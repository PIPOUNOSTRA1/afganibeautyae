import crypto from "node:crypto";
import http from "node:http";

const PORT = Number(process.env.PORT || 3000);
const ALLOWED_COUNTRY = process.env.MAXMIND_ALLOWED_COUNTRY || "SA";
const RISK_THRESHOLD = Number(process.env.MAXMIND_RISK_REJECT_THRESHOLD || 20);
const WHITELIST = new Set((process.env.TEST_WHITELIST_PHONES || "055000000,+96655000000,96655000000").split(",").map((v) => v.trim()));

function json(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": process.env.CORS_ORIGIN || "*", "access-control-allow-headers": "content-type,x-admin-api-key", "access-control-allow-methods": "GET,POST,OPTIONS" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch (error) { reject(error); }
    });
  });
}

function sha256(value) {
  if (!value) return undefined;
  return crypto.createHash("sha256").update(String(value).trim().toLowerCase()).digest("hex");
}

function normalizeSaudiPhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.startsWith("966")) return { raw, e164: `+${digits}`, digitsCountry: digits };
  if (digits.startsWith("05")) return { raw, e164: `+966${digits.slice(1)}`, digitsCountry: `966${digits.slice(1)}` };
  if (digits.startsWith("5") && digits.length === 9) return { raw, e164: `+966${digits}`, digitsCountry: `966${digits}` };
  return { raw, e164: raw ? `+${digits}` : "", digitsCountry: digits };
}

function clientIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
}

async function maxMindCheck({ ip, order }) {
  if (!process.env.MAXMIND_ACCOUNT_ID || !process.env.MAXMIND_LICENSE_KEY) {
    return { allowed: true, skipped: true, reason: "MAXMIND_NOT_CONFIGURED" };
  }

  const auth = Buffer.from(`${process.env.MAXMIND_ACCOUNT_ID}:${process.env.MAXMIND_LICENSE_KEY}`).toString("base64");
  const response = await fetch(process.env.MAXMIND_ENDPOINT || "https://minfraud.maxmind.com/minfraud/v2.0/insights", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Basic ${auth}` },
    body: JSON.stringify({
      device: { ip_address: ip, user_agent: order.userAgent },
      event: { transaction_id: order.eventId, shop_id: "NAWABEAUTY.SHOP" },
      account: { user_id: order.phoneE164 },
      shipping_address: { country: "SA", city: order.city },
    }),
  });
  const data = await response.json();
  const traits = data?.ip_address?.traits || {};
  const country = data?.ip_address?.country?.iso_code || data?.country?.iso_code;
  const riskScore = Number(data?.risk_score || data?.ip_address?.risk || 0);
  const suspicious = Boolean(traits.is_anonymous || traits.is_anonymous_vpn || traits.is_anonymous_proxy || traits.is_public_proxy || traits.is_residential_proxy || traits.is_tor_exit_node || traits.is_hosting_provider);
  const allowed = country === ALLOWED_COUNTRY && !suspicious && riskScore <= RISK_THRESHOLD;
  return { allowed, country, riskScore, suspicious, traits, raw: data, reason: allowed ? "ALLOW" : "REJECT_FRAUD_OR_GEO" };
}

async function sendSheet(order) {
  if (!process.env.GOOGLE_SHEETS_WEBHOOK_URL) return { skipped: true };
  const response = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json", "x-sheet-secret": process.env.GOOGLE_SHEETS_SECRET || "" },
    body: JSON.stringify(order),
  });
  return { ok: response.ok, status: response.status, body: await response.text() };
}

function buildCapiUser(order) {
  return {
    emailHash: sha256(order.email),
    phoneHashE164: sha256(order.phoneE164),
    phoneHashDigits: sha256(order.phoneDigitsCountry),
    ip: order.ip,
    userAgent: order.userAgent,
    fbp: order.fbp,
    fbc: order.fbc,
    ttp: order.ttp,
    ttclid: order.ttclid,
  };
}

async function sendCapiEvents(order) {
  const user = buildCapiUser(order);
  return {
    meta: process.env.META_ACCESS_TOKEN ? { queued: true, event_id: order.eventId, user_data: { em: user.emailHash ? [user.emailHash] : undefined, ph: user.phoneHashE164 ? [user.phoneHashE164] : undefined, client_ip_address: user.ip, client_user_agent: user.userAgent, fbp: user.fbp, fbc: user.fbc } } : { skipped: true },
    tiktok: process.env.TIKTOK_ACCESS_TOKEN ? { queued: true, event_id: order.eventId, phone_sha256_e164: user.phoneHashE164 } : { skipped: true },
    snapchat: process.env.SNAP_ACCESS_TOKEN ? { queued: true, client_dedup_id: order.eventId, hashed_phone_number: user.phoneHashDigits } : { skipped: true },
  };
}

async function handleOrder(req, res) {
  const body = await readBody(req);
  const phone = normalizeSaudiPhone(body.phone);
  const whitelisted = WHITELIST.has(String(body.phone).trim()) || WHITELIST.has(phone.e164) || WHITELIST.has(phone.digitsCountry);
  const order = {
    id: `NW-${Date.now()}`,
    eventId: body.eventId || crypto.randomUUID(),
    name: body.name,
    phoneRaw: body.phone,
    phoneE164: phone.e164,
    phoneDigitsCountry: phone.digitsCountry,
    email: body.email,
    city: body.city,
    address: body.address,
    items: body.items || [],
    total: Number(body.total || 0),
    currency: body.currency || "SAR",
    ip: clientIp(req),
    userAgent: req.headers["user-agent"] || body.userAgent || "",
    fbp: body.fbp,
    fbc: body.fbc,
    ttp: body.ttp,
    ttclid: body.ttclid,
    utm: body.utm || {},
    status: "new",
    createdAt: new Date().toISOString(),
  };

  const fraud = whitelisted ? { allowed: true, whitelisted: true, reason: "TEST_PHONE_WHITELIST" } : await maxMindCheck({ ip: order.ip, order });
  if (!fraud.allowed) return json(res, 403, { ok: false, reason: "ORDER_NOT_ALLOWED", fraud });

  const sheet = await sendSheet({ ...order, fraud });
  const capi = await sendCapiEvents(order);
  json(res, 201, { ok: true, orderId: order.id, eventId: order.eventId, fraud, sheet, capi });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") return json(res, 204, {});
    if (req.method === "GET" && req.url === "/health") return json(res, 200, { ok: true, service: "nawabeauty-api" });
    if (req.method === "POST" && req.url === "/orders") return handleOrder(req, res);
    return json(res, 404, { ok: false, reason: "NOT_FOUND" });
  } catch (error) {
    return json(res, 500, { ok: false, reason: "SERVER_ERROR", message: error.message });
  }
});

console.log("Migration hook: run SQL migrations here before server.listen in final implementation.");
server.listen(PORT, () => console.log(`NAWABEAUTY API listening on ${PORT}`));