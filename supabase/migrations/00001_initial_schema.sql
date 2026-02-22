-- Users (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    email TEXT NOT NULL,
    nuts_balance INTEGER NOT NULL DEFAULT 10,
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

-- Circles
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

-- Tools
CREATE TYPE tool_status AS ENUM ('available', 'lent_out', 'not_available');

CREATE TABLE public.tool_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT,
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
    sku TEXT,
    nuts_cost INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.tool_circle_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
    circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
    listed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tool_id, circle_id)
);

-- Borrow Requests
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'declined', 'handed_off', 'returned', 'cancelled');

CREATE TABLE public.borrow_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
    borrower_id UUID NOT NULL REFERENCES public.profiles(id),
    lender_id UUID NOT NULL REFERENCES public.profiles(id),
    circle_id UUID NOT NULL REFERENCES public.circles(id),
    status request_status NOT NULL DEFAULT 'pending',
    message TEXT,
    due_date DATE,
    nuts_amount INTEGER NOT NULL DEFAULT 1,
    responded_at TIMESTAMPTZ,
    handed_off_at TIMESTAMPTZ,
    returned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Nuts Transactions
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
    amount INTEGER NOT NULL,
    type nuts_transaction_type NOT NULL,
    related_request_id UUID REFERENCES public.borrow_requests(id),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notifications
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

-- Indexes
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
