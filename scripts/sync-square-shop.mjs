#!/usr/bin/env node
/**
 * Push live gift-shop items into Square Catalog (replaces TEST items for production use).
 *
 * Usage:
 *   npm run sync:square-shop
 */
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SHOP_CATEGORIES, seedProductsForSquare } from "../js/shop-catalog.js";
import {
  getSquareCredentials,
  resolveLocationId,
  squareBaseUrl,
  squareRequest,
} from "../netlify/functions/lib/square.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadDotEnv() {
  try {
    const raw = await readFile(path.join(root, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    /* no .env */
  }
}

function idempotencyKey() {
  return randomBytes(16).toString("hex");
}

function buildVariationTempId(itemTempId) {
  return `${itemTempId}-var`;
}

function catalogObjectForCategory({ tempId, name }) {
  return {
    type: "CATEGORY",
    id: tempId,
    category_data: { name },
  };
}

function catalogObjectForItem(product, categoryId, locationId) {
  const variationTempId = buildVariationTempId(product.tempId);
  return {
    type: "ITEM",
    id: product.tempId,
    item_data: {
      name: product.name,
      description: product.description,
      description_plaintext: product.description,
      category_id: categoryId,
      present_at_all_locations: false,
      present_at_location_ids: [locationId],
      ecom_available: true,
      variations: [
        {
          type: "ITEM_VARIATION",
          id: variationTempId,
          item_variation_data: {
            item_id: product.tempId,
            name: "Regular",
            sku: product.sku,
            pricing_type: "FIXED_PRICING",
            price_money: { amount: product.priceCents, currency: "USD" },
            track_inventory: false,
            present_at_all_locations: false,
            present_at_location_ids: [locationId],
          },
        },
      ],
    },
  };
}

function catalogObjectForItemUpdate({ existing, product, categoryId, locationId }) {
  return {
    type: "ITEM",
    id: existing.itemId,
    item_data: {
      name: product.name,
      description: product.description,
      description_plaintext: product.description,
      category_id: categoryId,
      present_at_all_locations: false,
      present_at_location_ids: [locationId],
      ecom_available: true,
      variations: [
        {
          type: "ITEM_VARIATION",
          id: existing.variationId,
          item_variation_data: {
            item_id: existing.itemId,
            name: "Regular",
            sku: product.sku,
            pricing_type: "FIXED_PRICING",
            price_money: { amount: product.priceCents, currency: "USD" },
            track_inventory: false,
            present_at_all_locations: false,
            present_at_location_ids: [locationId],
          },
        },
      ],
    },
  };
}

async function batchUpsert(objects) {
  return squareRequest("/v2/catalog/batch-upsert", {
    method: "POST",
    body: {
      idempotency_key: idempotencyKey(),
      batches: [{ objects }],
    },
  });
}

function mapUpsertedIds(idMappings = []) {
  const map = new Map();
  for (const entry of idMappings) {
    if (entry.client_object_id && entry.object_id) {
      map.set(entry.client_object_id, entry.object_id);
    }
  }
  return map;
}

async function listCatalogBySku() {
  const locationId = await resolveLocationId();
  const data = await squareRequest("/v2/catalog/search-catalog-items", {
    method: "POST",
    body: {
      enabled_location_ids: [locationId],
      product_types: ["REGULAR"],
    },
  });

  const lookup = new Map();
  for (const obj of [...(data.items ?? []), ...(data.related_objects ?? [])]) {
    lookup.set(obj.id, obj);
  }

  const bySku = new Map();
  for (const item of data.items ?? []) {
    if (item.type !== "ITEM") continue;
    for (const varRef of item.item_data?.variations ?? []) {
      const variation = lookup.get(varRef.id);
      const sku = variation?.item_variation_data?.sku;
      if (!sku) continue;
      bySku.set(sku, {
        sku,
        itemId: item.id,
        variationId: variation.id,
        name: item.item_data?.name ?? sku,
        hasImage: Boolean(item.item_data?.image_ids?.length),
      });
    }
  }
  return bySku;
}

async function resolveCategoryIds() {
  const data = await squareRequest("/v2/catalog/list?types=CATEGORY");
  const byLabel = new Map();
  for (const obj of data.objects ?? []) {
    if (obj.type === "CATEGORY" && obj.category_data?.name) {
      byLabel.set(obj.category_data.name, obj.id);
    }
  }

  const map = new Map();
  const creates = [];
  for (const category of SHOP_CATEGORIES) {
    const existing = byLabel.get(category.label);
    if (existing) {
      map.set(category.label, existing);
      continue;
    }
    const tempId = `#shop-cat-${category.id}`;
    creates.push(catalogObjectForCategory({ tempId, name: category.label }));
    map.set(category.label, tempId);
  }

  if (creates.length) {
    const result = await batchUpsert(creates);
    const idMap = mapUpsertedIds(result.id_mappings);
    for (const category of SHOP_CATEGORIES) {
      const tempId = `#shop-cat-${category.id}`;
      if (map.get(category.label) === tempId) {
        map.set(category.label, idMap.get(tempId));
      }
    }
  }

  return map;
}

function localImagePath(imagePath) {
  const rel = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return path.join(root, "public", rel);
}

function mimeForPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".gif") return "image/gif";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

