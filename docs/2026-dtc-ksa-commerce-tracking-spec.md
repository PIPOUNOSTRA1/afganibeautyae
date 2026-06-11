# NAWABEAUTY.SHOP 2026 DTC Commerce Spec

This document is the implementation brief for the production DTC branded store on `NAWABEAUTY.SHOP` with API on `api.NAWABEAUTY.SHOP`.

## Goal

Build a high-converting Saudi DTC store for paid traffic from Snapchat, TikTok, Meta, AI video ads, UGC, and edited creator videos.

Primary KPIs:

- High checkout completion on mobile.
- High COD confirmation rate.
- High delivery rate.
- Increased AOV through bundles, quantity breaks, upsells, and post-submit confirmation offers.
- Clean attribution across browser pixels and server CAPI.
- Low fake order rate with Saudi-only order acceptance and fraud checks.

## Required Folders

The production repo should contain:

- `frontend/` for the storefront.
- `backend/` for the API, database, fraud checks, CAPI, and Google Sheets delivery.
- `sheets/` for Google Sheet templates and Apps Script.
- `docs/` for this implementation spec and handoff prompt.

## Domains

- Storefront: `https://NAWABEAUTY.SHOP`
- API: `https://api.NAWABEAUTY.SHOP`

## EasyPanel Environment

Frontend should use public build-time variables only.

Backend should hold all secrets:

- Pixel access tokens.
- MaxMind credentials.
- Google Sheets webhook or service credentials.
- PostgreSQL connection string.

## PostgreSQL

Internal database link example:

```txt
postgres://NAWABEAUTY_database:5432/namabeauty?sslmode=disable
```

The backend must run database migrations automatically on startup before listening for traffic.

## Order Fraud Gate

Order acceptance rules:

- Allow if phone is whitelisted: `055000000`.
- Otherwise only allow KSA traffic.
- Reject if MaxMind country is not `SA`.
- Reject if MaxMind says anonymous VPN, proxy, Tor, hosting provider, residential proxy, or anonymous network.
- Reject if MaxMind risk score is above the configured threshold.
- Store the MaxMind decision on the order for review.

Recommended defaults:

- `MAXMIND_RISK_REJECT_THRESHOLD=20`
- `MAXMIND_ALLOWED_COUNTRY=SA`
- `TEST_WHITELIST_PHONES=055000000,+96655000000,96655000000`

Use `X-Forwarded-For` carefully behind proxy. Trust only EasyPanel/proxy headers configured by the platform.

## Phone Normalization

For Saudi numbers:

- Web display can accept `05xxxxxxxx`, `9665xxxxxxxx`, or `+9665xxxxxxxx`.
- Store normalized E.164 as `+9665xxxxxxxx`.
- For CAPI hashing, hash the normalized E.164 phone where required.
- TikTok expects phone in E.164 before hashing when using Events API.
- Snapchat offline docs mention phone with country code and no special characters in some endpoints, while partner mappings use normalized hashed phone. Use platform-specific normalizers.

Recommended internal fields:

- `phone_raw`
- `phone_e164`
- `phone_digits_country`
- `phone_sha256_e164`
- `phone_sha256_digits`

## Web Pixel Loading

All browser pixels must be deferred for speed:

- Load after first user interaction or after `requestIdleCallback`.
- Do not block first paint.
- Queue events until scripts are ready.
- Generate an `event_id` before firing browser and server events.
- Send same `event_id` to backend for CAPI dedup.

## Browser Events

Required events:

- `PageView`
- `ViewContent`
- `AddToCart`
- `InitiateCheckout`
- `Purchase`
- `Lead`
- `WhatsappClick`
- `OrderConfirmed` server-only after admin changes status.

## Event Deduplication

Meta:

- Dedup uses matching `event_name` plus `event_id` between Pixel and CAPI.
- Hash PII in CAPI only.
- Do not hash `fbp`, `fbc`, IP, or user agent.

TikTok:

- Use `event_id` when sending overlapping browser and Events API events.
- Use E.164 phone format before hashing.
- Include `_ttp`, `ttclid`, IP, user agent, URL, referrer when available.

Snapchat:

- Use `client_dedup_id` and/or transaction/order ID for dedup.
- Hash normalized email/phone/IP fields in server payload where required.
- Include user agent for web events.

## CAPI Hashing

Backend must hash PII with SHA-256 lowercase hex after normalization.

Hash these in CAPI where applicable:

- Email: lowercase, trim, SHA-256.
- Phone: normalize first, then SHA-256.
- First name, last name, city, state, ZIP, country where platform supports it.
- Snapchat may require hashed IP in some mappings, while Meta requires raw IP in `client_ip_address`. Keep platform-specific functions.

Do not hash these for Meta:

- `fbp`
- `fbc`
- `client_ip_address`
- `client_user_agent`

## CRO Requirements

Every product page should include:

- Clear problem and outcome.
- Product photos and usage photos.
- UGC video slot.
- AI edited ad video slot.
- Short form review clips slot.
- Price, compare-at price, and savings.
- Quantity breaks: 1, 2, 3 units.
- Bundle offer.
- COD trust message near CTA.
- Delivery estimate for KSA.
- Sticky mobile CTA.
- Exit offer.
- Social proof notification.
- WhatsApp confirmation copy.
- FAQ focused on hesitation.
- Before/after style comparison without medical overclaims.

Checkout should include:

- Name.
- Phone.
- City.
- Address.
- Product and quantity.
- COD selected by default.
- Optional WhatsApp opt-in.
- Clear message: no payment now, team confirms before shipping.

## Confirmation and Delivery Rate

Backend/admin should track:

- New orders.
- WhatsApp contacted.
- No answer.
- Confirmed.
- Shipped.
- Delivered.
- Cancelled before shipping.
- Cancelled after shipping.
- Return to origin.
- Confirmation agent notes.
- Confirmation time.
- Delivery city performance.

## AOV Features

- Quantity breaks on the PDP.
- Bundle offers by category.
- Checkout bump.
- Post-submit upsell before WhatsApp confirmation.
- Free shipping threshold.
- Gift item threshold.
- Cross-sell based on category.

## Google Sheets Delivery

Backend should write orders to:

- PostgreSQL first.
- Google Sheet second.
- Retry failed sheet delivery in a background job or `sheet_sync_status` field.

Sheet columns are defined in `sheets/orders-template.csv`.

## Fake Orders

Use seeded fake orders only in development and staging.

Never send fake orders to pixels, CAPI, courier, or live sheets unless `FAKE_ORDERS_ENABLED=true` and `NODE_ENV=development`.

Fake order generator should create:

- Saudi names.
- Saudi phone numbers.
- Riyadh, Jeddah, Dammam, Khobar, Makkah, Madinah cities.
- Realistic order statuses.
- Realistic AOV.

## Production Checklist

- Frontend Docker builds successfully.
- Backend Docker builds successfully.
- Backend migrations run on start.
- Health endpoint returns 200.
- Order endpoint blocks non-KSA VPN/proxy traffic.
- Test phone `055000000` bypasses fraud gate.
- Pixels load deferred.
- Browser and server events share event IDs.
- Meta Events Manager shows deduped Browser + Server events.
- TikTok Events Manager receives events with E.164 phone hashing.
- Snapchat receives web pixel and CAPI events with dedup fields.
- Google Sheet receives test order.
- PostgreSQL stores order and tracking metadata.