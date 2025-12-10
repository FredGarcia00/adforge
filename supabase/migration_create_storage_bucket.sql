-- Create storage bucket for slideshow images
-- Run this in the Supabase SQL Editor

-- Create the storage bucket for slideshow images
INSERT INTO storage.buckets (id, name, public)
VALUES ('slideshow-images', 'slideshow-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Public read access for slideshow images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'slideshow-images');

-- Allow authenticated users to upload (or all users for testing)
-- For testing without auth, use this policy:
CREATE POLICY "Allow all uploads to slideshow images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'slideshow-images');

-- Allow updates to slideshow images
CREATE POLICY "Allow all updates to slideshow images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'slideshow-images');

-- Allow deletes to slideshow images
CREATE POLICY "Allow all deletes to slideshow images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'slideshow-images');
