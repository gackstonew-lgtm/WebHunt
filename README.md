# ⚡ Gacks Leads — Worldwide B2B & Remote Tech Lead Radar

> A production-ready lead-generation web application designed to help agencies, software engineers, and growth hackers find high-value sales leads across two modes:
> 1. **Physical Mode**: Local businesses anywhere in the world (including Kenya, US, UK, Canada, Europe, Africa, Asia) that have active phone numbers but **no website on record**, queried via **OpenStreetMap Overpass API** and **Google Places API**.
> 2. **Online Mode**: Remote web-development and custom software opportunities queried via official public APIs (**Remotive API** and **Arbeitnow API**).

---

## ⚖️ Legal & Non-Scraping Guarantee

- 🚫 **No LinkedIn, Upwork, or Fiverr Scraping**: Scraping these platforms violates their Terms of Service and is actively blocked. Gacks Leads queries official public JSON endpoints and open geographic databases.
- 🔌 **Partner API Extensible**: The online provider architecture is designed so a licensed LinkedIn or Upwork Partner API can be plugged in when enterprise API credentials are provided.
- 📞 **Worldwide Telemarketing Compliance**: Always comply with local commercial communications regulations (e.g., Kenya Data Protection Act 2019, US TCPA/DNC, UK PECR, GDPR).

---

## 🚀 Key Features

### 🏢 1. Physical Mode (Local Businesses Without Websites)
- **OpenStreetMap Overpass API (Free Worldwide)**: Primary engine. Queries global OSM nodes/ways by country and city, filtering for records with active `phone` tags and **no website** (`!website`, `!contact:website`).
- **Google Places API (New)**: Optional integration. Automatically enabled if `GOOGLE_PLACES_API_KEY` is provided in `.env`.
- **240+ Countries Supported**: Dedicated country selector with special formatting for Kenya (`+254`), United States (`+1`), United Kingdom (`+44`), Nigeria (`+234`), etc.
- **Dynamic Cold Call Pitch Generator**: Generates 3-step personalized cold calling scripts tailored to the business's niche, local area, and lack of web presence, complete with objection handling.

### 💻 2. Online Mode (Remote Tech & Web Gigs)
- **Remotive API (Free Public JSON)**: Fetches remote software, frontend, backend, and full-stack opportunities worldwide.
- **Arbeitnow API (Free Public JSON)**: Fetches developer and engineering contracts.
- **Dynamic Freelance Proposal & Cover Letter Generator**: Generates client pitches with tailored tech stack highlights for every job listing.

### 📊 3. In-Session & LocalStorage Pipeline CRM
- Full CRM workflow without database dependencies for v1:
  - **New (Inbox)** ➔ **Contacted** ➔ **Pitch / Proposal Sent** ➔ **Closed / Won** ➔ **Archived**.
- Track total pipeline volume, outreach activity, and estimated deal value in real-time.
- One-click formatted **CSV Export** for dialers, spreadsheets, and cold email tools.

---

## 🛠️ Quick Start (Zero Config)

The app runs immediately out of the box with zero paid API keys needed (using OpenStreetMap Overpass, Remotive API, and Arbeitnow API):

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Configuration (`.env.example`)

```env
# ==============================================================================
# GACKS LEADS - CONFIGURATION
# ==============================================================================

# 1. GOOGLE PLACES API KEY (Optional - OpenStreetMap is used for free by default)
# https://console.cloud.google.com/apis/credentials
GOOGLE_PLACES_API_KEY=""

# 2. API CACHE (1 hour in-memory / response cache)
CACHE_TTL_SECONDS=3600
ENABLE_API_CACHE=true
```

---

## 🗄️ Future Neon PostgreSQL Persistence (Optional)

Gacks Leads stores pipeline leads in-session and browser `localStorage` by default for instant responsiveness. If you wish to enable cloud database persistence:

1. Create a PostgreSQL database at [neon.tech](https://neon.tech).
2. Set `DATABASE_URL` in `.env`.
3. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
4. Run `npx prisma db push`.

---

## 📁 Architecture Overview

```
gacks-leads/
├── app/
│   ├── actions/
│   │   └── search.ts          # Server action routing Physical & Online searches
│   ├── pipeline/
│   │   └── page.tsx           # In-session Lead Pipeline CRM
│   ├── searches/
│   │   └── page.tsx           # Search history & analytics
│   ├── globals.css            # Dark mode & glassmorphism styling
│   ├── layout.tsx             # Root layout with navigation & footer
│   └── page.tsx               # Main dual-mode Lead Radar dashboard
├── components/
│   ├── Navbar.tsx             # Header with live pipeline counters
│   ├── SearchForm.tsx         # Dual-mode selector + 240+ countries dropdown
│   ├── ResultsTable.tsx       # Physical leads table & Online jobs cards
│   ├── JobCard.tsx            # Rich remote job opportunity card
│   ├── JobProposalModal.tsx   # Dynamic freelance proposal generator
│   ├── PitchScriptModal.tsx   # Cold calling script generator
│   ├── LeadNotesModal.tsx     # Notes & deal value editor
│   ├── LeadPipeline.tsx       # CRM stage manager & revenue tracker
│   ├── LegalModal.tsx         # Legal compliance & non-scraping notice
│   └── SavedSearches.tsx      # Query logs & re-scan triggers
├── lib/
│   ├── countries.ts           # 240+ worldwide countries dataset
│   ├── export.ts              # Universal CSV exporter
│   ├── pipeline-store.ts      # In-session & LocalStorage pipeline store
│   ├── providers/
│   │   ├── osm-overpass.ts    # Worldwide OpenStreetMap Overpass engine
│   │   ├── google-places.ts   # Google Places API integration
│   │   ├── demo-provider.ts   # Offline physical leads sandbox
│   │   ├── online/
│   │   │   ├── remotive.ts    # Remotive public JSON API client
│   │   │   ├── arbeitnow.ts   # Arbeitnow public JSON API client
│   │   │   ├── demo-jobs.ts   # Offline tech jobs sandbox
│   │   │   └── types.ts       # Online provider interface
│   │   ├── types.ts           # Physical provider interface
│   │   └── index.ts           # Central aggregator & server-side cache
│   ├── types.ts               # Shared TypeScript schemas
│   └── utils.ts               # Phone normalizer & script generators
└── package.json
```

---

## 📜 License
MIT License. Built for agency owners, freelancers, and software vendors.
