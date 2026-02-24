-- Enable RLS on tool_categories — anyone authenticated can read
ALTER TABLE public.tool_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view categories"
    ON public.tool_categories FOR SELECT
    TO authenticated
    USING (true);

-- Enable RLS on tool_circle_listings
ALTER TABLE public.tool_circle_listings ENABLE ROW LEVEL SECURITY;

-- Circle members can see listings in their circles
CREATE POLICY "Circle members can view listings"
    ON public.tool_circle_listings FOR SELECT USING (
        circle_id IN (
            SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid()
        )
    );

-- Tool owners who are members of the circle can create listings
CREATE POLICY "Tool owners can list in their circles"
    ON public.tool_circle_listings FOR INSERT WITH CHECK (
        tool_id IN (SELECT id FROM public.tools WHERE owner_id = auth.uid())
        AND circle_id IN (
            SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid()
        )
    );

-- Tool owners can remove listings
CREATE POLICY "Tool owners can remove listings"
    ON public.tool_circle_listings FOR DELETE USING (
        tool_id IN (SELECT id FROM public.tools WHERE owner_id = auth.uid())
    );
