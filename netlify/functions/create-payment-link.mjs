import { randomBytes } from "node:crypto";
import { MAHJONG_NIGHT } from "../../js/mahjong-night.js";
import { GALA_EVENT } from "../../js/gala-event.js";
import { getStandardSponsor } from "../../js/event-sponsorships.js";
import { PROGRAM_ADS } from "../../js/program-ads-sponsorships.js";
import { SHOP_PRODUCTS } from "../../js/shop-catalog.js";
import { jsonResponse } from "./lib/cors.mjs";
import { bindBlobs } from "./lib/netlify-blobs.mjs";
import { newPendingId, savePaymentLinkPending } from "./lib/payment-link-pending.mjs";
import { getClientIp, rateLimit } from "./lib/rateLimit.mjs";
import { resolveLocationId, squareRequest } from "./lib/square.mjs";
import { readStaticJsonCatalog } from "./lib/static-catalog.mjs";
import { formatCents } from "./lib/email-layout.mjs";

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

function resolveEventSponsorItems(items) {
  return items.map(({ itemId, quantity, eventId, eventTitle }) => {
    const tier = getStandardSponsor(itemId);
    if (!tier) throw new Error("Unknown event sponsor package");
    const qty = clampQty(quantity, 4);
    const label = String(eventTitle || eventId || "Event").trim().slice(0, 48);
    return {
      name: `${label} — ${tier.name}`.slice(0, 120),
      quantity: String(qty),
      base_price_money: { amount: Math.round(Number(tier.price) * 100), currency: "USD" },
      note: `${String(eventId || "event").slice(0, 24)}:${tier.id}`.slice(0, 60),
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

async function buildPendingSnapshot(kind, items, buyer, lineItems, shopItems = []) {
  const base = {
    id: newPendingId(),
    kind,
    buyer,
    lineItems: lineItems.map((l) => ({
      name: l.name,
      quantity: Number(l.quantity) || 1,
      unitPrice: Number(l.base_price_money?.amount ?? 0),
      unitPriceDisplay: formatCents(Number(l.base_price_money?.amount ?? 0)),
    })),
  };

  if (kind === "ticket") {
    const catalog = await loadTicketing();
    const typeById = Object.fromEntries(
      (catalog.ticketTypes ?? catalog.ticketClasses ?? []).map((t) => [String(t.id), t]),
    );
    const first = items[0] || {};
    const performanceId = String(first.performanceId || "");
    const shopSnapshot = shopItems.length
      ? {
          fulfillment: "pickup",
          lineItems: (() => {
            const byId = Object.fromEntries(SHOP_PRODUCTS.map((p) => [p.id, p]));
            const bySku = Object.fromEntries(SHOP_PRODUCTS.map((p) => [p.sku, p]));
            return shopItems.map(({ itemId, sku, quantity, option }) => {
              const product = byId[itemId] || bySku[sku];
              const qty = Number(quantity) || 1;
              const unit = Number(product?.price?.value ?? 0);
              const optionLabel = typeof option === "string" ? option.trim() : "";
              return {
                id: product?.id,
                sku: product?.sku,
                name: product?.name || "Item",
                option: optionLabel || undefined,
                category: product?.category,
                quantity: qty,
                unitPrice: unit,
                unitPriceDisplay: formatCents(unit),
              };
            });
          })(),
        }
      : null;
    return {
      ...base,
      title: catalog?.production?.title || "Much Ado About Nothing",
      ticket: {
        performanceId,
        lineItems: items.map(({ performanceId: perfId, ticketTypeId, quantity }) => {
          const ticketType = typeById[String(ticketTypeId)];
          const qty = Number(quantity) || 1;
          const unit = Number(ticketType?.price?.value ?? 0);
          return {
            performanceId: String(perfId || performanceId),
            ticketTypeId: String(ticketTypeId),
            name: ticketType?.name || "Ticket",
            quantity: qty,
            unitPrice: unit,
            unitPriceDisplay: formatCents(unit),
          };
        }),
      },
      ...(shopSnapshot ? { shop: shopSnapshot } : {}),
    };
  }

  if (kind === "shop") {
    const byId = Object.fromEntries(SHOP_PRODUCTS.map((p) => [p.id, p]));
    const bySku = Object.fromEntries(SHOP_PRODUCTS.map((p) => [p.sku, p]));
    return {
      ...base,
      title: "Gift shop",
      shop: {
        fulfillment: "pickup",
        lineItems: items.map(({ itemId, sku, quantity, option }) => {
          const product = byId[itemId] || bySku[sku];
          const qty = Number(quantity) || 1;
          const unit = Number(product?.price?.value ?? 0);
          const optionLabel = typeof option === "string" ? option.trim() : "";
          return {
            id: product?.id,
            sku: product?.sku,
            name: product?.name || "Item",
            option: optionLabel || undefined,
            category: product?.category,
            quantity: qty,
            unitPrice: unit,
            unitPriceDisplay: formatCents(unit),
          };
        }),
      },
    };
  }

  if (kind === "event-sponsor") {
    const first = items[0] || {};
    return {
      ...base,
      title: String(first.eventTitle || "Event sponsorship").slice(0, 80),
      eventTitle: String(first.eventTitle || "").slice(0, 80),
      eventId: String(first.eventId || "").slice(0, 40),
    };
  }

  if (kind === "mahjong") return { ...base, title: "Mahjong Midsummer Classic" };
  if (kind === "gala") return { ...base, title: "Much Ado About Something" };
  if (kind === "donate") return { ...base, title: "Gift to Shakespeare on the Sound" };
  if (kind === "sponsorship") return { ...base, title: "Program ads & sponsorship" };
  return base;
}

function redirectFor(kind, returnPath) {
  if (typeof returnPath === "string") {
    const path = returnPath.trim();
    if (path.startsWith("/") && !path.startsWith("//")) {
      return `${siteUrl}${path}`;
    }
  }
  if (kind === "shop") return `${siteUrl}/shop/?thanks=1`;
  if (kind === "mahjong") return `${siteUrl}/events/mahjong-night/?thanks=1`;
  if (kind === "gala") return `${siteUrl}/events/much-ado-about-something/?thanks=1`;
  if (kind === "event-sponsor") return `${siteUrl}/support/events/?thanks=1`;
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
  bindBlobs(event);
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
  const shopItems = Array.isArray(body.shopItems) ? body.shopItems : [];
  if (!items.length) {
    return jsonResponse(400, { error: "Select at least one item" }, event, { methods: "POST, OPTIONS" });
  }
  if (items.length + shopItems.length > 16) {
    return jsonResponse(400, { error: "Too many line items" }, event, { methods: "POST, OPTIONS" });
  }

  try {
    let lineItems;
    if (kind === "mahjong") lineItems = resolveMahjongItems(items);
    else if (kind === "gala") lineItems = resolveGalaItems(items);
    else if (kind === "event-sponsor") lineItems = resolveEventSponsorItems(items);
    else if (kind === "shop") lineItems = resolveShopItems(items);
    else if (kind === "ticket") {
      lineItems = await resolveTicketItems(items);
      if (shopItems.length) {
        lineItems = [...lineItems, ...resolveShopItems(shopItems)];
      }
    } else if (kind === "donate") lineItems = resolveDonateItems(items);
    else if (kind === "sponsorship") lineItems = resolveSponsorshipItems(items);
    else throw new Error("Unknown checkout kind");

    const buyer = sanitizeBuyer(body);
    if ((kind === "sponsorship" || kind === "event-sponsor") && !buyer.businessName) {
      throw new Error("Enter your business or organization name before checkout");
    }

    const supportEmail =
      kind === "sponsorship" || kind === "event-sponsor"
        ? "marketing@shakespeareonthesound.org"
        : "aaron@shakespeareonthesound.org";

    const pending = await buildPendingSnapshot(kind, items, buyer, lineItems, shopItems);
    const locationId = await resolveLocationId();
    const data = await squareRequest("/v2/online-checkout/payment-links", {
      method: "POST",
      body: {
        idempotency_key: randomBytes(16).toString("hex"),
        description: `SOTS ${kind} checkout`,
        payment_note: `${buildPaymentNote(kind, lineItems, buyer)} · ${pending.id}`.slice(0, 500),
        order: {
          location_id: locationId,
          reference_id: pending.id,
          metadata: {
            sots_kind: kind,
            sots_pending: pending.id,
          },
          line_items: lineItems,
        },
        checkout_options: {
          redirect_url: redirectFor(kind, body.returnPath),
          merchant_support_email: supportEmail,
          ask_for_shipping_address: kind === "shop",
        },
      },
    });

    const link = data.payment_link;
    const url = link?.url || link?.long_url;
    if (!url) throw new Error("Square did not return a checkout URL");

    pending.paymentLinkId = link.id;
    pending.squareOrderId = link.order_id || data.related_resources?.orders?.[0]?.id || null;
    try {
      await savePaymentLinkPending(pending, event);
    } catch (err) {
      console.error("payment-link pending save failed:", err);
      // Still return checkout URL — webhook can rebuild from Square line notes when possible.
    }

    return jsonResponse(
      200,
      { url, paymentLinkId: link.id, pendingId: pending.id },
      event,
      { methods: "POST, OPTIONS" },
    );
  } catch (err) {
    console.error("create-payment-link:", err);
    return jsonResponse(400, { error: err.message || "Could not start checkout" }, event, {
      methods: "POST, OPTIONS",
    });
  }
}
