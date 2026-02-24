-- ============================================================
-- Migration 00013: Atomic RPC functions for tool create/update
-- ============================================================
-- Replaces multi-step client-side operations with single atomic
-- PL/pgSQL functions. On any failure the implicit transaction
-- rolls back all changes, preventing orphaned rows.

-- ── create_tool_with_listings ───────────────────────────────
CREATE OR REPLACE FUNCTION public.create_tool_with_listings(
  p_name        TEXT,
  p_description TEXT        DEFAULT NULL,
  p_category_id UUID        DEFAULT NULL,
  p_photo_url   TEXT        DEFAULT NULL,
  p_nuts_cost   INTEGER     DEFAULT 1,
  p_circle_ids  UUID[]      DEFAULT '{}'
)
RETURNS public.tools
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tool  public.tools;
  v_uid   UUID := auth.uid();
BEGIN
  -- Validate nuts_cost
  IF p_nuts_cost < 1 THEN
    RAISE EXCEPTION 'nuts_cost must be at least 1';
  END IF;

  -- Validate caller is a member of every requested circle
  IF array_length(p_circle_ids, 1) IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM unnest(p_circle_ids) AS cid
      WHERE cid NOT IN (
        SELECT circle_id FROM public.circle_members WHERE user_id = v_uid
      )
    ) THEN
      RAISE EXCEPTION 'You are not a member of one or more selected circles';
    END IF;
  END IF;

  -- Insert tool
  INSERT INTO public.tools (owner_id, name, description, category_id, photo_url, nuts_cost)
  VALUES (v_uid, p_name, p_description, p_category_id, p_photo_url, p_nuts_cost)
  RETURNING * INTO v_tool;

  -- Insert circle listings
  IF array_length(p_circle_ids, 1) IS NOT NULL THEN
    INSERT INTO public.tool_circle_listings (tool_id, circle_id)
    SELECT v_tool.id, unnest(p_circle_ids);
  END IF;

  RETURN v_tool;
END;
$$;

-- ── update_tool_with_listings ───────────────────────────────
CREATE OR REPLACE FUNCTION public.update_tool_with_listings(
  p_tool_id     UUID,
  p_name        TEXT,
  p_description TEXT        DEFAULT NULL,
  p_category_id UUID        DEFAULT NULL,
  p_photo_url   TEXT        DEFAULT NULL,
  p_nuts_cost   INTEGER     DEFAULT 1,
  p_circle_ids  UUID[]      DEFAULT '{}'
)
RETURNS public.tools
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tool  public.tools;
  v_uid   UUID := auth.uid();
BEGIN
  -- Validate ownership
  IF NOT EXISTS (
    SELECT 1 FROM public.tools WHERE id = p_tool_id AND owner_id = v_uid
  ) THEN
    RAISE EXCEPTION 'Tool not found or you are not the owner';
  END IF;

  -- Validate nuts_cost
  IF p_nuts_cost < 1 THEN
    RAISE EXCEPTION 'nuts_cost must be at least 1';
  END IF;

  -- Validate caller is a member of every requested circle
  IF array_length(p_circle_ids, 1) IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM unnest(p_circle_ids) AS cid
      WHERE cid NOT IN (
        SELECT circle_id FROM public.circle_members WHERE user_id = v_uid
      )
    ) THEN
      RAISE EXCEPTION 'You are not a member of one or more selected circles';
    END IF;
  END IF;

  -- Update tool
  UPDATE public.tools
  SET name        = p_name,
      description = p_description,
      category_id = p_category_id,
      photo_url   = p_photo_url,
      nuts_cost   = p_nuts_cost,
      updated_at  = now()
  WHERE id = p_tool_id
  RETURNING * INTO v_tool;

  -- Re-sync circle listings: delete all, re-insert
  DELETE FROM public.tool_circle_listings WHERE tool_id = p_tool_id;

  IF array_length(p_circle_ids, 1) IS NOT NULL THEN
    INSERT INTO public.tool_circle_listings (tool_id, circle_id)
    SELECT p_tool_id, unnest(p_circle_ids);
  END IF;

  RETURN v_tool;
END;
$$;
