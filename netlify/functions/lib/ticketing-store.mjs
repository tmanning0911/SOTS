import {
  bindBlobs,
  blobStore,
  isNetlifyRuntime,
  persistJson,
} from "./netlify-blobs.mjs";
import { randomBytes } from "node:crypto";
import { isPastPerformance, normalizeTicketCatalog } from "../../../js/performance-dates.js";
import { stripTestPerformances, assertProductionPerformanceId } from "../../../js/catalog-production.js";
import { normalizePatronEmail } from "./patron-auth.mjs";
import { normalizePhone } from "./patron-profile.mjs";
import { calculateDiscountCents, ticketChargeCents, validatePromo } from "./promo.mjs";
import { getProduct, readShopCatalog } from "./shop-store.mjs";
import { readStaticJsonCatalog } from "./static-catalog.mjs";
import { squareEnvironment } from "./square.mjs";

const STORE_NAME = "sots-ticketing";
const HOLD_TTL_MS = 15 * 60 * 1000;
const SHOP_ADDON_MAX_PER_LINE = 4;
const SHOP_ADDON_MAX_TOTAL = 8;

function store() {
  return blobStore(STORE_NAME);
}

export async function readCatalog() {
  return readStaticJsonCatalog("ticketing.json");
}

function invKey(performanceId, ticketTypeId) {
  return `${performanceId}:${ticketTypeId}`;
}

export async function getInventoryMap() {
  try {
    return (await store().get("inventory", { type: "json" })) ?? {};
  } catch {
    return {};
  }
}

async function saveInventoryMap(map) {
  try {
    await store().setJSON("inventory", map);
  } catch {
    /* blobs optional locally */
  }
}

export async function getReservedMap() {
  try {
    return (await store().get("reserved", { type: "json" })) ?? {};
  } catch {
    return {};
  }
}

async function saveReservedMap(map) {
  try {
    await store().setJSON("reserved", map);
  } catch {
    /* blobs optional locally */
  }
}

async function adjustReserved(lineItems, performanceId, deltaSign) {
  const reserved = await getReservedMap();
  for (const line of lineItems) {
    const key = invKey(performanceId, line.ticketTypeId);
    const next = Math.max(0, (reserved[key] ?? 0) + deltaSign * line.quantity);
    if (next <= 0) delete reserved[key];
    else reserved[key] = next;
  }
  await saveReservedMap(reserved);
  return reserved;
}

export function sandboxSalesEnabled() {
  if (squareEnvironment() === "sandbox") return true;
  return process.env.TICKETING_SANDBOX_SALES === "true";
}

function isNetlifyProductionDeploy() {
  return (process.env.CONTEXT || "").toLowerCase() === "production";
}

function productionCatalogMode() {
  // Preview / QA builds keep synthetic season dates purchasable.
  if (process.env.TICKETING_TEST_MODE === "true") return false;
  if (!isNetlifyProductionDeploy()) return false;
  return squareEnvironment() === "production" && !sandboxSalesEnabled();
}

export function isPerformanceOnSale(performance, catalog) {
  if (!performance) return false;
  if (performance.status === "cancelled") return false;
  if (isPastPerformance(performance)) return false;

  if (sandboxSalesEnabled()) {
    return true;
  }

  if (performance.ticketsAvailable === false) return false;
  if (["live", "started", "draft", "on_sale"].includes(performance.status)) return true;
  return false;
}

export function getTicketType(catalog, ticketTypeId) {
  const types = catalog?.ticketTypes ?? catalog?.ticketClasses ?? [];
  return types.find((t) => t.id === ticketTypeId);
}

export function getPerformance(catalog, performanceId) {
  return catalog?.performances?.find((p) => p.id === performanceId);
}

export async function getSoldCount(performanceId, ticketTypeId, inventory) {
  const map = inventory ?? (await getInventoryMap());
  return map[invKey(performanceId, ticketTypeId)] ?? 0;
}

