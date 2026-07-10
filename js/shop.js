let catalogCache = null;
let catalogAt = 0;
const CACHE_MS = 60_000;

export const SHOP_PAGE_PATH = "/shop/";
export const SHOP_CHECKOUT_PATH = "/shop/checkout";

export function getShopCheckoutPath() {
  return `${SHOP_CHECKOUT_PATH}/`;
}

export function formatCents(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    (cents ?? 0) / 100,
  );
}

export async function loadShopCatalog({ fresh = false } = {}) {
  if (!fresh && catalogCache && Date.now() - catalogAt < CACHE_MS) {
    return catalogCache;
  }

  const sources = ["/api/shop", "/data/shop.json"];
  for (const source of sources) {
    try {
      const res = await fetch(source, { headers: { Accept: "application/json" } });
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.error) continue;
      catalogCache = data;
      catalogAt = Date.now();
      return data;
    } catch {
      /* try next */
    }
  }
  return null;
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
