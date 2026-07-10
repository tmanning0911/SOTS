import { catalogAllowsTestPerformances, stripTestPerformances } from "./catalog-production.js";

const ET = "America/New_York";

function coerceNow(now) {
  if (now instanceof Date && !Number.isNaN(now.getTime())) return now;
  if (now == null) return new Date();
  const parsed = new Date(now);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Parse catalog datetimes (no Z suffix) as wall time in America/New_York.
 */
export function parseEtLocalIso(isoLocal) {
  if (!isoLocal || typeof isoLocal !== "string") return null;
  const match = isoLocal.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!match) {
    const fallback = new Date(isoLocal);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }

  const [, y, mo, d, h = "0", mi = "0", s = "0"] = match;
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: ET,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const targetUtc = Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s));
  let utc = targetUtc;

  for (let i = 0; i < 4; i += 1) {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(utc)).map((p) => [p.type, p.value]));
    const hour = Number(parts.hour === "24" ? "0" : parts.hour);
    const formedUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      hour,
      Number(parts.minute),
      Number(parts.second),
    );
    utc += targetUtc - formedUtc;
  }

  return new Date(utc);
}

export function performanceShowDateKey(performance) {
  return performance?.start?.slice(0, 10) ?? null;
}

/** Today's calendar date in Eastern (YYYY-MM-DD). */
export function etDateKey(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ET,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** True once the show day has passed in Eastern (hidden from midnight onward). */
export function isPastPerformance(performance, now = new Date()) {
  const at = coerceNow(now);
  const showDate = performanceShowDateKey(performance);
  if (!showDate) return false;
  return etDateKey(at) > showDate;
}

export function derivePerformanceStatus(performance, now = new Date()) {
  const at = coerceNow(now);
  if (!performance) return "completed";
  if (performance.status === "cancelled") return "cancelled";
  if (isPastPerformance(performance, at)) return "completed";

  const start = parseEtLocalIso(performance.start);
  if (!start || Number.isNaN(start.getTime())) return performance.status ?? "on_sale";

  if (at.getTime() >= start.getTime()) return "live";
  if (performance.status === "draft") return "draft";
  return "on_sale";
}

export function normalizePerformance(performance, now = new Date()) {
  const status = derivePerformanceStatus(performance, now);
  const onSale = ["on_sale", "live", "started", "draft"].includes(status);
  return {
    ...performance,
    status,
    ticketsAvailable: onSale ? performance.ticketsAvailable !== false : false,
    isSoldOut: status === "completed" ? true : Boolean(performance.isSoldOut),
  };
}

export function normalizeTicketCatalog(catalog, now = new Date()) {
  if (!catalog) return catalog;

  const performances = (catalog.performances ?? [])
    .map((p) => normalizePerformance(p, now))
    .filter((p) => !isPastPerformance(p, now));
  const purchasable = performances.filter(
    (p) => ["on_sale", "live", "started", "draft"].includes(p.status) && p.ticketsAvailable !== false && !p.isSoldOut,
  );

  const featuredBase = catalog.featuredTicket ?? null;
  const featuredTicket = featuredBase
    ? {
        ...featuredBase,
        ...normalizePerformance(
          {
            ...featuredBase,
            start: featuredBase.start ?? performances[0]?.start,
            end: featuredBase.end ?? performances[performances.length - 1]?.end,
          },
          now,
        ),
        status: purchasable.length ? "on_sale" : derivePerformanceStatus(featuredBase, now),
        isSoldOut: !purchasable.length,
        ticketsAvailable: purchasable.length > 0,
      }
    : null;

  const performanceByDate = Object.fromEntries(
    performances.map((p) => [p.start?.slice(0, 10), p]).filter(([key]) => Boolean(key)),
  );

  const normalized = {
    ...catalog,
    performances,
    featuredTicket,
    performanceByDate,
    meta: {
      ...(catalog.meta ?? {}),
      catalogNormalizedAt: now.toISOString(),
    },
  };

  return catalogAllowsTestPerformances(normalized) ? normalized : stripTestPerformances(normalized);
}

/** Performances patrons should see (excludes dates after the show day in Eastern). */
export function displayPerformances(catalog, limit, now = new Date()) {
  const list = (catalog?.performances ?? [])
    .map((p) => normalizePerformance(p, now))
    .filter((p) => !isPastPerformance(p, now))
    .sort((a, b) => (a.start ?? "").localeCompare(b.start ?? ""));

  return typeof limit === "number" ? list.slice(0, limit) : list;
}
