-- ============================================================
-- Migration 00010: Fix profiles RLS recursive policy
-- ============================================================
-- The "Users can view circle members profiles" policy subqueries
-- circle_members, which has its own RLS. This cross-table RLS
-- dependency causes 500 errors. Fix: use a SECURITY DEFINER
-- function to bypass RLS on the inner lookup.

-- 1. Helper function: get user IDs sharing circles with current user
CREATE OR REPLACE FUNCTION public.get_circle_mate_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT DISTINCT cm.user_id
    FROM public.circle_members cm
    WHERE cm.circle_id IN (
        SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid()
    );
$$;

-- 2. Drop the broken policy
DROP POLICY IF EXISTS "Users can view circle members profiles" ON public.profiles;

-- 3. Recreate using the SECURITY DEFINER function
CREATE POLICY "Users can view circle members profiles"
    ON public.profiles FOR SELECT
    USING (id IN (SELECT get_circle_mate_ids()));
