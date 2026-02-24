-- ============================================================
-- Migration 00009: Audit logging
-- ============================================================

-- 1. Audit log table
CREATE TABLE public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own audit entries"
  ON public.audit_log FOR SELECT
  USING (user_id = auth.uid());

CREATE INDEX idx_audit_log_user_created ON public.audit_log(user_id, created_at DESC);

-- 2. Helper function for inserting audit entries
CREATE OR REPLACE FUNCTION public.audit_insert(
    p_user_id UUID,
    p_action TEXT,
    p_entity_type TEXT,
    p_entity_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.audit_log (user_id, action, entity_type, entity_id, metadata)
    VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_metadata);
END;
$$;

-- 3. Instrument process_borrow_action with audit logging
CREATE OR REPLACE FUNCTION public.process_borrow_action(
    p_request_id UUID,
    p_action TEXT
)
RETURNS public.borrow_requests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_request public.borrow_requests;
    v_tool public.tools;
    v_borrower_balance INTEGER;
BEGIN
    SELECT * INTO v_request FROM public.borrow_requests WHERE id = p_request_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found';
    END IF;

    -- Verify the caller is a participant
    IF v_request.borrower_id != auth.uid() AND v_request.lender_id != auth.uid() THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    SELECT * INTO v_tool FROM public.tools WHERE id = v_request.tool_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tool not found';
    END IF;

    -- Verify tool ownership matches lender
    IF v_tool.owner_id != v_request.lender_id THEN
        RAISE EXCEPTION 'Tool owner mismatch';
    END IF;

    CASE p_action
        WHEN 'approve' THEN
            IF v_request.status != 'pending' THEN RAISE EXCEPTION 'Request is not pending'; END IF;
            IF v_request.lender_id != auth.uid() THEN RAISE EXCEPTION 'Only lender can approve'; END IF;
            UPDATE public.borrow_requests SET status = 'approved', responded_at = now(), updated_at = now() WHERE id = p_request_id RETURNING * INTO v_request;
            PERFORM audit_insert(auth.uid(), 'borrow.approve', 'borrow_request', p_request_id,
                jsonb_build_object('tool_id', v_tool.id, 'borrower_id', v_request.borrower_id, 'nuts_amount', v_request.nuts_amount));

        WHEN 'decline' THEN
            IF v_request.status != 'pending' THEN RAISE EXCEPTION 'Request is not pending'; END IF;
            IF v_request.lender_id != auth.uid() THEN RAISE EXCEPTION 'Only lender can decline'; END IF;
            UPDATE public.borrow_requests SET status = 'declined', responded_at = now(), updated_at = now() WHERE id = p_request_id RETURNING * INTO v_request;
            PERFORM audit_insert(auth.uid(), 'borrow.decline', 'borrow_request', p_request_id,
                jsonb_build_object('tool_id', v_tool.id, 'borrower_id', v_request.borrower_id));

        WHEN 'cancel' THEN
            IF v_request.status NOT IN ('pending', 'approved') THEN RAISE EXCEPTION 'Cannot cancel at this stage'; END IF;
            IF v_request.borrower_id != auth.uid() THEN RAISE EXCEPTION 'Only borrower can cancel'; END IF;
            UPDATE public.borrow_requests SET status = 'cancelled', updated_at = now() WHERE id = p_request_id RETURNING * INTO v_request;
            PERFORM audit_insert(auth.uid(), 'borrow.cancel', 'borrow_request', p_request_id,
                jsonb_build_object('tool_id', v_tool.id, 'lender_id', v_request.lender_id));

        WHEN 'handoff' THEN
            IF v_request.status != 'approved' THEN RAISE EXCEPTION 'Request is not approved'; END IF;
            IF v_request.lender_id != auth.uid() THEN RAISE EXCEPTION 'Only lender can confirm handoff'; END IF;
            -- Verify borrower has sufficient balance
            SELECT nuts_balance INTO v_borrower_balance FROM public.profiles WHERE id = v_request.borrower_id;
            IF v_borrower_balance < v_request.nuts_amount THEN
                RAISE EXCEPTION 'Borrower has insufficient nuts balance';
            END IF;
            -- Re-validate nuts_amount matches current tool cost
            IF v_request.nuts_amount != v_tool.nuts_cost THEN
                RAISE EXCEPTION 'Nuts amount does not match current tool cost';
            END IF;
            -- Transfer nuts: deduct from borrower
            UPDATE public.profiles SET nuts_balance = nuts_balance - v_request.nuts_amount WHERE id = v_request.borrower_id;
            INSERT INTO public.nuts_transactions (user_id, amount, type, related_request_id, description)
                VALUES (v_request.borrower_id, -v_request.nuts_amount, 'borrow_spend', p_request_id, 'Borrowed: ' || v_tool.name);
            -- Update request + tool status
            UPDATE public.borrow_requests SET status = 'handed_off', handed_off_at = now(), updated_at = now() WHERE id = p_request_id RETURNING * INTO v_request;
            UPDATE public.tools SET status = 'lent_out', updated_at = now() WHERE id = v_request.tool_id;
            PERFORM audit_insert(auth.uid(), 'borrow.handoff', 'borrow_request', p_request_id,
                jsonb_build_object('tool_id', v_tool.id, 'borrower_id', v_request.borrower_id, 'nuts_amount', v_request.nuts_amount));

        WHEN 'return' THEN
            IF v_request.status != 'handed_off' THEN RAISE EXCEPTION 'Tool has not been handed off'; END IF;
            IF v_request.lender_id != auth.uid() THEN RAISE EXCEPTION 'Only lender can confirm return'; END IF;
            -- Transfer nuts: credit to lender
            UPDATE public.profiles SET nuts_balance = nuts_balance + v_request.nuts_amount WHERE id = v_request.lender_id;
            INSERT INTO public.nuts_transactions (user_id, amount, type, related_request_id, description)
                VALUES (v_request.lender_id, v_request.nuts_amount, 'lend_earn', p_request_id, 'Lent: ' || v_tool.name);
            -- Update request + tool status
            UPDATE public.borrow_requests SET status = 'returned', returned_at = now(), updated_at = now() WHERE id = p_request_id RETURNING * INTO v_request;
            UPDATE public.tools SET status = 'available', updated_at = now() WHERE id = v_request.tool_id;
            PERFORM audit_insert(auth.uid(), 'borrow.return', 'borrow_request', p_request_id,
                jsonb_build_object('tool_id', v_tool.id, 'lender_id', v_request.lender_id, 'nuts_amount', v_request.nuts_amount));

        ELSE
            RAISE EXCEPTION 'Unknown action: %', p_action;
    END CASE;

    RETURN v_request;
