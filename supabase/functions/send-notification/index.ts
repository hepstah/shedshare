// Edge Function: Send email/SMS notifications
// TODO: Implement Twilio (SMS) + Resend (email) integration
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const VALID_TYPES = [
  'borrow_request',
  'request_approved',
  'request_declined',
  'tool_handed_off',
  'tool_returned',
  'return_reminder',
] as const

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
  const { type, userId, title, body: notifBody } = body as {
    type: unknown
    userId: unknown
    title: unknown
    body: unknown
  }

  if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    return jsonError(`Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`, 400)
  }
  if (typeof userId !== 'string' || !UUID_RE.test(userId)) {
    return jsonError('Invalid userId', 400)
  }
  if (typeof title !== 'string' || title.length === 0 || title.length > 200) {
    return jsonError('title must be a non-empty string (max 200 chars)', 400)
  }
  if (typeof notifBody !== 'string' || notifBody.length === 0 || notifBody.length > 2000) {
    return jsonError('body must be a non-empty string (max 2000 chars)', 400)
  }

  // TODO: Look up user notification preferences
  // TODO: Send via Resend (email) and/or Twilio (SMS)

  return new Response(
    JSON.stringify({ success: true, type, userId, title, body: notifBody }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
