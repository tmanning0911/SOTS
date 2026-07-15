#!/usr/bin/env node
/**
 * Create Square Payment Links for each on-sale performance × ticket type.
 * Writes public/data/ticket-payment-links.json (merged at load time).
 *
 * Usage:
 *   node scripts/create-ticket-payment-links.mjs
 *   node scripts/create-ticket-payment-links.mjs --check
 */
import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getSquareCredentials,
  resolveLocationId,
  squareEnvironment,
  squareRequest,
} from "../netlify/functions/lib/square.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ticketingPath = path.join(root, "public/data/ticketing.json");
const linksPath = path.join(root, "public/data/ticket-payment-links.json");
const siteUrl = (process.env.VITE_SITE_URL || "https://www.shakespeareonthesound.org").replace(/\/$/, "");
const redirectUrl = `${siteUrl}/tickets/?thanks=1`;

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

function formatDateLabel(start) {
  if (!start) return "Performance";
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "America/New_York",
    }).format(new Date(String(start).slice(0, 10) + "T12:00:00"));
  } catch {
    return String(start).slice(0, 10);
  }
}

function shortTierName(name) {
  return String(name || "Ticket")
    .replace(/^TEST\s*[—–-]\s*/i, "")
    .trim();
}

async function createLink({ performance, ticketType, locationId }) {
  const dateLabel = formatDateLabel(performance.start);
  const tier = shortTierName(ticketType.name);
  const name = `Much Ado — ${dateLabel} — ${tier}`;
  const key = `tix-2026-${performance.id}-${ticketType.id}-${randomBytes(6).toString("hex")}`;

  const data = await squareRequest("/v2/online-checkout/payment-links", {
    method: "POST",
    body: {
      idempotency_key: key,
      description: `SOTS Much Ado · ${performance.id} · ${ticketType.id}`,
      payment_note: name,
      quick_pay: {
        name: name.slice(0, 120),
        location_id: locationId,
        price_money: {
          amount: ticketType.price?.value ?? 0,
          currency: ticketType.price?.currency || "USD",
        },
      },
      checkout_options: {
        redirect_url: redirectUrl,
        merchant_support_email: "contactus@shakespeareonthesound.org",
        ask_for_shipping_address: false,
      },
    },
  });

  const link = data.payment_link;
  const url = link?.url || link?.long_url;
  if (!url) throw new Error(`No URL for ${performance.id}/${ticketType.id}`);
  return url;
}

async function main() {
  await loadDotEnv();
  const checkOnly = process.argv.includes("--check");

  const catalog = JSON.parse(await readFile(ticketingPath, "utf8"));
  const ticketTypes = (catalog.ticketTypes ?? catalog.ticketClasses ?? []).filter(
    (t) => t.price?.value > 0 && t.onSale !== false,
  );
  const performances = (catalog.performances ?? []).filter((p) => {
    const status = String(p.status ?? "").toLowerCase();
    return status === "on_sale" || status === "live" || status === "started";
  });

  let existing = {};
  try {
    existing = JSON.parse(await readFile(linksPath, "utf8"));
  } catch {
    existing = {};
  }

  const pairs = [];
  for (const performance of performances) {
    for (const ticketType of ticketTypes) {
      pairs.push({ performance, ticketType });
    }
  }

  console.log(`On-sale performances: ${performances.length}`);
  console.log(`Ticket types: ${ticketTypes.length}`);
  console.log(`Links needed: ${pairs.length}`);

  if (checkOnly) {
    let missing = 0;
    for (const { performance, ticketType } of pairs) {
      const url = existing[performance.id]?.[ticketType.id];
      if (!url) missing += 1;
    }
    console.log(missing ? `Missing ${missing} payment links.` : "All ticket payment links present.");
    process.exit(missing ? 1 : 0);
  }

  if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_APPLICATION_ID) {
    console.error("Missing Square credentials. Set SQUARE_ACCESS_TOKEN and SQUARE_APPLICATION_ID.");
    process.exit(1);
  }

  getSquareCredentials();
  const env = squareEnvironment();
  const locationId = await resolveLocationId();
  console.log(`Square environment: ${env}`);
  console.log(`Location: ${locationId}`);

  const next = structuredClone(existing);
  for (const { performance, ticketType } of pairs) {
    if (!next[performance.id]) next[performance.id] = {};
    if (next[performance.id][ticketType.id]?.trim()) {
      console.log(`skip ${performance.id} / ${ticketType.id}`);
      continue;
    }
    process.stdout.write(`create ${performance.id} / ${ticketType.slug || ticketType.id} … `);
    const url = await createLink({ performance, ticketType, locationId });
    next[performance.id][ticketType.id] = url;
    console.log(url);
  }

  await writeFile(linksPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(`Wrote ${path.relative(root, linksPath)}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
