# Aurevex

Website, customer workspace and private founder application center for **Aurevex**, AI regulatory intelligence software that is building its initial product.

Stack: Vite · React (JavaScript) · Tailwind CSS v4 · Lucide · React Router · Supabase (Auth + Postgres).

## Run
```bash
npm install
cp .env.example .env   # fill in values
npm run dev            # http://localhost:5173
npm run build          # outputs dist/, prerenders public pages
```

## Routes
| Route | What it is |
|---|---|
| `/` | Marketing site (prerendered to static HTML for SEO) |
| `/login` `/signup` `/forgot-password` `/reset-password` | Supabase auth flows |
| `/onboarding` | 3-step workspace setup (new accounts only; sign-in always lands on `/dashboard`), saved to `workspaces` |
| `/dashboard` | Obligation register (CRUD, search, filter, sort, CSV, print/PDF), sources, deadlines, gaps, activity, settings |
| `/privacy` `/terms` | Legal pages |

## Single source of truth
`src/data/business.js` holds every business fact. Unconfirmed facts are marked `verified: false`, stay hidden on the public site. The AWS answers (`src/data/aws-answers.js`) are generated from this file and checked against the exact option lists in `src/data/aws-options.js`.

## Authentication and data
- **With Supabase configured:** real accounts, email confirmation, password reset, and per-user data protected by row-level security (`supabase/schema.sql`). The contact form inserts into `leads`.
- **Without Supabase:** auth pages say accounts aren't connected and offer a **local demo workspace** stored in browser localStorage only, labelled "Local demo". This is not authentication. The contact form shows an error instead of a fake success.

## Status: what's real
- Implemented: site, auth integration (untested against a live Supabase project), onboarding, dashboard CRUD and exports.
- Prototype: the change-comparison visual on the homepage.
- Planned: AI extraction (Textract + Bedrock), document upload, reminders, payments. No AWS service is deployed. Pricing is shown as proposed; checkout is not enabled.

## Deploy
Any static host. `public/_redirects` (Netlify) and `vercel.json` provide the SPA fallback. Set the env vars at build time. See `docs/deployment-checklist.md`.

Browsers: current Chrome, Edge, Firefox, Safari.

© 2026 Aurevex
