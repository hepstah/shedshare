-- Profiles
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

-- Tools
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

-- Circles
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their circles"
    ON public.circles FOR SELECT USING (
        id IN (SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid())
    );

-- Borrow requests
ALTER TABLE public.borrow_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view their requests"
    ON public.borrow_requests FOR SELECT USING (
        borrower_id = auth.uid() OR lender_id = auth.uid()
    );

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE USING (user_id = auth.uid());
