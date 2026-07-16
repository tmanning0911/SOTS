import crypto from "node:crypto";
import { jsonResponse } from "./lib/cors.mjs";
import { bindBlobs } from "./lib/netlify-blobs.mjs";
import { fulfillPaymentLinkPayment } from "./lib/payment-link-fulfill.mjs";
import { getSquarePayment } from "./lib/square.mjs";
import { getOrderById } from "./lib/ticketing-store.mjs";

function verifySquareSignature(body, signature, url) {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY?.trim();
  if (!key || !signature) return !key;
  const payload = url + body;
  const digest = crypto.createHmac("sha256", key).update(payload).digest("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

function webhookUrl(event) {
  const configured = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL?.trim();
  if (configured) return configured;
  const site =
    process.env.URL?.replace(/\/$/, "") ||
    process.env.DEPLOY_PRIME_URL?.replace(/\/$/, "") ||
    process.env.VITE_SITE_URL?.replace(/\/$/, "");
  if (site) return `${site}/api/webhooks/square`;
  const host = event.headers?.host || event.headers?.Host;
  if (host) {
    const proto = event.headers?.["x-forwarded-proto"] || "https";
    return `${proto}://${host}/api/webhooks/square`;
  }
  return "";
}

export async function handler(event) {
  bindBlobs(event);
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "POST, OPTIONS" });
  }
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "POST, OPTIONS" });
  }

  const body = event.body || "";
  const signature = event.headers?.["x-square-hmacsha256-signature"] || "";
  const url = webhookUrl(event);
  if (process.env.SQUARE_WEBHOOK_SIGNATURE_KEY && !verifySquareSignature(body, signature, url)) {
    return jsonResponse(401, { error: "Invalid signature" }, event, { methods: "POST, OPTIONS" });
  }

  let payload;
  try {
    payload = JSON.parse(body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid JSON" }, event, { methods: "POST, OPTIONS" });
  }

  const type = payload?.type;
  const payment = payload?.data?.object?.payment;

  if ((type === "payment.updated" || type === "payment.created") && payment?.id) {
    try {
      const latest = await getSquarePayment(payment.id);
      const referenceId = String(latest?.reference_id || "");

      // On-site Web Payments SDK checkouts — leave inventory/email to *-checkout-complete.
      const isOnSiteHold =
        referenceId.startsWith("hold_") || referenceId.startsWith("shop_hold_");
      if (isOnSiteHold) {
        console.log("square-webhook on-site hold payment", referenceId, latest.status);
        if (latest.status === "FAILED") {
          console.warn("square-webhook failed payment for hold", referenceId);
        }
      } else if (latest.status === "COMPLETED" || latest.status === "APPROVED") {
        const result = await fulfillPaymentLinkPayment(latest, event);
        console.log("square-webhook fulfill", payment.id, result);
      } else if (referenceId && latest.status === "FAILED") {
        const order = await getOrderById(referenceId);
        if (order) console.warn("square-webhook failed payment for order", order.id);
      }
    } catch (err) {
      console.error("square-webhook payment handling failed:", err);
      // Still 200 so Square does not hammer retries forever on code bugs;
      // resend path / logging covers ops recovery.
    }
  }

  return jsonResponse(200, { ok: true }, event, { methods: "POST, OPTIONS" });
}
