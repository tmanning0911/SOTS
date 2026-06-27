#!/usr/bin/env node
/** Restores dev asset paths in HTML (Vite HMR). */
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

for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/<link rel="stylesheet" href="\/assets\/app\.css"[^>]*>\s*/g, "");
  html = html.replace(/<script type="module" src="\/assets\/app\.js"><\/script>\s*/g, "");
  html = html.replace(/<script type="module" src="\/src\/app\.js"><\/script>\s*/g, "");
  html = html.replace(/<script type="module" src="\/src\/main\.jsx"><\/script>\s*/g, "");
  if (!html.includes("/src/main.jsx")) {
    html = html.replace("</body>", `  <script type="module" src="/src/main.jsx"></script>\n</body>`);
  }
  fs.writeFileSync(file, html, "utf8");
}

console.log("Restored dev script paths in HTML files.");
