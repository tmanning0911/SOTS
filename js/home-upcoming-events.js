import { MEDIA, SITE } from "./data.js";

const PLAY_ROUTES = {
  "much-ado-2026": "/productions/much-ado-about-nothing/",
  "kids-show-2026": "/productions/kids-show/",
};

const SEED_PLAYS = [
  {
    id: "much-ado-2026",
    title: "Much Ado About Nothing",
    dates: "June 10–28, 2026 · 7:30pm (Wed–Sun evenings; no Mondays)",
    image: "/images/hero-much-ado.jpg",
    featured: true,
    status: "On Sale",
    ticketUrl: SITE.ticketsUrl,
    sort_order: 1,
  },
  {
    id: "kids-show-2026",
    title: "Shakespeare for Kids",
    dates: "Summer 2026 · 6:30pm before evening performances",
    image: "/images/news/shakespeare-for-kids.jpg",
    status: "Free",
    ticketUrl: "/productions/kids-show/",
    sort_order: 2,
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
  },
  {
    id: "opening-night",
    title: "Opening Night Pre-show Reception",
    category: "Reception",
    date: "Saturday, June 13, 2026",
    time: "6–7:30pm",
    image: "/images/hero-much-ado.jpg",
    ctaLabel: "Get Tickets",
    ctaUrl: SITE.ticketsUrl,
    external: true,
    sort_order: 2,
  },
  {
    id: "directors-discuss",
    title: "Directors' Discuss Much Ado",
    category: "Talk",
    date: "Sunday, June 14, 2026",
    time: "6–6:45pm",
    image: "/images/hero-much-ado.jpg",
    ctaLabel: "Get Tickets",
    ctaUrl: SITE.ticketsUrl,
    external: true,
    sort_order: 3,
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
  const location = event.location?.includes("Pinkney") ? "Pinkney Park" : event.location;
  return [event.category, location].filter(Boolean).join(" · ");
}

function fromPlay(play, { featured = false } = {}) {
  const ticketUrl = play.ticketUrl || null;
  const isExternal = Boolean(ticketUrl?.startsWith("http"));
  const href = playHref(play);
  return {
    id: play.id,
    title: play.title,
    dates: play.dates,
    genre: play.id.includes("kids") ? "Family · Pinkney Park" : "Main Stage · Pinkney Park",
    image: play.image || MEDIA.heroHome,
    featureImage: play.image || MEDIA.heroBanner,
    href,
    tickets: isExternal ? ticketUrl : null,
    ctaLabel: play.status === "Free" ? "Free in the Park" : "Buy Tickets",
    ctaHref: isExternal ? ticketUrl : href,
    ctaExternal: isExternal,
    variant: featured ? "feature" : "photo",
  };
}

function fromEvent(event) {
  const ticketHref = event.ctaUrl || null;
  const isExternal = event.external ?? ticketHref?.startsWith("http");
  return {
    id: event.id,
    title: event.title,
    dates: formatEventDates(event),
    genre: formatEventGenre(event),
    image: event.image || event.poster || MEDIA.galaImage,
    featureImage: event.image || MEDIA.galaImage,
    href: eventHref(event),
    tickets: isExternal ? ticketHref : null,
    ctaLabel: event.ctaLabel || (isExternal ? "Get Tickets" : "Learn More"),
    ctaHref: ticketHref || eventHref(event),
    ctaExternal: Boolean(isExternal),
    variant: "photo",
  };
}

/**
 * Curated homepage lineup: main production, kids show, gala, plus season highlights.
 */
export function buildHomeUpcomingEvents(plays = SEED_PLAYS, events = SEED_EVENTS) {
  const activePlays = [...plays]
    .filter((p) => p.status !== "Archived")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const sortedEvents = [...events].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const mainPlay = activePlays.find((p) => p.featured) || activePlays[0];
  const kidsPlay = activePlays.find((p) => p.id?.includes("kids") || /kids/i.test(p.title || ""));
  const gala = sortedEvents.find((e) => e.featured) || sortedEvents.find((e) => e.id === "gala-2026");
  const seasonHighlights = sortedEvents
    .filter((e) => !e.featured)
    .slice(0, 2);

  const lineup = [];
  if (mainPlay) lineup.push(fromPlay(mainPlay, { featured: true }));
  if (kidsPlay && kidsPlay.id !== mainPlay?.id) lineup.push(fromPlay(kidsPlay));
  if (gala) lineup.push(fromEvent(gala));
  seasonHighlights.forEach((event) => {
    if (!lineup.some((item) => item.id === event.id)) {
      lineup.push(fromEvent(event));
    }
  });

  return lineup;
}

/** Static export for search + fallbacks */
export const HOME_UPCOMING_EVENTS = buildHomeUpcomingEvents();
