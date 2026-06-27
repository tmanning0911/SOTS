#!/usr/bin/env node
/** Generates sitemap.xml — Front-End Checklist SEO */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SITE_URL = "https://www.shakespeareonthesound.org";

function walkHtml(dir, base = "") {
  const urls = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !["node_modules", "assets", "src", "scripts"].includes(entry.name)) {
      urls.push(...walkHtml(full, rel));
    } else if (entry.name === "index.html") {
      const urlPath = base ? `/${base.replace(/\\/g, "/")}/` : "/";
      if (!urlPath.includes("404")) urls.push(urlPath);
    }
  }
  return urls;
}

const paths = walkHtml(ROOT).sort();
const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p === "/" ? "" : p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${p === "/" ? "1.0" : "0.7"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");
console.log(`Generated sitemap.xml with ${paths.length} URLs.`);
