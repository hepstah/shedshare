# ShedShare — Architecture & Bootstrap Plan

> **Name:** ShedShare
> **Tagline:** "Got any...?" — Borrow tools from your circle.
> **Currency:** Nuts 🔩 (the bolt kind)

---

## 1. Product Overview

ShedShare is a tool-lending app for friend circles. Users add tools to their inventory, browse what's available in their circles, request to borrow tools, and track lending/returning. A "Nuts" credit system incentivizes lending.

### Core User Stories (MVP)

1. **As a user**, I can sign up/in via Google or Apple federated auth
2. **As a user**, I can create a Circle and invite friends via link/code
3. **As a user**, I can join multiple Circles
4. **As a user**, I can add tools to my inventory (name, description, category, photo)
5. **As a user**, I can set a tool's status: Available, Not Available, Lent Out
6. **As a user**, I can browse/search all tools across my Circles
7. **As a borrower**, I can request to borrow a tool from its owner
8. **As a lender**, I receive a notification of the request and can approve/decline
9. **As a lender**, I confirm handoff (tool status → Lent Out)
10. **As a lender**, I confirm return (tool status → Available)
11. **As a user**, I earn Nuts for lending and spend Nuts for borrowing
12. **As a user**, I receive email/SMS notifications for requests, approvals, and reminders

### Deferred Features (Post-MVP)

- SKU/part number auto-populate from product databases
- Broadcast requests ("Anyone have a miter saw?")
- In-app push notifications (native mobile)
- Cross-circle lending / marketplace / monetization
- Reminder system for unreturned tools
- Borrower-initiated return confirmation
- Photo verification of tool condition

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React 18 + Vite | React Native path for mobile; Vite for fast DX |
| **UI Framework** | Tailwind CSS + shadcn/ui | Rapid, consistent UI; accessible components |
| **Routing** | React Router v6 | Standard SPA routing |
| **State Management** | TanStack Query + Zustand | Server state (Query) + lightweight client state (Zustand) |
| **Backend/DB** | Supabase (PostgreSQL) | Auth, DB, Storage, Realtime, Edge Functions — all-in-one |
| **Auth** | Supabase Auth (Google + Apple OIDC) | Federated auth with row-level security |
| **File Storage** | Supabase Storage | Tool photos with CDN |
| **Notifications** | Supabase Edge Functions + Twilio (SMS) + Resend (Email) | Push notifications via email/SMS for MVP |
| **Hosting** | Vercel | Auto-deploy from GitHub, preview deploys, edge CDN |
| **Mobile (Future)** | React Native + Expo | Shared business logic, native push notifications |

---

## 3. Database Schema

