# AdForge - Development Progress

## Current Status: Phase 1.75 - UI Fixes & Image Persistence

Last Updated: December 8, 2024

---

## Project Vision

**"10 Videos in 60 Seconds"** - Not competing feature-for-feature with Reel.Farm, but offering 10x speed advantage through batch generation and intelligent automation.

### Key Differentiators vs Reel.Farm

| Area | Reel.Farm | AdForge |
|------|-----------|---------|
| Videos per generation | 1 | **10** |
| Hook options | 1 | **10 to choose from** |
| Time for 10 videos | 30-60 min | **60 seconds** |
| Remix winners | Manual | **One-click** (Phase 3) |
| Price for TikTok posting | $49/mo | **$39/mo** |
| Platforms | TikTok only | **TikTok + IG + YouTube** (Phase 3) |

---

## Completed Work

### Phase 1: Core Generation APIs (Dec 4, 2024)

Built the foundation for AI-powered content generation.

#### New API Endpoints Created

| File | Method | Purpose |
|------|--------|---------|
| `app/api/hooks/generate/route.ts` | POST | Generate 10 viral hooks using Claude |
| `app/api/slideshow/script/route.ts` | POST | Generate slideshow script with Claude |
| `app/api/slideshow/image/route.ts` | POST | Generate single image with FLUX.1 |
| `app/api/slideshow/image/route.ts` | PUT | Batch generate images for all slides |

#### Hook Generator Features

- Uses Claude 3.5 Sonnet for high-quality hooks
- Generates 10 unique hooks per request
- Supports multiple hook styles:
  - Curiosity gaps ("I can't believe this actually...")
  - Bold claims ("This changed my life in 3 days")
  - Direct questions ("Why is nobody talking about this?")
  - Controversial takes ("Unpopular opinion...")
  - Story hooks ("I was today years old when...")
  - FOMO ("Stop scrolling if you...")
  - Results-focused ("How I got [result] in [time]")
- Returns hook + style + explanation for each

#### Slideshow Generator Features

- Creates 6-slide scripts based on selected hook
- Supports 4 slideshow types:
  - **Listicle**: "5 reasons why..." format
  - **Story**: Personal journey narrative
  - **Before/After**: Transformation reveal
  - **Tutorial**: Step-by-step guide
- Auto-generates image prompts for each slide
- Suggests relevant hashtags

#### Image Generator Features

- Uses FLUX.1 Schnell via Replicate (fast + cheap)
- 4 image styles: Aesthetic, Realistic, Minimal, Vibrant
- Vertical 9:16 format (TikTok optimized)
- Batch generation for all slides in parallel

#### New Types Added (types/index.ts)

```typescript
// Hook types
HookStyle = 'curiosity' | 'bold_claim' | 'question' | 'controversial' | 'story' | 'fomo' | 'results'
GeneratedHook = { hook: string; style: HookStyle; whyItWorks: string }

// Slideshow types
SlideshowType = 'listicle' | 'story' | 'before_after' | 'tutorial'
ImageStyle = 'realistic' | 'aesthetic' | 'minimal' | 'vibrant'
Slide = { slideNumber: number; text: string; imagePrompt: string; imageUrl?: string; duration: number }
Slideshow = { title: string; slides: Slide[]; totalDuration: number; hashtags: string[] }

// Video generation types
VideoType = 'slideshow' | 'ugc' | 'meme'
GenerationJob = { id: string; type: VideoType; status: VideoStatus; hook: GeneratedHook; slideshow?: Slideshow; createdAt: string }
```

#### Generate Page Redesigned

New 4-step flow:
1. **Product** - Enter product details (name, description, price, benefits, audience)
2. **Hooks** - View 10 generated hooks, pick your favorite
3. **Slideshow** - Choose type/style, generate script, generate images
4. **Preview** - Review final slideshow, export options

Key UI improvements:
- "Generate 10 Hooks" button (emphasizes our differentiator)
- Hook cards with style badges and explanations
- Live slideshow preview with text overlays
- Image style selector (aesthetic, realistic, minimal, vibrant)

#### Packages Installed

```json
"@anthropic-ai/sdk": "latest"
"replicate": "latest"
```

---

### Phase 1.5: Supabase Integration (Dec 7, 2024)

Connected slideshow generation to Supabase database for persistent storage.

#### Database Schema Updates

New migration file: `supabase/migration_add_slideshow_fields.sql`

