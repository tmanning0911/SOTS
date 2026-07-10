import { jsonResponse } from "./lib/cors.mjs";
import { getClientIp, rateLimit } from "./lib/rateLimit.mjs";
import { calculateDiscountCents, validatePromo } from "./lib/promo.mjs";

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "POST, OPTIONS" });
  }
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "POST, OPTIONS" });
  }

  const ip = getClientIp(event);
  if (!rateLimit(`checkout-promo:${ip}`, { max: 40, windowMs: 900_000 })) {
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

  const subtotalCents = Number(body.subtotalCents ?? 0);
  if (!Number.isFinite(subtotalCents) || subtotalCents < 100) {
    return jsonResponse(400, { error: "Select tickets before applying a promo code" }, event, {
      methods: "POST, OPTIONS",
    });
  }

  const promo = await validatePromo(body.promoCode);
  if (!promo) {
    return jsonResponse(400, { error: "Promo code is not valid" }, event, { methods: "POST, OPTIONS" });
  }

  const discountCents = calculateDiscountCents(subtotalCents, promo);
  return jsonResponse(
    200,
    {
      promoCode: promo.code,
      description: promo.description ?? null,
      discountCents,
    },
    event,
    { methods: "POST, OPTIONS" },
  );
}
