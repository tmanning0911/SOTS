#!/usr/bin/env node
/**
 * List Constant Contact contact lists (to copy CONSTANT_CONTACT_LIST_ID).
 *
 * Requires in env / .env:
 *   CONSTANT_CONTACT_API_KEY (or CLIENT_ID)
 *   CONSTANT_CONTACT_CLIENT_SECRET
 *   CONSTANT_CONTACT_REFRESH_TOKEN
 * Optional: CONSTANT_CONTACT_ACCESS_TOKEN
 *
 * Usage: node scripts/constant-contact-lists.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadDotEnv() {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadDotEnv();

const clientId =
  process.env.CONSTANT_CONTACT_API_KEY?.trim() ||
  process.env.CONSTANT_CONTACT_CLIENT_ID?.trim();
const clientSecret = process.env.CONSTANT_CONTACT_CLIENT_SECRET?.trim();
const refreshToken = process.env.CONSTANT_CONTACT_REFRESH_TOKEN?.trim();
let accessToken = process.env.CONSTANT_CONTACT_ACCESS_TOKEN?.trim();

async function refresh() {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const url = new URL("https://authz.constantcontact.com/oauth2/default/v1/token");
  url.searchParams.set("refresh_token", refreshToken);
  url.searchParams.set("grant_type", "refresh_token");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error_description || body.error || res.statusText);
  }
  accessToken = body.access_token;
  console.error("Refreshed access token. New refresh_token (store in Netlify + .env):");
  console.error(body.refresh_token);
  return body;
}

async function main() {
  if (!clientId || !clientSecret || !refreshToken) {
    console.error(
      "Set CONSTANT_CONTACT_API_KEY, CONSTANT_CONTACT_CLIENT_SECRET, and CONSTANT_CONTACT_REFRESH_TOKEN.",
    );
    process.exit(1);
  }

  if (!accessToken) await refresh();

  let res = await fetch("https://api.cc.email/v3/contact_lists?limit=50", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) {
    await refresh();
    res = await fetch("https://api.cc.email/v3/contact_lists?limit=50", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  const body = await res.json();
  if (!res.ok) {
    console.error(body);
    process.exit(1);
  }

  const lists = body.lists || [];
  if (!lists.length) {
    console.log("No contact lists found. Create one in Constant Contact first.");
    return;
  }

  console.log("Contact lists (use list_id as CONSTANT_CONTACT_LIST_ID):\n");
  for (const list of lists) {
    console.log(`- ${list.name}`);
    console.log(`  list_id: ${list.list_id}`);
    if (list.description) console.log(`  ${list.description}`);
    console.log("");
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
