import { buildShopCatalog, mergeSeedWithSquareProducts, resolveShopCatalog, SHOP_PRODUCTS } from "./shop-catalog.js";

let catalogCache = null;
let catalogAt = 0;
let prefetchPromise = null;
const CACHE_MS = 300_000;
const STATIC_CATALOG_URL = "/data/shop.json";

export const SHOP_PAGE_PATH = "/shop/";
export const SHOP_CHECKOUT_PATH = "/shop/checkout";

/** Instant catalog bundled with the app — no network required for first paint. */
export const INITIAL_SHOP_CATALOG = buildShopCatalog(SHOP_PRODUCTS, "seed");

export const BUNDLED_GIFT_CERTIFICATES = INITIAL_SHOP_CATALOG.products.filter(
  (product) => product.category === "gift-certificates",
);

export const BUNDLED_MERCHANDISE = INITIAL_SHOP_CATALOG.products.filter(
  (product) => product.category !== "gift-certificates",
);

export function giftCertificateProducts(catalog = INITIAL_SHOP_CATALOG) {
  const products = catalog?.products?.length ? catalog.products : INITIAL_SHOP_CATALOG.products;
  return products.filter((product) => product.category === "gift-certificates");
}

export function merchandiseProducts(catalog = INITIAL_SHOP_CATALOG) {
  const products = catalog?.products?.length ? catalog.products : INITIAL_SHOP_CATALOG.products;
  return products.filter((product) => product.category !== "gift-certificates");
}

/** Jul–Apr (incl. holidays): gift certificates first; May–June: merchandise first. */
export function shopFeatureGiftCertificatesFirst(date = new Date()) {
  const month = date.getMonth() + 1; // 1–12
  return month < 5 || month >= 7;
}

/** Physical souvenirs eligible as ticket-checkout add-ons (no gift certificates). */
export function ticketAddonMerchandise(catalog = INITIAL_SHOP_CATALOG) {
  return merchandiseProducts(catalog).filter((product) => product.onSale !== false && !product.digital);
}

export function merchandiseCategories(catalog = INITIAL_SHOP_CATALOG) {
  const merchandise = merchandiseProducts(catalog);
  const ids = new Set(merchandise.map((product) => product.category));
  const cats = (catalog?.categories ?? INITIAL_SHOP_CATALOG.categories).filter((cat) => ids.has(cat.id));
  return [{ id: "all", label: "All" }, ...cats];
}

const prefetchedImages = new Set();

export function prefetchShopProductImages(catalog = INITIAL_SHOP_CATALOG, limit = 6) {
  if (typeof document === "undefined") return;

  merchandiseProducts(catalog)
    .slice(0, limit)
    .forEach((product) => {
      if (!product.image || prefetchedImages.has(product.image)) return;
      prefetchedImages.add(product.image);

      const preload = document.createElement("link");
      preload.rel = "preload";
      preload.as = "image";
      preload.href = product.image;
      document.head.appendChild(preload);
    });
}

export function getShopCheckoutPath() {
  return `${SHOP_CHECKOUT_PATH}/`;
}

export function formatCents(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    (cents ?? 0) / 100,
  );
}

function rememberCatalog(data) {
  if (!data?.products?.length) return null;
  catalogCache = data;
  catalogAt = Date.now();
  return data;
}

async function fetchStaticCatalog({ fresh = false } = {}) {
  const res = await fetch(STATIC_CATALOG_URL, {
    headers: { Accept: "application/json" },
    cache: fresh ? "no-cache" : "default",
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data?.error || !data?.products?.length) return null;
  return rememberCatalog(resolveShopCatalog(data));
}

export function prefetchShopCatalog() {
  if (typeof window === "undefined") {
    return Promise.resolve(INITIAL_SHOP_CATALOG);
  }
  if (!prefetchPromise) {
    prefetchPromise = loadShopCatalog().catch(() => INITIAL_SHOP_CATALOG);
  }
  return prefetchPromise;
}

export async function loadShopCatalog({ fresh = false } = {}) {
  if (!fresh && catalogCache && Date.now() - catalogAt < CACHE_MS) {
    return catalogCache;
  }

  try {
    const staticCatalog = await fetchStaticCatalog({ fresh });
    if (staticCatalog) return staticCatalog;
  } catch {
    /* use bundled fallback */
  }

  return rememberCatalog(INITIAL_SHOP_CATALOG) ?? INITIAL_SHOP_CATALOG;
}

export function remapCartLines(cart, catalog) {
  if (!Array.isArray(cart) || !catalog?.products?.length) return cart;

  const byId = new Map(catalog.products.map((product) => [product.id, product]));
  const bySku = new Map(
    catalog.products.filter((product) => product.sku).map((product) => [product.sku, product]),
  );

  return cart
    .map((line) => {
      let product = byId.get(line.id);
      if (!product && line.sku) product = bySku.get(line.sku);
      if (!product) return null;

      return {
        ...line,
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        image: product.image ?? line.image,
        digital: product.digital ?? line.digital,
      };
    })
    .filter(Boolean);
}

export function cartTotalCents(cart) {
  return (cart ?? []).reduce((sum, line) => sum + (line.price?.value ?? 0) * line.quantity, 0);
}

export function cartItemCount(cart) {
  return (cart ?? []).reduce((sum, line) => sum + line.quantity, 0);
}

export async function prepareShopCheckout(payload) {
  const res = await fetch("/api/shop/checkout/prepare", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not start checkout");
  return data;
}

export async function completeShopCheckout({ holdId, sourceId }) {
  const res = await fetch("/api/shop/checkout/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ holdId, sourceId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Payment failed");
  return { order: data.order, emailSent: Boolean(data.emailSent) };
}

if (typeof window !== "undefined") {
  prefetchShopCatalog();
  prefetchShopProductImages();
}
