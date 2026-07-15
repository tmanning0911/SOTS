/**
 * Org-wide calendar feed for /education/events/
 * Merges season events, productions, and education program windows.
 */

const PLAY_ROUTES = {
  "much-ado-2026": "/productions/much-ado-about-nothing/",
  "kids-show-2026": "/productions/kids-show/",
};

/** Education / community program windows (not always in events.json). */
export const EDUCATION_PROGRAM_SEEDS = [
  {
    id: "spring-tours-2026",
    title: "Spring School Tours",
    category: "Education",
    dateLabel: "Late May–early June 2026",
    location: "Schools & libraries, Fairfield County",
    description: "R+J4evr (grades 6+) and Much Ado About Nothing for Kids (grades K–5) touring performances.",
    href: "/education/tours/",
    ctaLabel: "Book a tour",
    start: "2026-05-19T09:00:00",
    end: "2026-06-06T17:00:00",
  },
  {
    id: "apprentice-company-2026",
    title: "2026 Apprentice Company",
    category: "Education",
    dateLabel: "May 4–June 29, 2026",
    location: "Connecticut & New York City",
    description: "Professional training in acting, directing, playwriting, education, costuming, and production.",
    href: "/education/apprentice-application/",
    ctaLabel: "Apprentice info",
    start: "2026-05-04T09:00:00",
    end: "2026-06-29T17:00:00",
  },
  {
    id: "globe-company-rowayton-2026",
    title: "The Globe Company — Rowayton",
    category: "Education",
    dateLabel: "June 16–27, 2026 · Performance June 28",
    location: "Rowayton Community Center, Rowayton, CT",
    mapQuery: "United Church of Rowayton Community Center, Rowayton, CT",
    description: "Summer camp for ages 8–15. Scenes from Macbeth; ensemble-focused process with a closing performance.",
    href: "/education/summer-camps/",
    ctaLabel: "Summer camps",
    start: "2026-06-16T11:00:00",
    end: "2026-06-28T14:00:00",
  },
  {
    id: "globe-company-ridgefield-2026",
    title: "The Globe Company — Ridgefield",
    category: "Education",
    dateLabel: "August 4–8, 2026",
    location: "Ridgefield Academy, Ridgefield, CT",
    mapQuery: "Ridgefield Academy, Ridgefield, CT",
    description: "A week of Shakespeare for ages 10–15 — scenes, ensemble work, and a shared performance.",
    href: "/education/summer-camps/",
    ctaLabel: "Summer camps",
    start: "2026-08-04T11:00:00",
    end: "2026-08-08T15:00:00",
  },
  {
    id: "in-the-park-2026",
    title: "In the Park — Kids' Show & First Folio Tent",
    category: "Education",
    dateLabel: "June 10–28, 2026 · 6:30pm (except Mondays)",
    location: "Pinkney Park, Rowayton, CT",
    mapQuery: "Pinkney Park, 177 Rowayton Avenue, Rowayton, CT",
    description: "Accessible Kids' Show before Main Stage evenings, plus Book Club and First Folio Tent nightly programming.",
    href: "/education/in-the-park/",
    ctaLabel: "In the park",
    start: "2026-06-10T18:30:00",
    end: "2026-06-28T19:00:00",
  },
];

const FILTER_CATEGORIES = ["Programs", "Camps", "Tours", "In the Park"];

/** Catalog events that belong on the Education calendar (not galas/fundraisers/main stage). */
const EDUCATION_EVENT_IDS = new Set(["book-club", "apprentice-matinee"]);

/** Productions that are education programming. */
const EDUCATION_PLAY_IDS = new Set(["kids-show-2026"]);

function educationBucket({ id = "", title = "", category = "" } = {}) {
  const hay = `${id} ${title} ${category}`.toLowerCase();
  if (/camp|globe/.test(hay)) return "Camps";
  if (/tour/.test(hay)) return "Tours";
  if (/park|kids-show|kids show|in-the-park|book-club|folio|matinee/.test(hay)) return "In the Park";
  return "Programs";
}

function isEducationCatalogEvent(event) {
  if (!event?.id) return false;
  if (EDUCATION_EVENT_IDS.has(event.id)) return true;
  return String(event.category || "").toLowerCase() === "education";
}

function isEducationPlay(play) {
  if (!play?.id) return false;
  return EDUCATION_PLAY_IDS.has(play.id);
}

function dayKeyFromIso(iso) {
  if (!iso || typeof iso !== "string") return "";
  return iso.slice(0, 10);
}

function parseMs(iso) {
  if (!iso) return null;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : null;
}

function mapCategory(raw) {
  const value = String(raw || "").toLowerCase();
  if (value.includes("fundrais") || value.includes("gala") || value.includes("reception")) return "Fundraiser";
  if (value.includes("educat") || value.includes("camp") || value.includes("tour") || value.includes("apprentice")) {
    return "Education";
  }
  if (value.includes("perform") || value.includes("stage") || value.includes("show")) return "Performance";
  if (value.includes("talk") || value.includes("community") || value.includes("book")) return "Community";
  return "Community";
}

