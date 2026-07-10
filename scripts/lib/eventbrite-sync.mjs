import fs from "node:fs";
import path from "node:path";
import { affiliateUrl, createEventbriteClient } from "./eventbrite-client.mjs";

function mapEvent(e) {
  const availability = e.ticket_availability ?? {};
  const minPrice = availability.minimum_ticket_price;
  const maxPrice = availability.maximum_ticket_price;
  return {
    id: e.id,
    name: e.name?.text ?? "",
    status: e.status,
    url: e.url,
    affiliateUrl: affiliateUrl(e.url),
    vanityUrl: e.vanity_url ?? null,
    start: e.start?.local ?? null,
    end: e.end?.local ?? null,
    timezone: e.start?.timezone ?? "America/New_York",
    venue: e.venue?.name ?? null,
    location: e.venue?.address?.localized_address_display ?? null,
    isFree: Boolean(e.is_free),
    ticketsAvailable: availability.has_available_tickets ?? null,
    isSeriesParent: Boolean(e.is_series_parent),
    isSoldOut: availability.has_available_tickets === false,
    minPrice: minPrice
      ? { display: minPrice.display, currency: minPrice.currency, value: minPrice.value }
      : null,
    maxPrice: maxPrice
      ? { display: maxPrice.display, currency: maxPrice.currency, value: maxPrice.value }
      : null,
  };
}

function mapTicketClass(tc) {
  const sold =
    typeof tc.quantity_total === "number" &&
    tc.quantity_total > 0 &&
    typeof tc.quantity_sold === "number" &&
    tc.quantity_sold >= tc.quantity_total;
  return {
    id: tc.id,
    name: tc.name,
    free: Boolean(tc.free),
    soldOut: sold,
    onSale: tc.on_sale !== false,
    hidden: Boolean(tc.hidden),
    price: tc.cost
      ? { display: tc.cost.display, currency: tc.cost.currency, value: tc.cost.value }
      : null,
    salesStart: tc.sales_start ?? null,
    salesEnd: tc.sales_end ?? null,
    capacity: tc.quantity_total ?? null,
    sold: tc.quantity_sold ?? null,
  };
}

function performanceDateKey(isoLocal) {
  return isoLocal?.slice(0, 10) ?? null;
}

function pickFeaturedFromList(events) {
  const listed = events.filter((e) => e.listed && e.url);
  const seriesParent = listed.find((e) => e.is_series_parent && /much ado/i.test(e.name?.text ?? ""));
  if (seriesParent) return seriesParent;
  const muchAdo = listed
    .filter((e) => /much ado/i.test(e.name?.text ?? ""))
    .sort((a, b) => Date.parse(b.start?.utc ?? 0) - Date.parse(a.start?.utc ?? 0))[0];
  if (muchAdo) return muchAdo;
  return (
    listed.find((e) => ["live", "started", "draft"].includes(e.status)) ??
    listed.sort((a, b) => Date.parse(b.start?.utc ?? 0) - Date.parse(a.start?.utc ?? 0))[0] ??
    null
  );
}

