/**
 * Create a Square-hosted checkout for one or more line items (with quantities).
 * Used when static Payment Links can't express qty > 1.
 */
export async function createPaymentLinkCheckout({ kind, items, buyer, returnPath }) {
  const res = await fetch("/api/checkout/payment-link", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ kind, items, buyer, returnPath }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not start checkout");
  if (!data.url) throw new Error("Checkout URL missing");
  return data;
}

export async function openPaymentLinkCheckout(payload) {
  const { url } = await createPaymentLinkCheckout(payload);
  // Same-tab navigation — popup blockers often kill window.open after await.
  window.location.assign(url);
  return url;
}
