import { getStore } from "@netlify/blobs";
import { syncEventbrite } from "./eventbrite-sync.mjs";

const STORE_NAME = "sots-ticketing";

export function getEventbriteConfig() {
  const token = process.env.EVENTBRITE_API_TOKEN?.trim();
  const orgId = process.env.EVENTBRITE_ORG_ID?.trim() || "2093560299743";
  const featuredEventId =
    process.env.EVENTBRITE_FEATURED_EVENT_ID?.trim() || "1986841853468";
  return { token, orgId, featuredEventId };
}

export async function runEventbriteSync({ writeBlob = true } = {}) {
  const { token, orgId, featuredEventId } = getEventbriteConfig();
  if (!token) {
    throw new Error("Missing EVENTBRITE_API_TOKEN");
  }

  const payload = await syncEventbrite({ token, orgId, featuredEventId });

  if (writeBlob) {
    try {
      const store = getStore({ name: STORE_NAME, consistency: "strong" });
      await store.setJSON("eventbrite", payload);
    } catch (err) {
      console.warn("eventbrite blob write skipped:", err.message || err);
    }
  }

  return payload;
}

/** Eventbrite webhook payloads include an api_url for the changed object. */
export function shouldSyncFromWebhook(apiUrl) {
  if (!apiUrl || typeof apiUrl !== "string") return false;
  return /\/(events|orders|ticket_classes|venues|organizers)\//i.test(apiUrl);
}
