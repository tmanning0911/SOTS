const SQUARE_VERSION = "2024-11-20";

export function squareEnvironment() {
  const explicit = (process.env.SQUARE_ENVIRONMENT || "").toLowerCase();
  if (explicit === "production" || explicit === "sandbox") {
    return explicit;
  }
  // Netlify production deploys should use live Square unless overridden.
  if ((process.env.CONTEXT || "").toLowerCase() === "production") {
    return "production";
  }
  return "sandbox";
}

export function squareBaseUrl() {
  return squareEnvironment() === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

export function squareWebSdkUrl() {
  return squareEnvironment() === "production"
    ? "https://web.squarecdn.com/v1/square.js"
    : "https://sandbox.web.squarecdn.com/v1/square.js";
}

export function getSquareCredentials() {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const applicationId = process.env.SQUARE_APPLICATION_ID;
  const locationId = process.env.SQUARE_LOCATION_ID;
  if (!accessToken || !applicationId) {
    throw new Error("Square credentials not configured (SQUARE_ACCESS_TOKEN, SQUARE_APPLICATION_ID)");
  }
  return { accessToken, applicationId, locationId };
}

export async function squareRequest(pathname, { method = "GET", body } = {}) {
  const { accessToken } = getSquareCredentials();
  const res = await fetch(`${squareBaseUrl()}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data?.errors?.[0]?.detail || data?.errors?.[0]?.code || res.statusText;
    throw new Error(detail || "Square API request failed");
  }
  return data;
}

let cachedLocationId = null;

export async function resolveLocationId() {
  const { locationId } = getSquareCredentials();
  if (locationId) return locationId;
  if (cachedLocationId) return cachedLocationId;
  const data = await squareRequest("/v2/locations");
  const active = (data.locations ?? []).find((l) => l.status === "ACTIVE") ?? data.locations?.[0];
  if (!active?.id) throw new Error("No Square location found for this account");
  cachedLocationId = active.id;
  return cachedLocationId;
}

export async function createSquarePayment({
  sourceId,
  amountCents,
  currency = "USD",
  idempotencyKey,
  referenceId,
  note,
  buyerEmail,
  orderId,
}) {
  const locationId = await resolveLocationId();
  const payload = {
    idempotency_key: idempotencyKey,
    source_id: sourceId,
    amount_money: { amount: amountCents, currency },
    location_id: locationId,
    reference_id: referenceId,
    note,
  };
  if (orderId) {
    payload.order_id = orderId;
  }
  if (buyerEmail) {
    payload.buyer_email_address = buyerEmail;
  }
  const data = await squareRequest("/v2/payments", { method: "POST", body: payload });
  return data.payment;
}

export async function createSquareOrder({ order, idempotencyKey }) {
  const data = await squareRequest("/v2/orders", {
    method: "POST",
    body: {
      idempotency_key: idempotencyKey,
      order,
    },
  });
  return data.order;
}

export async function createSquareOrderAndPay({
  sourceId,
  order,
  amountCents,
  currency = "USD",
  orderIdempotencyKey,
  paymentIdempotencyKey,
  referenceId,
  note,
  buyerEmail,
}) {
  const squareOrder = await createSquareOrder({
    order,
    idempotencyKey: orderIdempotencyKey,
  });
  const payment = await createSquarePayment({
    sourceId,
    amountCents,
    currency,
    idempotencyKey: paymentIdempotencyKey,
    referenceId,
    note,
    buyerEmail,
    orderId: squareOrder.id,
  });
  return { order: squareOrder, payment };
}

export async function refundSquarePayment({ paymentId, amountCents, currency = "USD", idempotencyKey, reason }) {
  const payload = {
    idempotency_key: idempotencyKey,
    payment_id: paymentId,
    amount_money: { amount: amountCents, currency },
    reason,
  };
  const data = await squareRequest("/v2/refunds", { method: "POST", body: payload });
  return data.refund;
}

export async function getSquarePayment(paymentId) {
  const data = await squareRequest(`/v2/payments/${paymentId}`);
  return data.payment;
}

export function publicSquareConfig() {
  const { applicationId } = getSquareCredentials();
  return {
    applicationId,
    environment: squareEnvironment(),
    webSdkUrl: squareWebSdkUrl(),
  };
}
