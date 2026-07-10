import { jsonResponse } from "./lib/cors.mjs";
import { publicSquareConfig, resolveLocationId } from "./lib/square.mjs";

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "GET, OPTIONS" });
  }
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "GET, OPTIONS" });
  }

  try {
    const config = publicSquareConfig();
    const locationId = await resolveLocationId();
    return jsonResponse(
      200,
      {
        ...config,
        locationId,
      },
      event,
      { methods: "GET, OPTIONS" },
    );
  } catch (err) {
    console.error("checkout-config:", err);
    return jsonResponse(503, { error: "Checkout is not configured yet" }, event, { methods: "GET, OPTIONS" });
  }
}
