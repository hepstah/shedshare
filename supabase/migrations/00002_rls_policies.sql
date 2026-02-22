-- ============================================================
-- Profiles
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view circle members profiles"
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

-- Profile INSERT is handled by the signup trigger (service_role),
-- so no INSERT policy is needed for anon/authenticated users.

-- ============================================================
-- Circles
-- ============================================================
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their circles"
    ON public.circles FOR SELECT USING (
        id IN (SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid())
    );

-- Any authenticated user can create a circle
CREATE POLICY "Authenticated users can create circles"
    ON public.circles FOR INSERT WITH CHECK (
        auth.uid() = created_by
    );

-- Only circle admins can update circle details
CREATE POLICY "Circle admins can update circles"
    ON public.circles FOR UPDATE USING (
        id IN (
            SELECT circle_id FROM public.circle_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Only circle admins can delete circles
CREATE POLICY "Circle admins can delete circles"
    ON public.circles FOR DELETE USING (
        id IN (
            SELECT circle_id FROM public.circle_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================
-- Circle Members
-- ============================================================
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;

-- Members can see who's in their circles
CREATE POLICY "Members can view circle members"
    ON public.circle_members FOR SELECT USING (
        circle_id IN (
            SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid()
        )
    );

-- Users can join a circle (insert themselves only)
CREATE POLICY "Users can join circles"
    ON public.circle_members FOR INSERT WITH CHECK (
        user_id = auth.uid() AND role = 'member'
    );

-- Admins can update member roles within their circles
CREATE POLICY "Circle admins can update members"
    ON public.circle_members FOR UPDATE USING (
        circle_id IN (
            SELECT circle_id FROM public.circle_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Users can leave (delete themselves), admins can remove anyone
CREATE POLICY "Users can leave or admins can remove members"
    ON public.circle_members FOR DELETE USING (
        user_id = auth.uid()
        OR circle_id IN (
            SELECT circle_id FROM public.circle_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================
-- Tools
-- ============================================================
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

CREATE POLICY "Users can insert own tools"
    ON public.tools FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own tools"
    ON public.tools FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete own tools"
    ON public.tools FOR DELETE USING (owner_id = auth.uid());

-- ============================================================
-- Tool Circle Listings
-- ============================================================
ALTER TABLE public.tool_circle_listings ENABLE ROW LEVEL SECURITY;

-- Members can see listings in their circles
CREATE POLICY "Members can view listings in their circles"
    ON public.tool_circle_listings FOR SELECT USING (
        circle_id IN (
            SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid()
        )
    );

-- Tool owners can list their tools in circles they belong to
CREATE POLICY "Tool owners can create listings"
    ON public.tool_circle_listings FOR INSERT WITH CHECK (
        tool_id IN (SELECT id FROM public.tools WHERE owner_id = auth.uid())
        AND circle_id IN (SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid())
    );

-- Tool owners can remove their listings
CREATE POLICY "Tool owners can delete listings"
    ON public.tool_circle_listings FOR DELETE USING (
        tool_id IN (SELECT id FROM public.tools WHERE owner_id = auth.uid())
    );

-- ============================================================
-- Borrow Requests
-- ============================================================
ALTER TABLE public.borrow_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view their requests"
    ON public.borrow_requests FOR SELECT USING (
        borrower_id = auth.uid() OR lender_id = auth.uid()
    );

-- Borrowers can create requests in circles they belong to
CREATE POLICY "Borrowers can create requests"
    ON public.borrow_requests FOR INSERT WITH CHECK (
        borrower_id = auth.uid()
        AND borrower_id != lender_id
        AND circle_id IN (
            SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid()
        )
    );

-- Lender or borrower can update requests (approve, decline, handoff, return, cancel)
CREATE POLICY "Participants can update requests"
    ON public.borrow_requests FOR UPDATE USING (
        borrower_id = auth.uid() OR lender_id = auth.uid()
    );

-- ============================================================
-- Nuts Transactions
-- ============================================================
ALTER TABLE public.nuts_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transaction history
CREATE POLICY "Users can view own transactions"
    ON public.nuts_transactions FOR SELECT USING (user_id = auth.uid());

-- Nuts inserts are done by Edge Functions (service_role) or DB triggers,
-- not directly by clients. No INSERT policy for authenticated users.

-- ============================================================
-- Notifications
-- ============================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- Notification inserts are done by Edge Functions (service_role) or DB triggers.
-- No INSERT policy for authenticated users.
