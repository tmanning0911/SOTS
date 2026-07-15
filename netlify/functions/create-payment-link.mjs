import { randomBytes } from "node:crypto";
import { MAHJONG_NIGHT } from "../../js/mahjong-night.js";
import { GALA_EVENT } from "../../js/gala-event.js";
import { PROGRAM_ADS } from "../../js/program-ads-sponsorships.js";
import { SHOP_PRODUCTS } from "../../js/shop-catalog.js";
import { jsonResponse } from "./lib/cors.mjs";
import { getClientIp, rateLimit } from "./lib/rateLimit.mjs";
import { resolveLocationId, squareRequest } from "./lib/square.mjs";
import { readStaticJsonCatalog } from "./lib/static-catalog.mjs";

const MAX_QTY = 10;
const DONATE_MIN_CENTS = 500; // $5
const DONATE_MAX_CENTS = 500_000; // $5,000 (Square donation link cap territory)
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

function resolveGalaItems(items) {
  const byId = Object.fromEntries(GALA_EVENT.tickets.map((t) => [t.id, t]));
  return items.map(({ itemId, quantity }) => {
    const tier = byId[itemId];
    if (!tier) throw new Error("Unknown gala ticket");
    const price = Number(tier.price);
    if (!(price > 100)) throw new Error("Invalid gala ticket price");
    const qty = clampQty(quantity, MAX_QTY);
    return {
      name: `Much Ado About Something — ${tier.name}`,
      quantity: String(qty),
      base_price_money: { amount: Math.round(price * 100), currency: "USD" },
      note: tier.id,
    };
  });
}

function resolveSponsorshipItems(items) {
  const catalog = [...PROGRAM_ADS.ads, ...PROGRAM_ADS.sponsorships];
  const byId = Object.fromEntries(catalog.map((t) => [t.id, t]));
  return items.map(({ itemId, quantity, businessName }) => {
    const tier = byId[itemId];
    if (!tier) throw new Error("Unknown ad or sponsorship package");
    const qty = clampQty(quantity, 1);
    const kindLabel = PROGRAM_ADS.ads.some((a) => a.id === tier.id) ? "Program ad" : "Sponsorship";
    const biz = String(businessName || "").trim();
    const noteParts = [tier.id];
    if (biz) noteParts.push(biz.slice(0, 40));
    return {
      name: `${kindLabel} — ${tier.name}`.slice(0, 120),
      quantity: String(qty),
      base_price_money: { amount: Math.round(Number(tier.price) * 100), currency: "USD" },
      note: noteParts.join(":").slice(0, 60),
    };
  });
}

function sanitizeBuyer(body) {
  const buyer = body?.buyer && typeof body.buyer === "object" ? body.buyer : {};
  return {
    businessName: String(buyer.businessName || buyer.business || "").trim().slice(0, 100),
    contactName: String(buyer.contactName || buyer.name || "").trim().slice(0, 100),
    note: String(buyer.note || "").trim().slice(0, 400),
  };
}

function buildPaymentNote(kind, lineItems, buyer) {
  const parts = [
    `SOTS ${kind}`,
    lineItems.map((l) => `${l.quantity}× ${l.name}`).join("; "),
  ];
  if (buyer.businessName) parts.push(`Business: ${buyer.businessName}`);
  if (buyer.contactName) parts.push(`Contact: ${buyer.contactName}`);
  if (buyer.note) parts.push(`Note: ${buyer.note}`);
  return parts.join(" · ").slice(0, 500);
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
  if (kind === "gala") return `${siteUrl}/events/much-ado-about-something/?thanks=1`;
  if (kind === "donate") return `${siteUrl}/support/donate/?thanks=1`;
  if (kind === "sponsorship") return `${siteUrl}/support/program-ads-sponsorships/?thanks=1`;
  return `${siteUrl}/tickets/?thanks=1`;
}

function resolveDonateItems(items) {
  const row = items[0] || {};
  const amountCents = Math.round(Number(row.amountCents ?? row.amount ?? 0));
  if (!Number.isInteger(amountCents) || amountCents < DONATE_MIN_CENTS) {
    throw new Error("Enter a gift of at least $5");
  }
  if (amountCents > DONATE_MAX_CENTS) {
    throw new Error("For gifts over $5,000, please contact Aaron Simms");
  }
  const coverFees = Boolean(row.coverFees);
  const frequency = String(row.frequency || "once").toLowerCase() === "monthly" ? "monthly" : "once";
  const label =
    frequency === "monthly"
      ? coverFees
        ? "Monthly gift (incl. processing)"
        : "Monthly gift to Shakespeare on the Sound"
      : coverFees
        ? "Gift (incl. processing)"
        : "Gift to Shakespeare on the Sound";

  return [
    {
      name: label.slice(0, 120),
      quantity: "1",
      base_price_money: { amount: amountCents, currency: "USD" },
      note: `donate:${frequency}:${coverFees ? "fees" : "net"}`.slice(0, 60),
    },
  ];
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
    else if (kind === "gala") lineItems = resolveGalaItems(items);
    else if (kind === "shop") lineItems = resolveShopItems(items);
    else if (kind === "ticket") lineItems = await resolveTicketItems(items);
    else if (kind === "donate") lineItems = resolveDonateItems(items);
    else if (kind === "sponsorship") lineItems = resolveSponsorshipItems(items);
    else throw new Error("Unknown checkout kind");

    const buyer = sanitizeBuyer(body);
    if (kind === "sponsorship" && !buyer.businessName) {
      throw new Error("Enter your business or organization name before checkout");
    }

    const supportEmail =
      kind === "sponsorship"
        ? "marketing@shakespeareonthesound.org"
        : "aaron@shakespeareonthesound.org";

    const locationId = await resolveLocationId();
    const data = await squareRequest("/v2/online-checkout/payment-links", {
      method: "POST",
      body: {
        idempotency_key: randomBytes(16).toString("hex"),
        description: `SOTS ${kind} checkout`,
        payment_note: buildPaymentNote(kind, lineItems, buyer),
        order: {
          location_id: locationId,
          line_items: lineItems,
        },
        checkout_options: {
          redirect_url: redirectFor(kind),
          merchant_support_email: supportEmail,
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
