import { jsonResponse } from "./lib/cors.mjs";
import { getClientIp, rateLimit } from "./lib/rateLimit.mjs";
import { sendOrderConfirmationEmail } from "./lib/order-email.mjs";
import { lookupOrder } from "./lib/ticketing-store.mjs";

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "POST, OPTIONS" });
  }
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "POST, OPTIONS" });
  }

  const ip = getClientIp(event);
  if (!rateLimit(`orders-resend:${ip}`, { max: 6, windowMs: 900_000 })) {
    return jsonResponse(429, { error: "Too many requests. Please wait and try again." }, event, {
      methods: "POST, OPTIONS",
    });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid JSON" }, event, { methods: "POST, OPTIONS" });
  }

  const order = await lookupOrder(body.email, body.confirmationCode);
  if (!order) {
    return jsonResponse(404, { error: "No order found with that email and confirmation code." }, event, {
      methods: "POST, OPTIONS",
    });
  }

  try {
    const result = await sendOrderConfirmationEmail(order);
    if (!result.sent) {
      return jsonResponse(503, { error: "Email service is not configured yet." }, event, {
        methods: "POST, OPTIONS",
      });
    }
    return jsonResponse(200, { ok: true, emailSent: true }, event, { methods: "POST, OPTIONS" });
  } catch (err) {
    console.error("orders-resend:", err);
    return jsonResponse(500, { error: "Could not resend confirmation email." }, event, {
      methods: "POST, OPTIONS",
    });
  }
}
