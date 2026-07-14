import { jsonResponse } from "./lib/cors.mjs";
import { bindBlobs } from "./lib/netlify-blobs.mjs";
import { getClientIp, rateLimit } from "./lib/rateLimit.mjs";
import { createHold } from "./lib/ticketing-store.mjs";

export async function handler(event) {
  bindBlobs(event);
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "POST, OPTIONS" });
  }
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "POST, OPTIONS" });
  }

  const ip = getClientIp(event);
  if (!rateLimit(`checkout-prepare:${ip}`, { max: 30, windowMs: 900_000 })) {
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

  try {
    const hold = await createHold({
      performanceId: body.performanceId,
      items: Array.isArray(body.items) ? body.items : [],
      buyer: body.buyer ?? {},
      promoCode: body.promoCode,
      donationCents: body.donationCents,
      shopItems: Array.isArray(body.shopItems) ? body.shopItems : [],
    });

    return jsonResponse(
      200,
      {
        holdId: hold.id,
        expiresAt: hold.expiresAt,
        lineItems: hold.lineItems,
        shopLineItems: hold.shopLineItems ?? [],
        subtotalCents: hold.subtotalCents,
        discountCents: hold.discountCents,
        promoCode: hold.promoCode,
        donationCents: hold.donationCents,
        shopCents: hold.shopCents ?? 0,
        totalCents: hold.totalCents,
        currency: hold.currency,
        performanceId: hold.performanceId,
        performanceStart: hold.performanceLabel,
        buyer: hold.buyer,
      },
      event,
      { methods: "POST, OPTIONS" },
    );
  } catch (err) {
    return jsonResponse(400, { error: err.message || "Could not prepare checkout" }, event, {
      methods: "POST, OPTIONS",
    });
  }
}
