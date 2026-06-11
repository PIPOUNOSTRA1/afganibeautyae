import crypto from "node:crypto";

export function sha256(value) {
  if (!value) return undefined;
  return crypto.createHash("sha256").update(String(value).trim().toLowerCase()).digest("hex");
}

export function normalizeSaudiPhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.startsWith("966")) return { e164: `+${digits}`, digitsCountry: digits };
  if (digits.startsWith("05")) return { e164: `+966${digits.slice(1)}`, digitsCountry: `966${digits.slice(1)}` };
  if (digits.startsWith("5") && digits.length === 9) return { e164: `+966${digits}`, digitsCountry: `966${digits}` };
  return { e164: `+${digits}`, digitsCountry: digits };
}

export function metaPayload(order) {
  return {
    data: [{
      event_name: "Purchase",
      event_time: Math.floor(Date.now() / 1000),
      event_id: order.eventId,
      action_source: "website",
      event_source_url: order.url,
      user_data: {
        em: order.email ? [sha256(order.email)] : undefined,
        ph: order.phoneE164 ? [sha256(order.phoneE164)] : undefined,
        client_ip_address: order.ip,
        client_user_agent: order.userAgent,
        fbp: order.fbp,
        fbc: order.fbc,
      },
      custom_data: {
        value: order.total,
        currency: order.currency || "SAR",
        contents: order.items?.map((item) => ({ id: item.sku, quantity: item.quantity, item_price: item.price })),
        content_type: "product",
        order_id: order.id,
      },
    }],
  };
}

export function tiktokPayload(order) {
  return {
    pixel_code: process.env.TIKTOK_PIXEL_ID,
    event: "Purchase",
    event_id: order.eventId,
    timestamp: Math.floor(Date.now() / 1000),
    context: {
      page: { url: order.url, referrer: order.referrer },
      user: {
        email: order.email ? sha256(order.email) : undefined,
        phone_number: order.phoneE164 ? sha256(order.phoneE164) : undefined,
        external_id: order.phoneE164 ? sha256(order.phoneE164) : undefined,
        ttp: order.ttp,
        ttclid: order.ttclid,
      },
      ip: order.ip,
      user_agent: order.userAgent,
    },
    properties: {
      value: order.total,
      currency: order.currency || "SAR",
      content_type: "product",
      contents: order.items?.map((item) => ({ content_id: item.sku, quantity: item.quantity, price: item.price })),
    },
  };
}

export function snapchatPayload(order) {
  return {
    pixel_id: process.env.SNAP_PIXEL_ID,
    event_type: "PURCHASE",
    event_conversion_type: "WEB",
    timestamp: Date.now(),
    client_dedup_id: order.eventId,
    transaction_id: order.id,
    hashed_email: order.email ? sha256(order.email) : undefined,
    hashed_phone_number: order.phoneDigitsCountry ? sha256(order.phoneDigitsCountry) : undefined,
    hashed_ip_address: order.ip ? sha256(order.ip) : undefined,
    user_agent: order.userAgent,
    price: String(order.total),
    currency: order.currency || "SAR",
    item_ids: order.items?.map((item) => item.sku),
  };
}