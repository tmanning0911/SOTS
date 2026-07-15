import {
  derivePerformanceStatus,
  displayPerformances,
  isPastPerformance,
  normalizeTicketCatalog,
} from "./performance-dates.js";

export const AFFILIATE_CODE = "ebdsoporgprofile";
export const TICKETS_CTA_LABEL = "Tickets";
export const TICKETS_PAGE_PATH = "/tickets/";
export const TICKET_CHECKOUT_PATH = "/tickets/checkout";

/** Deep-link to tickets calendar (on-site checkout retired — Square Payment Links). */
export function getTicketCheckoutPath(performanceId) {
  if (!performanceId) return `${TICKETS_PAGE_PATH}#dates`;
  return `${TICKETS_PAGE_PATH}?perf=${encodeURIComponent(String(performanceId))}#dates`;
}

export function getTicketPaymentLink(performance, ticketTypeId) {
  const url = performance?.paymentLinks?.[String(ticketTypeId)]?.trim();
  return url || null;
}

/** Strip internal QA prefixes from catalog titles shown to patrons. */
export function patronDisplayName(name) {
  if (!name || typeof name !== "string") return name ?? "";
  return name.replace(/^TEST\s*[—–-]\s*/i, "").trim();
}

const TICKET_TIER = [
  { test: (t) => t.slug === "general-admission" || /general admission/i.test(t.name ?? "") && !/child|kid|vip/i.test(t.name ?? ""), tier: 0 },
  { test: (t) => /child|kid|under/i.test(t.name ?? "") || /child|kid/i.test(t.slug ?? ""), tier: 1 },
  { test: (t) => /vip|reserved/i.test(t.name ?? "") || /vip/i.test(t.slug ?? ""), tier: 2 },
];

export function sortTicketTypesForDisplay(ticketTypes) {
  return [...(ticketTypes ?? [])].sort((a, b) => {
    const tier = (t) => TICKET_TIER.find((rule) => rule.test(t))?.tier ?? 3;
    const diff = tier(a) - tier(b);
    if (diff !== 0) return diff;
    return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  });
}

export function ticketTypeHint(ticketType) {
  if (!ticketType) return "";
  const slug = ticketType.slug ?? "";
  const name = ticketType.name ?? "";
  if (/general admission/i.test(name) && !/child|kid/i.test(name)) {
    return "Open seating on the lawn.";
  }
  if (/child|kid|under/i.test(name)) return "For ages 12 and under.";
  if (/low back vip/i.test(name)) return "Reserved low-back chair seating.";
  if (/high back vip/i.test(name)) return "Reserved high-back chair seating.";
  if (/vip|reserved/i.test(name)) return "Reserved seating.";
  if (/vip/i.test(slug)) return "Reserved seating.";
  return "";
}

export function formatPerformanceListDate(isoLocal) {
  if (!isoLocal) return "";
  const date = new Date(isoLocal);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  }).format(date);
}

export function formatPerformanceTime(isoLocal) {
  if (!isoLocal) return "";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  }).format(new Date(isoLocal));
}

export {
  derivePerformanceStatus,
  displayPerformances,
  isPastPerformance,
  normalizeTicketCatalog,
} from "./performance-dates.js";

let cache = null;
let cacheAt = 0;
const CACHE_MS = 60_000;

const ACTIVE_STATUSES = new Set(["live", "started", "draft", "on_sale"]);
const STATUS_DISPLAY = {
  completed: "Ended",
  live: "On Sale",
  started: "On Sale",
  draft: "Coming Soon",
  on_sale: "On Sale",
  cancelled: "Cancelled",
};