export async function getAvailableQty(performanceId, ticketTypeId, ticketType, inventory, reserved) {
  const capacity = ticketType?.capacity;
  if (!capacity || capacity <= 0) return 20;
  const sold = await getSoldCount(performanceId, ticketTypeId, inventory);
  const reservedMap = reserved ?? (await getReservedMap());
  const held = reservedMap[invKey(performanceId, ticketTypeId)] ?? 0;
  return Math.max(0, capacity - sold - held);
}

export function mergeCatalogWithInventory(catalog, inventory, reserved = {}) {
  const sandbox = sandboxSalesEnabled();
  const base = normalizeTicketCatalog(catalog);
  const performances = (base.performances ?? [])
    .map((p) => {
    const onSale = isPerformanceOnSale(p, catalog);
    const status = onSale ? (p.status === "completed" && sandbox ? "on_sale" : p.status) : p.status;
    let anyAvailable = false;
    const ticketAvailability = {};
    for (const tt of base.ticketTypes ?? catalog.ticketTypes ?? []) {
      const sold = inventory[invKey(p.id, tt.id)] ?? 0;
      const held = reserved[invKey(p.id, tt.id)] ?? 0;
      const cap = tt.capacity ?? 0;
      const remaining = cap > 0 ? Math.max(0, cap - sold - held) : 10;
      ticketAvailability[tt.id] = remaining;
      if (remaining > 0 && tt.onSale !== false) anyAvailable = true;
    }
    return {
      ...p,
      status,
      isSoldOut: false,
      ticketsAvailable: onSale ? anyAvailable : false,
      ticketAvailability,
    };
  })
    .filter((p) => !isPastPerformance(p));

  const purchasable = performances.filter((p) => isPerformanceOnSale(p, catalog) && p.ticketsAvailable);
  const featured = base.featuredTicket
    ? {
        ...base.featuredTicket,
        status: purchasable.length ? "on_sale" : base.featuredTicket.status,
        isSoldOut: false,
        ticketsAvailable: purchasable.length > 0,
      }
    : null;

  return productionCatalogMode()
    ? stripTestPerformances({
        ...base,
        featuredTicket: featured,
        performances,
        inventorySyncedAt: new Date().toISOString(),
      })
    : {
        ...base,
        featuredTicket: featured,
        performances,
        inventorySyncedAt: new Date().toISOString(),
      };
}

function randomCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(len);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export function newHoldId() {
  return `hold_${randomBytes(12).toString("hex")}`;
}

export function newOrderId() {
  return `SOTS-${randomCode(8)}`;
}

const DONATION_PRESETS_CENTS = [500, 1000, 2500, 5000];

function patronOrdersKey(email) {
  return `patron-orders:${normalizePatronEmail(email)}`;
}

function summarizeOrder(order) {
  return {
    id: order.id,
    confirmationCode: order.confirmationCode,
    email: order.buyer?.email ?? "",
    buyerName: order.buyer?.name ?? "",
    performanceStart: order.performanceStart,
    productionTitle: order.productionTitle,
    totalCents: order.totalCents,
    status: order.status ?? "completed",
    ticketCount: order.tickets?.length ?? 0,
    createdAt: order.createdAt,
  };
}

async function readOrderIndex() {
  try {
    return (await store().get("order-index", { type: "json" })) ?? [];
  } catch {
    return [];
  }
}

async function saveOrderIndex(entries) {
  try {
    await store().setJSON("order-index", entries);
  } catch {
    /* local */
  }
}

async function indexOrder(order) {
  try {
    const s = store();
    const email = normalizePatronEmail(order.buyer?.email);
    if (email) {
      const patronKey = patronOrdersKey(email);
      const existing = (await s.get(patronKey, { type: "json" })) ?? [];
      const nextPatron = [order.id, ...existing.filter((id) => id !== order.id)].slice(0, 100);
      await s.setJSON(patronKey, nextPatron);
    }

    const summary = summarizeOrder(order);
    const index = await readOrderIndex();
    const nextIndex = [summary, ...index.filter((entry) => entry.id !== order.id)].slice(0, 5000);
    await saveOrderIndex(nextIndex);
  } catch {
    /* optional */
  }
}

