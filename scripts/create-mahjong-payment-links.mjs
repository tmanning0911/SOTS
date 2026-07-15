#!/usr/bin/env node
/**
 * Create Square Payment Links for Mahjong Night tiers and write URLs into js/mahjong-night.js.
 *
 * Usage:
 *   node scripts/create-mahjong-payment-links.mjs
 *   node scripts/create-mahjong-payment-links.mjs --check
 */
import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MAHJONG_NIGHT } from "../js/mahjong-night.js";
import {
  getSquareCredentials,
  resolveLocationId,
  squareEnvironment,
  squareRequest,
} from "../netlify/functions/lib/square.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "js/mahjong-night.js");
const siteUrl = (process.env.VITE_SITE_URL || "https://www.shakespeareonthesound.org").replace(/\/$/, "");
const redirectUrl = `${siteUrl}/events/mahjong-night/?thanks=1`;

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

function idempotencyKey(id) {
  return `mahjong-2026-${id}-${randomBytes(8).toString("hex")}`;
}

function allTiers() {
  return [
    ...MAHJONG_NIGHT.tickets.map((t) => ({ ...t, kind: "ticket" })),
    ...MAHJONG_NIGHT.sponsors.map((t) => ({ ...t, kind: "sponsor" })),
  ];
}

async function createLink(tier, locationId) {
  const name =
    tier.kind === "sponsor"
      ? `Mahjong Night — ${tier.name}`
      : `Mahjong Night — ${tier.name}`;

  const data = await squareRequest("/v2/online-checkout/payment-links", {
    method: "POST",
    body: {
      idempotency_key: idempotencyKey(tier.id),
      description: `SOTS Mahjong Night Sept 19, 2026 · ${tier.id}`,
      payment_note: `Mahjong Night 2026 · ${tier.name}`,
      quick_pay: {
        name,
        location_id: locationId,
        price_money: {
          amount: Math.round(tier.price * 100),
          currency: "USD",
        },
      },
      checkout_options: {
        redirect_url: redirectUrl,
        merchant_support_email: MAHJONG_NIGHT.contactEmail,
        ask_for_shipping_address: false,
      },
    },
  });

  const link = data.payment_link;
  const url = link?.url || link?.long_url;
  if (!url) throw new Error(`No URL returned for ${tier.id}`);
  return { id: tier.id, url, squareId: link.id };
}

function applyUrlsToSource(source, urlById) {
  let next = source;
  for (const [id, url] of Object.entries(urlById)) {
    const pattern = new RegExp(
      `(id:\\s*"${id}"[\\s\\S]*?paymentLink:\\s*")[^"]*(")`,
      "m",
    );
    if (!pattern.test(next)) {
      throw new Error(`Could not find paymentLink field for id "${id}" in mahjong-night.js`);
    }
    next = next.replace(pattern, `$1${url}$2`);
  }
  return next;
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
  const tiers = allTiers();

  console.log(`Square environment: ${env}`);
  console.log(`Location: ${locationId}`);
  console.log(`Tiers: ${tiers.length}`);

  if (checkOnly) {
    const missing = tiers.filter((t) => !t.paymentLink?.trim());
    console.log(missing.length ? `Missing links: ${missing.map((t) => t.id).join(", ")}` : "All tiers have payment links.");
    process.exit(missing.length ? 1 : 0);
  }

  const urlById = {};
  for (const tier of tiers) {
    if (tier.paymentLink?.trim()) {
      console.log(`skip ${tier.id} (already set)`);
      urlById[tier.id] = tier.paymentLink.trim();
      continue;
    }
    process.stdout.write(`create ${tier.id} ($${tier.price}) … `);
    const created = await createLink(tier, locationId);
    urlById[tier.id] = created.url;
    console.log(created.url);
  }

  const source = await readFile(configPath, "utf8");
  const updated = applyUrlsToSource(source, urlById);
  await writeFile(configPath, updated, "utf8");
  console.log(`Updated ${path.relative(root, configPath)}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
