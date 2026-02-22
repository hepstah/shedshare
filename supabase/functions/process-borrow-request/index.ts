// Edge Function: Process borrow request state machine
// TODO: Implement request state transitions and nuts transfers
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  const { requestId, action } = await req.json()

  // TODO: Validate state transition
  // TODO: Update request status
  // TODO: Transfer nuts on handoff
  // TODO: Update tool status
  // TODO: Create notification

  return new Response(
    JSON.stringify({ success: true, requestId, action }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