export async function getOrderById(orderId) {
  try {
    return (await store().get(`order:${orderId}`, { type: "json" })) ?? null;
  } catch {
    return null;
  }
}

export async function listPatronOrders(email) {
  const normalized = normalizePatronEmail(email);
  if (!normalized) return [];

  try {
    const ids = (await store().get(patronOrdersKey(normalized), { type: "json" })) ?? [];
    const orders = await Promise.all(ids.map((id) => getOrderById(id)));
    return orders.filter(Boolean).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  } catch {
    return [];
  }
}

export async function listOrdersForAdmin({ limit = 50, query = "" } = {}) {
  const index = await readOrderIndex();
  const q = String(query).trim().toLowerCase();
  const filtered = q
    ? index.filter(
        (entry) =>
          entry.id?.toLowerCase().includes(q) ||
          entry.confirmationCode?.toLowerCase().includes(q) ||
          entry.email?.toLowerCase().includes(q) ||
          entry.buyerName?.toLowerCase().includes(q),
      )
    : index;
  return filtered.slice(0, Math.min(Math.max(limit, 1), 200));
}

export async function markOrderRefunded(orderId, { squareRefundId, amountCents } = {}) {
  const order = await getOrderById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.status === "refunded") return order;

  order.status = "refunded";
  order.refundedAt = new Date().toISOString();
  order.squareRefundId = squareRefundId ?? order.squareRefundId;
  order.refundAmountCents = amountCents ?? order.totalCents;

  try {
    await store().setJSON(`order:${order.id}`, order);
    const index = await readOrderIndex();
    const nextIndex = index.map((entry) =>
      entry.id === order.id ? { ...entry, status: "refunded" } : entry,
    );
    await saveOrderIndex(nextIndex);
  } catch {
    /* local */
  }

  return order;
}

async function resolveShopAddonLines(shopItems) {
  if (!Array.isArray(shopItems) || !shopItems.length) {
    return { shopLineItems: [], shopCents: 0 };
  }

  const shopCatalog = await readShopCatalog();
  const shopLineItems = [];
  let shopCents = 0;
  let totalUnits = 0;

  for (const raw of shopItems) {
    const qty = Number(raw?.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > SHOP_ADDON_MAX_PER_LINE) {
      throw new Error("Invalid souvenir quantity");
    }
    totalUnits += qty;
    if (totalUnits > SHOP_ADDON_MAX_TOTAL) {
      throw new Error("Too many souvenirs for one order");
    }

    const product = getProduct(shopCatalog, raw?.productId);
    if (!product?.price?.value) throw new Error("Invalid souvenir");
    if (product.digital || product.category === "gift-certificates") {
      throw new Error("Gift certificates are available in the gift shop only");
    }
    if (product.onSale === false) throw new Error(`${product.name} is not available`);

    const hasOptions = Boolean(product.options?.length);
    let option;
    if (hasOptions) {
      const allowed = product.options[0].values ?? [];
      option = String(raw?.option ?? "").trim();
      if (!option || !allowed.includes(option)) {
        throw new Error(`Select a ${product.options[0].name?.toLowerCase() || "size"} for ${product.name}`);
      }
    }

    const lineTotal = product.price.value * qty;
    shopLineItems.push({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity: qty,
      option: option || undefined,
      unitPrice: product.price.value,
      unitPriceDisplay: product.price.display,
      lineTotal,
      fulfillment: "pickup",
    });
    shopCents += lineTotal;
  }

  return { shopLineItems, shopCents };
}