export async function syncEventbrite({
  token,
  orgId = "2093560299743",
  featuredEventId = "1986841853468",
}) {
  const { api, fetchPaginated } = createEventbriteClient(token);

  const orgList = await api("/users/me/organizations/");
  const org =
    orgList.organizations?.find((o) => o.id === orgId) ?? orgList.organizations?.[0];
  if (!org) throw new Error(`No Eventbrite organization found for id ${orgId}`);

  const orgEvents = await fetchPaginated(
    (page) =>
      `/organizations/${orgId}/events/?order_by=start_desc&page=${page}&page_size=50&expand=venue,ticket_availability`,
  );

  let featuredRaw = pickFeaturedFromList(orgEvents);
  try {
    const canonical = await api(
      `/events/${featuredEventId}/?expand=venue,ticket_availability`,
    );
    if (canonical?.url) featuredRaw = canonical;
  } catch {
    // keep list heuristic
  }

  let performancesRaw = [];
  if (featuredRaw?.is_series_parent) {
    performancesRaw = await fetchPaginated(
      (page) =>
        `/series/${featuredRaw.id}/events/?order_by=start_asc&page=${page}&page_size=50&expand=venue,ticket_availability`,
    );
  }

  let ticketClassesRaw = [];
  try {
    const tc = await api(`/events/${featuredEventId}/ticket_classes/`);
    ticketClassesRaw = tc.ticket_classes ?? [];
  } catch {
    // optional
  }

  const performances = performancesRaw.map(mapEvent).sort((a, b) => {
    if (!a.start || !b.start) return 0;
    return a.start.localeCompare(b.start);
  });

  const performanceByDate = new Map(
    performances.map((p) => [performanceDateKey(p.start), p]),
  );

  const upcoming = orgEvents
    .filter((e) => ["live", "started", "draft"].includes(e.status))
    .map(mapEvent)
    .sort((a, b) => (a.start ?? "").localeCompare(b.start ?? ""));

  const featuredTicket = featuredRaw ? mapEvent(featuredRaw) : null;
  const ticketClasses = ticketClassesRaw
    .map(mapTicketClass)
    .filter((tc) => !tc.hidden && tc.onSale);

  const onSaleClasses = ticketClasses.filter((tc) => !tc.soldOut && tc.price && !tc.free);
  const generalAdmission = onSaleClasses.find((tc) => /general admission/i.test(tc.name));
  const priceFrom =
    generalAdmission?.price ??
    onSaleClasses
      .map((tc) => tc.price)
      .sort((a, b) => (a.value ?? 0) - (b.value ?? 0))[0] ??
    featuredTicket?.minPrice ??
    null;

  return {
    syncedAt: new Date().toISOString(),
    organization: { id: org.id, name: org.name },
    featuredTicket,
    ticketClasses,
    priceFrom,
    performances,
    performanceByDate: Object.fromEntries(performanceByDate),
    upcoming,
    recent: orgEvents.slice(0, 16).map(mapEvent),
    meta: {
      featuredEventId,
      affiliateCode: "ebdsoporgprofile",
      seriesPerformanceCount: performances.length,
    },
  };
}

