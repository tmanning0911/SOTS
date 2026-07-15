#!/usr/bin/env node
/**
 * Create Square Payment Links for gift shop SKUs and write URLs into js/shop-catalog.js.
 *
 * Usage:
 *   node scripts/create-shop-payment-links.mjs
 *   node scripts/create-shop-payment-links.mjs --check
 */
import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SHOP_PRODUCTS } from "../js/shop-catalog.js";
import {
  getSquareCredentials,
  resolveLocationId,
  squareEnvironment,
  squareRequest,
} from "../netlify/functions/lib/square.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "js/shop-catalog.js");
const shopJsonPath = path.join(root, "public/data/shop.json");
const siteUrl = (process.env.VITE_SITE_URL || "https://www.shakespeareonthesound.org").replace(/\/$/, "");
const redirectUrl = `${siteUrl}/shop/?thanks=1`;

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

function idempotencyKey(sku) {
  return `shop-2026-${sku}-${randomBytes(8).toString("hex")}`;
}

async function createLink(product, locationId) {
  const data = await squareRequest("/v2/online-checkout/payment-links", {
    method: "POST",
    body: {
      idempotency_key: idempotencyKey(product.sku),
      description: `SOTS Gift Shop · ${product.sku}`,
      payment_note: `Gift Shop · ${product.name}`,
      quick_pay: {
        name: product.name,
        location_id: locationId,
        price_money: {
          amount: product.price.value,
          currency: product.price.currency || "USD",
        },
      },
      checkout_options: {
        redirect_url: redirectUrl,
        merchant_support_email: "contactus@shakespeareonthesound.org",
        ask_for_shipping_address: !product.digital,
      },
    },
  });

  const link = data.payment_link;
  const url = link?.url || link?.long_url;
  if (!url) throw new Error(`No URL returned for ${product.sku}`);
  return { sku: product.sku, url, squareId: link.id };
}

function applyUrlsToSource(source, urlBySku) {
  let next = source;
  for (const [sku, url] of Object.entries(urlBySku)) {
    const pattern = new RegExp(`(sku:\\s*"${sku}"[\\s\\S]*?paymentLink:\\s*")[^"]*(")`, "m");
    if (!pattern.test(next)) {
      throw new Error(`Could not find paymentLink field for sku "${sku}" in shop-catalog.js`);
    }
    next = next.replace(pattern, `$1${url}$2`);
  }
  return next;
}

async function patchShopJson(urlBySku) {
  try {
    const raw = await readFile(shopJsonPath, "utf8");
    const data = JSON.parse(raw);
    if (!Array.isArray(data.products)) return;
    for (const product of data.products) {
      const url = urlBySku[product.sku];
      if (url) product.paymentLink = url;
    }
    await writeFile(shopJsonPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    console.log(`Updated ${path.relative(root, shopJsonPath)}`);
  } catch {
    /* shop.json optional */
  }
}

async function main() {
  await loadDotEnv();
  const checkOnly = process.argv.includes("--check");

  if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_APPLICATION_ID) {
    console.error("Missing Square credentials. Set SQUARE_ACCESS_TOKEN and SQUARE_APPLICATION_ID.");
    process.exit(1);
  }

  getSquareCredentials();
  const env = squareEnvironment();
  const locationId = await resolveLocationId();
  const products = SHOP_PRODUCTS.filter((p) => p.onSale !== false);

  console.log(`Square environment: ${env}`);
  console.log(`Location: ${locationId}`);
  console.log(`Products: ${products.length}`);

  if (checkOnly) {
    const missing = products.filter((p) => !p.paymentLink?.trim());
    console.log(missing.length ? `Missing links: ${missing.map((p) => p.sku).join(", ")}` : "All products have payment links.");
    process.exit(missing.length ? 1 : 0);
  }

  const urlBySku = {};
  for (const product of products) {
    if (product.paymentLink?.trim()) {
      console.log(`skip ${product.sku} (already set)`);
      urlBySku[product.sku] = product.paymentLink.trim();
      continue;
    }
    process.stdout.write(`create ${product.sku} ($${product.price.value / 100}) … `);
    const created = await createLink(product, locationId);
    urlBySku[product.sku] = created.url;
    console.log(created.url);
  }

  const source = await readFile(configPath, "utf8");
  const updated = applyUrlsToSource(source, urlBySku);
  await writeFile(configPath, updated, "utf8");
  console.log(`Updated ${path.relative(root, configPath)}`);
  await patchShopJson(urlBySku);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