export async function createHold({ performanceId, items, buyer, promoCode, donationCents, shopItems }) {
  if (productionCatalogMode()) {
    assertProductionPerformanceId(performanceId);
  }

  const catalogRaw = await readCatalog();
  const inventory = await getInventoryMap();
  const reserved = await getReservedMap();
  const catalog = mergeCatalogWithInventory(catalogRaw, inventory, reserved);
  const performance = getPerformance(catalog, performanceId);
  if (!performance || !isPerformanceOnSale(performance, catalog)) {
    throw new Error("This performance is not available for purchase");
  }

  const lineItems = [];
  let subtotalCents = 0;

  for (const { ticketTypeId, quantity } of items) {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
      throw new Error("Invalid ticket quantity");
    }
    const tt = getTicketType(catalog, ticketTypeId);
    if (!tt?.price?.value) throw new Error("Invalid ticket type");
    const available = await getAvailableQty(performanceId, ticketTypeId, tt, inventory, reserved);
    if (qty > available) {
      throw new Error(`${tt.name} is no longer available in that quantity`);
    }
    const lineTotal = tt.price.value * qty;
    lineItems.push({
      ticketTypeId: tt.id,
      name: tt.name,
      quantity: qty,
      unitPrice: tt.price.value,
      unitPriceDisplay: tt.price.display,
      lineTotal,
    });
    subtotalCents += lineTotal;
  }

  if (!lineItems.length || subtotalCents < 100) {
    throw new Error("Select at least one ticket");
  }

  let promo = null;
  let discountCents = 0;
  if (promoCode) {
    promo = await validatePromo(promoCode);
    if (!promo) throw new Error("Promo code is not valid");
    discountCents = calculateDiscountCents(subtotalCents, promo);
  }

  let donation = Number(donationCents ?? 0);
  if (!Number.isFinite(donation) || donation < 0) donation = 0;
  if (donation > 0 && donation < 100) donation = 100;
  if (donation > 500_000) donation = 500_000;

  const { shopLineItems, shopCents } = await resolveShopAddonLines(shopItems);

  const ticketCents = ticketChargeCents(subtotalCents, discountCents, promo);
  const totalCents = ticketCents + donation + shopCents;

  const holdId = newHoldId();
  const hold = {
    id: holdId,
    performanceId,
    performanceLabel: performance.start,
    lineItems,
    shopLineItems,
    subtotalCents,
    discountCents,
    promoCode: promo?.code ?? null,
    promoDescription: promo?.description ?? null,
    donationCents: donation,
    shopCents,
    totalCents,
    currency: "USD",
    reserved: true,
    buyer: {
      name: String(buyer?.name ?? "").trim().slice(0, 200),
      email: normalizePatronEmail(buyer?.email),
      phone: normalizePhone(buyer?.phone),
      marketingOptIn: Boolean(buyer?.marketingOptIn),
    },
    expiresAt: new Date(Date.now() + HOLD_TTL_MS).toISOString(),
    createdAt: new Date().toISOString(),
  };

  if (!hold.buyer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hold.buyer.email)) {
    throw new Error("A valid email is required");
  }
  if (!hold.buyer.name) throw new Error("Name is required");

  // Re-check availability then reserve (best-effort under Netlify Blobs race conditions).
  const reservedFresh = await getReservedMap();
  for (const line of lineItems) {
    const tt = getTicketType(catalog, line.ticketTypeId);
    const available = await getAvailableQty(performanceId, line.ticketTypeId, tt, inventory, reservedFresh);
    if (line.quantity > available) {
      throw new Error(`${line.name} is no longer available in that quantity`);
    }
  }
  await adjustReserved(lineItems, performanceId, 1);

  try {
    await persistJson(store(), `hold:${holdId}`, hold, { metadata: { expiresAt: hold.expiresAt } });
  } catch (err) {
    await adjustReserved(lineItems, performanceId, -1);
    console.error("ticket hold persist failed:", err);
    if (isNetlifyRuntime()) throw err;
  }

  return hold;
}

export function getDonationPresetsCents() {
  return DONATION_PRESETS_CENTS;
}

export async function getHold(holdId) {
  try {
    const hold = await store().get(`hold:${holdId}`, { type: "json" });
    if (!hold) return null;
    if (new Date(hold.expiresAt).getTime() < Date.now()) {
      await releaseHold(holdId);
      return null;
    }
    return hold;
  } catch (err) {
    console.error("ticket hold read failed:", err);
    return null;
  }
}