async function attachImage({ itemId, imagePath, caption }) {
  const filePath = localImagePath(imagePath);
  const fileBuffer = await readFile(filePath);
  const mime = mimeForPath(filePath);
  const { accessToken } = getSquareCredentials();

  const requestJson = JSON.stringify({
    idempotency_key: idempotencyKey(),
    object_id: itemId,
    image: {
      type: "IMAGE",
      id: `#img-${randomBytes(4).toString("hex")}`,
      image_data: {
        name: caption,
        caption,
      },
    },
    is_primary: true,
  });

  const form = new FormData();
  form.append("request", new Blob([requestJson], { type: "application/json" }));
  form.append("file", new Blob([fileBuffer], { type: mime }), path.basename(filePath));

  const res = await fetch(`${squareBaseUrl()}/v2/catalog/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Square-Version": "2024-11-20",
    },
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data?.errors?.[0]?.detail || data?.errors?.[0]?.code || res.statusText;
    throw new Error(detail || "Image upload failed");
  }
  return data;
}

async function main() {
  await loadDotEnv();

  if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_APPLICATION_ID) {
    console.error("Missing Square credentials. Set SQUARE_ACCESS_TOKEN and SQUARE_APPLICATION_ID.");
    process.exit(1);
  }

  const locationId = await resolveLocationId();
  const products = seedProductsForSquare();
  const categoryIds = await resolveCategoryIds();
  const existingBySku = await listCatalogBySku();

  const creates = [];
  const updates = [];

  for (const product of products) {
    const categoryId = categoryIds.get(product.categoryLabel);
    const existing = existingBySku.get(product.sku);
    if (existing?.itemId && existing?.variationId) {
      updates.push(catalogObjectForItemUpdate({ existing, product, categoryId, locationId }));
    } else {
      creates.push(catalogObjectForItem(product, categoryId, locationId));
    }
  }

  if (creates.length) {
    const result = await batchUpsert(creates);
    const idMap = mapUpsertedIds(result.id_mappings);
    for (const product of products) {
      if (existingBySku.has(product.sku)) continue;
      const itemId = idMap.get(product.tempId);
      if (itemId) {
        existingBySku.set(product.sku, {
          sku: product.sku,
          itemId,
          name: product.name,
          hasImage: false,
        });
      }
    }
    console.log(`Created ${creates.length} Square item(s).`);
  }

  if (updates.length) {
    await batchUpsert(updates);
    console.log(`Updated ${updates.length} Square item(s).`);
  }

  for (const product of products) {
    const existing = existingBySku.get(product.sku);
    if (!existing?.itemId || existing.hasImage) continue;
    try {
      await attachImage({ itemId: existing.itemId, imagePath: product.image, caption: product.name });
      console.log(`  ✓ Photo attached: ${product.name}`);
    } catch (err) {
      console.warn(`  ! Photo failed for ${product.name}: ${err.message}`);
    }
  }

  console.log("\nDone. Run npm run seed:shop to refresh public/data/shop.json from Square.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
