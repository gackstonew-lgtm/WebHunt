# ⚡ Gacks Leads — Local Business "No-Website" Lead Radar & CRM

> A production-ready lead-generation platform engineered to discover local businesses that have active phone numbers but **no registered website**, giving web design agencies, freelancers, and software vendors a high-converting pipeline of warm B2B prospects.

---

## 🎯 The Core Philosophy: Why This Works

Traditional web scraping is fragile, illegal-prone, and misses offline businesses. **Gacks Leads** leverages official, authoritative business-listing APIs (**Google Places API (New)**, **Yelp Fusion API**, and **OpenStreetMap Overpass**), applies an automated **`website == null/empty` & `phone != null` qualification filter**, and normalizes + de-duplicates records across providers.

---

## 🚀 Key Features

- 📡 **Multi-Provider Radar Engine**:
  - **Google Places API (New)**: Queries text search and place details for national phone numbers, categories, ratings, reviews, and website absence.
  - **Yelp Fusion API**: Real-time business search with ratings, review count, and phone numbers.
  - **OpenStreetMap Overpass API**: 100% **free**, public fallback querying global Overpass QL without needing API keys.
  - **Demo Sandbox Provider**: Pre-loaded with realistic, localized businesses across 10+ industries for instant offline testing and staging.
- 🧹 **Intelligent De-duplication & Enrichment**: Strips company suffixes (LLC, Inc), standardizes phone numbers into E.164, and merges duplicate listings across providers.
- ⚡ **Rate-Limiting & Cost Awareness**: Integrated API cache (`ApiCache` table) with TTL to prevent redundant Google/Yelp billings.
- 📊 **Lead Pipeline CRM**: Move prospects through Kanban/list stages (**New** ➔ **Contacted** ➔ **Interested** ➔ **Closed / Won** ➔ **Archived**), log notes, and adjust estimated deal size.
- 🎙️ **Dynamic Cold Call Pitch Generator**: Generates 3-step personalized cold calling scripts tailored to the business's niche, local area, and star rating, complete with objection handling.
- 📥 **CSV Export**: One-click download of leads formatted specifically for cold-calling dialers, CRMs, and spreadsheets.
- 🛡️ **TCPA & Do-Not-Call (DNC) Compliance**: Built-in compliance guide and best practices for ethical B2B phone outreach.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/) + TypeScript + React 18
- **Styling**: Tailwind CSS + Lucide Icons + Radix/Modern Dark Glassmorphism UI
- **Database & ORM**: Prisma ORM with **Neon PostgreSQL** (or local SQLite for zero-config startup)
- **API Handling**: Server Actions & Next.js Route Handlers (API keys never exposed to client)

---

## ⚡ Quick Start (Zero Config)

The app is pre-configured to run immediately out-of-the-box using the Demo and OpenStreetMap providers:

```bash
# 1. Install dependencies
npm install

# 2. Push schema to local SQLite or Neon Postgres
npx prisma db push

# 3. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables & Provider Setup

Copy `.env.example` to `.env`:

```env
# 1. Database (Neon PostgreSQL or SQLite)
DATABASE_URL="file:./dev.db"
# Or Neon Postgres:
# DATABASE_URL="postgresql://user:pass@ep-cool-frost.us-east-2.aws.neon.tech/neondb?sslmode=require"

# 2. Google Places API (Optional)
GOOGLE_PLACES_API_KEY="your_google_cloud_api_key_here"

# 3. Yelp Fusion API (Optional)
YELP_API_KEY="your_yelp_fusion_api_key_here"

# 4. Default Provider ("demo" | "osm" | "google" | "yelp" | "all")
DEFAULT_PROVIDER="demo"

# 5. API Cache (86400 seconds = 24 hours)
CACHE_TTL_SECONDS=86400
ENABLE_API_CACHE=true
```

### Getting API Keys

#### 1. Neon PostgreSQL (Production DB)
1. Sign up at [neon.tech](https://neon.tech) (Free tier available).
2. Create a project and copy the **Connection string** (`postgresql://...`).
3. Set `DATABASE_URL` in `.env` to your connection string.
4. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
5. Run `npx prisma db push`.

#### 2. Google Places API
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and enable the **Places API (New)**.
3. Go to **APIs & Services > Credentials** and create an API Key.
4. Set `GOOGLE_PLACES_API_KEY` in `.env`.

#### 3. Yelp Fusion API
1. Create a free developer account on [Yelp Fusion](https://www.yelp.com/developers/v3/manage_app).
2. Create an App to generate your **API Key**.
3. Set `YELP_API_KEY` in `.env`.

#### 4. OpenStreetMap Overpass (Free / No Key Required)
- OpenStreetMap Overpass requires **no registration or API key**. It works globally out of the box.

---

## 📁 Project Architecture

```
gacks-leads/
├── app/
│   ├── actions/
│   │   ├── search.ts          # Search server action & caching layer
│   │   └── leads.ts           # Pipeline CRM CRUD actions & metrics
│   ├── api/
│   │   └── export/route.ts    # Streaming CSV export endpoint
│   ├── pipeline/
│   │   └── page.tsx           # Lead Pipeline CRM view
│   ├── searches/
│   │   └── page.tsx           # Search history & analytics
│   ├── globals.css            # Custom glassmorphism & dark theme styles
│   ├── layout.tsx             # Root layout with responsive header & stats
│   └── page.tsx               # Main Lead Radar search dashboard
├── components/
│   ├── Navbar.tsx             # Top navigation with live status badges
│   ├── SearchForm.tsx         # Multi-provider radar search console
│   ├── ResultsTable.tsx       # Lead table with sorting, filters & actions
│   ├── LeadPipeline.tsx       # CRM Kanban/Stage manager
│   ├── PitchScriptModal.tsx   # Personalized cold call script generator
│   ├── LeadNotesModal.tsx     # Notes & estimated deal size editor
│   ├── LegalModal.tsx         # TCPA & DNC regulatory compliance modal
│   └── SavedSearches.tsx      # Past search logs & re-scan triggers
├── lib/
│   ├── providers/
│   │   ├── google-places.ts   # Google Places API v1 integration
│   │   ├── yelp-fusion.ts     # Yelp Fusion API integration
│   │   ├── osm-overpass.ts    # OpenStreetMap Overpass QL integration
│   │   ├── demo-provider.ts   # Realistic offline sandbox provider
│   │   ├── types.ts           # Provider interfaces
│   │   └── index.ts           # Deduplication & "no-website" filter pipeline
│   ├── db.ts                  # Prisma client singleton
│   ├── types.ts               # Shared TypeScript types
│   └── utils.ts               # Phone & business name normalizers, pitch engine
├── prisma/
│   ├── schema.prisma          # Prisma schema (SQLite / Neon Postgres)
│   └── schema.postgresql.prisma # PostgreSQL reference schema
├── package.json
└── tailwind.config.ts
```

---

## ⚖️ Compliance & Cold Outreach Best Practices

1. **B2B Outbound Exemption**: Calling local businesses on their published commercial phone numbers to offer B2B services (e.g. websites, software, POS) is legal in most jurisdictions.
2. **Do-Not-Call (DNC) Compliance**: If a prospect asks not to be contacted again, mark them as `NOT_INTERESTED` or remove them immediately.
3. **Calling Hours**: Restrict outbound calls to **8:00 AM – 9:00 PM** local recipient time.
4. **Transparent Identification**: Always state your name, company, and reason for calling within the first 15 seconds.

---

## 📜 License
MIT License. Built for agency owners, freelancers, and B2B growth hackers.