END;
$$;

-- 4. Trigger: circle_members join/leave
CREATE OR REPLACE FUNCTION public.audit_circle_member_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM audit_insert(NEW.user_id, 'circle.join', 'circle', NEW.circle_id,
            jsonb_build_object('role', NEW.role));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM audit_insert(OLD.user_id, 'circle.leave', 'circle', OLD.circle_id, '{}');
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_audit_circle_members
    AFTER INSERT OR DELETE ON public.circle_members
    FOR EACH ROW EXECUTE FUNCTION public.audit_circle_member_change();

-- 5. Trigger: tools lifecycle
CREATE OR REPLACE FUNCTION public.audit_tool_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM audit_insert(NEW.owner_id, 'tool.create', 'tool', NEW.id,
            jsonb_build_object('name', NEW.name, 'nuts_cost', NEW.nuts_cost));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM audit_insert(NEW.owner_id, 'tool.update', 'tool', NEW.id,
            jsonb_build_object('name', NEW.name, 'nuts_cost', NEW.nuts_cost, 'status', NEW.status::text));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM audit_insert(OLD.owner_id, 'tool.delete', 'tool', OLD.id,
            jsonb_build_object('name', OLD.name));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_audit_tools
    AFTER INSERT OR UPDATE OR DELETE ON public.tools
    FOR EACH ROW EXECUTE FUNCTION public.audit_tool_change();

-- 6. Trigger: profile updates (skip updated_at-only changes)
CREATE OR REPLACE FUNCTION public.audit_profile_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Skip if only updated_at changed
    IF NEW.display_name = OLD.display_name
       AND NEW.avatar_url IS NOT DISTINCT FROM OLD.avatar_url
       AND NEW.phone IS NOT DISTINCT FROM OLD.phone
       AND NEW.email = OLD.email
       AND NEW.nuts_balance = OLD.nuts_balance
       AND NEW.notification_prefs = OLD.notification_prefs THEN
        RETURN NEW;
    END IF;

    PERFORM audit_insert(NEW.id, 'profile.update', 'profile', NEW.id,
        jsonb_build_object(
            'display_name', NEW.display_name,
            'nuts_balance', NEW.nuts_balance
        ));
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_audit_profiles
    AFTER UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.audit_profile_change();
