import { readFile } from "node:fs/promises";
import path from "node:path";
import { PREVIEW_SITE_URL, PRODUCTION_SITE_URL } from "../../scripts/lib/site-domains.mjs";
import { corsHeaders, jsonResponse } from "./lib/cors.mjs";
import {
  getInventoryMap,
  mergeCatalogWithInventory,
  readCatalog,
} from "./lib/ticketing-store.mjs";

const STATIC_CANDIDATES = [
  path.join(process.cwd(), "dist", "data", "ticketing.json"),
  path.join(process.cwd(), "public", "data", "ticketing.json"),
];

function siteDataUrls() {
  const urls = new Set([
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.DEPLOY_URL,
    PRODUCTION_SITE_URL,
    PREVIEW_SITE_URL,
  ]);
  return [...urls]
    .filter(Boolean)
    .map((base) => `${String(base).replace(/\/$/, "")}/data/ticketing.json`);
}

async function readStaticCatalog() {
  const fromLib = await readCatalog();
  if (fromLib) return fromLib;

  for (const filePath of STATIC_CANDIDATES) {
    try {
      return JSON.parse(await readFile(filePath, "utf8"));
    } catch {
      // next
    }
  }

  for (const url of siteDataUrls()) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) continue;
      return await res.json();
    } catch {
      // next
    }
  }

  return null;
}

export const handler = async (event) => {
  const { headers, allowed, origin } = corsHeaders(event, {
    methods: "GET, OPTIONS",
  });

  if (event.httpMethod === "OPTIONS") {
    if (!allowed && origin) return { statusCode: 403, headers };
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed" }, event);
  }

  try {
    const catalog = await readStaticCatalog();
    if (!catalog) {
      return jsonResponse(503, { error: "Ticket data unavailable" }, event);
    }

    const inventory = await getInventoryMap();
    const data = mergeCatalogWithInventory(catalog, inventory);

    const responseHeaders = {
      ...headers,
      "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
    };

    if (!allowed && origin) {
      return {
        statusCode: 403,
        headers: responseHeaders,
        body: JSON.stringify({ error: "Origin not allowed" }),
      };
    }

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("tickets handler failed:", err);
    return jsonResponse(500, { error: "Ticket data unavailable" }, event);
  }
};
