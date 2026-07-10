export const AFFILIATE_CODE = "ebdsoporgprofile";
export const TICKETS_CTA_LABEL = "Tickets";

let cache = null;
let cacheAt = 0;
const CACHE_MS = 60_000;

const ACTIVE_STATUSES = new Set(["live", "started", "draft"]);
const STATUS_DISPLAY = {
  completed: "Ended",
  live: "On Sale",
  started: "On Sale",
  draft: "Coming Soon",
  cancelled: "Cancelled",
};

export function affiliateUrl(url) {
  if (!url) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}aff=${AFFILIATE_CODE}`;
}

export async function loadEventbriteData({ fresh = false } = {}) {
  if (!fresh && cache && Date.now() - cacheAt < CACHE_MS) {
    return cache;
  }

  const sources = ["/api/tickets", "/data/eventbrite.json"];
  let lastError = null;

  for (const source of sources) {
    try {
      const res = await fetch(source, { headers: { Accept: "application/json" } });
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.error) continue;
      cache = data;
      cacheAt = Date.now();
      return data;
    } catch (err) {
      lastError = err;
    }
  }

  if (lastError) throw lastError;
  return null;
}

export function getTicketsUrl(data, fallback) {
  return data?.featuredTicket?.affiliateUrl ?? data?.featuredTicket?.url ?? fallback ?? null;
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
  if (STATUS_DISPLAY[status]) return STATUS_DISPLAY[status];
  return status;
}

export function isPurchasablePerformance(performance) {
  if (!performance) return false;
  if (performance.isSoldOut || performance.ticketsAvailable === false) return false;
  return ACTIVE_STATUSES.has(performance.status);
}

export function ticketStatusLabel(event) {
  if (!event) return "";
  if (typeof event === "string") return normalizeStatusLabel(event);
  if (event.isSoldOut || event.ticketsAvailable === false) return "Sold Out";
  if (ACTIVE_STATUSES.has(event.status)) return "On Sale";
  if (event.status === "draft") return "Coming Soon";
  if (event.status === "completed") return "Ended";
  if (event.status === "cancelled") return "Cancelled";
  return normalizeStatusLabel(event.status);
}

export function purchasablePerformances(data, limit) {
  const list = [...(data?.performances ?? [])]
    .filter(isPurchasablePerformance)
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
    statusLabel: canPurchase ? "On Sale" : featuredLabel || "Unavailable",
    purchasableCount: purchasable.length,
    defaultEventId,
    ticketsUrl: getTicketsUrl(data),
    isEnded: featured?.status === "completed" && !canPurchase,
    isSoldOut: Boolean(featured?.isSoldOut) && !canPurchase,
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
  const list = [...(data?.performances ?? [])].sort((a, b) =>
    (a.start ?? "").localeCompare(b.start ?? ""),
  );
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export function performanceForDate(data, isoStart) {
  const key = isoStart?.slice(0, 10);
  if (!key) return null;
  return data?.performanceByDate?.[key] ?? null;
}

export function isTicketCheckoutUrl(href, ticketsUrl) {
  if (!href || typeof href !== "string") return false;
  if (/eventbrite\.com/i.test(href)) return true;
  if (ticketsUrl && href === ticketsUrl) return true;
  return false;
}

export function enrichPlayWithTickets(play, data) {
  if (!play || !data) return play;
  const state = getTicketingState(data);
  const url = state.ticketsUrl ?? play.ticketUrl;
  const priceLabel = state.canPurchase ? getPriceFromLabel(data) : null;
  const eventbriteId = state.defaultEventId ?? play.eventbriteId;

  return {
    ...play,
    ticketUrl: url ?? play.ticketUrl,
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
  const fallback = state.ticketsUrl ?? event.ctaUrl;
  const ctaUrl = matched?.affiliateUrl ?? (event.external ? fallback : event.ctaUrl);
  const matchedPurchasable = matched && isPurchasablePerformance(matched);

  return {
    ...event,
    ctaUrl,
    eventbriteId: matchedPurchasable ? matched.id : state.defaultEventId ?? event.eventbriteId,
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
