# Backend Service

Domain: `https://api.NAWABEAUTY.SHOP`

## Responsibilities

- Order intake.
- PostgreSQL persistence.
- Database migrations on startup.
- MaxMind fraud gate.
- KSA-only order validation.
- Google Sheets delivery.
- Meta CAPI.
- TikTok Events API.
- Snapchat CAPI.
- Admin order status updates.
- Fake orders in development only.

## Required Runtime Variables

See `backend/.env.example`.

## Startup Flow

1. Read env.
2. Run migrations.
3. Start API server.
4. Health endpoint returns 200.

## Fraud Gate

- `055000000` must be whitelisted for production tests.
- Non-whitelisted orders must be from Saudi Arabia.
- VPN/proxy/Tor/hosting provider/high-risk traffic must be blocked.

## CAPI Notes

- Hash PII server-side only.
- Use platform-specific payloads.
- Use shared event IDs for dedup.
- Keep access tokens server-only.