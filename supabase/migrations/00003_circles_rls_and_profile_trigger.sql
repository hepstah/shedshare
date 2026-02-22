-- ============================================================
-- Migration 00003: Circles RLS, profile trigger, and RPCs
-- ============================================================

-- 1A. Profile auto-creation trigger
-- Without this, new users have no profiles row and creating circles fails on FK constraint.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.email, '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 1B. Profiles INSERT policy (allows the trigger / client to insert the user's own profile)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 1C. Circles INSERT + UPDATE policies
CREATE POLICY "Authenticated users can create circles"
  ON public.circles FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update their circles"
  ON public.circles FOR UPDATE
  USING (
    id IN (
      SELECT circle_id FROM public.circle_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 1D. RPC: create_circle — atomic circle + admin member insert
CREATE OR REPLACE FUNCTION public.create_circle(p_name TEXT, p_description TEXT DEFAULT NULL)
RETURNS public.circles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_circle public.circles;
BEGIN
  INSERT INTO public.circles (name, description, created_by)
  VALUES (p_name, p_description, auth.uid())
  RETURNING * INTO v_circle;

  INSERT INTO public.circle_members (circle_id, user_id, role)
  VALUES (v_circle.id, auth.uid(), 'admin');

  RETURN v_circle;
END;
$$;

-- 1E. RPC: get_circle_by_invite_code — bypasses member-only SELECT policy
CREATE OR REPLACE FUNCTION public.get_circle_by_invite_code(code TEXT)
RETURNS public.circles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_circle public.circles;
BEGIN
  SELECT * INTO v_circle
  FROM public.circles
  WHERE invite_code = code;

  RETURN v_circle;
END;
$$;

-- 1F. circle_members — Enable RLS + policies
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;

-- Members can view members in their circles
CREATE POLICY "Members can view circle members"
  ON public.circle_members FOR SELECT
  USING (
    circle_id IN (
      SELECT circle_id FROM public.circle_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can join circles (insert their own membership)
CREATE POLICY "Users can join circles"
  ON public.circle_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can leave circles (delete their own membership)
CREATE POLICY "Users can leave circles"
  ON public.circle_members FOR DELETE
  USING (auth.uid() = user_id);
