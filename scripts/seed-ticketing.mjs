#!/usr/bin/env node
/**
 * Build public/data/ticketing.json from eventbrite.json (catalog shape for Square ticketing).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { derivePerformanceStatus } from "../js/performance-dates.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "public/data/eventbrite.json");
const outPath = path.join(root, "public/data/ticketing.json");

function slugTicketType(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function testModeEnabled() {
  return process.env.TICKETING_TEST_MODE === "true" || process.argv.includes("--test");
}

function etDatePlusDays(daysOut, now = new Date()) {
  const target = new Date(now.getTime() + daysOut * 86_400_000);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(target);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

function buildTestPerformances(catalog, now = new Date()) {
  const venue = "Pinkney Park";
  const location = "177 Rowayton Avenue, Norwalk, CT 06853";
  const minPrice = catalog.priceFrom ?? { display: "$25.00", currency: "USD", value: 2500 };
  const showName = "TEST — Much Ado About Nothing";

  return [7, 8, 9, 10, 14, 15].map((daysOut, index) => {
    const date = etDatePlusDays(daysOut, now);
    return {
      id: `test-perf-${String(index + 1).padStart(3, "0")}`,
      name: showName,
      status: "on_sale",
      start: `${date}T19:30:00`,
      end: `${date}T22:00:00`,
      timezone: "America/New_York",
      venue,
      location,
      isSoldOut: false,
      ticketsAvailable: true,
      minPrice,
      isTest: true,
    };
  });
}

function applyTestPerformances(catalog, now = new Date()) {
  const testPerformances = buildTestPerformances(catalog, now);
  const performances = [...testPerformances, ...catalog.performances];
  const first = testPerformances[0];
  const last = testPerformances[testPerformances.length - 1];

  return {
    ...catalog,
    production: {
      ...catalog.production,
      id: "test-much-ado-2026",
      title: "TEST — Much Ado About Nothing",
    },
    featuredTicket: {
      id: first.id,
      name: first.name,
      status: "on_sale",
      start: first.start,
      end: last.end,
      timezone: "America/New_York",
      venue: first.venue,
      location: first.location,
      isSoldOut: false,
      ticketsAvailable: true,
    },
    performances,
    performanceByDate: Object.fromEntries(
      performances.map((p) => [p.start?.slice(0, 10), p]).filter(([key]) => Boolean(key)),
    ),
    meta: {
      ...catalog.meta,
      testMode: true,
      testPerformanceCount: testPerformances.length,
    },
  };
}

function shouldIncludeTestPerformances(catalog) {
  if (process.env.TICKETING_TEST_MODE === "false") return false;
  if (testModeEnabled()) return true;
  const onSale = catalog.performances.filter((p) =>
    ["on_sale", "live", "started", "draft"].includes(p.status),
  ).length;
  return onSale === 0;
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
    .map((p) => {
      const status = derivePerformanceStatus(p);
      const onSale = ["on_sale", "live", "started", "draft"].includes(status);
      return {
        id: p.id,
        name: p.name,
        status,
        start: p.start,
        end: p.end,
        timezone: p.timezone ?? "America/New_York",
        venue: p.venue,
        location: p.location,
        isSoldOut: Boolean(p.isSoldOut),
        ticketsAvailable: onSale ? p.ticketsAvailable !== false : false,
        minPrice: p.minPrice ?? eb.priceFrom ?? null,
      };
    });

  const purchasableCount = performances.filter((p) =>
    ["on_sale", "live", "started", "draft"].includes(p.status),
  ).length;

  const featuredStatus = eb.featuredTicket
    ? derivePerformanceStatus({
        status: eb.featuredTicket.status,
        start: eb.featuredTicket.start,
        end: eb.featuredTicket.end,
      })
    : "on_sale";

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
      status: featuredStatus,
      start: eb.featuredTicket?.start,
      end: eb.featuredTicket?.end,
      timezone: eb.featuredTicket?.timezone ?? "America/New_York",
      venue: eb.featuredTicket?.venue,
      location: eb.featuredTicket?.location,
      isSoldOut: eb.featuredTicket?.isSoldOut ?? false,
      ticketsAvailable: purchasableCount > 0,
    },
    ticketClasses: ticketTypes,
    ticketTypes,
    priceFrom: eb.priceFrom ?? null,
    performances,
    performanceByDate: Object.fromEntries(
      performances
        .map((p) => [p.start?.slice(0, 10), p])
        .filter(([key]) => Boolean(key)),
    ),
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
  let catalog = buildCatalog(eb);
  if (shouldIncludeTestPerformances(catalog)) {
    catalog = applyTestPerformances(catalog);
    console.log(`  + ${catalog.meta.testPerformanceCount} TEST performance(s) added`);
  }
  fs.writeFileSync(outPath, `${JSON.stringify(catalog, null, 2)}\n`);
  const onSale = catalog.performances.filter((p) =>
    ["on_sale", "live", "started", "draft"].includes(p.status),
  ).length;
  console.log(
    `Wrote ${outPath} (${catalog.performances.length} performances, ${onSale} on sale, ${catalog.ticketTypes.length} ticket types)`,
  );
}

main();