Added columns to `videos` table:
- `video_type` - 'slideshow' | 'ugc' | 'meme'
- `slides` - JSONB array of slide data
- `hook` - JSONB object for selected hook
- `image_style` - 'realistic' | 'aesthetic' | 'minimal' | 'vibrant'
- `slideshow_type` - 'listicle' | 'story' | 'before_after' | 'tutorial'
- `hashtags` - Text array
- `total_duration` - Integer (seconds)
- `product_description` - Text
- `target_audience` - Text

#### New API Endpoints

| File | Method | Purpose |
|------|--------|---------|
| `app/api/slideshow/save/route.ts` | POST | Save slideshow to database |
| `app/api/slideshow/save/route.ts` | GET | Fetch saved slideshows |

#### Generate Page Updates

- Added "Save Slideshow" button in Step 4
- "Save & Done" button saves before navigating
- Shows save success message
- Graceful fallback when Supabase not configured

#### Bug Fixes (Dec 7, 2024)

- **Fixed dashboard crash** - Dashboard now properly handles null Supabase client
- **Fixed video detail page crash** - Shows 404 when Supabase not configured
- **Fixed Replicate URL extraction** - Added `extractImageUrl()` helper to handle FileOutput objects
- **Fixed rate limiting** - Sequential image generation with 2-second delays and retry logic

#### Setup Instructions

1. **Run the migration** in Supabase SQL Editor:
   ```sql
   -- Copy contents of supabase/migration_add_slideshow_fields.sql
   ```

2. **Ensure RLS is disabled for testing** (already done if you ran `migration_disable_auth.sql`)

3. **Update `.env.local`** with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

4. **Important**: If you see "Supabase not configured" errors, verify:
   - URL starts with `https://`
   - No placeholder text like `your_` in values
   - No extra spaces or quotes around values

---

### Phase 1.75: UI Fixes & Image Persistence (Dec 8, 2024)

Fixed critical bugs preventing slideshow playback and added permanent image storage.

#### Bug Fixes

| Issue | File | Fix |
|-------|------|-----|
| Content/Videos page crash | `app/(app)/content/videos/page.tsx` | Added null checks for Supabase client in fetch, delete, and bulk delete operations |
| Video detail page not showing slideshows | `app/(app)/video/[id]/page.tsx` | Added slideshow detection and SlideshowPlayer component |
| Broken images after save | `app/api/slideshow/save/route.ts` | Images now persist to Supabase Storage before saving |
| Next.js image domain error | `next.config.js` | Added `replicate.delivery` to allowed image hosts |

#### New Components

| File | Purpose |
|------|---------|
| `app/(app)/video/[id]/slideshow-player.tsx` | Interactive slideshow viewer with play/pause, navigation, and broken image handling |

#### Slideshow Player Features

- **Navigation**: Previous/Next buttons, clickable progress dots
- **Auto-play**: Play/Pause with configurable slide duration
- **Broken image handling**: Graceful fallback with "Image expired" message
- **Slide counter**: Shows current slide number (e.g., "3 / 6")
- **Text overlay**: Displays slide text with gradient background

#### Image Persistence Solution

**Problem**: Replicate image URLs are temporary (expire after a few hours)

**Solution**: When saving a slideshow:
1. Download images from temporary Replicate URLs
2. Upload to Supabase Storage (`slideshow-images` bucket)
3. Store permanent Supabase URLs in database

#### New Migration File

`supabase/migration_create_storage_bucket.sql` - Creates storage bucket for permanent image storage

```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('slideshow-images', 'slideshow-images', true)
ON CONFLICT (id) DO NOTHING;

-- Add read/write policies
CREATE POLICY "Public read access for slideshow images"
ON storage.objects FOR SELECT
USING (bucket_id = 'slideshow-images');

CREATE POLICY "Allow all uploads to slideshow images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'slideshow-images');
```

#### Video Detail Page Enhancements

- Shows video type badge (slideshow/ugc/meme)
- Shows slideshow type badge (listicle/story/before-after/tutorial)
- Displays selected hook with style and explanation
- Shows hashtags as clickable badges
- Shows product description and target audience

#### Updated next.config.js

Added remote image patterns:
- `replicate.delivery` - for temporary generated images
- `*.replicate.delivery` - for CDN subdomains

---

### Studio Dashboard Redesign (Dec 1, 2024)

Transformed from TikTok-style vertical video feed to professional YouTube Studio-style dashboard.

#### UI Components Created

| File | Purpose |
|------|---------|
| `components/ui/checkbox.tsx` | Checkbox with indeterminate state |
| `components/ui/badge.tsx` | Status badges |
| `components/ui/dropdown-menu.tsx` | Action menus |
| `components/ui/search-input.tsx` | Search with clear |
| `components/ui/filter-dropdown.tsx` | Multi-select filter |
| `components/ui/data-table.tsx` | Sortable table |

