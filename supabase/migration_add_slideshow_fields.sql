-- Migration to add slideshow-specific fields to the videos table
-- Run this in your Supabase SQL Editor

-- Add video_type column to distinguish between slideshow, ugc, and meme videos
ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS video_type text DEFAULT 'slideshow'
CHECK (video_type IN ('slideshow', 'ugc', 'meme'));

-- Add slides JSONB column to store slide data
-- Each slide contains: slideNumber, text, imagePrompt, imageUrl, duration
ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS slides jsonb DEFAULT '[]'::jsonb;

-- Add hook JSONB column to store the selected hook
-- Contains: hook (text), style, whyItWorks
ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS hook jsonb;

-- Add image_style column for slideshow image generation style
ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS image_style text DEFAULT 'aesthetic'
CHECK (image_style IN ('realistic', 'aesthetic', 'minimal', 'vibrant'));

-- Add slideshow_type column
ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS slideshow_type text DEFAULT 'listicle'
CHECK (slideshow_type IN ('listicle', 'story', 'before_after', 'tutorial'));

-- Add hashtags array column
ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS hashtags text[] DEFAULT '{}';

-- Add total_duration column for slideshow
ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS total_duration integer DEFAULT 0;

-- Add product_description column (used for hook generation)
ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS product_description text;

-- Add target_audience column
ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS target_audience text;

-- Create index for video_type for faster filtering
CREATE INDEX IF NOT EXISTS videos_video_type_idx ON public.videos(video_type);

-- Comment explaining the slides JSONB structure
COMMENT ON COLUMN public.videos.slides IS 'Array of slide objects: [{slideNumber: number, text: string, imagePrompt: string, imageUrl?: string, duration: number}]';
COMMENT ON COLUMN public.videos.hook IS 'Selected hook object: {hook: string, style: string, whyItWorks: string}';
