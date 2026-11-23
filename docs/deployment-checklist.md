# Pre-deployment checklist

- [ ] Confirm every `verified: false` fact in `src/data/business.js` (14 items, listed at `/app`)
- [ ] Set `VITE_SITE_URL` (enables canonical tags, OG URLs, sitemap.xml)
- [ ] Create Supabase project, run `supabase/schema.sql`, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Supabase Auth → URL config: add `<site>/onboarding` and `<site>/reset-password` as redirect URLs
- [ ] Sign up, confirm email, onboard, create/edit/delete an obligation, sign out, reset password: test against the real backend
- [ ] Submit the contact form and check the row in `leads`
- [ ] Legal review of `/privacy` and `/terms` (jurisdiction, governing law, entity name are unresolved)
- [ ] Re-check the AWS Activate option lists against the live form
