#!/usr/bin/env node
/**
 * Sync ticket tiers from ticketing.json into Square Catalog for reporting.
 * Writes public/data/square-ticket-catalog.json with Square variation IDs used at checkout.
 *
 * Requires SQUARE_ACCESS_TOKEN + SQUARE_APPLICATION_ID in env or .env.
 *
 * Usage:
 *   npm run sync:square-tickets
 *   node scripts/sync-square-ticket-types.mjs --check
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SQUARE_TICKET_CATALOG_FILENAME,
  syncTicketTypesToSquareCatalog,
} from "../netlify/functions/lib/square-ticket-catalog.mjs";
import { getSquareCredentials, resolveLocationId } from "../netlify/functions/lib/square.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ticketingPath = path.join(root, "public/data/ticketing.json");
const outPath = path.join(root, "public/data", SQUARE_TICKET_CATALOG_FILENAME);
const checkOnly = process.argv.includes("--check");

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

async function main() {
  await loadDotEnv();

  if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_APPLICATION_ID) {
    console.error("Missing Square credentials. Set SQUARE_ACCESS_TOKEN and SQUARE_APPLICATION_ID.");
    process.exit(1);
  }

  let ticketing;
  try {
    ticketing = JSON.parse(await readFile(ticketingPath, "utf8"));
  } catch {
    console.error(`Could not read ${ticketingPath}. Run npm run sync:ticketing first.`);
    process.exit(1);
  }

  const ticketTypes = ticketing.ticketTypes ?? ticketing.ticketClasses ?? [];
  if (!ticketTypes.length) {
    console.error("No ticket types found in ticketing.json.");
    process.exit(1);
  }

  const locationId = await resolveLocationId();
  getSquareCredentials();

  if (checkOnly) {
    console.log(`Square environment: ${process.env.SQUARE_ENVIRONMENT || "sandbox"}`);
    console.log(`Location: ${locationId}`);
    console.log(`Ticket types in catalog: ${ticketTypes.length}`);
    for (const ticketType of ticketTypes) {
      console.log(`  • ${ticketType.name} — $${((ticketType.price?.value ?? 0) / 100).toFixed(2)}`);
    }
    process.exit(0);
  }

  console.log(`Square environment: ${process.env.SQUARE_ENVIRONMENT || "sandbox"}`);
  console.log(`Location: ${locationId}`);
  console.log(`Syncing ${ticketTypes.length} ticket type(s) to Square Catalog...`);

  const mapping = await syncTicketTypesToSquareCatalog(ticketTypes);
  await writeFile(outPath, `${JSON.stringify(mapping, null, 2)}\n`);

  const linked = Object.values(mapping.ticketTypes).filter((entry) => entry.catalogVariationId).length;
  console.log(`Wrote ${outPath}`);
  console.log(`Linked ${linked}/${ticketTypes.length} ticket type(s) to Square variations.`);
  console.log("Checkout will attach catalog line items to Square Orders when this file is deployed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
