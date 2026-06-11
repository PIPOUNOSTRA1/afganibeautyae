# Frontend Service

Domain: `https://NAWABEAUTY.SHOP`

## Responsibilities

- Mobile-first storefront.
- Product pages for paid traffic from TikTok, Snapchat, Meta, AI videos, UGC, and edited videos.
- Deferred web pixels.
- Event queue with shared `event_id` sent to backend.
- COD checkout.
- AOV features: bundles, quantity breaks, checkout bump, post-submit upsell.

## Required Runtime Variables

See `frontend/.env.example`.

## Pixel Loading

Load all pixels after idle or first interaction:

- Meta Pixel.
- TikTok Pixel.
- Snapchat Pixel.

Use one generated event ID per user action and pass it to both browser pixel and backend order/CAPI payload.

## Docker

`frontend/Dockerfile` is a deployment template. Adapt framework commands depending on the final frontend stack.