export function affiliateUrl(url) {
  if (!url) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}aff=${AFFILIATE_CODE}`;
}

export async function loadTicketData({ fresh = false } = {}) {
  if (!fresh && cache && Date.now() - cacheAt < CACHE_MS) {
    return cache;
  }

  const sources = ["/api/tickets", "/data/ticketing.json", "/data/eventbrite.json"];
  let lastError = null;
  let linksByPerformance = {};

  try {
    const linksRes = await fetch("/data/ticket-payment-links.json", {
      headers: { Accept: "application/json" },
    });
    if (linksRes.ok) {
      linksByPerformance = (await linksRes.json()) || {};
    }
  } catch {
    /* optional overlay */
  }

  for (const source of sources) {
    try {
      const res = await fetch(source, { headers: { Accept: "application/json" } });
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.error) continue;
      const normalized = normalizeTicketCatalog(data);
      if (normalized?.performances?.length && linksByPerformance) {
        for (const performance of normalized.performances) {
          const links = linksByPerformance[performance.id];
          if (links && typeof links === "object") {
            performance.paymentLinks = { ...(performance.paymentLinks || {}), ...links };
          }
        }
      }
      cache = normalized;
      cacheAt = Date.now();
      return cache;
    } catch (err) {
      lastError = err;
    }
  }

  if (lastError) throw lastError;
  return null;
}

/** @deprecated Use loadTicketData */
export async function loadEventbriteData(options) {
  return loadTicketData(options);
}

export function getTicketsUrl(_data, fallback = TICKETS_PAGE_PATH) {
  return TICKETS_PAGE_PATH ?? fallback;
}

/** Performance ID for native checkout (Square). */
export function getCheckoutPerformanceId(data, performanceId) {
  return getWidgetEventId(data, performanceId);
}

export function getWidgetEventId(data, eventId) {
  if (eventId) return String(eventId);
  const purchasable = purchasablePerformances(data, 1)[0]?.id;
  if (purchasable) return String(purchasable);
  const firstPerformance =
    data?.performances?.find((p) => !p.isSeriesParent)?.id ?? data?.performances?.[0]?.id;
  return firstPerformance ? String(firstPerformance) : null;
}

/** @deprecated Prefer getDefaultCheckoutEventId — series parent IDs break embedded checkout. */
export function getFeaturedEventId(data) {
  return data?.featuredTicket?.id ?? data?.meta?.featuredEventId ?? null;
}

export function getPriceFromLabel(data) {
  if (!getTicketingState(data).canPurchase) return null;
  const display = data?.priceFrom?.display;
  if (display) return `From ${display}`;
  const min = data?.featuredTicket?.minPrice?.display;
  return min ? `From ${min}` : null;
}

export function normalizeStatusLabel(status) {
  if (!status || typeof status !== "string") return "";
  if (status.toLowerCase() === "unavailable") return "";
  if (STATUS_DISPLAY[status]) return STATUS_DISPLAY[status];
  return status;
}

export function isPurchasablePerformance(performance, now = new Date()) {
  if (!performance) return false;
  if (isPastPerformance(performance, now)) return false;
  if (performance.ticketsAvailable === false) return false;
  const status = derivePerformanceStatus(performance, now);
  return ACTIVE_STATUSES.has(status);
}

export function ticketStatusLabel(event) {
  if (!event) return "";
  if (typeof event === "string") return normalizeStatusLabel(event);
  const status = typeof event === "object" && event.start ? derivePerformanceStatus(event) : event.status;
  if (event.ticketsAvailable === false && !ACTIVE_STATUSES.has(status)) return "";
  if (ACTIVE_STATUSES.has(status)) return "On Sale";
  if (status === "draft") return "Coming Soon";
  if (status === "completed") return "Ended";
  if (status === "cancelled") return "Cancelled";
  return normalizeStatusLabel(status);
}

export function purchasablePerformances(data, limit) {
  const list = displayPerformances(data)
    .filter((performance) => isPurchasablePerformance(performance))
    .sort((a, b) => (a.start ?? "").localeCompare(b.start ?? ""));
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export function getDefaultCheckoutEventId(data) {
  return purchasablePerformances(data, 1)[0]?.id ?? null;
}

export function getTicketingState(data) {
  const featured = data?.featuredTicket ?? null;
  const purchasable = purchasablePerformances(data);
  const canPurchase = purchasable.length > 0;
  const featuredLabel = featured ? ticketStatusLabel(featured) : "";
  const defaultEventId = purchasable[0]?.id ?? null;

  return {
    canPurchase,
    statusLabel: canPurchase ? "On Sale" : featuredLabel || "",
    purchasableCount: purchasable.length,
    defaultEventId,
    ticketsUrl: getTicketsUrl(data),
    isEnded: featured?.status === "completed" && !canPurchase,
  };
}

export function formatPerformanceDate(isoLocal, options = {}) {
  if (!isoLocal) return "";
  const date = new Date(isoLocal);
  return new Intl.DateTimeFormat("en-US", {
    weekday: options.weekday === false ? undefined : "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    ...options,
  }).format(date);
}

export function upcomingPerformances(data, limit) {
  return purchasablePerformances(data, limit);
}

export function seriesPerformances(data, limit) {
  return displayPerformances(data, limit);
}

export function performanceForDate(data, isoStart) {
  const key = isoStart?.slice(0, 10);
  if (!key) return null;
  return data?.performanceByDate?.[key] ?? null;
}

export function isTicketCheckoutUrl(href, ticketsUrl) {
  if (!href || typeof href !== "string") return false;
  if (/eventbrite\.com/i.test(href)) return true;
  if (href === "/tickets" || href.startsWith("/tickets?") || href.startsWith("/tickets/")) return true;
  if (ticketsUrl && (href === ticketsUrl || href.startsWith(`${ticketsUrl}#`))) return true;
  if (href === TICKETS_PAGE_PATH || href.startsWith(`${TICKETS_PAGE_PATH}#`)) return true;
  if (href === "/productions/much-ado-about-nothing/" || href.startsWith("/productions/much-ado-about-nothing")) {
    return true;
  }
  return false;
}

export function enrichPlayWithTickets(play, data) {
  if (!play || !data) return play;
  const state = getTicketingState(data);
  const priceLabel = state.canPurchase ? getPriceFromLabel(data) : null;
  const eventbriteId = getWidgetEventId(data, state.defaultEventId ?? play.eventbriteId);

  return {
    ...play,
    ticketUrl: TICKETS_PAGE_PATH,
    priceLabel,
    eventbriteId,
    status: state.statusLabel,
    canPurchase: state.canPurchase,
  };
}

export function enrichEventWithTickets(event, data) {
  if (!event || !data) return event;
  const calendarStart = event.calendar?.start ?? event.calendar?.occurrences?.[0]?.start;
  const matched = performanceForDate(data, calendarStart);
  const state = getTicketingState(data);
  const isTicketEvent =
    event.external ||
    /eventbrite/i.test(event.ctaUrl ?? "") ||
    /ticket/i.test(event.ctaLabel ?? "");
  const ctaUrl = isTicketEvent ? TICKETS_PAGE_PATH : event.ctaUrl;
  const matchedPurchasable = matched && isPurchasablePerformance(matched);

  return {
    ...event,
    ctaUrl,
    external: isTicketEvent ? false : event.external,
    eventbriteId: getWidgetEventId(data, matched?.id ?? state.defaultEventId ?? event.eventbriteId),
    ticketStatus: matched ? ticketStatusLabel(matched) : state.statusLabel,
    canPurchase: matched ? isPurchasablePerformance(matched) : state.canPurchase,
    priceNote:
      event.priceNote ??
      (state.canPurchase && matched?.minPrice?.display
        ? `From ${matched.minPrice.display}`
        : state.canPurchase && data.priceFrom?.display
          ? `From ${data.priceFrom.display}`
          : undefined),
  };
}
