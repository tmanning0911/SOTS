import { jsonResponse } from "./lib/cors.mjs";
import { bindBlobs } from "./lib/netlify-blobs.mjs";
import { getClientIp, rateLimit } from "./lib/rateLimit.mjs";
import { createShopHold } from "./lib/shop-store.mjs";

export async function handler(event) {
  bindBlobs(event);
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "POST, OPTIONS" });
  }
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "POST, OPTIONS" });
  }

  const ip = getClientIp(event);
  if (!rateLimit(`shop-prepare:${ip}`, { max: 30, windowMs: 900_000 })) {
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
    const hold = await createShopHold({
      items: Array.isArray(body.items) ? body.items : [],
      buyer: body.buyer ?? {},
      fulfillment: body.fulfillment,
      note: body.note,
    });

    return jsonResponse(
      200,
      {
        holdId: hold.id,
        expiresAt: hold.expiresAt,
        lineItems: hold.lineItems,
        totalCents: hold.totalCents,
        currency: hold.currency,
        fulfillment: hold.fulfillment,
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
