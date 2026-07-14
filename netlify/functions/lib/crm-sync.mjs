/**
 * Patron CRM sync hook.
 *
 * Today:
 *  - Constant Contact list signup when marketingOptIn is true (if configured)
 *  - Optional CRM_WEBHOOK_URL POST for Zapier / Salesforce / custom CRM
 *
 * Later: point CRM_WEBHOOK_URL at Zapier/Salesforce or extend syncPatronToCrm
 * with a native Salesforce connector — profiles stay the source of truth in Blobs.
 */

import { getConstantContactConfig, signUpContact } from "./constant-contact.mjs";
import { markPatronCrmSync, publicPatronProfile } from "./patron-profile.mjs";

function webhookUrl() {
  return process.env.CRM_WEBHOOK_URL?.trim() || "";
}

function splitName(fullName) {
  const parts = String(fullName ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

async function postCrmWebhook(profile, context = {}) {
  const url = webhookUrl();
  if (!url) return { skipped: true, reason: "CRM_WEBHOOK_URL not set" };

  const payload = {
    event: context.event || "patron.upsert",
    occurredAt: new Date().toISOString(),
    source: context.source || profile.lastSource || "sots",
    patron: publicPatronProfile(profile),
    order: context.order
      ? {
          id: context.order.id,
          confirmationCode: context.order.confirmationCode,
          productionTitle: context.order.productionTitle,
          performanceStart: context.order.performanceStart,
          totalCents: context.order.totalCents,
          ticketCount: context.order.tickets?.length ?? 0,
        }
      : undefined,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(process.env.CRM_WEBHOOK_SECRET
        ? { "X-SOTS-Webhook-Secret": process.env.CRM_WEBHOOK_SECRET.trim() }
        : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CRM webhook failed (${res.status}): ${text.slice(0, 200)}`);
  }

  return { ok: true, status: res.status };
}

async function syncConstantContact(event, profile) {
  if (!profile.marketingOptIn) {
    return { skipped: true, reason: "no marketing opt-in" };
  }
  const config = getConstantContactConfig();
  if (!config.configured && !config.accessToken) {
    return { skipped: true, reason: "Constant Contact not configured" };
  }

  const { firstName, lastName } = splitName(profile.name);
  await signUpContact(event, {
    email: profile.email,
    firstName,
    lastName,
  });
  return { ok: true };
}

/**
 * Best-effort sync after profile save or ticket purchase.
 * Never throws to callers — errors are logged and stored on the profile.
 */
export async function syncPatronToCrm(event, profile, context = {}) {
  if (!profile?.email) return { ok: false, error: "missing profile" };

  const results = {
    constantContact: null,
    webhook: null,
  };

  try {
    results.constantContact = await syncConstantContact(event, profile);
  } catch (err) {
    console.error("CRM Constant Contact sync failed:", err);
    results.constantContact = { ok: false, error: err.message };
  }

  try {
    results.webhook = await postCrmWebhook(profile, context);
  } catch (err) {
    console.error("CRM webhook sync failed:", err);
    results.webhook = { ok: false, error: err.message };
  }

  const hardFail =
    (results.constantContact?.ok === false && profile.marketingOptIn) ||
    results.webhook?.ok === false;

  const anyWork =
    results.constantContact?.ok ||
    results.webhook?.ok ||
    results.constantContact?.skipped ||
    results.webhook?.skipped;

  try {
    if (hardFail) {
      await markPatronCrmSync(profile.email, {
        status: "error",
        detail: [results.constantContact?.error, results.webhook?.error].filter(Boolean).join("; "),
      });
    } else if (anyWork) {
      await markPatronCrmSync(profile.email, { status: "synced" });
    }
  } catch {
    /* ignore */
  }

  return { ok: !hardFail, results };
}
