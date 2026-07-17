import { randomBytes } from "node:crypto";
import { jsonResponse } from "./lib/cors.mjs";
import { bindBlobs } from "./lib/netlify-blobs.mjs";
import { syncPatronToCrm } from "./lib/crm-sync.mjs";
import { getClientIp, rateLimit } from "./lib/rateLimit.mjs";
import { sendOrderConfirmationEmail } from "./lib/order-email.mjs";
import { upsertPatronProfile } from "./lib/patron-profile.mjs";
import { createSquareOrderAndPay, createSquarePayment, resolveLocationId } from "./lib/square.mjs";
import {
  buildSquareTicketOrderPayload,
  canBuildSquareTicketOrder,
  SQUARE_TICKET_CATALOG_FILENAME,
} from "./lib/square-ticket-catalog.mjs";
import { readStaticJsonCatalog } from "./lib/static-catalog.mjs";
import {
  commitOrder,
  getHold,
  getPerformance,
  publicOrderView,
  readCatalog,
} from "./lib/ticketing-store.mjs";

export async function handler(event) {
  bindBlobs(event);
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
  if (!holdId) {
    return jsonResponse(400, { error: "Missing payment details" }, event, { methods: "POST, OPTIONS" });
  }

  const hold = await getHold(holdId);
  if (!hold) {
    return jsonResponse(410, { error: "Your checkout session expired. Please start again." }, event, {
      methods: "POST, OPTIONS",
    });
  }

  const isComp = Number(hold.totalCents) === 0;
  if (!isComp && !sourceId) {
    return jsonResponse(400, { error: "Missing payment details" }, event, { methods: "POST, OPTIONS" });
  }

  try {
    const catalog = await readCatalog();
    const performance = getPerformance(catalog, hold.performanceId);
    const productionTitle = catalog?.production?.title ?? catalog?.featuredTicket?.name ?? "SOTS tickets";
    const performanceStart = performance?.start ?? hold.performanceLabel;
    const note = `SOTS tickets — ${productionTitle} — ${performanceStart}`;

    let payment = null;
    let squareOrderId = null;

    if (isComp) {
      payment = {
        id: `comp:${hold.promoCode || "FREE"}:${holdId}`,
        status: "COMPLETED",
      };
    } else {
      const squareCatalog = await readStaticJsonCatalog(SQUARE_TICKET_CATALOG_FILENAME);

      if (canBuildSquareTicketOrder(hold, squareCatalog)) {
        const locationId = await resolveLocationId();
        const orderPayload = buildSquareTicketOrderPayload({
          hold,
          catalogMapping: squareCatalog,
          productionTitle,
          performanceStart,
          locationId,
        });
        const keys = randomBytes(16);
        const result = await createSquareOrderAndPay({
          sourceId,
          order: orderPayload,
          amountCents: hold.totalCents,
          currency: hold.currency,
          orderIdempotencyKey: `${keys.toString("hex")}-order`,
          paymentIdempotencyKey: randomBytes(16).toString("hex"),
          referenceId: holdId,
          note,
          buyerEmail: hold.buyer.email,
        });
        payment = result.payment;
        squareOrderId = result.order?.id ?? null;
      } else {
        payment = await createSquarePayment({
          sourceId,
          amountCents: hold.totalCents,
          currency: hold.currency,
          idempotencyKey: randomBytes(16).toString("hex"),
          referenceId: holdId,
          note,
          buyerEmail: hold.buyer.email,
        });
      }

      if (payment.status !== "COMPLETED" && payment.status !== "APPROVED") {
        return jsonResponse(402, { error: "Payment was not completed. Please try again." }, event, {
          methods: "POST, OPTIONS",
        });
      }
    }

    const order = await commitOrder({ hold, squarePaymentId: payment.id, squareOrderId });

    let emailSent = false;
    try {
      const emailResult = await sendOrderConfirmationEmail(order);
      emailSent = Boolean(emailResult.sent);
    } catch (err) {
      console.error("order confirmation email failed:", err);
    }

    try {
      const profile = await upsertPatronProfile(
        order.buyer.email,
        {
          name: order.buyer.name,
          phone: order.buyer.phone,
          marketingOptIn: Boolean(order.buyer.marketingOptIn),
        },
        { source: "checkout", overwrite: false },
      );
      syncPatronToCrm(event, profile, {
        event: "patron.ticket_purchase",
        source: "checkout",
        order,
      }).catch((err) => console.error("checkout CRM sync:", err));
    } catch (err) {
      console.error("checkout patron profile upsert failed:", err);
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
