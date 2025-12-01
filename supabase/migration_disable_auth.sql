-- Temporary migration to disable authentication requirements
-- Run this in your Supabase SQL Editor to test without auth

-- Make user_id nullable in videos table
ALTER TABLE public.videos ALTER COLUMN user_id DROP NOT NULL;

-- Temporarily disable RLS policies that require authentication
DROP POLICY IF EXISTS "Users can view own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can create own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can update own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can delete own videos" ON public.videos;

-- Create permissive policies for testing (allow all operations)
CREATE POLICY "Allow all to view videos"
  ON public.videos FOR SELECT
  USING (true);

CREATE POLICY "Allow all to create videos"
  ON public.videos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to update videos"
  ON public.videos FOR UPDATE
  USING (true);

CREATE POLICY "Allow all to delete videos"
  ON public.videos FOR DELETE
  USING (true);

-- Note: Remember to revert these changes when you re-enable authentication!
