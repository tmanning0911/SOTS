/**
 * Post-build sitemap for Netlify deploy.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INNER_PAGES, hrefToRoutePath } from "../js/pages-data.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = (process.env.VITE_SITE_URL || "https://www.shakespeareonthesound.org").replace(/\/$/, "");
const lastmod = new Date().toISOString().slice(0, 10);

const routes = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  ...INNER_PAGES.map((page) => ({
    loc: hrefToRoutePath(page.href),
    priority: page.href.includes("/productions/") ? "0.9" : "0.8",
    changefreq: "monthly",
  })),
  { loc: "/productions/much-ado-about-nothing", priority: "0.95", changefreq: "weekly" },
  { loc: "/productions/kids-show", priority: "0.85", changefreq: "monthly" },
  { loc: "/productions/past-productions", priority: "0.75", changefreq: "yearly" },
];

const unique = [...new Map(routes.map((r) => [r.loc, r])).values()];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route.loc.startsWith("/") ? route.loc : `/${route.loc}`}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

mkdirSync(path.join(root, "dist"), { recursive: true });
writeFileSync(path.join(root, "dist/sitemap.xml"), xml);
console.log(`Wrote dist/sitemap.xml (${unique.length} URLs)`);
