# ShedShare: Supabase Migration Plan

**Status:** On ice until we need to scale
**Reason:** Cost control — Supabase pricing scales faster than we'd like

---

## Target Stack

| Current (Supabase) | Replacement | Why |
|---|---|---|
| Supabase Postgres | **Neon** | Free tier (0.5 GB), autoscales to zero, keeps all our migrations/RLS/RPCs as-is |
| Supabase Auth | **Auth.js** | Free, open source, same Google/Apple OAuth with our existing client IDs |
| Supabase Storage | **Cloudflare R2** | Zero egress fees — huge for a photo-heavy app |
| Supabase Edge Functions | **Vercel Functions** | Already on Vercel, free tier is generous |
| Supabase Realtime | **Neon + SSE or WebSockets** | Roll our own or use a lightweight pub/sub (Ably, Pusher free tier) |

---

## Migration Phases

### Phase 1: Database (Neon)
- Provision Neon project
- Run existing migrations 00001–00014 against Neon (standard Postgres, should work as-is)
- Run seed.sql for tool categories
- Replace `@supabase/supabase-js` DB calls with **Drizzle ORM** or **Prisma**
  - All hooks in `src/hooks/` that call `supabase.from(...)` need rewriting
  - RPC functions (`create_tool_with_listings`, `update_tool_with_listings`, `process_borrow_action`) stay as Postgres functions — call via Drizzle `sql` or a thin API layer
- RLS policies: Neon supports RLS but we'd need to pass the user context differently (no `auth.uid()`). Options:
  - Set `app.current_user_id` via `SET LOCAL` on each request
  - Or move authorization to the API layer (simpler, more common outside Supabase)
- **Files touched:** `src/lib/supabase.ts` (replaced), all hooks, `src/types/index.ts` (generate from Drizzle schema)

### Phase 2: Auth (Auth.js)
- Install `next-auth` or `@auth/core` (works with any framework via adapters)
- Configure Google + Apple providers with existing OAuth credentials
- Add email/password via Credentials provider
- Create a Neon adapter for session/account storage (or use the built-in Drizzle adapter)
- Replace `useAuth` hook internals — context shape stays the same, just swap the source
- Update `AuthGuard` to use new auth check
- Migrate existing `auth.users` to the new user table
- **Files touched:** `src/hooks/useAuth.tsx`, `src/components/auth/AuthGuard.tsx`, new `src/lib/auth.ts`

### Phase 3: Storage (Cloudflare R2)
- Create R2 bucket for `tool-photos` and `avatars`
- Add a Vercel API route for presigned upload URLs
- Replace `supabase.storage.from(...).upload()` with direct R2 upload via presigned URL
- Replace `supabase.storage.from(...).getPublicUrl()` with R2 public URL pattern
- Migrate existing files from Supabase Storage to R2 (one-time script)
- **Files touched:** `src/hooks/useTools.ts` (upload), `src/hooks/useProfile.ts` (avatar upload), new `api/upload.ts`

### Phase 4: Edge Functions → Vercel Functions
- Move `supabase/functions/send-notification` to `api/send-notification.ts`
- Move `supabase/functions/process-borrow-request` to `api/process-borrow-request.ts`
- Same Resend + Twilio logic, just a different runtime
- **Files touched:** new files in `api/`, delete `supabase/functions/`

### Phase 5: Realtime (if needed)
- Current state: polling every 30s (not even using Supabase Realtime)
- Options:
  - **Ably** or **Pusher** free tier for push notifications
  - **Server-Sent Events** from Vercel Functions for lightweight updates
  - Or just keep polling — it works fine at our scale
- Low priority, do this last

---

## What Stays the Same
- React + Vite + Tailwind + shadcn/ui (untouched)
- TanStack Query hooks (same shape, different data source)
- Zustand (if we add client state back)
- All components and pages (no UI changes)
- Vercel hosting
- Sentry error tracking
- All 13+ database migrations (Postgres is Postgres)

## Estimated Effort
- **Phase 1 (DB):** Biggest lift — every hook touches Supabase. ~2-3 days.
- **Phase 2 (Auth):** Medium — auth is centralized in one hook. ~1 day.
- **Phase 3 (Storage):** Small — two upload functions. ~half day.
- **Phase 4 (Functions):** Small — two functions. ~half day.
- **Phase 5 (Realtime):** Optional. ~half day if needed.

**Total: ~4-5 days of focused work.**

## Cost Comparison (estimated monthly at moderate usage)
| | Supabase Pro | Neon + R2 + Auth.js + Vercel |
|---|---|---|
| Database | $25+ | $0 (free tier) → $19 (scale) |
| Auth | included | $0 (open source) |
| Storage | $0.021/GB + egress | $0.015/GB, no egress |
| Functions | included | $0 (Vercel free tier) |
| **Total** | **$25–75+** | **$0–19** |

---

## Trigger to Start
Don't migrate preemptively. Start this when:
- Supabase bill crosses ~$50/month consistently
- We need more than what the Pro plan offers
- Or we hit a Supabase-specific limitation that blocks a feature

Until then, Supabase is working fine. Keep shipping.