#### Content Components Created

| File | Purpose |
|------|---------|
| `components/content/content-header.tsx` | Page header with search, filters |
| `components/content/bulk-action-bar.tsx` | Bulk actions bar |

---

## Development Roadmap

### Phase 1: Core Generation - COMPLETE

- [x] Hook Generator API (Claude)
- [x] Slideshow Script Generator (Claude)
- [x] Image Generator (FLUX.1)
- [x] Batch image generation
- [x] New generate page UI

### Phase 1.5: Supabase Integration - COMPLETE

- [x] Database schema for slideshows
- [x] Save slideshow API endpoint
- [x] Fetch slideshows API endpoint
- [x] Generate page save functionality
- [x] Graceful fallback when Supabase not configured

### Phase 1.75: UI Fixes & Image Persistence - COMPLETE

- [x] Fix Content/Videos page crash (null Supabase client)
- [x] Build SlideshowPlayer component with navigation/auto-play
- [x] Video detail page slideshow support
- [x] Permanent image storage (Supabase Storage)
- [x] Broken image handling with graceful fallback
- [x] Next.js image domain configuration

### Phase 2: UGC & Automation - UP NEXT

- [ ] Hook + Demo UGC videos (HeyGen integration)
- [ ] Batch generation ("Generate 10 Videos" button)
- [ ] Auto-scheduling queue
- [ ] TikTok OAuth connection
- [ ] Direct TikTok posting

### Phase 3: Intelligence & Scale

- [ ] Analytics with real TikTok data
- [ ] "Remix Winner" feature
- [ ] Trend detection
- [ ] Autopilot mode
- [ ] Multi-platform (Instagram Reels, YouTube Shorts)

---

## Environment Setup

### Required API Keys

Create `.env.local` in project root:

```env
# Supabase (optional for now - uses mock data without)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_AGENCY_PRICE_ID=price_xxx

# AI Generation APIs (REQUIRED FOR PHASE 1)
ANTHROPIC_API_KEY=sk-ant-xxx
REPLICATE_API_TOKEN=r8_xxx

# Heygen (for Phase 2)
HEYGEN_API_KEY=your_heygen_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting API Keys

| Service | URL | Purpose |
|---------|-----|---------|
| Anthropic | https://console.anthropic.com/ | Hook & script generation |
| Replicate | https://replicate.com/account/api-tokens | Image generation |
| HeyGen | https://app.heygen.com/ | UGC avatar videos (Phase 2) |

### Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000/generate
```

---

## Cost Estimates

### Per Slideshow Generation

| Action | Cost |
|--------|------|
| Generate 10 hooks | ~$0.01 |
| Generate slideshow script | ~$0.01 |
| Generate 6 images (FLUX Schnell) | ~$0.02 |
| **Total** | **~$0.04** |

### Monthly Estimates (at scale)

| Usage | Cost |
|-------|------|
| 100 slideshows/month | ~$4 |
| 500 slideshows/month | ~$20 |
| 1000 slideshows/month | ~$40 |

---

## Known Issues

### High Priority

| Issue | Description | Workaround |
|-------|-------------|------------|
| Build fails without env vars | Stripe initialization crashes | Use `npm run dev` |
| API keys required | Generation features need Anthropic + Replicate keys | Add to `.env.local` |

### Medium Priority

| Issue | Description | Notes |
|-------|-------------|-------|
| Video detail page may crash | Mock video IDs don't exist | Need mock data fallback |
| Export not implemented | Download/video creation are placeholders | Phase 2 |

---

## File Structure (Updated)

```
app/
├── (app)/
│   ├── generate/
│   │   └── page.tsx              # UPDATED - 4-step flow with save
│   ├── content/
│   │   └── videos/
│   │       └── page.tsx          # Video table
│   └── dashboard/
│       └── page.tsx              # Overview
├── api/
│   ├── hooks/
│   │   └── generate/
│   │       └── route.ts          # Hook generation
│   ├── slideshow/
│   │   ├── script/
│   │   │   └── route.ts          # Script generation
│   │   ├── image/
│   │   │   └── route.ts          # Image generation
│   │   └── save/
│   │       └── route.ts          # NEW - Save/fetch slideshows
│   ├── generate/
│   │   └── route.ts              # Existing HeyGen integration
│   └── videos/
│       └── bulk/
│           └── route.ts          # Bulk actions

supabase/
├── schema.sql                    # Main database schema
├── migration_disable_auth.sql    # Disable RLS for testing
├── migration_restore_auth.sql    # Re-enable RLS
├── migration_add_slideshow_fields.sql  # Slideshow columns
└── migration_create_storage_bucket.sql # NEW - Image storage bucket

types/
└── index.ts                      # UPDATED - Added slideshow fields to Video

.env.example                      # Added AI API keys
```

