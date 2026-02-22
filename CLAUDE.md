# CLAUDE.md — ShedShare Project Instructions

## Project Overview
ShedShare is a tool-lending app for friend circles built with React + Vite + Supabase.
See ARCHITECTURE.md for full technical details.

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions, Realtime)
- **State:** TanStack Query (server state) + Zustand (UI state)
- **Routing:** React Router v6
- **Hosting:** Vercel
- **CI/CD:** GitHub Actions

## Commands
- `npm run dev` — Start dev server (port 5173)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run type-check` — TypeScript check (tsc --noEmit)
- `npm run test` — Vitest
- `npx supabase start` — Local Supabase (Docker required)
- `npx supabase db reset` — Reset local DB with migrations + seed

## Code Conventions
- Functional components only, with TypeScript
- Use TanStack Query for ALL Supabase data fetching (no raw useEffect+fetch)
- Custom hooks in `src/hooks/` for each data domain
- Types in `src/types/index.ts` — keep in sync with DB schema
- shadcn/ui for base components; customize in `src/components/ui/`
- Tailwind only — no CSS files, no styled-components
- Use `cn()` utility from `src/lib/utils.ts` for conditional classes
- File naming: PascalCase for components, camelCase for hooks/utils
- One component per file

## Auth Pattern
```tsx
// Always use the useAuth hook
const { user, signIn, signOut, loading } = useAuth();
// Wrap protected routes with <AuthGuard>
```

## Supabase Patterns
```tsx
// Always use typed client
import { supabase } from '@/lib/supabase';
// RLS handles authorization — no manual auth checks in queries
// Use Edge Functions for anything requiring service_role_key
```

## Testing
- Vitest + React Testing Library
- Test hooks and components that have logic
- Mock Supabase client in tests

## Git Workflow
- Feature branches off `main`
- PR required for all changes
- CI must pass before merge
- Squash merge preferred

## Key Architectural Decisions
1. Supabase RLS enforces all authorization — no middleware auth checks
2. Nuts transfers happen at handoff confirmation, not request approval
3. Tools can be listed in multiple circles
4. Notifications are stored in DB + sent externally (email/SMS)
5. All timestamps in UTC
