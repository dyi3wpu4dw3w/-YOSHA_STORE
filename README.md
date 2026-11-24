# YOSHA STORE

A Sudan-first multi-vendor marketplace foundation with customer shopping, seller applications, a product catalog, cart, checkout, and a Supabase-backed data model.

## Implemented in this repository
- Arabic RTL storefront and responsive marketplace shell.
- Supabase email/password sign-up and sign-in.
- Live product catalog query from Supabase.
- Browser cart and order checkout through an atomic database RPC.
- Seller application form and seller-center entry pages.
- Customer, seller, and admin route foundations.
- Seller product management (create, edit, publish/unpublish, and delete) for approved stores.
- Seller order visibility restricted to orders containing that seller's products.
- Production-readiness migration adds missing timestamps, tightens catalog visibility, and forces checkout writes through the atomic checkout RPC.
- PostgreSQL schema for profiles, stores, products, categories, orders, payments, seller plans/subscriptions, favorites and audit logs.
- Row-level security policies, seller approval guards and stock-safe checkout routine.
- Render deployment blueprint.

## Stack
Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase (Postgres/Auth/Storage).

## Local setup
1. Create a Supabase project.
2. In Supabase SQL Editor, run these files in order:
   - `supabase/schema.sql`
   - `supabase/seed.sql`
   - `supabase/production_hardening.sql`
   - `supabase/security_guards.sql`\n   - `supabase/admin_billing.sql`\n   - `supabase/seller_billing.sql`\n   - `supabase/admin_finance_extensions.sql`
   - `supabase/production_readiness.sql`
3. Copy `.env.example` to `.env.local` and set the Supabase project URL and anon key.
4. Run `npm install`.
5. Run `npm run dev`.

## Render
Create a Node web service from this repository. Build command: `npm install && npm run build`; start command: `npm start`. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL`.

## Before accepting real orders
- Configure Supabase Auth email templates and redirect URLs.
- Create the first platform administrator by promoting the intended profile in the Supabase SQL editor after that user signs up. Never expose service-role credentials in the browser.
- Add approved merchant integrations and signed server-side webhooks for Bankak, MyCashi, Fawry or bank transfers. These methods currently create a pending-review payment record; they are not live gateway integrations.
- Configure payment-proof upload/storage, shipping zones and delivery partners, notification delivery, refunds and dispute workflows.
- Finish seller order actions, customer order history, and remaining admin operational workflows; product CRUD is now implemented.
- Add legal terms, privacy policy, tax/compliance rules, monitoring, backups and production security review.
- Run `npm run lint` and `npm run build` before deployment.

## Verification checklist
- Apply every SQL file in the exact order above to a non-production Supabase project first.
- Promote the intended administrator only after their account has been created.
- Test customer checkout with test products and verify stock decrements exactly once.
- Test seller approval, product publishing, seller-only order visibility, invoice submission, and admin review with separate customer/seller/admin accounts.
- Run `npm install`, `npm run lint`, and `npm run build`; then verify the deployed Render service and Supabase Auth redirect URLs.
- Keep payment gateway integration disabled until provider credentials, signed callbacks/webhooks, and reconciliation tests are available.

## Important status
This is an actively built marketplace foundation. The production-readiness SQL patch and seller product-management UI are committed, but they are not active until the SQL migration is applied and the full verification checklist passes. It is not yet a production-certified marketplace. External payment rails, shipping partners, complete admin workflows and seller subscription billing require provider credentials, configuration and further implementation. Do not use it to collect live payments until those gates are completed and tested.
