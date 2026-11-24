# YOSHA STORE

A multi-vendor commerce platform foundation built for Sudan-first operations and international expansion.

## Product areas
- Customer marketplace: discovery, product details, cart, checkout, orders, favorites and addresses.
- Seller Center: applications, store profiles, catalog and order management.
- Platform administration: seller approvals, categories, plans, commissions and order oversight.
- Payments: cash on delivery and manual bank/mobile-wallet transfer proof workflow. Provider APIs are intentionally not marked live until credentials and merchant approval are supplied.
- Security: Supabase Auth, row-level security, server-side privileged operations and auditable order/payment records.

## Stack
Next.js App Router, TypeScript, Tailwind CSS, Supabase (Postgres/Auth/Storage).

## Quick start
1. Copy `.env.example` to `.env.local`.
2. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
3. Set the public Supabase URL and anon key.
4. Install dependencies with `npm install`.
5. Run `npm run dev`.

## Deployment
Deploy the Next.js app to Render as a Node web service. Build command: `npm install && npm run build`; start command: `npm start`. Configure the environment variables from `.env.example`.

## Important production gates
- Configure Supabase Auth email templates and allowed redirect URLs.
- Add verified payment-provider credentials and signed webhook handlers before enabling automated payment confirmation.
- Configure shipping partners, transactional email/SMS and legal/privacy documents.
- Review RLS policies and run the test suite before accepting real customer payments.
- Never commit secrets or service-role keys.

This repository is a working foundation, not a claim that external payment rails or shipping providers are already connected.
