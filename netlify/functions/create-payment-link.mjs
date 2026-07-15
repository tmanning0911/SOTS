import { randomBytes } from "node:crypto";
import { MAHJONG_NIGHT } from "../../js/mahjong-night.js";
import { SHOP_PRODUCTS } from "../../js/shop-catalog.js";
import { jsonResponse } from "./lib/cors.mjs";
import { getClientIp, rateLimit } from "./lib/rateLimit.mjs";
import { resolveLocationId, squareRequest } from "./lib/square.mjs";
import { readStaticJsonCatalog } from "./lib/static-catalog.mjs";

const MAX_QTY = 10;
const siteUrl = (
  process.env.VITE_SITE_URL ||
  process.env.URL ||
  "https://www.shakespeareonthesound.org"
).replace(/\/$/, "");

let ticketingCache = null;

async function loadTicketing() {
  if (ticketingCache) return ticketingCache;
  const catalog = await readStaticJsonCatalog("ticketing.json");
  if (!catalog) throw new Error("Ticket catalog unavailable");
  ticketingCache = catalog;
  return ticketingCache;
}

function clampQty(n, max = MAX_QTY) {
  const qty = Number(n);
  if (!Number.isInteger(qty) || qty < 1) throw new Error("Quantity must be at least 1");
  if (qty > max) throw new Error(`Maximum ${max} per item`);
  return qty;
}

function resolveMahjongItems(items) {
  const tiers = [...MAHJONG_NIGHT.tickets, ...MAHJONG_NIGHT.sponsors];
  const byId = Object.fromEntries(tiers.map((t) => [t.id, t]));
  return items.map(({ itemId, quantity }) => {
    const tier = byId[itemId];
    if (!tier) throw new Error("Unknown Mahjong item");
    const max = tier.limited ? 4 : MAX_QTY;
    const qty = clampQty(quantity, max);
    return {
      name: `Mahjong Midsummer Classic — ${tier.name}`,
      quantity: String(qty),
      base_price_money: { amount: Math.round(Number(tier.price) * 100), currency: "USD" },
      note: tier.id,
    };
  });
}

function resolveShopItems(items) {
  const byId = Object.fromEntries(SHOP_PRODUCTS.map((p) => [p.id, p]));
  const bySku = Object.fromEntries(SHOP_PRODUCTS.map((p) => [p.sku, p]));
  return items.map(({ itemId, sku, quantity, option }) => {
    const product = byId[itemId] || bySku[sku];
    if (!product?.price?.value) throw new Error("Unknown shop product");
    const qty = clampQty(quantity);
    const optionLabel = typeof option === "string" ? option.trim() : "";
    const name = optionLabel ? `${product.name} — ${optionLabel}` : product.name;
    const note = optionLabel ? `${product.sku}:${optionLabel}` : product.sku;
    return {
      name: name.slice(0, 120),
      quantity: String(qty),
      base_price_money: {
        amount: product.price.value,
        currency: product.price.currency || "USD",
      },
      note: note.slice(0, 60),
    };
  });
}

async function resolveTicketItems(items) {
  const catalog = await loadTicketing();
  const ticketTypes = catalog.ticketTypes ?? catalog.ticketClasses ?? [];
  const typeById = Object.fromEntries(ticketTypes.map((t) => [String(t.id), t]));
  const perfById = Object.fromEntries((catalog.performances ?? []).map((p) => [String(p.id), p]));

  return items.map(({ performanceId, ticketTypeId, quantity }) => {
    const performance = perfById[String(performanceId)];
    const ticketType = typeById[String(ticketTypeId)];
    if (!performance || !ticketType?.price?.value) throw new Error("Unknown ticket selection");
    const qty = clampQty(quantity);
    const date = String(performance.start || "").slice(0, 10);
    return {
      name: `Much Ado — ${date} — ${ticketType.name}`.slice(0, 120),
      quantity: String(qty),
      base_price_money: {
        amount: ticketType.price.value,
        currency: ticketType.price.currency || "USD",
      },
      note: `${performance.id}:${ticketType.id}`,
    };
  });
}

function redirectFor(kind) {
  if (kind === "shop") return `${siteUrl}/shop/?thanks=1`;
  if (kind === "mahjong") return `${siteUrl}/events/mahjong-night/?thanks=1`;
  return `${siteUrl}/tickets/?thanks=1`;
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "POST, OPTIONS" });
  }
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "POST, OPTIONS" });
  }

  const ip = getClientIp(event);
  if (!rateLimit(`payment-link:${ip}`, { max: 40, windowMs: 900_000 })) {
    return jsonResponse(429, { error: "Too many requests. Please wait and try again." }, event, {
      methods: "POST, OPTIONS",
    });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid JSON" }, event, { methods: "POST, OPTIONS" });
  }

  const kind = String(body.kind || "").trim();
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) {
    return jsonResponse(400, { error: "Select at least one item" }, event, { methods: "POST, OPTIONS" });
  }
  if (items.length > 12) {
    return jsonResponse(400, { error: "Too many line items" }, event, { methods: "POST, OPTIONS" });
  }

  try {
    let lineItems;
    if (kind === "mahjong") lineItems = resolveMahjongItems(items);
    else if (kind === "shop") lineItems = resolveShopItems(items);
    else if (kind === "ticket") lineItems = await resolveTicketItems(items);
    else throw new Error("Unknown checkout kind");

    const locationId = await resolveLocationId();
    const data = await squareRequest("/v2/online-checkout/payment-links", {
      method: "POST",
      body: {
        idempotency_key: randomBytes(16).toString("hex"),
        description: `SOTS ${kind} checkout`,
        payment_note: `SOTS ${kind} · ${lineItems.map((l) => `${l.quantity}× ${l.name}`).join("; ")}`.slice(
          0,
          500,
        ),
        order: {
          location_id: locationId,
          line_items: lineItems,
        },
        checkout_options: {
          redirect_url: redirectFor(kind),
          merchant_support_email: "contactus@shakespeareonthesound.org",
          ask_for_shipping_address: kind === "shop",
        },
      },
    });

    const link = data.payment_link;
    const url = link?.url || link?.long_url;
    if (!url) throw new Error("Square did not return a checkout URL");

    return jsonResponse(200, { url, paymentLinkId: link.id }, event, { methods: "POST, OPTIONS" });
  } catch (err) {
    console.error("create-payment-link:", err);
    return jsonResponse(400, { error: err.message || "Could not start checkout" }, event, {
      methods: "POST, OPTIONS",
    });
  }
}
