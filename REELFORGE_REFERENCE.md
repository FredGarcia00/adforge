# ReelForge – Complete Reference & Build Log

## One-Sentence Goal
A ReelFarm-killing SaaS that turns any product (physical, app, course, affiliate link) into 10 dead-real, ready-to-post TikTok ads in under 60 seconds — then lets creators edit, schedule, and track them.

---

## What Was Built Today (Foundation)

### Completed Features

**1. Project Foundation**
- Next.js 15 with App Router + TypeScript
- Tailwind CSS with custom theme (TikTok coral #FE2C55 accent)
- Supabase integration (Auth + PostgreSQL + Storage)
- Stripe integration (checkout, portal, webhooks)
- Vercel-ready deployment configuration

**2. TikTok Studio-Style UI**
- Left sidebar navigation with grouped sections
- Main content area for each page
- Clean light/dark theme support
- Professional desktop SaaS layout

**3. Sidebar Navigation Structure**
```
[Logo] ReelForge
[+ Generate] ← Primary CTA

CONTENT
├── Videos        (grid of all generated videos)
├── Scheduled     (queued for posting)
├── Campaigns     (grouped content)
└── Analytics     (performance stats)

PLAYGROUND
├── Create        (generation wizard)
├── Templates     (saved prompts/styles)
└── Assets        (uploaded images/logos)

ACCOUNT
├── TikTok Accounts
├── Subscription
└── Settings
```

**4. Pages Built**
- `/dashboard` - Videos grid with thumbnails, stats, hover actions
- `/generate` - 4-step creation wizard (Prompt → Images → Details → Style)
- `/scheduled` - Scheduled posts queue (empty state)
- `/campaigns` - Campaign organization (empty state)
- `/analytics` - Stats dashboard with metrics grid
- `/templates` - Saved prompts/styles (empty state)
- `/assets` - Uploaded images/logos (empty state)
- `/accounts` - TikTok account connections
- `/subscription` - Plan management (Free/Pro/Agency)
- `/settings` - User preferences
- `/` - Marketing landing page
- `/login` & `/signup` - Auth pages

**5. Database Schema**
```sql
-- users (extends auth.users)
-- videos (with status, stats, product info)
-- product_images
-- tiktok_accounts
-- product-images storage bucket
```

**6. Components Library**
- Button, Input, Textarea, Card, Modal
- Sidebar, VideoCard, ImageUpload
- Empty states for all pages

---

## Exact Technologies & APIs (never change)

| What we need to do                 | Tool / API we will use                     |
|------------------------------------|--------------------------------------------|
| Frontend + routing                 | Next.js 15 (app router) + TypeScript       |
| Styling                            | Tailwind CSS                               |
| Hosting                            | Vercel                                     |
| Database + Auth + File Storage     | Supabase                                   |
| Payments                           | Stripe                                     |
| Script writing                     | Claude 3.5 Sonnet (primary) or GPT-4o-mini |
| Images (UGC + product insertion)   | FLUX.1 via Groq or Replicate               |
| Dead-real avatars                  | HeyGen Instant Avatar 2.0 API              |
| Voiceover                          | ElevenLabs Starter API                     |
| Final video assembly + lip-sync    | Runway Gen-3 Alpha API                     |
| TikTok analytics & OAuth           | TikTok Marketing API                       |
| Scheduler & background jobs        | Vercel Cron Jobs or Upstash Queue          |
| Drag-and-drop editor               | Tiptap + React canvas (or Lexical)         |

---

## MVP Features – Detailed (Next Steps)

### 1. Generation Flow (Partially Built)
- [x] User clicks "+ Create" → page opens
- [x] Prompt box ("sell my $49 LED face mask")
- [x] Drag-and-drop upload product photos (1–10 images)
- [x] Optional form: product name, price, benefits, link
- [x] Avatar picker (placeholder - needs real avatars)
- [x] Brand color picker
- [ ] "Generate 10 videos" button → actual AI generation

### 2. What "Generate 10 videos" Creates (Not Built Yet)
- [ ] 5 slideshow listicles (6–10 slides each, soft-sell ending)
- [ ] 3 talking-avatar videos (person holding/showing product)
- [ ] 2 meme/green-screen clips (fails, Day-1-vs-Day-100)
- [ ] All videos exported silent (for trending TikTok sound)

### 3. Full Editor (Not Built Yet)
- [ ] Drag-and-drop reordering of slides/scenes
- [ ] Edit any text overlay
- [ ] Change voiceover text
- [ ] Swap avatar or background
- [ ] Regenerate individual slides

### 4. Analytics (Partially Built)
- [x] Stats dashboard with metrics
- [x] Top performing videos list
- [ ] Connect TikTok accounts via OAuth
- [ ] Real stats: views, likes, comments, shares, saves
- [ ] "Remix this winner" button

### 5. Scheduler (Not Built Yet)
- [ ] Schedule 1–3 posts per day per account
- [ ] Support unlimited TikTok accounts
- [ ] Calendar view

### 6. Export (Not Built Yet)
- [ ] Download silent MP4
- [ ] Direct auto-post to TikTok (draft or scheduled)

---

## File Structure

```
/app
  /(app)/                    # Protected app routes
    dashboard/               # Videos grid
    generate/                # Creation wizard
    scheduled/               # Scheduled posts
    campaigns/               # Campaigns
    analytics/               # Stats
    templates/               # Saved templates
    assets/                  # Uploaded assets
    accounts/                # TikTok accounts
    subscription/            # Billing
    settings/                # Preferences
    video/[id]/              # Video detail
  /(auth)/login, signup      # Auth pages
  /api/stripe/               # Stripe webhooks
  /auth/                     # Auth callbacks

/components
  /ui/                       # Button, Input, Modal, Card, etc.
  /layout/                   # Sidebar
  /generate/                 # ImageUpload
  /video/                    # VideoCard, VideoFeed

/lib
  /supabase/                 # Client, server, middleware
  /stripe.ts                 # Stripe config
  /utils.ts                  # Utilities

/types/index.ts              # TypeScript types
/supabase/schema.sql         # Database schema
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_AGENCY_PRICE_ID=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI APIs (to be added)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
HEYGEN_API_KEY=
ELEVENLABS_API_KEY=
RUNWAY_API_KEY=
REPLICATE_API_TOKEN=
```

---

## Pricing Tiers

| Tier   | Price   | Videos/Month | Features                              |
|--------|---------|--------------|---------------------------------------|
| Free   | $0      | 3            | Basic analytics, watermarked          |
| Pro    | $29/mo  | 50           | Advanced analytics, no watermark      |
| Agency | $99/mo  | Unlimited    | Team collab, API access, priority     |

---

## Next Development Priorities

1. **Enable Supabase/Stripe** - Configure environment variables
2. **AI Script Generation** - Claude API integration
3. **Image Generation** - FLUX.1 for UGC + product shots
4. **Avatar Videos** - HeyGen API integration
5. **Video Assembly** - Runway Gen-3 for final render
6. **TikTok OAuth** - Connect accounts for posting
7. **Scheduler** - Cron jobs for auto-posting
8. **Full Editor** - Drag-drop editing interface

---

## How to Run

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Fill in your API keys

# Run Supabase schema
# Go to Supabase SQL Editor and run supabase/schema.sql

# Start development
npm run dev

# Open http://localhost:3000
```

---

## Claude Prompt Template

Start every Claude message with:

> "Continue building ReelForge using the exact technologies and features in this plan:"

Then describe what you want to build next.

---

*Last updated: November 20, 2025*
