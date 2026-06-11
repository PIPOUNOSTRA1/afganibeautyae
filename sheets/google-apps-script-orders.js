const SHEET_NAME = "Orders";

function doPost(e) {
  const secret = PropertiesService.getScriptProperties().getProperty("GOOGLE_SHEETS_SECRET");
  const requestSecret = e && e.parameter && e.parameter.secret ? e.parameter.secret : "";
  if (secret && requestSecret && secret !== requestSecret) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, reason: "UNAUTHORIZED" })).setMimeType(ContentService.MimeType.JSON);
  }

  const body = JSON.parse(e.postData.contents || "{}");
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
  ensureHeaders(sheet);
  sheet.appendRow(toRow(body));
  return ContentService.createTextOutput(JSON.stringify({ ok: true, order_id: body.id || body.order_id })).setMimeType(ContentService.MimeType.JSON);
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow([
    "order_id", "event_id", "created_at", "status", "customer_name", "phone_raw", "phone_e164", "email", "city", "address", "items_json", "total", "currency", "ip", "user_agent", "maxmind_allowed", "maxmind_country", "maxmind_risk_score", "maxmind_suspicious", "maxmind_reason", "utm_json"
  ]);
}

function toRow(order) {
  const fraud = order.fraud || {};
  return [
    order.id || order.order_id || "",
    order.eventId || order.event_id || "",
    order.createdAt || order.created_at || new Date().toISOString(),
    order.status || "new",
    order.name || order.customer_name || "",
    order.phoneRaw || order.phone_raw || "",
    order.phoneE164 || order.phone_e164 || "",
    order.email || "",
    order.city || "",
    order.address || "",
    JSON.stringify(order.items || []),
    order.total || 0,
    order.currency || "SAR",
    order.ip || "",
    order.userAgent || order.user_agent || "",
    fraud.allowed === undefined ? "" : fraud.allowed,
    fraud.country || "",
    fraud.riskScore || "",
    fraud.suspicious === undefined ? "" : fraud.suspicious,
    fraud.reason || "",
    JSON.stringify(order.utm || {})
  ];
}