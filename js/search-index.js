import {
  SITE,
  NAV_ITEMS,
  HOMEPAGE_NEWS,
  HOMEPAGE_FAQ,
  UTILITY_LINKS,
  UTILITY_LEFT,
  SEASON_SHOWS,
  QUICK_BAR_LINKS,
} from "./data.js";
import { HOME_UPCOMING_EVENTS } from "./home-upcoming-events.js";
import { INNER_PAGES, PRODUCTION_DETAILS } from "./pages-data.js";

let cachedIndex = null;

function pushItem(items, seen, entry) {
  const key = entry.id || `${entry.href}|${entry.title}`;
  if (!entry.href || seen.has(key)) return;
  seen.add(key);
  items.push({
    ...entry,
    keywords: [...(entry.keywords || []), entry.type?.toLowerCase()].filter(Boolean),
  });
}

function flattenNavLinks(item) {
  const links = [];
  item.columns?.forEach((col) => links.push(...col.links));
  if (item.featured) {
    links.push({
      label: item.featured.title,
      href: item.featured.href,
      meta: item.featured.meta,
      dates: item.featured.dates,
    });
  }
  return links;
}

export function buildSearchIndex() {
  if (cachedIndex) return cachedIndex;

  const items = [];
  const seen = new Set();

  pushItem(items, seen, {
    title: SITE.name,
    excerpt: `${SITE.tagline} Free outdoor Shakespeare in Norwalk and Rowayton, Connecticut.`,
    href: "/",
    type: "Home",
    keywords: ["shakespeare", "sound", "sos", "theatre", "theater", "connecticut"],
  });

  INNER_PAGES.forEach((page) => {
    pushItem(items, seen, {
      title: page.title,
      excerpt: page.body,
      href: page.href,
      type: "Page",
      keywords: [page.heading?.replace(/\.$/, "")],
    });
  });

  Object.entries(PRODUCTION_DETAILS).forEach(([slug, production]) => {
    pushItem(items, seen, {
      title: production.title,
      excerpt: production.description,
      href: `/productions/${slug}/`,
      type: "Production",
      keywords: [production.venue, production.date, production.season, production.director].filter(Boolean),
    });
  });

  SEASON_SHOWS.forEach((show) => {
    pushItem(items, seen, {
      title: show.title,
      excerpt: show.description,
      href: show.href,
      type: "Production",
      keywords: [show.venue, show.dates, show.badge],
    });
  });

  HOME_UPCOMING_EVENTS.forEach((event) => {
    pushItem(items, seen, {
      title: event.title,
      excerpt: `${event.dates} · ${event.genre}`,
      href: event.href,
      type: "Event",
      keywords: [event.genre, event.dates],
    });
  });

  HOMEPAGE_NEWS.forEach((article) => {
    pushItem(items, seen, {
      title: article.title,
      excerpt: article.excerpt,
      href: article.href,
      type: "News",
      keywords: [article.category],
    });
  });

  HOMEPAGE_FAQ.forEach((item) => {
    pushItem(items, seen, {
      title: item.q,
      excerpt: item.a,
      href: "/about/faq/",
      type: "FAQ",
      keywords: ["question", "help", "tickets", "parking", "weather", "rain"],
    });
  });

  NAV_ITEMS.forEach((item) => {
    flattenNavLinks(item).forEach((link) => {
      if (link.external) return;
      pushItem(items, seen, {
        title: link.label,
        excerpt: `Find ${link.label} under ${item.label}.`,
        href: link.href,
        type: "Page",
        keywords: [item.label],
      });
    });
  });

  [...UTILITY_LEFT, ...UTILITY_LINKS].forEach((link) => {
    if (link.children) {
      link.children.forEach((child) => {
        if (child.external) return;
        pushItem(items, seen, {
          title: child.label,
          excerpt: `Quick link: ${child.label}`,
          href: child.href,
          type: "Page",
          keywords: [link.label],
        });
      });
      return;
    }
    if (link.href && !link.external && !link.action) {
      pushItem(items, seen, {
        title: link.label,
        excerpt: `Quick link: ${link.label}`,
        href: link.href,
        type: "Page",
      });
    }
  });

  QUICK_BAR_LINKS.forEach((link) => {
    if (link.action) return;
    pushItem(items, seen, {
      title: link.label,
      excerpt: `Plan your visit: ${link.label}`,
      href: link.href,
      type: "Page",
      keywords: ["visit", "plan"],
    });
  });

  pushItem(items, seen, {
    title: "Box Office",
    excerpt: `Call ${SITE.boxOffice} or email ${SITE.email}. ${SITE.address}`,
    href: "/about/contact/",
    type: "Contact",
    keywords: ["phone", "email", "tickets", "contact", SITE.boxOffice, SITE.email],
  });

  pushItem(items, seen, {
    title: "Get Tickets",
    excerpt: "Purchase general admission and reserved seating through Eventbrite.",
    href: SITE.ticketsUrl,
    type: "Tickets",
    external: true,
    keywords: ["eventbrite", "buy", "reserved", "seating"],
  });

  cachedIndex = items;
  return items;
}

function scoreItem(item, terms) {
  const title = item.title.toLowerCase();
  const excerpt = (item.excerpt || "").toLowerCase();
  const keywords = (item.keywords || []).join(" ").toLowerCase();
  const haystack = `${title} ${excerpt} ${keywords}`;

  let score = 0;
  for (const term of terms) {
    if (title === term) score += 12;
    else if (title.startsWith(term)) score += 8;
    else if (title.includes(term)) score += 6;
    else if (keywords.includes(term)) score += 4;
    else if (excerpt.includes(term)) score += 2;
    else return 0;
  }
  return score;
}

export function searchSite(query, { limit = 10 } = {}) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const terms = normalized.split(/\s+/).filter(Boolean);
  const index = buildSearchIndex();

  return index
    .map((item) => ({ item, score: scoreItem(item, terms) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map(({ item }) => item);
}
