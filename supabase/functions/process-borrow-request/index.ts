// Edge Function: Process borrow request state machine
// TODO: Implement request state transitions and nuts transfers
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

const VALID_ACTIONS = ['approve', 'decline', 'hand_off', 'return', 'cancel'] as const
type Action = (typeof VALID_ACTIONS)[number]

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function jsonError(message: string, status: number) {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { 'Content-Type': 'application/json' } },
  )
}

Deno.serve(async (req) => {
  // --- Auth ---
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return jsonError('Missing Authorization header', 401)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return jsonError('Invalid token', 401)

  // --- Input validation ---
  const body = await req.json()
  const { requestId, action } = body as { requestId: unknown; action: unknown }

  if (typeof requestId !== 'string' || !UUID_RE.test(requestId)) {
    return jsonError('Invalid requestId', 400)
  }
  if (!VALID_ACTIONS.includes(action as Action)) {
    return jsonError(`Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}`, 400)
  }

  // --- Authorization: caller must be borrower or lender ---
  const { data: request, error: fetchError } = await supabase
    .from('borrow_requests')
    .select('borrower_id, lender_id, status')
    .eq('id', requestId)
    .single()

  if (fetchError || !request) return jsonError('Request not found', 404)

  if (request.borrower_id !== user.id && request.lender_id !== user.id) {
    return jsonError('Forbidden', 403)
  }

  // TODO: Validate state transition (e.g. only pending -> approved)
  // TODO: Update request status
  // TODO: Transfer nuts on handoff
  // TODO: Update tool status
  // TODO: Create notification

  return new Response(
    JSON.stringify({ success: true, requestId, action }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
