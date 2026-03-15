# CODE REVIEW: ShedShare

**Reviewer:** Snoop Claude, nephew
**Date:** 2026-03-15
**Status:** Updated after fixes

---

## THE GOOD (still good, still smooth)

- **RLS everywhere.** Authorization in the database where it belongs. `process_borrow_action` is `SECURITY DEFINER` with `auth.uid()` checks. Respect.
- **TanStack Query usage is consistent.** Every hook follows the same shape.
- **Atomic RPCs for multi-step ops.** `create_tool_with_listings` and `update_tool_with_listings` in a single transaction.
- **Types match the DB schema.** `src/types/index.ts` is clean and in sync.
- **Lazy-loaded routes.** Code splitting on every page via `React.lazy()`. Ya girl did that right.

---

## FIXED ITEMS

### 1. ~~`App.tsx` — Copy-paste hell~~ FIXED
Now uses a `<ProtectedRoute>` layout route with `<Outlet>`. All protected routes are children of a single layout wrapper. Clean indentation. No more copy-paste.

### 2. ~~`useAuth.ts` — Duplicate logic, no context~~ FIXED
Refactored to `AuthProvider` context. Single subscription, single source of truth for auth state. Extracted `syncUser()` helper to eliminate the duplicate `setUser`/`Sentry.setUser`/`ensureProfile` dance. File renamed to `.tsx`.

### 3. `as unknown as` everywhere — STILL OPEN
`useTool`, `useCircleTools`, `useCircles` still double-cast through `unknown`. Need to generate Supabase types via `supabase gen types typescript` and use them as the generic parameter to `createClient<Database>()`.

### 4. ~~`useSearchTools` — LIKE wildcard injection~~ FIXED
Added `escapeLikePattern()` utility to `src/lib/utils.ts`. Search input now properly escapes `%`, `_`, and `\` before being passed to `.ilike()`.

### 5. ~~`api.ts` — Empty file~~ FIXED
Deleted.

### 6. ~~`appStore.ts` — Dead code~~ FIXED
Deleted along with empty `src/stores/` directory.

### 7. ~~`ProfilePage.tsx` — setState during render~~ FIXED
Form initialization now happens in a `useEffect` instead of inline during render.

### 8. ~~`getInitials()` — defined TWICE~~ FIXED
Extracted to `src/lib/utils.ts`. Both `Dashboard.tsx` and `ProfilePage.tsx` now import from there.

### 9. ~~`supabase.ts` — Placeholder fallback~~ FIXED
Now throws a clear error if env vars are missing. No more silent requests to `placeholder.supabase.co`.

### 10. ~~No `QueryClient` default options~~ FIXED
Added `staleTime: 60s` for queries, `retry: 1` for queries, `retry: false` for mutations.

### 11. Every query hook calls `supabase.auth.getUser()` independently — STILL OPEN
Each hook still makes a separate round-trip for the user. Could pass user ID from the auth context, but this is a performance optimization, not a bug. Lower priority.

### 12. ~~`useJoinCircle` / `useLeaveCircle` — Non-null assertion bombs~~ FIXED
Now properly destructures and checks for null user with a clear error message.

### 13. ~~No 404 route~~ FIXED
Added `<Route path="*" element={<Navigate to="/" replace />} />` catch-all.

### 14. Test coverage is thin — STILL OPEN
Three test files for nine hooks. No component tests. The nuts economy flow has no integration tests. This needs attention but isn't a quick fix.

### 15. Notification polling at 30s with no Supabase Realtime — STILL OPEN
Still polling. Should use `supabase.channel()` for real-time notifications. Lower priority but leaving money on the table.

---

## THE UGLY — FIXED

### ~~Security: `process_borrow_action` race condition~~ FIXED
Migration `00014` replaces the function with:
- `SELECT ... FOR UPDATE` on the request row to serialize concurrent actions
- Single `UPDATE ... WHERE nuts_balance >= amount` for atomic check-and-deduct (no more read-then-write race)

### ~~`BorrowRequestButton` re-fetches the whole tool~~ FIXED
Now accepts `nutsCost`, `circleListings`, and `circles` as props from the parent `ToolDetail` component. No redundant query.

---

## REMAINING ITEMS

| # | Issue | Priority | Effort |
|---|-------|----------|--------|
| 3 | `as unknown as` casts — generate Supabase types | Medium | Medium |
| 11 | Redundant `getUser()` calls in every hook | Low | Medium |
| 14 | Thin test coverage, no integration tests | Medium | High |
| 15 | Polling instead of Supabase Realtime | Low | Low |

---

## VERDICT (UPDATED)

Went from a **B-minus** to a solid **B-plus**. The auth bug is squashed, the race condition is locked down, dead code is gone, and the routing is clean. The remaining items are optimization and coverage — not correctness issues. Ship it, but circle back on those Supabase generated types and test coverage when you get a minute.
