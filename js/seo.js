/**
 * Single SEO catalog + head helpers.
 * Used by React (usePageMeta) and post-build generate-seo.mjs.
 */

import { SITE_URL, SITE_META } from "./site-config.js";
import { INNER_PAGES, PRODUCTION_DETAILS } from "./pages-data.js";
import { NEWS_ARCHIVE } from "./news-archive.js";
import { GALA_EVENT, GALA_PATH } from "./gala-event.js";
import { MAHJONG_NIGHT, MAHJONG_NIGHT_PATH } from "./mahjong-night.js";
import { PROGRAM_ADS, PROGRAM_ADS_PATH } from "./program-ads-sponsorships.js";
import { DONATE_PATH } from "./donate.js";

export { SITE_URL, SITE_META };

export const DEFAULT_DESCRIPTION =
  "Shakespeare on the Sound presents affordable outdoor Shakespeare in Pinkney Park, Rowayton, CT. Where Shakespeare Lives Now!";

export const HOME_TITLE =
  "Shakespeare on the Sound | Affordable Outdoor Shakespeare in Rowayton, CT";

export const HOME_DESCRIPTION =
  "The 2026 season has ended. Give now to support affordable outdoor Shakespeare in Pinkney Park, Rowayton, CT.";

/** @typedef {{
 *   path: string,
 *   title: string,
 *   description: string,
 *   image?: string,
 *   noindex?: boolean,
 *   isHome?: boolean,
 *   priority?: string,
 *   changefreq?: string,
 * }} SeoRoute */

