# VoidAd

DNS-level network security platform with VoidPoints gamification and charity donations.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS 4** — VoidAd cyber theme
- **Supabase** — Auth, Database, Storage
- **next-intl** — English (`voidad.com`) & German (`voidad.de`)

## Getting Started

### 1. Environment variables

```bash
cp .env.local.example .env.local
```

Add your Supabase anon key from:
https://supabase.com/dashboard/project/nehewgoinyxxjzjitpea/settings/api

### 2. Database schema

Run `supabase/schema.sql` in the Supabase SQL Editor.

### 3. Run locally

```bash
npm install --cache .npm-cache
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

German locale: [http://localhost:3000/de](http://localhost:3000/de)

### 4. Deploy to Vercel

1. Push to GitHub and connect the repo in Vercel
2. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. Assign domains: `voidad.com` → Production, `voidad.de` → Production
4. Push to `main` or run `vercel --prod`

## Project Structure

```
src/
  app/[locale]/     # Pages (en, de)
  components/       # UI + layout + VoidAd branding
  i18n/             # next-intl routing & navigation
  lib/supabase/     # Supabase clients
messages/           # en.json, de.json
supabase/           # schema.sql
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/dashboard` | Protection controls & live stats |
| `/voidpoints` | Points balance & charity donations |
| `/about` | Mission & values |
| `/login`, `/signup` | Supabase Auth |

## Domains

| Domain | Locale |
|--------|--------|
| voidad.com | English |
| voidad.de | German |
