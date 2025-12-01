# AdForge

AI-powered TikTok UGC video generator. Create viral content for any product in seconds.

## Documentation

| File | Description |
|------|-------------|
| [MISSION.md](./MISSION.md) | Mission, goals, features, subscription plans |
| [COMPETITION.md](./COMPETITION.md) | Competitor analysis, TikTok strategy, engagement tactics |
| [PROGRESS.md](./PROGRESS.md) | Development progress, bugs, next steps |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment guide for Vercel |

---

## Quick Start

### Development (No Supabase Required)

```bash
npm install
npm run dev
```

Opens at http://localhost:3000 with mock data.

### Development (With Supabase)

```bash
cp .env.example .env.local
# Fill in your Supabase credentials
npm run dev
```

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **Video AI**: Heygen API
- **Deployment**: Vercel

---

## Project Structure

```
app/
├── (app)/              # Protected app routes
│   ├── dashboard/      # Overview dashboard
│   ├── content/videos/ # Video management table
│   ├── generate/       # Video generation
│   ├── analytics/      # Stats dashboard
│   └── video/[id]/     # Video detail
├── (auth)/             # Auth pages
└── api/                # API routes

components/
├── ui/                 # Reusable UI components
├── content/            # Content management components
├── layout/             # Sidebar, header, nav
└── video/              # Video-related components

hooks/                  # Custom React hooks
lib/                    # Utilities and clients
types/                  # TypeScript types
supabase/               # Database schema
```

---

## Current Status

**Phase**: UI Development Complete, Backend Integration In Progress

See [PROGRESS.md](./PROGRESS.md) for detailed status and bugs.

---

## License

MIT
