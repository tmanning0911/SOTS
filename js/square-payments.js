let configPromise = null;
let sdkPromise = null;
let sdkUrl = null;

function checkoutConfigError(res, payload = {}) {
  if (res.status === 503) {
    return payload.error || "Payment is not configured on the server yet. Please call (203) 957-1006.";
  }
  if (res.status === 403) {
    return "Checkout blocked for this site origin. Try the official site URL or call (203) 957-1006.";
  }
  return payload.error || `Checkout could not start (error ${res.status}). Refresh and try again.`;
}

export function resetSquareCheckoutCache() {
  configPromise = null;
  sdkPromise = null;
  sdkUrl = null;
}

export async function fetchCheckoutConfig({ fresh = false } = {}) {
  if (fresh) {
    resetSquareCheckoutCache();
  }

  if (!configPromise) {
    configPromise = fetch("/api/checkout/config", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
      .then(async (res) => {
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(checkoutConfigError(res, payload));
        }
        if (!payload.applicationId || !payload.locationId) {
          throw new Error("Payment configuration is incomplete. Please call (203) 957-1006.");
        }
        return payload;
      })
      .catch((err) => {
        configPromise = null;
        throw err;
      });
  }

  return configPromise;
}

export function loadSquareSdk(webSdkUrl) {
  if (typeof window !== "undefined" && window.Square) {
    return Promise.resolve(window.Square);
  }

  if (sdkPromise && sdkUrl === webSdkUrl) {
    return sdkPromise;
  }

  sdkUrl = webSdkUrl;
  sdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${webSdkUrl}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Square), { once: true });
      existing.addEventListener(
        "error",
        () => {
          sdkPromise = null;
          reject(new Error("Square payment script could not load. Disable ad blockers and refresh."));
        },
        { once: true },
      );
      if (window.Square) resolve(window.Square);
      return;
    }

    const script = document.createElement("script");
    script.src = webSdkUrl;
    script.async = true;
    script.onload = () => resolve(window.Square);
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error("Square payment script could not load. Disable ad blockers and refresh."));
    };
    document.head.appendChild(script);
  });

  return sdkPromise;
}

const SQUARE_CARD_STYLE = {
  input: {
    backgroundColor: "#ffffff",
    color: "#0f2d4d",
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
    fontSize: "16px",
  },
  "input::placeholder": {
    color: "#8a97a3",
  },
  "input.is-focus": {
    color: "#0f2d4d",
  },
  ".input-container": {
    borderColor: "rgba(15, 45, 77, 0.22)",
    borderRadius: "8px",
  },
  ".input-container.is-focus": {
    borderColor: "#2165b4",
  },
  ".input-container.is-error": {
    borderColor: "#8a2f2f",
  },
  ".message-text.is-error": {
    color: "#8a2f2f",
  },
};

function formatSquareInitError(err, config) {
  const message = String(err?.message || err || "Could not load payment form");
  const lower = message.toLowerCase();

  if (lower.includes("domain") || lower.includes("not authorized") || lower.includes("application id")) {
    return `Payment form blocked for this website. Add ${window.location.host} in the Square Developer dashboard, or call (203) 957-1006.`;
  }

  if (lower.includes("location")) {
    return "Square location is not configured for payments. Please call (203) 957-1006.";
  }

  if (config?.environment === "sandbox" && !lower.includes("sandbox")) {
    return `${message} (sandbox mode)`;
  }

  return message;
}

export async function initSquareCard(containerId, { fresh = false } = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error("Payment form is not ready yet. Please wait a moment and try again.");
  }

  const config = await fetchCheckoutConfig({ fresh });
  const Square = await loadSquareSdk(config.webSdkUrl);

  if (!Square?.payments) {
    throw new Error("Square payment library did not initialize. Refresh and try again.");
  }

  try {
    const payments = Square.payments(config.applicationId, config.locationId);
    const card = await payments.card({ style: SQUARE_CARD_STYLE });
    await card.attach(`#${containerId}`);
    return { card, config };
  } catch (err) {
    throw new Error(formatSquareInitError(err, config));
  }
}

export function formatCents(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    (cents ?? 0) / 100,
  );
}

export async function validatePromoCode({ promoCode, subtotalCents }) {
  const res = await fetch("/api/checkout/validate-promo", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ promoCode, subtotalCents }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Promo code is not valid");
  return data;
}

export async function prepareCheckout(payload) {
  const res = await fetch("/api/checkout/prepare", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not start checkout");
  return data;
}

export async function completeCheckout({ holdId, sourceId }) {
  const res = await fetch("/api/checkout/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ holdId, sourceId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Payment failed");
  return { order: data.order, emailSent: Boolean(data.emailSent) };
}

export async function lookupOrder(email, confirmationCode) {
  const res = await fetch("/api/orders/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, confirmationCode }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Order not found");
  return data.order;
}

export async function resendOrderEmail(email, confirmationCode) {
  const res = await fetch("/api/orders/resend", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, confirmationCode }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not resend email");
  return data;
}

export async function fetchTicketingAdminOrders({ token, q = "", limit = 50 }) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (q) params.set("q", q);
  const res = await fetch(`/api/ticketing/admin?${params}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not load orders");
  return data.orders ?? [];
}

export async function refundTicketingOrder({ token, orderId, amountCents, reason }) {
  const res = await fetch("/api/ticketing/admin/refund", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId, amountCents, reason }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Refund failed");
  return data.order;
}

export function ticketingAdminExportUrl(token, q = "") {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  const query = params.toString();
  return `/api/ticketing/admin/export${query ? `?${query}` : ""}`;
}
