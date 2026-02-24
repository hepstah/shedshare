-- ============================================================
-- Migration 00006: Borrow request + nuts transaction RLS
-- ============================================================

-- Borrow requests: borrowers can create, participants can update
CREATE POLICY "Borrowers can create requests"
  ON public.borrow_requests FOR INSERT
  WITH CHECK (auth.uid() = borrower_id);

CREATE POLICY "Participants can update requests"
  ON public.borrow_requests FOR UPDATE
  USING (borrower_id = auth.uid() OR lender_id = auth.uid());

-- Nuts transactions: RLS
ALTER TABLE public.nuts_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.nuts_transactions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own transactions"
  ON public.nuts_transactions FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Notifications: users can insert (for in-app creation)
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- RPC: process_borrow_action — atomic status change + nuts transfer + notification
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

  CASE p_action
    WHEN 'approve' THEN
      IF v_request.status != 'pending' THEN RAISE EXCEPTION 'Request is not pending'; END IF;
      IF v_request.lender_id != auth.uid() THEN RAISE EXCEPTION 'Only lender can approve'; END IF;
      UPDATE public.borrow_requests SET status = 'approved', responded_at = now(), updated_at = now() WHERE id = p_request_id RETURNING * INTO v_request;

    WHEN 'decline' THEN
      IF v_request.status != 'pending' THEN RAISE EXCEPTION 'Request is not pending'; END IF;
      IF v_request.lender_id != auth.uid() THEN RAISE EXCEPTION 'Only lender can decline'; END IF;
      UPDATE public.borrow_requests SET status = 'declined', responded_at = now(), updated_at = now() WHERE id = p_request_id RETURNING * INTO v_request;

    WHEN 'cancel' THEN
      IF v_request.status NOT IN ('pending', 'approved') THEN RAISE EXCEPTION 'Cannot cancel at this stage'; END IF;
      IF v_request.borrower_id != auth.uid() THEN RAISE EXCEPTION 'Only borrower can cancel'; END IF;
      UPDATE public.borrow_requests SET status = 'cancelled', updated_at = now() WHERE id = p_request_id RETURNING * INTO v_request;

    WHEN 'handoff' THEN
      IF v_request.status != 'approved' THEN RAISE EXCEPTION 'Request is not approved'; END IF;
      IF v_request.lender_id != auth.uid() THEN RAISE EXCEPTION 'Only lender can confirm handoff'; END IF;
      -- Transfer nuts: deduct from borrower
      UPDATE public.profiles SET nuts_balance = nuts_balance - v_request.nuts_amount WHERE id = v_request.borrower_id;
      INSERT INTO public.nuts_transactions (user_id, amount, type, related_request_id, description)
        VALUES (v_request.borrower_id, -v_request.nuts_amount, 'borrow_spend', p_request_id, 'Borrowed: ' || v_tool.name);
      -- Update request + tool status
      UPDATE public.borrow_requests SET status = 'handed_off', handed_off_at = now(), updated_at = now() WHERE id = p_request_id RETURNING * INTO v_request;
      UPDATE public.tools SET status = 'lent_out', updated_at = now() WHERE id = v_request.tool_id;

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

    ELSE
      RAISE EXCEPTION 'Unknown action: %', p_action;
  END CASE;

  RETURN v_request;
END;
$$;
