/**
 * Post-build SEO: sitemap.xml + per-route HTML shells with unique <head>.
 * Netlify serves these static files before the SPA fallback, so crawlers
 * get correct title/description/canonical without executing JS.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  listSeoRoutes,
  listSitemapRoutes,
  patchHtmlHead,
  SITE_URL,
  toCanonicalPath,
} from "../js/seo.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const lastmod = new Date().toISOString().slice(0, 10);

function writeSitemap(routes) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => {
    const loc = route.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq || "monthly"}</changefreq>
    <priority>${route.priority || "0.8"}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>
`;

  writeFileSync(path.join(distDir, "sitemap.xml"), xml);
  writeFileSync(path.join(root, "public", "sitemap.xml"), xml);
  console.log(`Wrote sitemap.xml (${routes.length} URLs)`);
}

function prerenderHeads(shellHtml, routes) {
  let written = 0;
  for (const route of routes) {
    const html = patchHtmlHead(shellHtml, route);
    if (route.path === "/") {
      writeFileSync(path.join(distDir, "index.html"), html);
      written += 1;
      continue;
    }

    const segments = toCanonicalPath(route.path).replace(/^\/|\/$/g, "").split("/");
    const dir = path.join(distDir, ...segments);
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "index.html"), html);
    written += 1;
  }
  console.log(`Prerendered ${written} HTML shells with unique <head>`);
}

const shellPath = path.join(distDir, "index.html");
let shellHtml;
try {
  shellHtml = readFileSync(shellPath, "utf8");
} catch {
  console.error("dist/index.html missing — run vite build first");
  process.exit(1);
}

const allRoutes = listSeoRoutes();
const sitemapRoutes = listSitemapRoutes();

writeSitemap(sitemapRoutes);
prerenderHeads(shellHtml, allRoutes);

console.log(`SEO complete · site ${SITE_URL}`);
