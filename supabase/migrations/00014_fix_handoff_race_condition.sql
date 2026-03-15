-- ============================================================
-- Migration 00014: Fix race condition in process_borrow_action
--
-- The handoff action previously did a SELECT then UPDATE on the
-- borrower's profile, allowing concurrent handoffs to both pass
-- the balance check. Now uses a single UPDATE ... WHERE to
-- atomically check-and-deduct, and SELECT ... FOR UPDATE on the
-- request row to serialize concurrent actions on the same request.
-- ============================================================

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
  v_rows_affected INTEGER;
BEGIN
  -- Lock the request row to serialize concurrent actions
  SELECT * INTO v_request FROM public.borrow_requests WHERE id = p_request_id FOR UPDATE;
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
      -- Re-validate nuts_amount matches current tool cost
      IF v_request.nuts_amount != v_tool.nuts_cost THEN
        RAISE EXCEPTION 'Nuts amount does not match current tool cost';
      END IF;
      -- Atomically check-and-deduct: single UPDATE with WHERE guard
      UPDATE public.profiles
        SET nuts_balance = nuts_balance - v_request.nuts_amount, updated_at = now()
        WHERE id = v_request.borrower_id AND nuts_balance >= v_request.nuts_amount;
      GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
      IF v_rows_affected = 0 THEN
        RAISE EXCEPTION 'Borrower has insufficient nuts balance';
      END IF;
      INSERT INTO public.nuts_transactions (user_id, amount, type, related_request_id, description)
        VALUES (v_request.borrower_id, -v_request.nuts_amount, 'borrow_spend', p_request_id, 'Borrowed: ' || v_tool.name);
      -- Update request + tool status
      UPDATE public.borrow_requests SET status = 'handed_off', handed_off_at = now(), updated_at = now() WHERE id = p_request_id RETURNING * INTO v_request;
      UPDATE public.tools SET status = 'lent_out', updated_at = now() WHERE id = v_request.tool_id;

    WHEN 'return' THEN
      IF v_request.status != 'handed_off' THEN RAISE EXCEPTION 'Tool has not been handed off'; END IF;
      IF v_request.lender_id != auth.uid() THEN RAISE EXCEPTION 'Only lender can confirm return'; END IF;
      -- Credit lender
      UPDATE public.profiles SET nuts_balance = nuts_balance + v_request.nuts_amount, updated_at = now() WHERE id = v_request.lender_id;
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
