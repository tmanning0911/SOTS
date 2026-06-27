#!/usr/bin/env node
/** Ensures every HTML page has a fixed chrome mount before #root. */
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

const CHROME_MOUNT = '<div id="site-chrome"></div>';

for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, "utf8");
  if (html.includes('id="site-chrome"')) continue;

  if (html.includes('<div id="root">')) {
    html = html.replace('<div id="root">', `${CHROME_MOUNT}\n  <div id="root">`);
  } else if (html.includes("<body")) {
    html = html.replace(/<body([^>]*)>/, `<body$1>\n  ${CHROME_MOUNT}`);
  }

  fs.writeFileSync(file, html, "utf8");
}

console.log("Ensured #site-chrome mount in HTML files.");
