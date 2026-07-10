#!/usr/bin/env node
/**
 * One-time / maintenance setup for Eventbrite integration.
 * - Verifies API token
 * - Registers webhooks on production + preview domains
 * - Writes EVENTBRITE_WEBHOOK_SECRET to .env when missing
 *
 * Usage:
 *   npm run setup:eventbrite
 *   node scripts/setup-eventbrite.mjs --check
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { loadEnvFile } from "./lib/eventbrite-client.mjs";
import {
  EVENTBRITE_WEBHOOK_ACTIONS,
  PREVIEW_SITE_URL,
  PRODUCTION_SITE_URL,
  eventbriteWebhookUrl,
} from "./lib/site-domains.mjs";
import { runEventbriteSync } from "./lib/eventbrite-run-sync.mjs";

const API_BASE = "https://www.eventbriteapi.com/v3";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");
const checkOnly = process.argv.includes("--check");

loadEnvFile(envPath, fs);

const token = process.env.EVENTBRITE_API_TOKEN?.trim();
const orgId = process.env.EVENTBRITE_ORG_ID?.trim() || "2093560299743";
const featuredEventId =
  process.env.EVENTBRITE_FEATURED_EVENT_ID?.trim() || "1986841853468";

if (!token) {
  console.error("Missing EVENTBRITE_API_TOKEN in .env");
  process.exit(1);
}

async function api(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error_description || body.error || res.statusText);
  }
  if (res.status === 204) return null;
  return body;
}

function getOrCreateWebhookSecret() {
  const existing = process.env.EVENTBRITE_WEBHOOK_SECRET?.trim();
  if (existing) return existing;
  return crypto.randomBytes(24).toString("hex");
}

function upsertEnvValue(key, value) {
  let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const pattern = new RegExp(`^${key}=.*$`, "m");
  const line = `${key}=${value}`;
  content = pattern.test(content)
    ? content.replace(pattern, line)
    : `${content.trimEnd()}\n${line}\n`;
  fs.writeFileSync(envPath, content);
  process.env[key] = value;
}

async function listOrgWebhooks() {
  const data = await api(`/organizations/${orgId}/webhooks/`);
  return data.webhooks ?? [];
}

async function createWebhook(endpointUrl) {
  return api(`/organizations/${orgId}/webhooks/`, {
    method: "POST",
    body: JSON.stringify({
      endpoint_url: endpointUrl,
      actions: EVENTBRITE_WEBHOOK_ACTIONS,
      event_id: featuredEventId,
    }),
  });
}

async function deleteWebhook(webhookId) {
  await api(`/webhooks/${webhookId}/`, { method: "DELETE" });
}

function endpointBase(url) {
  return (url ?? "").split("?")[0];
}

function endpointSecret(url) {
  try {
    return new URL(url).searchParams.get("secret");
  } catch {
    return null;
  }
}

function webhookTargets(secret) {
  return [
    { label: "production", url: eventbriteWebhookUrl(PRODUCTION_SITE_URL, secret) },
    { label: "preview", url: eventbriteWebhookUrl(PREVIEW_SITE_URL, secret) },
  ];
}

function isOurWebhook(webhook, targets) {
  const endpoint = webhook.endpoint_url ?? "";
  const base = endpointBase(endpoint);
  const target = targets.find((t) => endpointBase(t.url) === base);
  if (!target) return false;
  return endpointSecret(endpoint) === endpointSecret(target.url);
}

async function ensureWebhooks(secret) {
  const targets = webhookTargets(secret);
  const existing = await listOrgWebhooks();
  const ours = existing.filter((w) => isOurWebhook(w, targets));
  const stale = existing.filter((w) => {
    const endpoint = w.endpoint_url ?? "";
    if (!/eventbrite-webhook/i.test(endpoint)) return false;
    return !isOurWebhook(w, targets);
  });

  for (const webhook of stale) {
    console.log(`Removing stale webhook ${webhook.id}: ${webhook.endpoint_url}`);
    await deleteWebhook(webhook.id);
  }

  const results = [];
  for (const target of targets) {
    const match = ours.find(
      (w) => endpointBase(w.endpoint_url) === endpointBase(target.url),
    );
    if (match) {
      results.push({ ...target, id: match.id, status: "exists" });
      continue;
    }
    const created = await createWebhook(target.url);
    results.push({ ...target, id: created.id, status: "created" });
    console.log(`Registered ${target.label} webhook (${created.id})`);
  }
  return results;
}

async function main() {
  const me = await api("/users/me/");
  console.log(`Authenticated as ${me.name} (${me.id})`);

  const orgList = await api("/users/me/organizations/");
  const org =
    orgList.organizations?.find((o) => o.id === orgId) ??
    orgList.organizations?.[0];
  if (!org) throw new Error(`No organization found for id ${orgId}`);
  console.log(`Organization: ${org.name} (${org.id})`);

  const secret = getOrCreateWebhookSecret();
  if (!process.env.EVENTBRITE_WEBHOOK_SECRET?.trim()) {
    upsertEnvValue("EVENTBRITE_WEBHOOK_SECRET", secret);
    console.log("Wrote EVENTBRITE_WEBHOOK_SECRET to .env");
  }

  const webhooks = await ensureWebhooks(secret);
  for (const hook of webhooks) {
    console.log(`  [${hook.status}] ${hook.label}: ${hook.url}`);
  }

  if (checkOnly) {
    const payload = await runEventbriteSync({ writeBlob: false });
    console.log(
      `Sync OK — ${payload.performances.length} performances, ${payload.ticketClasses.length} ticket classes`,
    );
    return;
  }

  console.log("\nSet these Netlify environment variables (all deploy contexts):");
  console.log("  EVENTBRITE_API_TOKEN         = <your private token>");
  console.log(`  EVENTBRITE_WEBHOOK_SECRET    = ${secret}`);
  console.log(`  EVENTBRITE_ORG_ID            = ${orgId}`);
  console.log(`  EVENTBRITE_FEATURED_EVENT_ID = ${featuredEventId}`);
  console.log("\nDomains covered:");
  console.log(`  Production: ${PRODUCTION_SITE_URL}`);
  console.log(`  Preview:    ${PREVIEW_SITE_URL}`);
}

try {
  await main();
} catch (err) {
  console.error("Setup failed:", err.message || err);
  process.exit(1);
}
