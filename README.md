# ShedShare

**"Got any...?" — Borrow tools from your circle.**

ShedShare is a tool-lending app for friend circles. Create circles, add tools to your inventory, lend and borrow from friends, and earn Nuts (the bolt kind) for being generous.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| UI | Tailwind CSS 4, shadcn/ui, Lucide icons |
| State | TanStack Query (server) + Zustand (UI) |
| Routing | React Router v7 |
| Backend | Supabase — PostgreSQL, Auth, Storage, Edge Functions, Realtime |
| Hosting | Vercel |
| CI/CD | GitHub Actions |

## Prerequisites

- **Node.js** >= 20 (`node -v` to check)
- **npm** (comes with Node)
- **Docker Desktop** — required for local Supabase
- **Supabase CLI** — `npm install -g supabase` or use `npx supabase`

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/<your-org>/shedshare.git
cd shedshare

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase project URL and anon key
# (see "Environment Variables" below)

# 4. Start local Supabase (requires Docker running)
npx supabase start

# 5. Apply migrations and seed data
npx supabase db reset

# 6. Start the dev server
npm run dev
```

The app will be running at **http://localhost:5173**.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | TypeScript compile + production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript check (`tsc --noEmit`) |
| `npm run test` | Run Vitest (watch mode) |
| `npm run preview` | Preview production build locally |
| `npx supabase start` | Start local Supabase (Docker) |
| `npx supabase db reset` | Reset local DB with migrations + seed |

## Project Structure

```
src/
├── pages/              # Route-level page components
├── components/
│   ├── ui/             # shadcn/ui primitives (Button, Card, etc.)
│   ├── layout/         # AppShell, Navbar, BottomNav
│   ├── auth/           # AuthGuard
│   ├── tools/          # ToolCard, ToolGrid, ToolForm, BorrowRequestButton
│   ├── circles/        # CircleCard, CreateCircleForm, JoinCircleForm
│   ├── requests/       # RequestCard, RequestList, RequestActions
│   ├── nuts/           # NutsBalance, NutsHistory
│   └── notifications/  # NotificationBell, NotificationList
├── hooks/              # Data-fetching hooks (one per domain)
│   ├── useAuth.ts
│   ├── useTools.ts
│   ├── useCircles.ts
│   ├── useBorrowRequests.ts
│   ├── useNuts.ts
│   └── useNotifications.ts
├── lib/
│   ├── supabase.ts     # Supabase client init
│   ├── api.ts          # API helper functions
│   └── utils.ts        # cn() utility, misc helpers
├── types/
│   └── index.ts        # TypeScript interfaces matching DB schema
└── stores/
    └── appStore.ts     # Zustand store for UI state

supabase/
├── migrations/         # SQL migration files
├── functions/          # Edge Functions (notifications, request processing)
├── seed.sql            # Default categories + test data
└── config.toml
```

## Key Patterns

### Authentication

```tsx
import { useAuth } from '@/hooks/useAuth';

const { user, signIn, signOut, loading } = useAuth();
```

Protected routes are wrapped with `<AuthGuard>`, which redirects unauthenticated users to the login page. Auth is federated (Google + Apple) — no passwords stored.

### Data Fetching

All Supabase queries go through TanStack Query hooks — never raw `useEffect` + `fetch`:

```tsx
import { useTools } from '@/hooks/useTools';

const { data: tools, isLoading } = useTools(circleId);
```

Each data domain has its own hook in `src/hooks/`.

### Row-Level Security

Supabase RLS policies enforce all authorization at the database level. There are no manual auth checks in frontend queries — if a user shouldn't see data, RLS blocks it.

### Nuts Economy

Nuts are the in-app credit system that incentivizes lending:

- **+10 Nuts** on sign-up (welcome bonus)
- **+N Nuts** earned when you lend a tool (on handoff confirmation)
- **-N Nuts** spent when you borrow a tool (on handoff confirmation)
- Lenders set the nut cost per tool (default: 1)

Transfers happen at **handoff confirmation**, not when a request is approved.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key (safe for frontend — RLS enforces access) |
| `VITE_APP_URL` | App URL (`http://localhost:5173` for local dev) |

The following are **server-side only** (used in Supabase Edge Functions, never in frontend code):

| Variable | Description |
|---|---|
| `SUPABASE_SECRET_KEY` | Supabase service role key |
| `TWILIO_ACCOUNT_SID` | Twilio account SID (SMS notifications) |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Twilio sender phone number |
| `RESEND_API_KEY` | Resend API key (email notifications) |

## Git Workflow

1. Create a **feature branch** off `main`
2. Make your changes and push
3. Open a **pull request** — CI runs lint, type-check, and tests automatically
4. Get a review, then **squash merge** into `main`

CI must pass before merge. See `.github/workflows/ci.yml` for the full pipeline.

## Deployment

- **Vercel** auto-deploys from `main` for production and creates preview deploys on PRs
- **Supabase migrations** are applied automatically via GitHub Actions when migration files change on `main`
- To deploy Edge Functions manually: `npx supabase functions deploy <function-name>`

## Learn More

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full technical deep dive — database schema, RLS policies, borrow request state machine, CI/CD pipeline details, and security checklist.
