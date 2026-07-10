#!/usr/bin/env node
/**
 * Build public/data/ticketing.json from eventbrite.json (catalog shape for Square ticketing).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "public/data/eventbrite.json");
const outPath = path.join(root, "public/data/ticketing.json");

function slugTicketType(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildCatalog(eb) {
  const ticketTypes = (eb.ticketClasses ?? [])
    .filter((tc) => tc.price?.value > 0)
    .map((tc) => ({
      id: tc.id,
      slug: slugTicketType(tc.name),
      name: tc.name,
      description: tc.description ?? null,
      price: tc.price,
      capacity: tc.capacity ?? null,
      onSale: tc.onSale !== false,
      sortOrder: tc.sort_order ?? 0,
    }));

  const performances = (eb.performances ?? [])
    .filter((p) => !p.isSeriesParent)
    .map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      start: p.start,
      end: p.end,
      timezone: p.timezone ?? "America/New_York",
      venue: p.venue,
      location: p.location,
      isSoldOut: Boolean(p.isSoldOut),
      ticketsAvailable: p.ticketsAvailable,
      minPrice: p.minPrice ?? eb.priceFrom ?? null,
    }));

  const performanceByDate = {};
  for (const p of performances) {
    const key = p.start?.slice(0, 10);
    if (key) performanceByDate[key] = p;
  }

  return {
    provider: "square",
    syncedAt: new Date().toISOString(),
    organization: eb.organization ?? { name: "Shakespeare on the Sound" },
    production: {
      id: "much-ado-2026",
      slug: "much-ado-about-nothing",
      title: eb.featuredTicket?.name ?? "Much Ado About Nothing",
      season: "2026",
    },
    featuredTicket: {
      id: eb.featuredTicket?.id,
      name: eb.featuredTicket?.name,
      status: eb.featuredTicket?.status,
      start: eb.featuredTicket?.start,
      end: eb.featuredTicket?.end,
      timezone: eb.featuredTicket?.timezone ?? "America/New_York",
      venue: eb.featuredTicket?.venue,
      location: eb.featuredTicket?.location,
      isSoldOut: eb.featuredTicket?.isSoldOut ?? false,
      ticketsAvailable: eb.featuredTicket?.ticketsAvailable,
    },
    ticketClasses: ticketTypes,
    ticketTypes,
    priceFrom: eb.priceFrom ?? null,
    performances,
    performanceByDate,
    meta: {
      ...(eb.meta ?? {}),
      provider: "square",
      performanceCount: performances.length,
    },
  };
}

function main() {
  if (!fs.existsSync(sourcePath)) {
    console.warn("seed-ticketing: no eventbrite.json, skipping");
    return;
  }
  const eb = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const catalog = buildCatalog(eb);
  fs.writeFileSync(outPath, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Wrote ${outPath} (${catalog.performances.length} performances, ${catalog.ticketTypes.length} ticket types)`);
}

main();