```sql
-- ============================================================
-- USERS
-- ============================================================
-- Extends Supabase auth.users
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,              -- for SMS notifications
    email TEXT NOT NULL,     -- from auth, denormalized for notifications
    nuts_balance INTEGER NOT NULL DEFAULT 10, -- starting balance
    notification_prefs JSONB NOT NULL DEFAULT '{
        "email": true,
        "sms": false,
        "borrow_requests": true,
        "request_responses": true,
        "return_reminders": true
    }'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CIRCLES
-- ============================================================
CREATE TABLE public.circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    invite_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.circle_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(circle_id, user_id)
);

-- ============================================================
-- TOOLS
-- ============================================================
CREATE TYPE tool_status AS ENUM ('available', 'lent_out', 'not_available');

CREATE TABLE public.tool_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,        -- e.g., "Power Tools", "Hand Tools", "Garden", "Automotive"
    icon TEXT,                         -- icon identifier
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.tool_categories(id),
    photo_url TEXT,
    status tool_status NOT NULL DEFAULT 'available',
    sku TEXT,                          -- future: store part number
    nuts_cost INTEGER NOT NULL DEFAULT 1,  -- cost to borrow in Nuts
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tools visible in circles (a tool can be listed in multiple circles)
CREATE TABLE public.tool_circle_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
    circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
    listed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tool_id, circle_id)
);

-- ============================================================
-- BORROW REQUESTS & LENDING
-- ============================================================
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'declined', 'handed_off', 'returned', 'cancelled');

CREATE TABLE public.borrow_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
    borrower_id UUID NOT NULL REFERENCES public.profiles(id),
    lender_id UUID NOT NULL REFERENCES public.profiles(id),   -- denormalized from tool.owner_id
    circle_id UUID NOT NULL REFERENCES public.circles(id),     -- which circle context
    status request_status NOT NULL DEFAULT 'pending',
    message TEXT,                       -- "Hey, need this for a weekend project!"
    due_date DATE,                      -- optional
    nuts_amount INTEGER NOT NULL DEFAULT 1,
    responded_at TIMESTAMPTZ,
    handed_off_at TIMESTAMPTZ,          -- lender confirms handoff
    returned_at TIMESTAMPTZ,            -- lender confirms return
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- NUTS TRANSACTIONS (ledger)
-- ============================================================
CREATE TYPE nuts_transaction_type AS ENUM (
    'signup_bonus',
    'lend_earn',
    'borrow_spend',
    'bonus',
    'refund'
);

CREATE TABLE public.nuts_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    amount INTEGER NOT NULL,            -- positive = earned, negative = spent
    type nuts_transaction_type NOT NULL,
    related_request_id UUID REFERENCES public.borrow_requests(id),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TYPE notification_type AS ENUM (
    'borrow_request',
    'request_approved',
    'request_declined',
    'tool_handed_off',
    'tool_returned',
    'return_reminder'
);

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    related_request_id UUID REFERENCES public.borrow_requests(id),
    read BOOLEAN NOT NULL DEFAULT false,
    email_sent BOOLEAN NOT NULL DEFAULT false,
    sms_sent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_tools_owner ON public.tools(owner_id);
CREATE INDEX idx_tools_status ON public.tools(status);
CREATE INDEX idx_tools_category ON public.tools(category_id);
CREATE INDEX idx_tool_listings_circle ON public.tool_circle_listings(circle_id);
CREATE INDEX idx_tool_listings_tool ON public.tool_circle_listings(tool_id);
CREATE INDEX idx_borrow_requests_borrower ON public.borrow_requests(borrower_id);
CREATE INDEX idx_borrow_requests_lender ON public.borrow_requests(lender_id);
CREATE INDEX idx_borrow_requests_status ON public.borrow_requests(status);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read);
CREATE INDEX idx_circle_members_user ON public.circle_members(user_id);
CREATE INDEX idx_circle_members_circle ON public.circle_members(circle_id);
CREATE INDEX idx_nuts_transactions_user ON public.nuts_transactions(user_id);
```

---

## 4. Row-Level Security (RLS) Policies

```sql
-- Profiles: users can read profiles of people in their circles, edit own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view circle members' profiles"
    ON public.profiles FOR SELECT USING (
        id IN (
            SELECT cm.user_id FROM public.circle_members cm
            WHERE cm.circle_id IN (
                SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Tools: visible within circles, editable by owner
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tools in their circles"
    ON public.tools FOR SELECT USING (
        owner_id = auth.uid()
        OR id IN (
            SELECT tcl.tool_id FROM public.tool_circle_listings tcl
            JOIN public.circle_members cm ON cm.circle_id = tcl.circle_id
            WHERE cm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own tools"
    ON public.tools FOR ALL USING (owner_id = auth.uid());

-- Circles: members can view, admins can edit
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their circles"
    ON public.circles FOR SELECT USING (
        id IN (SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid())
    );

-- Borrow requests: visible to borrower and lender
ALTER TABLE public.borrow_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view their requests"
    ON public.borrow_requests FOR SELECT USING (
        borrower_id = auth.uid() OR lender_id = auth.uid()
    );

-- Notifications: own only
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE USING (user_id = auth.uid());
```

---

## 5. Project Structure

