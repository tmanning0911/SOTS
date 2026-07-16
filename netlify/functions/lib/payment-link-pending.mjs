import { randomBytes } from "node:crypto";
import { bindBlobs, blobStore, persistJson } from "./netlify-blobs.mjs";

const STORE_NAME = "sots-payment-links";
const PENDING_TTL_MS = 48 * 60 * 60 * 1000;

function store() {
  return blobStore(STORE_NAME);
}

/** Short id for Square order.reference_id (max 40 chars). */
export function newPendingId() {
  return `plink_${randomBytes(8).toString("hex")}`;
}

export async function savePaymentLinkPending(pending, event) {
  if (event) bindBlobs(event);
  const record = {
    ...pending,
    expiresAt: new Date(Date.now() + PENDING_TTL_MS).toISOString(),
    createdAt: pending.createdAt || new Date().toISOString(),
  };
  await persistJson(store(), `pending:${record.id}`, record, {
    metadata: { expiresAt: record.expiresAt },
  });
  if (record.squareOrderId) {
    await persistJson(store(), `pending-order:${record.squareOrderId}`, { pendingId: record.id });
  }
  if (record.paymentLinkId) {
    await persistJson(store(), `pending-link:${record.paymentLinkId}`, { pendingId: record.id });
  }
  return record;
}

export async function getPaymentLinkPending(pendingId, event) {
  if (!pendingId) return null;
  if (event) bindBlobs(event);
  try {
    const pending = await store().get(`pending:${pendingId}`, { type: "json" });
    if (!pending) return null;
    if (pending.expiresAt && new Date(pending.expiresAt).getTime() < Date.now()) return null;
    return pending;
  } catch {
    return null;
  }
}

export async function getPaymentLinkPendingBySquareOrder(squareOrderId, event) {
  if (!squareOrderId) return null;
  if (event) bindBlobs(event);
  try {
    const ref = await store().get(`pending-order:${squareOrderId}`, { type: "json" });
    return getPaymentLinkPending(ref?.pendingId, event);
  } catch {
    return null;
  }
}

export async function markPaymentLinkFulfilled({ pendingId, squarePaymentId, result }, event) {
  if (event) bindBlobs(event);
  const s = store();
  const payload = {
    pendingId: pendingId || null,
    squarePaymentId,
    result,
    fulfilledAt: new Date().toISOString(),
  };
  await persistJson(s, `fulfilled-payment:${squarePaymentId}`, payload);
  if (pendingId) {
    try {
      const pending = await s.get(`pending:${pendingId}`, { type: "json" });
      if (pending) {
        await persistJson(s, `pending:${pendingId}`, {
          ...pending,
          fulfilledAt: payload.fulfilledAt,
          squarePaymentId,
          result,
        });
      }
    } catch {
      /* optional */
    }
  }
  return payload;
}

export async function getPaymentLinkFulfillment(squarePaymentId, event) {
  if (!squarePaymentId) return null;
  if (event) bindBlobs(event);
  try {
    return (await store().get(`fulfilled-payment:${squarePaymentId}`, { type: "json" })) ?? null;
  } catch {
    return null;
  }
}
