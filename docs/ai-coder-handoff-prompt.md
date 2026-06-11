# Prompt For AI Coder

You are building the production repo for `NAWABEAUTY.SHOP`, a Saudi DTC branded ecommerce store optimized for Snapchat, TikTok, Meta, AI videos, UGC, COD confirmation, delivery rate, and AOV.

Read these files first:

- `docs/2026-dtc-ksa-commerce-tracking-spec.md`
- `frontend/README.md`
- `backend/README.md`
- `sheets/orders-template.csv`
- `sheets/products-template.csv`
- `sheets/google-apps-script-orders.js`

Build two deployable services:

- `frontend/` on `https://NAWABEAUTY.SHOP`
- `backend/` on `https://api.NAWABEAUTY.SHOP`

Hard requirements:

- Mobile-first DTC storefront for KSA.
- Product pages optimized for TikTok/Snapchat traffic.
- Checkout optimized for COD.
- All web pixels deferred for performance.
- Meta Pixel, TikTok Pixel, Snapchat Pixel.
- Meta CAPI, TikTok Events API, Snapchat CAPI.
- Shared event IDs for dedup.
- CAPI PII hashing on backend.
- TikTok phone normalized to E.164 before hashing.
- MaxMind minFraud or Insights API fraud gate.
- Only KSA IP orders allowed unless phone is whitelisted.
- Reject VPN, proxy, Tor, hosting provider, anonymous IP, high risk score.
- Whitelist `055000000` for production test orders.
- PostgreSQL with migrations on backend start.
- Google Sheets order delivery.
- Dockerfiles and `.env.example` for frontend and backend.
- Fake order generator for development only.

Use this database internal link format in env:

```txt
postgres://NAWABEAUTY_database:5432/namabeauty?sslmode=disable
```

Implementation notes:

- Do not send fake orders to live ad platforms.
- Do not expose CAPI tokens in frontend.
- Do not hash browser pixel advanced matching fields unless the platform requires it in browser; CAPI hashing is backend only.
- Store raw order data, normalized order data, attribution cookies, UTM fields, fraud result, and CAPI send status.
- Add `/health`, `/orders`, `/events/capi`, `/admin/orders`, and `/admin/fake-orders` endpoints.

Start by implementing backend migrations and the order endpoint. Then implement frontend checkout and pixel queue. Then implement CAPI sends and sheet sync. Then add fake orders for dev.