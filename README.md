# 筷道 KuaiDao 🥢

> **发现你身边的中华味道** — Discover Chinese Flavors Near You

A bilingual (中文/English) local Chinese community information aggregation platform built with Next.js 16, featuring restaurants, grocery stores, service providers, community events, and a newcomer's guide.

## Features

- 🍜 **Restaurant Directory** — Browse by cuisine type (川菜, 粤菜, 火锅, etc.) with interactive filters and sorting
- 🛒 **Asian Grocery Finder** — Find supermarkets, specialty stores, bakeries
- 💼 **Service Providers** — Chinese-speaking accountants, lawyers, realtors, tutors
- 🎉 **Community Events** — Festivals, workshops, cultural events
- 📖 **Newcomer Guide** — Essentials for new arrivals (SSN, housing, banking, driving)
- 🗺️ **Map View** — Interactive Leaflet map showing all listings
- 🔍 **Global Search** — Search across all categories
- 🌙 **Dark Mode** — Full dark/light theme support
- 🌐 **Bilingual** — Toggle between 中文 and English
- 🔐 **Auth** — User registration/login with NextAuth.js
- ⭐ **Reviews** — Authenticated users can rate and review listings
- 📱 **Responsive** — Mobile-first design

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **i18n:** next-intl (Chinese/English)
- **Auth:** NextAuth.js v5
- **Database:** Prisma + SQLite
- **Maps:** React Leaflet (OpenStreetMap)
- **Icons:** Lucide React
- **Theme:** next-themes

## Getting Started

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Seed sample data (optional)
npx tsx prisma/seed.ts

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/zh` (Chinese).

**Demo login:** `demo@kuaidao.app` / `demo123`

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes (auth, reviews, register)
│   └── [locale]/         # i18n routes (zh, en)
│       ├── restaurants/  # Restaurant listing + [id] detail
│       ├── groceries/    # Grocery store listing + [id] detail
│       ├── services/     # Service provider listing + [id] detail
│       ├── events/       # Community events
│       ├── guide/        # Newcomer guide
│       ├── map/          # Full-screen map view
│       ├── search/       # Global search
│       ├── login/        # Login page
│       └── register/     # Registration page
├── components/
│   ├── layout/           # Navbar, Footer, ThemeProvider, AuthProvider
│   ├── ui/               # SearchBar, ListingCard, ThemeToggle
│   └── features/         # MiniMap, FullMap, ReviewSection
├── data/                 # Mock data
├── i18n/                 # Internationalization config
├── lib/                  # Prisma client, auth config, utils
└── types/                # TypeScript interfaces
messages/
├── zh.json               # Chinese translations
└── en.json               # English translations
prisma/
├── schema.prisma         # Database schema (User, Review)
└── seed.ts               # Seed script
```

## Deploy to Vercel

```bash
vercel deploy
```

Set environment variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

## License

MIT
