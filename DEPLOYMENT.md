# AdForge Deployment Guide (Core Functionality Only)

This guide walks you through deploying AdForge to Vercel with just the core video generation functionality. Authentication and Stripe billing will be added later.

## Quick Overview

**What we're deploying:** Core video generation with Heygen API (no auth, no Stripe)
**Platform:** Vercel
**Services needed:** Supabase (database only), Heygen (video generation)

**Changes made:**
- Removed authentication from API routes (commented with TODO)
- Disabled Supabase RLS policies temporarily
- Made `user_id` nullable in videos table

**How to revert:** See "Reverting Authentication Changes" section at the bottom of this guide.

---

## Prerequisites

- Vercel account
- Supabase account (with schema already set up)
- Heygen account

---

## Code Changes Made to Disable Authentication

The following files have been modified to temporarily disable authentication. All auth code is commented with `// TODO: Re-enable when auth is added back`

1. **app/api/generate/route.ts** - Removed user authentication checks, commented out `user_id` in video creation
2. **app/api/videos/[id]/status/route.ts** - Removed user verification and user_id filtering
3. **app/(app)/dashboard/page.tsx** - Disabled user authentication and filtering

---

## Step 1: Disable Authentication in Supabase

Since we're skipping authentication for now, you need to run a migration to temporarily disable auth requirements.

### 1.1 Run This SQL Code

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. **Copy and paste this exact SQL code:**

```sql
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
```

4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

### 1.2 What This Does

- Makes `user_id` nullable in the videos table (so videos can be created without a user)
- Removes restrictive RLS policies that require authentication
- Adds temporary permissive policies that allow anyone to view/create/update/delete videos

⚠️ **IMPORTANT:** These are temporary changes for testing. See "Reverting Authentication Changes" section below before going to production with auth enabled.

---

## Step 2: Get Heygen API Key

1. Go to [Heygen](https://www.heygen.com/) and sign up for an account
2. Navigate to **API Keys** in your dashboard
3. Create a new API key and copy it
4. Keep this handy for Step 4

**Note:** Heygen may require a paid plan to access the API. Check their pricing at https://www.heygen.com/pricing

---

## Step 3: Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")
   - **service_role key** (under "Project API keys" - click "Reveal" to see it)

---

## Step 4: Deploy to Vercel

### 4.1 Connect Repository

1. Go to [Vercel](https://vercel.com) and log in
2. Click **"Add New Project"**
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Select the AdForge repository

### 4.2 Configure Environment Variables

Before deploying, add these environment variables in Vercel:

**Supabase:**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Heygen:**
```
HEYGEN_API_KEY=your_heygen_api_key
```

**App URL:**
```
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```
(You can update this after deployment with your actual Vercel URL)

### 4.3 Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Once deployed, copy your production URL

### 4.4 Update App URL

1. Go to **Settings** > **Environment Variables** in Vercel
2. Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
3. Redeploy the app for changes to take effect

---

## Step 5: Test Video Generation

1. Visit your deployed app at `https://your-app.vercel.app`
2. Go to `/generate` route
3. Fill out the form:
   - **Step 1:** Enter a product description
   - **Step 2:** Skip images for now (optional)
   - **Step 3:** Add product details
   - **Step 4:** Choose an avatar and brand color
4. Click **"Generate Video"**
5. The app will poll for completion and redirect to the video page
6. Check your dashboard at `/dashboard` to see all generated videos

---

## Troubleshooting

### Video generation fails immediately
- Check that your `HEYGEN_API_KEY` is correct in Vercel environment variables
- Verify your Heygen account has API access enabled
- Check the Vercel logs for detailed error messages

### Videos don't show in dashboard
- Verify your Supabase credentials are correct
- Make sure you ran the SQL code from Step 1.1 to disable RLS policies
- Check that RLS policies are disabled in Supabase SQL Editor

### Build errors on Vercel
- Make sure all dependencies are installed (check `package.json`)
- Verify TypeScript errors by running `npm run build` locally first

---

## Next Steps

Once core video generation is working:

1. **Add Authentication**
   - Revert the database migration
   - Uncomment auth code in API routes
   - Set up Supabase Auth providers

2. **Add Stripe Billing**
   - Create Stripe products
   - Configure webhooks
   - Add environment variables

3. **Add TikTok Integration**
   - Set up TikTok Developer app
   - Implement OAuth flow
   - Add auto-posting functionality

---

## Environment Variables Reference

Here's the complete list of environment variables needed for core functionality:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Yes |
| `HEYGEN_API_KEY` | Heygen API key for video generation | Yes |
| `NEXT_PUBLIC_APP_URL` | Your production app URL | Yes |

---

## Reverting Authentication Changes

When you're ready to add authentication back, follow these steps to revert all temporary changes.

### Step 1: Revert Supabase Database Changes

Go to Supabase SQL Editor and copy/paste this SQL code (also saved in `supabase/migration_restore_auth.sql`):

```sql
-- Revert authentication changes and restore RLS policies

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
```

### Step 2: Revert Code Changes

In the following files, uncomment the auth code and remove the temporary changes:

**1. app/api/generate/route.ts**
- Uncomment the authentication check at the top
- Uncomment `user_id: user.id` in the video insert

**2. app/api/videos/[id]/status/route.ts**
- Uncomment the authentication check
- Uncomment `.eq('user_id', user.id)` in the video query

**3. app/(app)/dashboard/page.tsx**
- Uncomment `const { data: { user } } = await supabase.auth.getUser()`
- Uncomment `.eq('user_id', user.id)` in the videos query
- Restore the `if (user)` conditional

### Step 3: Set Up Supabase Auth

1. Go to **Authentication** > **Providers** in Supabase
2. Enable your desired auth providers (Email, Google, etc.)
3. Configure OAuth redirect URLs if using social auth
4. Test authentication flow

### Step 4: Add Stripe Environment Variables

Once you're ready for billing:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_PRO_PRICE_ID=price_your_pro_id
STRIPE_AGENCY_PRICE_ID=price_your_agency_id
```

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review Supabase logs in the dashboard
3. Verify all environment variables are set correctly
4. Test Heygen API directly using their documentation