```
shedshare/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                  # Lint, test, type-check on PR
│   │   ├── deploy-preview.yml      # Deploy preview to Vercel on PR
│   │   └── deploy-production.yml   # Deploy to production on main merge
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── dependabot.yml
├── supabase/
│   ├── migrations/
│   │   ├── 00001_initial_schema.sql
│   │   └── 00002_rls_policies.sql
│   ├── functions/
│   │   ├── send-notification/
│   │   │   └── index.ts            # Edge function: email/SMS via Twilio+Resend
│   │   └── process-borrow-request/
│   │       └── index.ts            # Edge function: handle request state machine
│   ├── seed.sql                    # Default categories + test data
│   └── config.toml
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── AppShell.tsx        # Main layout with nav
│   │   │   ├── Navbar.tsx
│   │   │   └── BottomNav.tsx       # Mobile bottom nav
│   │   ├── auth/
│   │   │   └── AuthGuard.tsx
│   │   ├── tools/
│   │   │   ├── ToolCard.tsx
│   │   │   ├── ToolGrid.tsx
│   │   │   ├── ToolForm.tsx        # Add/edit tool
│   │   │   ├── ToolDetail.tsx
│   │   │   ├── ToolStatusBadge.tsx
│   │   │   └── BorrowRequestButton.tsx
│   │   ├── circles/
│   │   │   ├── CircleCard.tsx
│   │   │   ├── CircleMembers.tsx
│   │   │   ├── CreateCircleForm.tsx
│   │   │   └── JoinCircleForm.tsx
│   │   ├── requests/
│   │   │   ├── RequestCard.tsx
│   │   │   ├── RequestList.tsx
│   │   │   └── RequestActions.tsx  # Approve/decline/handoff/return
│   │   ├── nuts/
│   │   │   ├── NutsBalance.tsx     # 🔩 display in navbar
│   │   │   └── NutsHistory.tsx
│   │   └── notifications/
│   │       ├── NotificationBell.tsx
│   │       └── NotificationList.tsx
│   ├── pages/
│   │   ├── Landing.tsx             # Unauthenticated landing
│   │   ├── Login.tsx               # Google/Apple sign-in
│   │   ├── Dashboard.tsx           # Home: recent activity, quick actions
│   │   ├── MyTools.tsx             # User's inventory
│   │   ├── AddTool.tsx
│   │   ├── ToolDetailPage.tsx
│   │   ├── CirclesPage.tsx         # List of user's circles
│   │   ├── CircleDetailPage.tsx    # Browse tools in a circle
│   │   ├── SearchPage.tsx          # Search across circles
│   │   ├── RequestsPage.tsx        # Incoming/outgoing requests
│   │   ├── ProfilePage.tsx         # Settings, notification prefs
│   │   └── JoinCirclePage.tsx      # /join/:inviteCode
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTools.ts
│   │   ├── useCircles.ts
│   │   ├── useBorrowRequests.ts
│   │   ├── useNuts.ts
│   │   └── useNotifications.ts
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client init
│   │   ├── api.ts                  # API helper functions
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces matching DB schema
│   └── stores/
│       └── appStore.ts             # Zustand store for UI state
├── public/
│   ├── favicon.svg                 # 🔩 nut icon
│   └── og-image.png
├── tests/
│   ├── setup.ts
│   ├── components/
│   └── hooks/
├── .env.example
├── .env.local                      # (gitignored)
├── .eslintrc.cjs
├── .prettierrc
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── postcss.config.js
├── package.json
├── CLAUDE.md                       # Instructions for Claude Code
└── README.md
```

---

## 6. Key Application Flows

### 6.1 Borrow Request State Machine

```
                    ┌──────────┐
                    │ PENDING  │
                    └────┬─────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
         ┌────────┐ ┌────────┐ ┌──────────┐
         │APPROVED│ │DECLINED│ │CANCELLED │
         └───┬────┘ └────────┘ └──────────┘
             │         (by         (by
             ▼        lender)    borrower)
        ┌──────────┐
        │HANDED_OFF│  ← Lender confirms physical handoff
        └────┬─────┘    Tool status → lent_out
             │          Nuts transferred: borrower→lender
             ▼
        ┌──────────┐
        │ RETURNED │  ← Lender confirms return
        └──────────┘    Tool status → available
```

### 6.2 Nuts Economy

| Action | Nuts |
|--------|------|
| Sign up | +10 (welcome bonus) |
| Lend a tool (on handoff) | + tool's nut cost |
| Borrow a tool (on handoff) | - tool's nut cost |
| Default tool cost | 1 nut |

