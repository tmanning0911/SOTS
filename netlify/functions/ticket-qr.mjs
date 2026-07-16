import { jsonResponse } from "./lib/cors.mjs";
import { qrPngBuffer } from "./lib/qr.mjs";

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "GET, OPTIONS" });
  }
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "GET, OPTIONS" });
  }

  const data = String(event.queryStringParameters?.data ?? "").trim().slice(0, 120);
  if (!data) {
    return jsonResponse(400, { error: "Missing data parameter" }, event, { methods: "GET, OPTIONS" });
  }

  const { headers, allowed, origin } = (await import("./lib/cors.mjs")).corsHeaders(event, {
    methods: "GET, OPTIONS",
  });
  if (!allowed && origin) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: "Origin not allowed" }) };
  }

  const png = await qrPngBuffer(data, { width: 296, margin: 2 });

  return {
    statusCode: 200,
    headers: {
      ...headers,
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    body: png.toString("base64"),
    isBase64Encoded: true,
  };
}
