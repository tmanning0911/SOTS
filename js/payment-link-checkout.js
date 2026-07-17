/**
 * Create a Square-hosted checkout for one or more line items (with quantities).
 * Used when static Payment Links can't express qty > 1.
 * Tester/comp promos that zero the ticket total return `{ free: true, redirectUrl }`.
 */
export async function createPaymentLinkCheckout({
  kind,
  items,
  shopItems,
  buyer,
  returnPath,
  promoCode,
}) {
  const res = await fetch("/api/checkout/payment-link", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ kind, items, shopItems, buyer, returnPath, promoCode }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not start checkout");
  if (data.free && data.redirectUrl) return data;
  if (!data.url) throw new Error("Checkout URL missing");
  return data;
}

export async function openPaymentLinkCheckout(payload) {
  const data = await createPaymentLinkCheckout(payload);
  const url = data.free ? data.redirectUrl : data.url;
  // Same-tab navigation — popup blockers often kill window.open after await.
  window.location.assign(url);
  return data;
}
