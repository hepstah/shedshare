-- Fix profile trigger to handle conflicts (e.g. OAuth re-signups)
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
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Also create a helper RPC that runs as SECURITY DEFINER to ensure profile exists
-- This bypasses RLS so the client can call it safely
CREATE OR REPLACE FUNCTION public.ensure_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email)
  VALUES (
    auth.uid(),
    COALESCE(
      (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = auth.uid()),
      (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = auth.uid()),
      (SELECT split_part(email, '@', 1) FROM auth.users WHERE id = auth.uid())
    ),
    COALESCE(
      (SELECT email FROM auth.users WHERE id = auth.uid()),
      ''
    )
  )
  ON CONFLICT (id) DO NOTHING;
END;
$$;