function eachDayKey(startIso, endIso) {
  const startKey = dayKeyFromIso(startIso);
  const endKey = dayKeyFromIso(endIso || startIso);
  if (!startKey) return [];
  const keys = [];
  const cursor = new Date(`${startKey}T12:00:00`);
  const end = new Date(`${(endKey || startKey)}T12:00:00`);
  if (!Number.isFinite(cursor.getTime()) || !Number.isFinite(end.getTime())) return [startKey];
  const guard = 120;
  let n = 0;
  while (cursor <= end && n < guard) {
    keys.push(
      `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`,
    );
    cursor.setDate(cursor.getDate() + 1);
    n += 1;
  }
  return keys.length ? keys : [startKey];
}

function formatRangeLabel(startIso, endIso, fallback = "") {
  if (fallback) return fallback;
  const startMs = parseMs(startIso);
  const endMs = parseMs(endIso);
  if (!startMs) return "";
  const startFmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
  const sameDay = endMs && dayKeyFromIso(startIso) === dayKeyFromIso(endIso);
  if (!endMs || sameDay) return startFmt.format(startMs);
  const endFmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
  return `${startFmt.format(startMs)} – ${endFmt.format(endMs)}`;
}

function normalizeItem({
  id,
  title,
  category,
  start,
  end,
  location = "",
  mapQuery = "",
  description = "",
  href = "/education/events/",
  ctaLabel = "Learn more",
  dateLabel = "",
  source = "seed",
}) {
  const startMs = parseMs(start) ?? 0;
  const endMs = parseMs(end) ?? startMs;
  return {
    id,
    title,
    category: educationBucket({ id, title, category }),
    start,
    end: end || start,
    startMs,
    endMs,
    dayKeys: eachDayKey(start, end || start),
    location,
    mapQuery: mapQuery || location,
    description,
    href,
    ctaLabel,
    dateLabel: formatRangeLabel(start, end || start, dateLabel),
    source,
  };
}

function expandEventOccurrences(event) {
  const occurrences = event?.calendar?.occurrences;
  if (Array.isArray(occurrences) && occurrences.length) {
    return occurrences.map((occ, index) =>
      normalizeItem({
        id: `${event.id}-${index + 1}`,
        title: event.title,
        category: event.category,
        start: occ.start,
        end: occ.end || occ.start,
        location: event.location,
        mapQuery: event.mapQuery || event.location,
        description: event.description,
        href: event.ctaUrl || "/support/events/",
        ctaLabel: event.ctaLabel || "Learn more",
        dateLabel: event.date,
        source: "events",
      }),
    );
  }

  const start = event?.calendar?.start;
  if (!start) return [];

  return [
    normalizeItem({
      id: event.id,
      title: event.title,
      category: event.category,
      start,
      end: event.calendar?.end || start,
      location: event.location,
      mapQuery: event.mapQuery || event.location,
      description: event.description,
      href: event.ctaUrl || "/support/events/",
      ctaLabel: event.ctaLabel || "Learn more",
      dateLabel: [event.date, event.time].filter(Boolean).join(" · "),
      source: "events",
    }),
  ];
}

function playHref(play) {
  return PLAY_ROUTES[play.id] || play.ticketUrl || `/productions/${play.id}/`;
}

function fromPlay(play) {
  const start = play?.calendar?.start;
  if (!start) return null;
  return normalizeItem({
    id: play.id,
    title: play.title,
    category: "Performance",
    start,
    end: play.calendar?.end || start,
    location: play.location,
    mapQuery: play.location,
    description: play.subtitle || play.description?.slice?.(0, 180) || "",
    href: playHref(play),
    ctaLabel: "About the production",
    dateLabel: play.dates,
    source: "plays",
  });
}

/**
 * @param {object[]} [events]
 * @param {object[]} [plays]
 * @param {object[]} [seeds]
 */
export function buildEducationEventsCalendar(
  events = [],
  plays = [],
  seeds = EDUCATION_PROGRAM_SEEDS,
) {
  const fromEvents = (Array.isArray(events) ? events : [])
    .filter(isEducationCatalogEvent)
    .flatMap(expandEventOccurrences);
  const fromPlays = (Array.isArray(plays) ? plays : [])
    .filter(isEducationPlay)
    .map(fromPlay)
    .filter(Boolean);
  const fromSeeds = (Array.isArray(seeds) ? seeds : []).map((seed) =>
    normalizeItem({ ...seed, source: "seed" }),
  );

  const seen = new Set();
  const items = [...fromSeeds, ...fromPlays, ...fromEvents].filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  items.sort((a, b) => a.startMs - b.startMs || a.title.localeCompare(b.title));
  return items;
}

export function filterCalendarItems(items, category = "all", now = Date.now()) {
  const list = Array.isArray(items) ? items : [];
  const filtered =
    category && category !== "all"
      ? list.filter((item) => item.category === category)
      : list;
  return {
    upcoming: filtered.filter((item) => item.endMs >= now),
    past: filtered.filter((item) => item.endMs < now).reverse(),
    all: filtered,
  };
}

export function itemsByDayKey(items) {
  const map = new Map();
  for (const item of items || []) {
    for (const key of item.dayKeys || []) {
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    }
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.startMs - b.startMs || a.title.localeCompare(b.title));
  }
  return map;
}

export function calendarFilterCategories() {
  return FILTER_CATEGORIES;
}

export function monthLabel(year, monthIndex) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(new Date(year, monthIndex, 1));
}

export function buildMonthCells(year, monthIndex, byDay) {
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push({ type: "pad" });
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({ type: "day", day, key, items: byDay.get(key) ?? [] });
  }
  return cells;
}
