#!/usr/bin/env node
/**
 * Generates Shakespeare on the Sound inner & production pages.
 * Run: npm run generate
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { renderHead, FEEDBUCKET_SCRIPT } from "./head-meta.js";
import { INNER_PAGES, PRODUCTION_DETAILS } from "../js/pages-data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function hrefToFilePath(href) {
  const clean = href.replace(/\/$/, "").replace(/^\//, "");
  return path.join(ROOT, clean, "index.html");
}

function appShell({ title, description, path: href, image }) {
  return `<!DOCTYPE html>
<html lang="en-US">
<head>
${renderHead({ title, description, path: href, image })}
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
${FEEDBUCKET_SCRIPT}
</body>
</html>`;
}

function writePage(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function removeDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) removeDir(full);
    else fs.unlinkSync(full);
  }
  fs.rmdirSync(dir);
}

for (const dir of ["production", "productions", "shows", "theatre", "about", "support", "education", "venues", "gift-certificates", "privacy-policy", "careers", "search"]) {
  removeDir(path.join(ROOT, dir));
}

let count = 0;
for (const page of INNER_PAGES) {
  writePage(
    hrefToFilePath(page.href),
    appShell({ title: page.title, description: page.body.slice(0, 155), path: page.href })
  );
  count++;
}

for (const [slug, data] of Object.entries(PRODUCTION_DETAILS)) {
  writePage(
    path.join(ROOT, "productions", slug, "index.html"),
    appShell({ title: data.title, description: data.description, path: `/productions/${slug}/`, image: data.image })
  );
  count++;
}

console.log(`Generated ${count} Shakespeare on the Sound pages.`);
