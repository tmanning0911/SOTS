import { randomBytes } from "node:crypto";
import { jsonResponse } from "./lib/cors.mjs";
import { getClientIp, rateLimit } from "./lib/rateLimit.mjs";
import { sendOrderConfirmationEmail } from "./lib/order-email.mjs";
import { createSquarePayment } from "./lib/square.mjs";
import { commitOrder, getHold, publicOrderView } from "./lib/ticketing-store.mjs";

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "POST, OPTIONS" });
  }
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "POST, OPTIONS" });
  }

  const ip = getClientIp(event);
  if (!rateLimit(`checkout-complete:${ip}`, { max: 20, windowMs: 900_000 })) {
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

  const holdId = String(body.holdId ?? "").trim();
  const sourceId = String(body.sourceId ?? "").trim();
  if (!holdId || !sourceId) {
    return jsonResponse(400, { error: "Missing payment details" }, event, { methods: "POST, OPTIONS" });
  }

  const hold = await getHold(holdId);
  if (!hold) {
    return jsonResponse(410, { error: "Your checkout session expired. Please start again." }, event, {
      methods: "POST, OPTIONS",
    });
  }

  try {
    const payment = await createSquarePayment({
      sourceId,
      amountCents: hold.totalCents,
      currency: hold.currency,
      idempotencyKey: randomBytes(16).toString("hex"),
      referenceId: holdId,
      note: `SOTS tickets — ${hold.performanceId}`,
      buyerEmail: hold.buyer.email,
    });

    if (payment.status !== "COMPLETED" && payment.status !== "APPROVED") {
      return jsonResponse(402, { error: "Payment was not completed. Please try again." }, event, {
        methods: "POST, OPTIONS",
      });
    }

    const order = await commitOrder({ hold, squarePaymentId: payment.id });

    let emailSent = false;
    try {
      const emailResult = await sendOrderConfirmationEmail(order);
      emailSent = Boolean(emailResult.sent);
    } catch (err) {
      console.error("order confirmation email failed:", err);
    }

    return jsonResponse(
      200,
      {
        ok: true,
        emailSent,
        order: publicOrderView(order),
      },
      event,
      { methods: "POST, OPTIONS" },
    );
  } catch (err) {
    console.error("checkout-complete:", err);
    return jsonResponse(402, { error: err.message || "Payment failed" }, event, { methods: "POST, OPTIONS" });
  }
}
