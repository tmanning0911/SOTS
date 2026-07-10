import { jsonResponse } from "./lib/cors.mjs";
import { getClientIp, rateLimit } from "./lib/rateLimit.mjs";
import { lookupOrder, publicOrderView } from "./lib/ticketing-store.mjs";

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "POST, OPTIONS" });
  }
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "POST, OPTIONS" });
  }

  const ip = getClientIp(event);
  if (!rateLimit(`orders-lookup:${ip}`, { max: 15, windowMs: 900_000 })) {
    return jsonResponse(429, { error: "Too many lookups. Please try again later." }, event, {
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

  return jsonResponse(
    200,
    { order: publicOrderView(order) },
    event,
    { methods: "POST, OPTIONS" },
  );
}
