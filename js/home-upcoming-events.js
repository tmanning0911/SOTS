import { MEDIA } from "./data.js";
import { TICKETS_PAGE_PATH } from "./ticketing.js";

const PLAY_ROUTES = {
  "much-ado-2026": "/productions/much-ado-about-nothing/",
  "kids-show-2026": "/productions/kids-show/",
};

const PAST_PLAY_STATUSES = new Set(["Archived", "Ended", "Past", "Closed"]);

const SEED_PLAYS = [
  {
    id: "much-ado-2026",
    title: "Much Ado About Nothing",
    dates: "June 10–28, 2026 · 7:30pm (Wed–Sun evenings; no Mondays)",
    image: "/images/hero-much-ado.jpg",
    featured: true,
    status: "Ended",
    ticketUrl: TICKETS_PAGE_PATH,
    sort_order: 1,
    calendar: { end: "2026-06-28T22:00:00" },
  },
  {
    id: "kids-show-2026",
    title: "Shakespeare for Kids",
    dates: "Summer 2026 · 6:30pm before evening performances",
    image: "/images/news/shakespeare-for-kids.jpg",
    status: "Accessible",
    ticketUrl: "/productions/kids-show/",
    sort_order: 2,
    calendar: { end: "2026-06-28T19:00:00" },
  },
];

const SEED_EVENTS = [
  {
    id: "gala-2026",
    title: "Much Ado About Something",
    category: "Gala",
    date: "Friday, October 16, 2026",
    time: "6–10pm",
    location: "Norwalk, CT",
    featured: true,
    image: "/images/news/gala-2026.jpg",
    ctaLabel: "Join the Committee",
    ctaUrl: "/contact?topic=sponsorship",
    external: false,
    sort_order: 1,
    calendar: { start: "2026-10-16T18:00:00", end: "2026-10-16T22:00:00" },
  },
  {
    id: "mahjong-night-2026",
    title: "Mahjong Midsummer Classic",
    category: "Fundraiser",
    date: "Saturday, September 19, 2026",
    time: "11:00 AM–2:00 PM",
    location: "Rowayton, CT",
    featured: false,
    image: "/images/mahjong-midsummer-classic-poster.jpg",
    ctaLabel: "Get Tickets",
    ctaUrl: "/events/mahjong-night/",
    external: false,
    sort_order: 2,
    calendar: { start: "2026-09-19T11:00:00", end: "2026-09-19T14:00:00" },
  },
];

function playHref(play) {
  return PLAY_ROUTES[play.id] || `/productions/${play.id}/`;
}

function eventHref(event) {
  return `/support/events#${event.id}`;
}

function formatEventDates(event) {
  if (event.dates) return event.dates;
  const parts = [event.date, event.time].filter(Boolean);
  return parts.join(" · ");
}

function formatEventGenre(event) {
  if (event.genre) return event.genre;
  const location = event.location?.includes("Pinkney") ? "Shakespeare in Pinkney Park" : event.location;
  return [event.category, location].filter(Boolean).join(" · ");
}

function endMs(item) {
  const end =
    item?.calendar?.end ??
    item?.calendar?.occurrences?.at?.(-1)?.end ??
    item?.calendar?.occurrences?.at?.(-1)?.start ??
    item?.calendar?.start ??
    null;
  if (end) {
    const ms = Date.parse(end);
    if (Number.isFinite(ms)) return ms;
  }
  // Soft parse common "Month D, YYYY" date strings when catalog omits calendar.end
  if (typeof item?.date === "string") {
    const ms = Date.parse(item.date);
    if (Number.isFinite(ms)) return ms;
  }
  return null;
}

function isPastItem(item, now = Date.now()) {
  if (PAST_PLAY_STATUSES.has(String(item?.status || ""))) return true;
  const end = endMs(item);
  if (end == null) return false;
  return end < now - 12 * 60 * 60 * 1000;
}

function fromPlay(play, { featured = false } = {}) {
  const href = playHref(play);
  const isTicketed =
    play.status !== "Accessible" &&
    play.status !== "Archived" &&
    play.status !== "Ended" &&
    !isPastItem(play);
  return {
    id: play.id,
    title: play.title,
    dates: play.dates,
    genre: play.id.includes("kids") ? "Family · Shakespeare in Pinkney Park" : "Main Stage · Shakespeare in Pinkney Park",
    image: play.image || MEDIA.heroHome,
    featureImage: play.image || MEDIA.heroBanner,
    href,
    tickets: isTicketed ? TICKETS_PAGE_PATH : null,
    ctaLabel: isTicketed ? "Tickets" : "Learn More",
    ctaHref: isTicketed ? TICKETS_PAGE_PATH : href,
    ctaExternal: false,
    variant: featured ? "feature" : "photo",
  };
}

function fromEvent(event, { featured = false } = {}) {
  const isTicket = /ticket/i.test(event.ctaLabel ?? "");
  const ticketHref = isTicket ? event.ctaUrl || TICKETS_PAGE_PATH : event.ctaUrl || null;
  return {
    id: event.id,
    title: event.title,
    dates: formatEventDates(event),
    genre: formatEventGenre(event),
    image: event.image || event.poster || MEDIA.galaImage,
    featureImage: event.image || MEDIA.galaImage,
    href: eventHref(event),
    tickets: isTicket ? ticketHref : null,
    ctaLabel: event.ctaLabel || (isTicket ? "Tickets" : "Learn More"),
    ctaHref: ticketHref || eventHref(event),
    ctaExternal: false,
    variant: featured ? "feature" : "photo",
  };
}

/**
 * Homepage lineup — only future / current items (past summer productions are sunset).
 */
export function buildHomeUpcomingEvents(plays = SEED_PLAYS, events = SEED_EVENTS, now = Date.now()) {
  const activePlays = [...plays]
    .filter((p) => !isPastItem(p, now))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const upcomingEvents = [...events]
    .filter((e) => !isPastItem(e, now))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const featuredEvent = upcomingEvents.find((e) => e.featured) || upcomingEvents[0];
  const lineup = [];

  if (featuredEvent) {
    lineup.push(fromEvent(featuredEvent, { featured: true }));
  }

  activePlays.forEach((play) => {
    if (!lineup.some((item) => item.id === play.id)) {
      lineup.push(fromPlay(play, { featured: lineup.length === 0 }));
    }
  });

  upcomingEvents.forEach((event) => {
    if (!lineup.some((item) => item.id === event.id)) {
      lineup.push(fromEvent(event));
    }
  });

  return lineup.slice(0, 4);
}

/** Static export for search + fallbacks */
export const HOME_UPCOMING_EVENTS = buildHomeUpcomingEvents();