Lender sets the nut cost per tool. Transfer happens at handoff confirmation, not at request approval.

---

## 7. CI/CD & DevOps

### 7.1 GitHub Actions — CI (on PR)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test -- --run

  build:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

### 7.2 GitHub Actions — Deploy Preview (on PR)

```yaml
# .github/workflows/deploy-preview.yml
name: Deploy Preview

on:
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          github-comment: true
```

### 7.3 GitHub Actions — Production Deploy (on merge to main)

```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 7.4 Supabase Migration Workflow

```yaml
# .github/workflows/supabase-migrate.yml
name: Supabase Migrate

on:
  push:
    branches: [main]
    paths:
      - 'supabase/migrations/**'

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
        with:
          version: latest
      - run: supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      - run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

### 7.5 Environment Variables

```bash
# .env.example
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173

# Server-side only (Supabase Edge Functions)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
RESEND_API_KEY=your-resend-key
```

---

## 8. CLAUDE.md — Instructions for Claude Code

```markdown
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
```

---

## 9. Bootstrap Sequence for Claude Code

Run these commands in order to scaffold the project:

### Step 1: Initialize Project
```bash
npm create vite@latest shedshare -- --template react-ts
cd shedshare
```

### Step 2: Install Dependencies
```bash
# Core
npm install @supabase/supabase-js @tanstack/react-query zustand react-router-dom

# UI
npm install tailwindcss @tailwindcss/vite
npm install lucide-react class-variance-authority clsx tailwind-merge

# Dev
npm install -D @types/react @types/react-dom vitest @testing-library/react @testing-library/jest-dom jsdom eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks prettier
```

### Step 3: Initialize shadcn/ui
```bash
npx shadcn@latest init
# Select: New York style, Zinc base color, CSS variables: yes
```

### Step 4: Initialize Supabase
```bash
npx supabase init
# Copy migration files from ARCHITECTURE.md Section 3 → supabase/migrations/
```

### Step 5: Initialize GitHub repo + Actions
```bash
git init
# Copy workflow files from ARCHITECTURE.md Section 7
# Set up branch protection on main
```

### Step 6: Create file structure
```bash
# Create directory structure from Section 5
# Scaffold placeholder components
# Set up routing in App.tsx
# Create Supabase client in src/lib/supabase.ts
# Create type definitions matching DB schema
```

### Step 7: Seed data
```sql
-- supabase/seed.sql
INSERT INTO public.tool_categories (name, icon, sort_order) VALUES
    ('Power Tools', 'zap', 1),
    ('Hand Tools', 'wrench', 2),
    ('Garden & Outdoor', 'flower', 3),
    ('Automotive', 'car', 4),
    ('Painting & Finishing', 'paintbrush', 5),
    ('Plumbing', 'droplet', 6),
    ('Electrical', 'plug', 7),
    ('Measuring & Layout', 'ruler', 8),
    ('Fastening', 'nut', 9),        -- lol
    ('Cleaning', 'sparkles', 10),
    ('Safety Equipment', 'shield', 11),
    ('Other', 'box', 99);
```

---

## 10. Security Checklist

- [x] Federated auth only (Google + Apple) — no password storage
- [x] Row-Level Security on ALL tables
- [x] Supabase anon key in frontend (safe — RLS enforces access)
- [x] Service role key in Edge Functions only (never in frontend)
- [x] HTTPS everywhere (Vercel + Supabase defaults)
- [ ] Rate limiting on Edge Functions (add post-MVP)
- [ ] Input sanitization on all user inputs
- [ ] Image upload validation (file type, size limits)
- [ ] Invite code expiration (add post-MVP)
- [ ] CORS configuration for production domain

---

## 11. Future Architecture Notes

### Mobile (React Native)
- Share `src/types/`, `src/hooks/`, `src/lib/` with web
- Use Expo for simplified build pipeline
- Native push notifications via Expo Push + Supabase Realtime
- Camera integration for tool photos

### Monetization Path
- Cross-circle lending marketplace
- Premium circles with advanced features
- Tool insurance / deposit system
- Local business tool rental partnerships
- Promoted tool listings
