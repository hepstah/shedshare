-- ============================================================
-- Migration 00011: Fix all RLS cross-table recursion
-- ============================================================
-- circle_members has a self-referencing RLS policy. Every table
-- whose RLS references circle_members hits the same 500 error.
-- Fix: a single SECURITY DEFINER function to get the current
-- user's circle IDs, then rewrite all affected policies.

-- 1. Helper: get circle IDs for current user (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_my_circle_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT circle_id
    FROM public.circle_members
    WHERE user_id = auth.uid();
$$;

-- 2. Fix circle_members self-referencing policy
DROP POLICY IF EXISTS "Members can view circle members" ON public.circle_members;
CREATE POLICY "Members can view circle members"
    ON public.circle_members FOR SELECT
    USING (circle_id IN (SELECT get_my_circle_ids()));

-- 3. Fix circles policy
DROP POLICY IF EXISTS "Members can view their circles" ON public.circles;
CREATE POLICY "Members can view their circles"
    ON public.circles FOR SELECT
    USING (id IN (SELECT get_my_circle_ids()));

-- 4. Fix tools policy (references circle_members via tool_circle_listings)
DROP POLICY IF EXISTS "Users can view tools in their circles" ON public.tools;
CREATE POLICY "Users can view tools in their circles"
    ON public.tools FOR SELECT
    USING (
        owner_id = auth.uid()
        OR id IN (
            SELECT tcl.tool_id
            FROM public.tool_circle_listings tcl
            WHERE tcl.circle_id IN (SELECT get_my_circle_ids())
        )
    );

-- 5. Fix tool_circle_listings policies
DROP POLICY IF EXISTS "Circle members can view listings" ON public.tool_circle_listings;
CREATE POLICY "Circle members can view listings"
    ON public.tool_circle_listings FOR SELECT
    USING (circle_id IN (SELECT get_my_circle_ids()));

DROP POLICY IF EXISTS "Tool owners can list in their circles" ON public.tool_circle_listings;
CREATE POLICY "Tool owners can list in their circles"
    ON public.tool_circle_listings FOR INSERT
    WITH CHECK (
        tool_id IN (SELECT id FROM public.tools WHERE owner_id = auth.uid())
        AND circle_id IN (SELECT get_my_circle_ids())
    );

-- 6. Update get_circle_mate_ids to use the new helper too
CREATE OR REPLACE FUNCTION public.get_circle_mate_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT DISTINCT cm.user_id
    FROM public.circle_members cm
    WHERE cm.circle_id IN (SELECT get_my_circle_ids());
$$;
