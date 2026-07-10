import { readFile } from "node:fs/promises";
import path from "node:path";
import { PREVIEW_SITE_URL, PRODUCTION_SITE_URL } from "../../../scripts/lib/site-domains.mjs";

export function catalogFilePaths(filename) {
  return [
    path.join(process.cwd(), "dist", "data", filename),
    path.join(process.cwd(), "public", "data", filename),
  ];
}

export function catalogDataUrls(filename) {
  const urls = new Set([
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.DEPLOY_URL,
    PRODUCTION_SITE_URL,
    PREVIEW_SITE_URL,
  ]);
  return [...urls]
    .filter(Boolean)
    .map((base) => `${String(base).replace(/\/$/, "")}/data/${filename}`);
}

export async function readStaticJsonCatalog(filename) {
  for (const filePath of catalogFilePaths(filename)) {
    try {
      return JSON.parse(await readFile(filePath, "utf8"));
    } catch {
      /* try next */
    }
  }

  for (const url of catalogDataUrls(filename)) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) continue;
      return await res.json();
    } catch {
      /* try next */
    }
  }

  return null;
}
