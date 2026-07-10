import { jsonResponse } from "./lib/cors.mjs";
import { readShopCatalog } from "./lib/shop-store.mjs";

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "GET, OPTIONS" });
  }
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "GET, OPTIONS" });
  }

  const catalog = await readShopCatalog();
  if (!catalog) {
    return jsonResponse(503, { error: "Shop catalog unavailable" }, event, { methods: "GET, OPTIONS" });
  }

  return jsonResponse(200, catalog, event, { methods: "GET, OPTIONS" });
}
