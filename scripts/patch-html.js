#!/usr/bin/env node
/**
 * Patches all HTML files to use built assets after Vite build.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !["node_modules", "assets", "src", ".git"].includes(entry.name)) {
      walk(full, files);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

const cssPath = fs.existsSync(path.join(ROOT, "assets/app.css")) ? "/assets/app.css" : null;
const jsPath = fs.existsSync(path.join(ROOT, "assets/app.js")) ? "/assets/app.js" : null;

if (!cssPath || !jsPath) {
  console.log("No built assets found — skipping HTML patch (run npm run build first).");
  process.exit(0);
}

const cssTag = `<link rel="stylesheet" href="${cssPath}" />`;
const jsTag = `<script type="module" src="${jsPath}"></script>`;

for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, "utf8");

  html = html.replace(/<link rel="stylesheet" href="\/assets\/app\.css"[^>]*>\s*/g, "");
  html = html.replace(/<script type="module" src="\/assets\/app\.js"><\/script>\s*/g, "");
  html = html.replace(/<script type="module" src="\/src\/main\.jsx"><\/script>\s*/g, "");
  html = html.replace(/<script type="module" src="\/src\/app\.js"><\/script>\s*/g, "");
  html = html.replace(/<link rel="stylesheet" href="https:\/\/cdn\.jsdelivr\.net\/npm\/@splidejs[^>]+>\s*/g, "");
  html = html.replace(/<link rel="stylesheet" href="\/css\/styles\.css"[^>]*>\s*/g, "");
  html = html.replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@splidejs[^<]+<\/script>\s*/g, "");
  html = html.replace(/<script src="\/js\/data\.js"><\/script>\s*/g, "");
  html = html.replace(/<script src="\/js\/main\.js"><\/script>\s*/g, "");
  html = html.replace(/<script src="\/js\/page\.js"><\/script>\s*/g, "");

  if (!html.includes("/assets/app.css")) {
    html = html.replace("</head>", `  ${cssTag}\n</head>`);
  }

  if (!html.includes("/assets/app.js")) {
    html = html.replace("</body>", `  ${jsTag}\n</body>`);
  }

  fs.writeFileSync(file, html, "utf8");
}

console.log(`Patched ${walk(ROOT).length} HTML files to use ${jsPath}`);
