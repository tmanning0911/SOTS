import crypto from "node:crypto";
import { jsonResponse } from "./lib/cors.mjs";
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

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "POST, OPTIONS" });
  }
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "POST, OPTIONS" });
  }

  const body = event.body || "";
  const signature = event.headers?.["x-square-hmacsha256-signature"] || "";
  const url = process.env.URL ? `${process.env.URL}/api/webhooks/square` : "";
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

  if (type === "payment.updated" && payment?.id) {
    try {
      const latest = await getSquarePayment(payment.id);
      const referenceId = latest?.reference_id;
      if (referenceId?.startsWith("hold_")) {
        console.log("square-webhook payment for hold", referenceId, latest.status);
      } else if (referenceId) {
        const order = await getOrderById(referenceId);
        if (order && latest.status === "FAILED") {
          console.warn("square-webhook failed payment for order", order.id);
        }
      }
    } catch (err) {
      console.error("square-webhook payment lookup failed:", err);
    }
  }

  return jsonResponse(200, { ok: true }, event, { methods: "POST, OPTIONS" });
}
