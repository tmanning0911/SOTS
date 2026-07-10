#!/usr/bin/env node
/**
 * Push TEST gift-shop items (with photos) into Square Catalog.
 * Requires SQUARE_ACCESS_TOKEN + SQUARE_APPLICATION_ID in env or .env.
 *
 * Usage:
 *   node scripts/seed-square-test-data.mjs
 *   SITE_URL=https://ubiquitous-maamoul-8b9b7f.netlify.app node scripts/seed-square-test-data.mjs
 */
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PREVIEW_SITE_URL } from "./lib/site-domains.mjs";
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

function absImageUrl(siteUrl, imagePath) {
  const base = siteUrl.replace(/\/$/, "");
  const rel = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${base}${rel}`;
}

const TEST_CATEGORIES = [
  { tempId: "#cat-apparel", name: "TEST — Apparel" },
  { tempId: "#cat-gifts", name: "TEST — Gifts & Souvenirs" },
  { tempId: "#cat-gc", name: "TEST — Gift Certificates" },
  { tempId: "#cat-books", name: "TEST — Books & Playbills" },
  { tempId: "#cat-tickets", name: "TEST — Event Tickets" },
];

const TEST_PRODUCTS = [
  {
    tempId: "#item-tee",
    categoryTempId: "#cat-apparel",
    name: "TEST — SOS Logo T-Shirt",
    description: "Soft cotton tee with the Shakespeare on the Sound logo. Unisex fit.",
    sku: "TEST-SOTS-TEE",
    priceCents: 2800,
    image: "/images/hero-much-ado.jpg",
  },
  {
    tempId: "#item-tote",
    categoryTempId: "#cat-gifts",
    name: "TEST — Canvas Tote Bag",
    description: "Sturdy tote for picnics at Pinkney Park.",
    sku: "TEST-SOTS-TOTE",
    priceCents: 2200,
    image: "/images/news/kids-kings.jpg",
  },
  {
    tempId: "#item-pin",
    categoryTempId: "#cat-gifts",
    name: "TEST — Enamel Pin",
    description: "Much Ado About Nothing collectible pin.",
    sku: "TEST-SOTS-PIN",
    priceCents: 1500,
    image: "/images/decor/shakespeare-portrait.png",
  },
  {
    tempId: "#item-playbill",
    categoryTempId: "#cat-books",
    name: "TEST — Much Ado Playbill",
    description: "Collectible program from the 2026 summer production.",
    sku: "TEST-PLAYBILL-2026",
    priceCents: 800,
    image: "/images/news/season-maan-banner.jpg",
  },
  {
    tempId: "#item-gift-50",
    categoryTempId: "#cat-gc",
    name: "TEST — Gift Certificate $50",
    description: "Redeemable for any Shakespeare on the Sound performance.",
    sku: "TEST-GIFT-50",
    priceCents: 5000,
    image: "/images/backgrounds/park-audience-nyt.jpg",
  },
  {
    tempId: "#item-gift-100",
    categoryTempId: "#cat-gc",
    name: "TEST — Gift Certificate $100",
    description: "Redeemable for any Shakespeare on the Sound performance.",
    sku: "TEST-GIFT-100",
    priceCents: 10000,
    image: "/images/backgrounds/park-audience-nyt.jpg",
  },
  {
    tempId: "#item-ga",
    categoryTempId: "#cat-tickets",
    name: "TEST — General Admission Ticket",
    description: "Website checkout uses the ticketing catalog — this item is for Square reporting only.",
    sku: "TEST-TIX-GA",
    priceCents: 2500,
    image: "/images/hero-much-ado.jpg",
  },
  {
    tempId: "#item-vip",
    categoryTempId: "#cat-tickets",
    name: "TEST — VIP Reserved Seating",
    description: "Website checkout uses the ticketing catalog — this item is for Square reporting only.",
    sku: "TEST-TIX-VIP",
    priceCents: 7500,
    image: "/images/hero-much-ado.jpg",
  },
];

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

function catalogObjectForItem(product, locationId) {
  const variationTempId = buildVariationTempId(product.tempId);
  return {
    type: "ITEM",
    id: product.tempId,
    item_data: {
      name: product.name,
      description: product.description,
      description_plaintext: product.description,
      category_id: product.categoryTempId,
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

async function batchUpsert(objects) {
  const data = await squareRequest("/v2/catalog/batch-upsert", {
    method: "POST",
    body: {
      idempotency_key: idempotencyKey(),
      batches: [{ objects }],
    },
  });
  return data;
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

async function listExistingTestItems() {
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
      if (sku?.startsWith("TEST-")) {
        bySku.set(sku, {
          itemId: item.id,
          name: item.item_data?.name ?? sku,
          hasImage: Boolean(item.item_data?.image_ids?.length),
        });
      }
    }
  }
  return bySku;
}

async function main() {
  await loadDotEnv();

  if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_APPLICATION_ID) {
    console.error("Missing Square credentials. Set SQUARE_ACCESS_TOKEN and SQUARE_APPLICATION_ID.");
    process.exit(1);
  }

  const locationId = await resolveLocationId();
  const existingItems = await listExistingTestItems();
  const imagesOnly = process.argv.includes("--images-only");

  const categories = TEST_CATEGORIES.map(catalogObjectForCategory);
  const productsToCreate = TEST_PRODUCTS.filter((p) => !existingItems.has(p.sku));

  if (!productsToCreate.length && !imagesOnly) {
    console.log("All TEST catalog items already exist in Square — attaching any missing photos.");
  }

  if (productsToCreate.length) {
    console.log(`Square environment: ${process.env.SQUARE_ENVIRONMENT || "sandbox"}`);
    console.log(`Location: ${locationId}`);
    console.log(`Creating ${productsToCreate.length} new TEST item(s)...`);

    const objects = [
      ...categories,
      ...productsToCreate.map((product) => catalogObjectForItem(product, locationId)),
    ];

    const result = await batchUpsert(objects);
    const idMap = mapUpsertedIds(result.id_mappings);

    for (const product of productsToCreate) {
      const itemId = idMap.get(product.tempId);
      if (!itemId) {
        console.warn(`  ! Could not resolve item id for ${product.sku}`);
        continue;
      }
      existingItems.set(product.sku, { itemId, name: product.name, hasImage: false });
    }
  }

  const productsForImages = TEST_PRODUCTS.filter((product) => {
    const existing = existingItems.get(product.sku);
    return existing && (!existing.hasImage || imagesOnly || productsToCreate.some((p) => p.sku === product.sku));
  });

  console.log(`Uploading photos for ${productsForImages.length} item(s)...`);

  for (const product of productsForImages) {
    const existing = existingItems.get(product.sku);
    if (!existing?.itemId) continue;
    try {
      await attachImage({ itemId: existing.itemId, imagePath: product.image, caption: product.name });
      console.log(`  ✓ ${product.name} (${product.sku}) + photo`);
    } catch (err) {
      console.warn(`  ! ${product.name} photo failed: ${err.message}`);
    }
  }

  console.log("\nDone. Open Square Dashboard → Items to review TEST — items.");
  console.log("Then run: npm run seed:shop   (pulls live catalog into shop.json)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
