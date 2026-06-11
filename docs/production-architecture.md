# Marsa Gulf Production Architecture

This repository is implemented as a Vite React application in the current runtime, with a production database schema included for a Next.js deployment.

Recommended production stack:

- Next.js App Router with TypeScript.
- PostgreSQL managed database.
- Prisma Client generated from `prisma/schema.prisma`.
- NextAuth or Auth.js credentials provider for the admin dashboard.
- Object storage for product images and videos.
- Server routes for checkout, order status updates, Meta CAPI, TikTok Events API, Snap Conversions API, and GA4 Measurement Protocol.
- Edge caching for public storefront pages and dynamic rendering for product inventory and order flows.

Operational checklist:

- Run Prisma migrations against PostgreSQL.
- Replace local admin password with hashed admin users.
- Move pixel access tokens to server-only environment variables.
- Add payment provider credentials for card payments.
- Connect courier webhooks for shipping status updates.
- Run Lighthouse, accessibility, and Core Web Vitals checks before launch.