export function clipMetaDescription(text, max = 155) {
  const clean = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return DEFAULT_DESCRIPTION;
  if (clean.length <= max) return clean;
  const sliced = clean.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

export function toCanonicalPath(path = "/") {
  if (!path || path === "/") return "/";
  let p = path.startsWith("/") ? path : `/${path}`;
  p = p.replace(/\/{2,}/g, "/");
  if (!p.endsWith("/")) p = `${p}/`;
  return p;
}

export function absoluteUrl(path = "/") {
  const p = toCanonicalPath(path);
  return p === "/" ? `${SITE_URL}/` : `${SITE_URL}${p}`;
}

export function absoluteAssetUrl(src) {
  if (!src) return SITE_META.ogImage;
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE_URL}${src.startsWith("/") ? src : `/${src}`}`;
}

export function formatDocumentTitle(title, { isHome = false } = {}) {
  if (isHome) return title || HOME_TITLE;
  const t = String(title || "").trim();
  if (!t) return SITE_META.name;
  if (t.includes(SITE_META.name)) return t;
  return `${t} | ${SITE_META.name}`;
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** @returns {SeoRoute} */
export function buildSeoRoute({
  path,
  title,
  description,
  image,
  noindex = false,
  isHome = false,
  priority = "0.8",
  changefreq = "monthly",
}) {
  return {
    path: toCanonicalPath(path),
    title: formatDocumentTitle(title, { isHome }),
    description: clipMetaDescription(description),
    image: absoluteAssetUrl(image),
    noindex,
    isHome,
    priority,
    changefreq,
  };
}

function route(path, title, description, extra = {}) {
  return buildSeoRoute({ path, title, description, ...extra });
}

function buildCatalog() {
  /** @type {SeoRoute[]} */
  const routes = [
    route("/", HOME_TITLE, HOME_DESCRIPTION, { isHome: true, priority: "1.0", changefreq: "weekly" }),
    ...INNER_PAGES.map((page) =>
      route(
        page.href,
        page.title,
        page.intro || page.heading || `${page.title} — Shakespeare on the Sound in Rowayton, CT.`,
      ),
    ),
    route(
      "/tickets/",
      "Tickets & Dates",
      "The 2026 season has ended. Nothing is on sale. Give now to support Shakespeare on the Sound in Rowayton, CT.",
      { priority: "0.95", changefreq: "weekly" },
    ),
    route(
      "/events/",
      "Events",
      "Past Shakespeare on the Sound events. The 2026 gala, mahjong afternoon, and Pinkney Park season have ended.",
      { priority: "0.9", changefreq: "weekly" },
    ),
    route(MAHJONG_NIGHT_PATH, MAHJONG_NIGHT.title, MAHJONG_NIGHT.intro, {
      image: MAHJONG_NIGHT.bannerImage,
      priority: "0.9",
      changefreq: "weekly",
    }),
    route(GALA_PATH, GALA_EVENT.title, GALA_EVENT.intro, {
      image: GALA_EVENT.image,
      priority: "0.9",
      changefreq: "weekly",
    }),
    route(
      "/shop/",
      "Gift Shop",
      "Shop Shakespeare on the Sound merch and gifts that support affordable outdoor theatre in Rowayton, CT.",
      { priority: "0.85", changefreq: "weekly" },
    ),
    route(
      "/news/",
      "News & History",
      "News, season announcements, and history from Shakespeare on the Sound — outdoor Shakespeare in Pinkney Park since 1998.",
      { priority: "0.75", changefreq: "weekly" },
    ),
    route(
      "/access-your-tickets/",
      "Ticket Lookup",
      "Look up your Shakespeare on the Sound order and access your tickets by email.",
      { priority: "0.5" },
    ),
    route(DONATE_PATH, "Donate", "Support Shakespeare on the Sound — donate today to keep affordable outdoor Shakespeare and education programs thriving in Fairfield County.", {
      priority: "0.9",
      changefreq: "monthly",
    }),
    route(PROGRAM_ADS_PATH, PROGRAM_ADS.title, PROGRAM_ADS.intro, { priority: "0.8" }),
    route("/my-tickets/", "My Tickets", "Sign in to view your Shakespeare on the Sound tickets and orders.", {
      noindex: true,
      priority: "0.1",
      changefreq: "yearly",
    }),
    route("/admin/ticketing/", "Ticketing Admin", "Internal ticketing administration for Shakespeare on the Sound.", {
      noindex: true,
      priority: "0.1",
      changefreq: "yearly",
    }),
    route("/404/", "Page Not Found", "The page you're looking for could not be found on Shakespeare on the Sound.", {
      noindex: true,
      priority: "0.1",
      changefreq: "yearly",
    }),
  ];

  for (const [slug, data] of Object.entries(PRODUCTION_DETAILS)) {
    routes.push(
      route(`/productions/${slug}/`, data.title, data.description || data.intro, {
        image: data.heroImage || data.image,
        priority: slug.includes("past") ? "0.75" : "0.9",
        changefreq: slug.includes("past") ? "yearly" : "weekly",
      }),
    );
  }

  for (const article of NEWS_ARCHIVE) {
    routes.push(
      route(article.href || `/news/${article.slug}/`, article.title, article.excerpt, {
        image: article.image,
        priority: "0.65",
      }),
    );
  }

  return [...new Map(routes.map((r) => [r.path, r])).values()];
}

/** @type {SeoRoute[] | null} */
let cachedRoutes = null;
/** @type {Map<string, SeoRoute> | null} */
let cachedByPath = null;

function ensureCatalog() {
  if (!cachedByPath) {
    cachedRoutes = buildCatalog();
    cachedByPath = new Map(cachedRoutes.map((r) => [r.path, r]));
  }
  return cachedByPath;
}

export function listSeoRoutes() {
  ensureCatalog();
  return cachedRoutes;
}

/**
 * Prefer /events/ as the public events hub; keep /support/events/ as an alias in the catalog.
 */
export function listSitemapRoutes() {
  return listSeoRoutes().filter((r) => {
    if (r.noindex) return false;
    // Prefer the primary events URL over the support alias
    if (r.path === "/support/events/") return false;
    return true;
  });
}

export function getSeoForPath(pathname) {
  const path = toCanonicalPath(pathname);
  const byPath = ensureCatalog();
  return (
    byPath.get(path) ||
    buildSeoRoute({
      path,
      title: SITE_META.name,
      description: DEFAULT_DESCRIPTION,
    })
  );
}

/**
 * Resolve catalog SEO, optionally merging overrides (dynamic pages / 404).
 * @param {string | Partial<SeoRoute> | null | undefined} input
 * @param {string} [fallbackPath]
 */
export function resolveSeo(input, fallbackPath = "/") {
  if (typeof input === "string") return getSeoForPath(input);

  const path = toCanonicalPath(input?.path || fallbackPath);
  const base = getSeoForPath(path);
  if (!input || typeof input !== "object") return base;

  const isHome = Boolean(input.isHome) || path === "/";
  return {
    ...base,
    path,
    isHome,
    noindex: input.noindex ?? base.noindex,
    image: input.image != null ? absoluteAssetUrl(input.image) : base.image,
    title:
      input.title != null
        ? formatDocumentTitle(input.title, { isHome })
        : base.title,
    description:
      input.description != null
        ? clipMetaDescription(input.description)
        : base.description,
    priority: input.priority ?? base.priority,
    changefreq: input.changefreq ?? base.changefreq,
  };
}

export function applyDocumentSeo(seo) {
  if (typeof document === "undefined") return;

  const resolved = resolveSeo(seo, seo?.path || "/");
  const canonical = absoluteUrl(resolved.path);
  const robots = resolved.noindex ? "noindex, nofollow" : "index, follow";

  document.title = resolved.title;
  setMetaByName("description", resolved.description);
  setMetaByName("robots", robots);
  setLinkCanonical(canonical);

  setMetaByProperty("og:type", "website");
  setMetaByProperty("og:site_name", SITE_META.name);
  setMetaByProperty("og:title", resolved.title);
  setMetaByProperty("og:description", resolved.description);
  setMetaByProperty("og:url", canonical);
  setMetaByProperty("og:image", resolved.image || SITE_META.ogImage);
  setMetaByProperty("og:locale", SITE_META.locale || "en_US");

  setMetaByName("twitter:card", "summary_large_image");
  setMetaByName("twitter:site", SITE_META.twitter || "@shakesonsound");
  setMetaByName("twitter:title", resolved.title);
  setMetaByName("twitter:description", resolved.description);
  setMetaByName("twitter:image", resolved.image || SITE_META.ogImage);
}

function setMetaByName(name, content) {
  let el = document.head.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaByProperty(property, content) {
  let el = document.head.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLinkCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** @param {string} html @param {SeoRoute} seo */
export function patchHtmlHead(html, seo) {
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const canonical = escapeHtml(absoluteUrl(seo.path));
  const image = escapeHtml(seo.image || SITE_META.ogImage);
  const robots = seo.noindex ? "noindex, nofollow" : "index, follow";

  let out = html;
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
  out = replaceMetaName(out, "description", description);
  out = replaceMetaName(out, "robots", robots);
  out = out.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${canonical}" />`,
  );
  out = replaceMetaProperty(out, "og:title", title);
  out = replaceMetaProperty(out, "og:description", description);
  out = replaceMetaProperty(out, "og:url", canonical);
  out = replaceMetaProperty(out, "og:image", image);
  out = replaceMetaName(out, "twitter:title", title);
  out = replaceMetaName(out, "twitter:description", description);
  out = replaceMetaName(out, "twitter:image", image);
  return out;
}

function replaceMetaName(html, name, content) {
  const re = new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]*"\\s*\\/?>`, "i");
  if (re.test(html)) return html.replace(re, `<meta name="${name}" content="${content}" />`);
  return html.replace(/<\/title>/i, `</title>\n  <meta name="${name}" content="${content}" />`);
}

function replaceMetaProperty(html, property, content) {
  const re = new RegExp(`<meta\\s+property="${property}"\\s+content="[^"]*"\\s*\\/?>`, "i");
  if (re.test(html)) return html.replace(re, `<meta property="${property}" content="${content}" />`);
  return html.replace(
    /<meta property="og:type"/i,
    `<meta property="${property}" content="${content}" />\n  <meta property="og:type"`,
  );
}

/** @deprecated use getSeoForPath(page.href) */
export function seoFromInnerPage(page) {
  return getSeoForPath(page.href);
}
