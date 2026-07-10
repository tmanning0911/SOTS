#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvFile } from "./lib/eventbrite-client.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");

loadEnvFile(envPath, fs);

const hasToken = Boolean(process.env.EVENTBRITE_API_TOKEN?.trim());
if (!hasToken && !fs.existsSync(envPath)) {
  console.log("Eventbrite sync skipped (no EVENTBRITE_API_TOKEN)");
  process.exit(0);
}

if (!hasToken) {
  console.log("Eventbrite sync skipped (EVENTBRITE_API_TOKEN not set in .env)");
  process.exit(0);
}

try {
  execSync("node scripts/sync-eventbrite.mjs", { cwd: root, stdio: "inherit" });
} catch {
  console.warn("Eventbrite sync failed — continuing build with existing eventbrite.json");
}