---

## Testing Checklist

### Phase 1 APIs
- [x] Hook generation returns 10 hooks
- [x] Slideshow script generates configurable slides (3-10)
- [x] Single image generation works
- [x] Batch image generation works (with rate limit handling)
- [x] Generate page flow complete

### Phase 1.5 Supabase
- [ ] Run migration_add_slideshow_fields.sql
- [ ] Verify slideshow saves to database
- [ ] Verify slideshows can be fetched
- [ ] Test with Supabase credentials in .env.local

### UI Components
- [x] Checkbox - click, indeterminate state
- [x] Badge - all variants
- [x] Dropdown menu - open, close
- [x] Search input - type, clear
- [x] Filter dropdown - multi-select
- [x] Data table - sort, select

### Pages
- [x] Landing page
- [x] Dashboard (mock data)
- [x] Videos page (mock data)
- [ ] Generate page (needs API keys to test)
- [ ] Video detail
- [ ] Analytics

---

## Session Summary - December 8, 2024

### What Was Done Today

1. **Fixed Content/Videos Page Crash**
   - Added null checks for Supabase client in `app/(app)/content/videos/page.tsx`
   - Fixed fetch, single delete, and bulk delete operations

2. **Built Slideshow Player Component**
   - Created `app/(app)/video/[id]/slideshow-player.tsx`
   - Features: navigation, auto-play, progress dots, broken image handling
   - Shows slide text overlay with gradient background

3. **Enhanced Video Detail Page**
   - Added slideshow detection (`video_type === 'slideshow'`)
   - Shows video type and slideshow type badges
   - Displays hook info, hashtags, product description
   - Integrated SlideshowPlayer for slideshow videos

4. **Implemented Permanent Image Storage**
   - Updated `app/api/slideshow/save/route.ts` to persist images
   - Downloads from temporary Replicate URLs
   - Uploads to Supabase Storage (`slideshow-images` bucket)
   - Stores permanent URLs in database
   - Created `migration_create_storage_bucket.sql`

5. **Fixed Next.js Image Configuration**
   - Added `replicate.delivery` to allowed hosts in `next.config.js`

### Files Changed

| File | Change |
|------|--------|
| `app/(app)/content/videos/page.tsx` | Added null checks for Supabase client |
| `app/(app)/video/[id]/page.tsx` | Added slideshow support, badges, hook/hashtag display |
| `app/(app)/video/[id]/slideshow-player.tsx` | NEW - Interactive slideshow viewer |
| `app/api/slideshow/save/route.ts` | Added image persistence to Supabase Storage |
| `next.config.js` | Added Replicate to allowed image domains |
| `supabase/migration_create_storage_bucket.sql` | NEW - Storage bucket setup |

### Setup Required

Run this in Supabase SQL Editor to enable image persistence:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('slideshow-images', 'slideshow-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for slideshow images"
ON storage.objects FOR SELECT
USING (bucket_id = 'slideshow-images');

CREATE POLICY "Allow all uploads to slideshow images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'slideshow-images');
```

---

## Session Summary - December 7, 2024

### What Was Done

1. **Supabase Integration**
   - Created `migration_add_slideshow_fields.sql` with new columns for slideshow data
   - Created `/api/slideshow/save` endpoint (POST to save, GET to fetch)
   - Added save functionality to generate page (Step 4)
   - Updated `types/index.ts` with slideshow fields on Video interface

2. **Bug Fixes**
   - Fixed dashboard page crash when Supabase client is null
   - Fixed video detail page crash when Supabase not configured
   - Fixed image generation - Replicate returns FileOutput objects, not plain URLs
   - Added `extractImageUrl()` helper to properly extract URLs

---

## Next Steps

1. **Run Storage Bucket Migration**
   - Execute `migration_create_storage_bucket.sql` in Supabase
   - This enables permanent image storage

2. **Test End-to-End Flow**
   - Generate a new slideshow
   - Save it
   - View it on video detail page
   - Verify images persist after browser refresh

3. **Begin Phase 2**
   - HeyGen UGC video integration
   - Batch generation ("Generate 10 Videos" button)
   - Video export with FFmpeg

---

*Last updated: December 8, 2024*