export function propagateTicketUrls(root, payload) {
  const featured = payload.featuredTicket;
  if (!featured?.affiliateUrl) return [];

  const TICKETS_PAGE_PATH = "/productions/much-ado-about-nothing/";
  const SITE_OFFERS_URL = `https://www.shakespeareonthesound.org${TICKETS_PAGE_PATH}`;
  const ticketsUrl = TICKETS_PAGE_PATH;
  const changes = [];

  const dataJs = path.join(root, "js/data.js");
  if (fs.existsSync(dataJs)) {
    const next = fs.readFileSync(dataJs, "utf8").replace(/ticketsUrl: "[^"]+"/, `ticketsUrl: "${ticketsUrl}"`);
    if (next !== fs.readFileSync(dataJs, "utf8")) {
      fs.writeFileSync(dataJs, next);
      changes.push("js/data.js");
    }
  }

  const pagesData = path.join(root, "js/pages-data.js");
  if (fs.existsSync(pagesData)) {
    let pages = fs.readFileSync(pagesData, "utf8");
    const before = pages;
    pages = pages.replace(
      /tickets: "https:\/\/[^"]*eventbrite[^"]*"/,
      `tickets: "${ticketsUrl}"`,
    );
    pages = pages.replace(/https:\/\/MuchAdo2026\.eventbrite\.com/g, ticketsUrl);
    pages = pages.replace(/https:\/\/www\.eventbrite\.com\/e\/[^"]+/g, ticketsUrl);
    if (pages !== before) {
      fs.writeFileSync(pagesData, pages);
      changes.push("js/pages-data.js");
    }
  }

  const playsPath = path.join(root, "public/data/plays.json");
  if (fs.existsSync(playsPath)) {
    const plays = JSON.parse(fs.readFileSync(playsPath, "utf8"));
    let touched = false;
    for (const play of plays) {
      if (play.ticketUrl?.includes("eventbrite")) {
        play.ticketUrl = ticketsUrl;
        play.status = featuredPlayStatus(payload);
        touched = true;
      }
    }
    if (touched) {
      fs.writeFileSync(playsPath, `${JSON.stringify(plays, null, 2)}\n`);
      changes.push("public/data/plays.json");
    }
  }

  const eventsPath = path.join(root, "public/data/events.json");
  if (fs.existsSync(eventsPath)) {
    const events = JSON.parse(fs.readFileSync(eventsPath, "utf8"));
    let touched = false;
    for (const event of events) {
      const calendarStart = event.calendar?.start ?? event.calendar?.occurrences?.[0]?.start;
      const dateKey = performanceDateKey(calendarStart);
      const matched = dateKey ? payload.performanceByDate[dateKey] : null;

      if (matched?.id && (event.external || event.ctaUrl?.includes("eventbrite"))) {
        event.ctaUrl = ticketsUrl;
        event.external = false;
        touched = true;
      } else if (event.ctaUrl?.includes("eventbrite")) {
        event.ctaUrl = ticketsUrl;
        event.external = false;
        touched = true;
      }

      if (matched) {
        event.ticketStatus = displayTicketStatus(matched);
        event.ticketsAvailable = matched.ticketsAvailable;
        event.eventbriteId = matched.id;
        touched = true;
      } else if (event.ctaUrl?.includes("eventbrite") || event.external) {
        event.ticketStatus = featuredPlayStatus(payload);
        if (event.ctaUrl?.includes("eventbrite")) {
          event.ctaUrl = ticketsUrl;
          event.external = false;
        }
        touched = true;
      }
    }
    if (touched) {
      fs.writeFileSync(eventsPath, `${JSON.stringify(events, null, 2)}\n`);
      changes.push("public/data/events.json");
    }
  }

  const indexHtml = path.join(root, "index.html");
  if (fs.existsSync(indexHtml)) {
    let html = fs.readFileSync(indexHtml, "utf8");
    const before = html;
    html = html.replace(
      /"offers": \{ "@type": "Offer", "url": "[^"]+"/,
      `"offers": { "@type": "Offer", "url": "${SITE_OFFERS_URL}"`,
    );
    const price = priceFromDisplay(payload);
    if (price) {
      html = html.replace(/"price": "[^"]+"/, `"price": "${price}"`);
    }
    if (html !== before) {
      fs.writeFileSync(indexHtml, html);
      changes.push("index.html");
    }
  }

  return changes;
}

function priceFromDisplay(payload) {
  const display = payload.priceFrom?.display;
  if (!display) return null;
  const num = display.replace(/[^0-9.]/g, "");
  return num || null;
}

function displayTicketStatus(performance) {
  if (!performance) return "Unavailable";
  if (performance.isSoldOut || performance.ticketsAvailable === false) return "Sold Out";
  if (["live", "started"].includes(performance.status)) return "On Sale";
  if (performance.status === "draft") return "Coming Soon";
  if (performance.status === "completed") return "Ended";
  return performance.status ?? "Unavailable";
}

function featuredPlayStatus(payload) {
  const purchasable = (payload.performances ?? []).some(
    (p) =>
      ["live", "started", "draft"].includes(p.status) &&
      p.ticketsAvailable !== false &&
      !p.isSoldOut,
  );
  if (purchasable) return "On Sale";
  return displayTicketStatus(payload.featuredTicket);
}

export function writeEventbriteJson(root, payload) {
  const outPath = path.join(root, "public/data/eventbrite.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`);
  return outPath;
}
