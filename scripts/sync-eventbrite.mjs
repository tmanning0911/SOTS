#!/usr/bin/env node
/**
 * Sync Eventbrite ticket data and propagate URLs across the site.
 *
 * Setup (https://www.eventbrite.com/platform/api-keys/):
 *   cp .env.example .env
 *   # Add your private OAuth token — server-side only, never in client code
 *
 * Usage:
 *   npm run sync:eventbrite
 *   node scripts/sync-eventbrite.mjs --check
 *
 * Production: set EVENTBRITE_API_TOKEN in Netlify. Optional webhook at
 * /api/eventbrite-webhook for real-time updates (see .env.example).
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvFile } from "./lib/eventbrite-client.mjs";
import {
  propagateTicketUrls,
  syncEventbrite,
  writeEventbriteJson,
} from "./lib/eventbrite-sync.mjs";
import fs from "node:fs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");
const checkOnly = process.argv.includes("--check");
const skipPropagate = process.argv.includes("--no-propagate");

loadEnvFile(envPath, fs);

const token = process.env.EVENTBRITE_API_TOKEN?.trim();
const orgId = process.env.EVENTBRITE_ORG_ID?.trim() || "2093560299743";
const featuredEventId = process.env.EVENTBRITE_FEATURED_EVENT_ID?.trim() || "1986841853468";

if (!token) {
  console.error("Missing EVENTBRITE_API_TOKEN. Copy .env.example to .env and add your private token.");
  process.exit(1);
}

const payload = await syncEventbrite({ token, orgId, featuredEventId });

if (checkOnly) {
  console.log(`Organization: ${payload.organization.name} (${payload.organization.id})`);
  console.log(`Featured: ${payload.featuredTicket?.name ?? "none"}`);
  if (payload.featuredTicket?.affiliateUrl) console.log(`Tickets: ${payload.featuredTicket.affiliateUrl}`);
  console.log(`Performances: ${payload.performances.length}`);
  console.log(`Ticket classes: ${payload.ticketClasses.length}`);
  console.log(`Upcoming live events: ${payload.upcoming.length}`);
  process.exit(0);
}

const outPath = writeEventbriteJson(root, payload);
console.log(`Wrote ${outPath}`);

if (!skipPropagate) {
  const changed = propagateTicketUrls(root, payload);
  if (changed.length) {
    console.log(`Updated: ${changed.join(", ")}`);
  }
}

if (payload.featuredTicket?.affiliateUrl) {
  console.log(`Featured tickets: ${payload.featuredTicket.affiliateUrl}`);
}
if (payload.priceFrom?.display) {
  console.log(`From ${payload.priceFrom.display}`);
}
