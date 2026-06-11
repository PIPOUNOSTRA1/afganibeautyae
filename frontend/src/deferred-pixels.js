// Drop this in the production frontend and import it once on app boot.
// It defers ad pixels for speed, queues events, and preserves event_id for CAPI dedup.

const config = {
  metaPixelId: import.meta.env.VITE_PUBLIC_META_PIXEL_ID,
  tiktokPixelId: import.meta.env.VITE_PUBLIC_TIKTOK_PIXEL_ID,
  snapPixelId: import.meta.env.VITE_PUBLIC_SNAP_PIXEL_ID,
  apiUrl: import.meta.env.VITE_PUBLIC_API_URL,
};

const queue = [];
let loaded = false;

export function makeEventId(prefix = "evt") {
  if (crypto.randomUUID) return `${prefix}_${crypto.randomUUID()}`;
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function initDeferredPixels() {
  const load = () => {
    if (loaded) return;
    loaded = true;
    loadMeta();
    loadTikTok();
    loadSnap();
    setTimeout(flushQueue, 250);
  };

  ["pointerdown", "keydown", "touchstart", "scroll"].forEach((eventName) => window.addEventListener(eventName, load, { once: true, passive: true }));
  if ("requestIdleCallback" in window) window.requestIdleCallback(load, { timeout: 2500 });
  else setTimeout(load, 2500);
}

export function trackCommerce(eventName, payload = {}) {
  const eventId = payload.eventId || makeEventId(eventName.toLowerCase());
  const event = { ...payload, eventName, eventId, eventTime: Date.now(), url: location.href, referrer: document.referrer };
  if (!loaded) queue.push(event);
  else sendBrowserEvents(event);
  return eventId;
}

function flushQueue() {
  while (queue.length) sendBrowserEvents(queue.shift());
}

function sendBrowserEvents(event) {
  if (window.fbq) {
    const metaName = mapMetaEvent(event.eventName);
    window.fbq("track", metaName, metaPayload(event), { eventID: event.eventId });
  }
  if (window.ttq) {
    window.ttq.track(mapTikTokEvent(event.eventName), tiktokPayload(event), { event_id: event.eventId });
  }
  if (window.snaptr) {
    window.snaptr("track", mapSnapEvent(event.eventName), snapPayload(event));
  }
}

function loadMeta() {
  if (!config.metaPixelId || window.fbq) return;
  window.fbq = function () { window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments); };
  window.fbq.push = window.fbq;
  window.fbq.loaded = true;
  window.fbq.version = "2.0";
  window.fbq.queue = [];
  inject("https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", config.metaPixelId);
  window.fbq("track", "PageView");
}

function loadTikTok() {
  if (!config.tiktokPixelId || window.ttq) return;
  window.TiktokAnalyticsObject = "ttq";
  const ttq = window.ttq = window.ttq || [];
  ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
  ttq.setAndDefer = function (target, method) { target[method] = function () { target.push([method].concat(Array.prototype.slice.call(arguments, 0))); }; };
  for (let i = 0; i < ttq.methods.length; i += 1) ttq.setAndDefer(ttq, ttq.methods[i]);
  ttq.load = function (pixelId) { inject(`https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${pixelId}&lib=ttq`); };
  ttq.load(config.tiktokPixelId);
  ttq.page();
}

function loadSnap() {
  if (!config.snapPixelId || window.snaptr) return;
  window.snaptr = function () { window.snaptr.handleRequest ? window.snaptr.handleRequest.apply(window.snaptr, arguments) : window.snaptr.queue.push(arguments); };
  window.snaptr.queue = [];
  inject("https://sc-static.net/scevent.min.js");
  window.snaptr("init", config.snapPixelId);
  window.snaptr("track", "PAGE_VIEW");
}

function inject(src) {
  const script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.src = src;
  document.head.appendChild(script);
}

function mapMetaEvent(name) {
  return { view_item: "ViewContent", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", purchase: "Purchase", lead: "Lead" }[name] || name;
}

function mapTikTokEvent(name) {
  return { view_item: "ViewContent", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", purchase: "Purchase", lead: "SubmitForm" }[name] || name;
}

function mapSnapEvent(name) {
  return { view_item: "VIEW_CONTENT", add_to_cart: "ADD_CART", begin_checkout: "START_CHECKOUT", purchase: "PURCHASE", lead: "SIGN_UP" }[name] || name;
}

function metaPayload(event) {
  return { content_ids: event.contentIds, content_type: "product", contents: event.contents, value: event.value, currency: event.currency || "SAR" };
}

function tiktokPayload(event) {
  return { content_id: event.contentIds?.[0], content_type: "product", contents: event.contents, value: event.value, currency: event.currency || "SAR" };
}

function snapPayload(event) {
  return { item_ids: event.contentIds, price: event.value, currency: event.currency || "SAR", client_dedup_id: event.eventId, transaction_id: event.orderId };
}