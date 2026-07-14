import {
  bindBlobs,
  blobStore,
  isNetlifyRuntime,
  persistJson,
} from "./netlify-blobs.mjs";
import { randomBytes } from "node:crypto";
import {
  buildShopCatalog,
  mergeSeedWithSquareProducts,
  SHOP_PRODUCTS,
} from "../../../js/shop-catalog.js";
import { normalizePatronEmail } from "./patron-auth.mjs";
import { readStaticJsonCatalog } from "./static-catalog.mjs";

const STORE_NAME = "sots-shop";
const HOLD_TTL_MS = 20 * 60 * 1000;

function store() {
  return blobStore(STORE_NAME);
}

function patronOrdersKey(email) {
  return `patron-orders:${normalizePatronEmail(email)}`;
}

async function indexPatronShopOrder(order) {
  try {
    const email = normalizePatronEmail(order.buyer?.email);
    if (!email) return;
    const s = store();
    const key = patronOrdersKey(email);
    const existing = (await s.get(key, { type: "json" })) ?? [];
    const next = [order.id, ...existing.filter((id) => id !== order.id)].slice(0, 100);
    await s.setJSON(key, next);
  } catch {
    /* optional */
  }
}

export async function getShopOrderById(orderId) {
  try {
    return (await store().get(`order:${orderId}`, { type: "json" })) ?? null;
  } catch {
    return null;
  }
}

export async function listPatronShopOrders(email) {
  const normalized = normalizePatronEmail(email);
  if (!normalized) return [];

  try {
    const ids = (await store().get(patronOrdersKey(normalized), { type: "json" })) ?? [];
    const orders = await Promise.all(ids.map((id) => getShopOrderById(id)));
    return orders.filter(Boolean).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  } catch {
    return [];
  }
}

export function publicShopOrderView(order) {
  if (!order) return null;
  return {
    id: order.id,
    type: "shop",
    confirmationCode: order.confirmationCode,
    buyer: order.buyer,
    lineItems: order.lineItems,
    totalCents: order.totalCents,
    currency: order.currency,
    fulfillment: order.fulfillment,
    note: order.note,
    status: order.status,
    createdAt: order.createdAt,
  };
}

export async function lookupShopOrder(email, confirmationCode) {
  const normalizedEmail = normalizePatronEmail(email);
  const code = String(confirmationCode ?? "")
    .trim()
    .toUpperCase();
  if (!normalizedEmail || !code) return null;

  try {
    const ref = await store().get(`order-confirm:${code}`, { type: "json" });
    if (!ref || normalizePatronEmail(ref.email) !== normalizedEmail) return null;
    return (await getShopOrderById(ref.orderId)) ?? null;
  } catch {
    return null;
  }
}

export async function readShopCatalog() {
  const fileCatalog = await readStaticJsonCatalog("shop.json");
  if (fileCatalog?.products?.length) {
    return mergeSeedWithSquareProducts(fileCatalog.products);
  }

  return buildShopCatalog(SHOP_PRODUCTS, "seed");
}

export function getProduct(catalog, productId) {
  return catalog?.products?.find((p) => p.id === productId);
}

function randomCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(len);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export function newHoldId() {
  return `shop_hold_${randomBytes(12).toString("hex")}`;
}

export function newOrderId() {
  return `SOTS-SHOP-${randomCode(8)}`;
}

export async function createShopHold({ items, buyer, fulfillment = "pickup", note = "" }) {
  const catalog = await readShopCatalog();
  if (!catalog?.products?.length) throw new Error("Shop is not available right now");

  const lineItems = [];
  let totalCents = 0;

  for (const { productId, quantity, option } of items) {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
      throw new Error("Invalid quantity");
    }
    const product = getProduct(catalog, productId);
    if (!product?.price?.value) throw new Error("Invalid product");

    const lineTotal = product.price.value * qty;
    lineItems.push({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity: qty,
      option: option ? String(option).slice(0, 80) : undefined,
      unitPrice: product.price.value,
      unitPriceDisplay: product.price.display,
      lineTotal,
      digital: Boolean(product.digital),
    });
    totalCents += lineTotal;
  }

  if (!lineItems.length || totalCents < 100) {
    throw new Error("Your cart is empty");
  }

  const hold = {
    id: newHoldId(),
    lineItems,
    totalCents,
    currency: "USD",
    fulfillment: fulfillment === "ship" ? "ship" : "pickup",
    note: String(note ?? "").trim().slice(0, 500),
    buyer: {
      name: String(buyer?.name ?? "").trim().slice(0, 200),
      email: String(buyer?.email ?? "")
        .trim()
        .toLowerCase()
        .slice(0, 254),
      phone: String(buyer?.phone ?? "").trim().slice(0, 30),
      address: buyer?.address
        ? {
            line1: String(buyer.address.line1 ?? "").trim().slice(0, 200),
            line2: String(buyer.address.line2 ?? "").trim().slice(0, 200),
            city: String(buyer.address.city ?? "").trim().slice(0, 100),
            state: String(buyer.address.state ?? "").trim().slice(0, 30),
            postalCode: String(buyer.address.postalCode ?? "").trim().slice(0, 20),
          }
        : undefined,
    },
    expiresAt: new Date(Date.now() + HOLD_TTL_MS).toISOString(),
    createdAt: new Date().toISOString(),
  };

  if (!hold.buyer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hold.buyer.email)) {
    throw new Error("A valid email is required");
  }
  if (!hold.buyer.name) throw new Error("Name is required");
  if (hold.fulfillment === "ship") {
    const addr = hold.buyer.address;
    if (!addr?.line1 || !addr?.city || !addr?.state || !addr?.postalCode) {
      throw new Error("A complete shipping address is required");
    }
  }

  try {
    await persistJson(store(), `hold:${hold.id}`, hold, { metadata: { expiresAt: hold.expiresAt } });
  } catch (err) {
    console.error("shop hold persist failed:", err);
    if (isNetlifyRuntime()) throw err;
  }

  return hold;
}

export async function getShopHold(holdId) {
  try {
    const hold = await store().get(`hold:${holdId}`, { type: "json" });
    if (!hold) return null;
    if (new Date(hold.expiresAt).getTime() < Date.now()) {
      await releaseShopHold(holdId);
      return null;
    }
    return hold;
  } catch (err) {
    console.error("shop hold read failed:", err);
    return null;
  }
}

export async function releaseShopHold(holdId) {
  try {
    await store().delete(`hold:${holdId}`);
  } catch {
    /* noop */
  }
}

export async function commitShopOrder({ hold, squarePaymentId }) {
  const confirmationCode = randomCode(6);
  const order = {
    id: newOrderId(),
    type: "shop",
    confirmationCode,
    buyer: hold.buyer,
    lineItems: hold.lineItems,
    totalCents: hold.totalCents,
    currency: hold.currency,
    fulfillment: hold.fulfillment,
    note: hold.note,
    squarePaymentId,
    status: "completed",
    createdAt: new Date().toISOString(),
  };

  try {
    const s = store();
    await s.setJSON(`order:${order.id}`, order);
    await s.setJSON(`order-confirm:${confirmationCode}`, {
      orderId: order.id,
      email: normalizePatronEmail(order.buyer.email),
    });
    await indexPatronShopOrder(order);
  } catch {
    /* local */
  }

  await releaseShopHold(hold.id);
  return order;
}