export async function releaseHold(holdId) {
  try {
    const hold = await store().get(`hold:${holdId}`, { type: "json" });
    if (hold?.reserved && hold.lineItems?.length) {
      await adjustReserved(hold.lineItems, hold.performanceId, -1);
    }
    await store().delete(`hold:${holdId}`);
  } catch {
    /* noop */
  }
}

export async function commitOrder({ hold, squarePaymentId, squareOrderId = null }) {
  const catalog = await readCatalog();
  const performance = getPerformance(catalog, hold.performanceId);

  const inventory = await getInventoryMap();
  for (const line of hold.lineItems) {
    const key = invKey(hold.performanceId, line.ticketTypeId);
    inventory[key] = (inventory[key] ?? 0) + line.quantity;
  }
  await saveInventoryMap(inventory);

  // Convert reservation → sold (drop reserved qty for this hold).
  if (hold.reserved && hold.lineItems?.length) {
    await adjustReserved(hold.lineItems, hold.performanceId, -1);
  }

  const confirmationCode = randomCode(6);
  const tickets = [];
  for (const line of hold.lineItems) {
    for (let i = 0; i < line.quantity; i += 1) {
      tickets.push({
        code: randomCode(10),
        ticketTypeId: line.ticketTypeId,
        ticketTypeName: line.name,
        performanceId: hold.performanceId,
      });
    }
  }

  const order = {
    id: newOrderId(),
    confirmationCode,
    performanceId: hold.performanceId,
    performanceStart: performance?.start ?? hold.performanceLabel,
    productionTitle: catalog?.production?.title ?? catalog?.featuredTicket?.name ?? "",
    venue: performance?.venue ?? "",
    location: performance?.location ?? "",
    buyer: hold.buyer,
    lineItems: hold.lineItems,
    shopLineItems: hold.shopLineItems ?? [],
    subtotalCents: hold.subtotalCents ?? hold.totalCents,
    discountCents: hold.discountCents ?? 0,
    promoCode: hold.promoCode ?? null,
    donationCents: hold.donationCents ?? 0,
    shopCents: hold.shopCents ?? 0,
    totalCents: hold.totalCents,
    currency: hold.currency,
    squarePaymentId,
    squareOrderId,
    status: "completed",
    tickets,
    createdAt: new Date().toISOString(),
  };

  try {
    const s = store();
    await s.setJSON(`order:${order.id}`, order);
    await s.setJSON(`order-confirm:${confirmationCode}`, { orderId: order.id, email: order.buyer.email });
    await indexOrder(order);
  } catch {
    /* local */
  }

  // Delete hold without double-releasing reserved (already converted above).
  try {
    await store().delete(`hold:${hold.id}`);
  } catch {
    /* noop */
  }
  return order;
}

export function publicOrderView(order) {
  if (!order) return null;
  return {
    id: order.id,
    type: order.type || "ticket",
    confirmationCode: order.confirmationCode,
    performanceStart: order.performanceStart,
    productionTitle: order.productionTitle,
    venue: order.venue,
    location: order.location,
    buyer: order.buyer,
    lineItems: order.lineItems,
    shopLineItems: order.shopLineItems ?? [],
    subtotalCents: order.subtotalCents,
    discountCents: order.discountCents,
    promoCode: order.promoCode,
    donationCents: order.donationCents,
    shopCents: order.shopCents ?? 0,
    totalCents: order.totalCents,
    currency: order.currency,
    tickets: order.tickets,
    status: order.status,
    createdAt: order.createdAt,
  };
}

export async function lookupOrder(email, confirmationCode) {
  const normalizedEmail = String(email ?? "")
    .trim()
    .toLowerCase();
  const code = String(confirmationCode ?? "")
    .trim()
    .toUpperCase();
  if (!normalizedEmail || !code) return null;

  try {
    const ref = await store().get(`order-confirm:${code}`, { type: "json" });
    if (!ref || ref.email !== normalizedEmail) return null;
    const order = await store().get(`order:${ref.orderId}`, { type: "json" });
    return order ?? null;
  } catch {
    return null;
  }
}
