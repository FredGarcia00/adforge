-- Revert authentication changes and restore RLS policies
-- Run this in Supabase SQL Editor when you're ready to re-enable authentication

-- Remove temporary permissive policies
DROP POLICY IF EXISTS "Allow all to view videos" ON public.videos;
DROP POLICY IF EXISTS "Allow all to create videos" ON public.videos;
DROP POLICY IF EXISTS "Allow all to update videos" ON public.videos;
DROP POLICY IF EXISTS "Allow all to delete videos" ON public.videos;

-- Make user_id required again
ALTER TABLE public.videos ALTER COLUMN user_id SET NOT NULL;

-- Restore original RLS policies
CREATE POLICY "Users can view own videos"
  ON public.videos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own videos"
  ON public.videos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos"
  ON public.videos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own videos"
  ON public.videos FOR DELETE
  USING (auth.uid() = user_id);
