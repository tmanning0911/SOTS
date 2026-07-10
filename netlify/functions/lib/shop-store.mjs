import { getStore } from "@netlify/blobs";
import { randomBytes } from "node:crypto";
import {
  buildShopCatalog,
  enrichShopProducts,
  filterLiveShopProducts,
  SHOP_CATEGORIES,
  SHOP_DINE_PARTNERS,
  SHOP_FULFILLMENT,
} from "../../../js/shop-catalog.js";
import { fetchSquareShopCatalog } from "./square-catalog.mjs";
import { readStaticJsonCatalog } from "./static-catalog.mjs";

const STORE_NAME = "sots-shop";
const HOLD_TTL_MS = 20 * 60 * 1000;

function store() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export async function readShopCatalog() {
  const fileCatalog = await readStaticJsonCatalog("shop.json");
  const baseMeta = {
    categories: fileCatalog?.categories ?? SHOP_CATEGORIES,
    shopAndDine: fileCatalog?.shopAndDine ?? SHOP_DINE_PARTNERS,
    fulfillment: fileCatalog?.fulfillment ?? SHOP_FULFILLMENT,
  };

  if (process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_APPLICATION_ID) {
    try {
      const squareProducts = enrichShopProducts(await fetchSquareShopCatalog());
      if (squareProducts.length) {
        return buildShopCatalog(squareProducts, "square");
      }
    } catch {
      /* fall through */
    }
  }

  if (fileCatalog?.products?.length) {
    return {
      ...fileCatalog,
      products: filterLiveShopProducts(fileCatalog.products),
      ...baseMeta,
    };
  }

  return fileCatalog;
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
    await store().setJSON(`hold:${hold.id}`, hold, { metadata: { expiresAt: hold.expiresAt } });
  } catch {
    /* local dev */
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
  } catch {
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
    await s.setJSON(`order-confirm:${confirmationCode}`, { orderId: order.id, email: order.buyer.email });
  } catch {
    /* local */
  }

  await releaseShopHold(hold.id);
  return order;
}
