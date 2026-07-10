import {
  runEventbriteSync,
  shouldSyncFromWebhook,
} from "../../scripts/lib/eventbrite-run-sync.mjs";

function unauthorized(message = "Unauthorized") {
  return { statusCode: 401, body: message };
}

function parseBody(event) {
  if (!event.body) return null;
  try {
    return JSON.parse(event.body);
  } catch {
    return null;
  }
}

function isAuthorized(event) {
  const secret = process.env.EVENTBRITE_WEBHOOK_SECRET?.trim();
  if (!secret) return false;

  const headerSecret =
    event.headers?.["x-eventbrite-webhook-secret"] ??
    event.headers?.["X-Eventbrite-Webhook-Secret"];
  if (headerSecret === secret) return true;

  const querySecret = event.queryStringParameters?.secret;
  return querySecret === secret;
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  if (!isAuthorized(event)) {
    return unauthorized();
  }

  const payload = parseBody(event);
  if (!payload) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  if (!shouldSyncFromWebhook(payload.api_url)) {
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, skipped: true }),
    };
  }

  try {
    const data = await runEventbriteSync();
    console.log(
      `eventbrite-webhook: synced after ${payload.api_url} at ${data.syncedAt}`,
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        syncedAt: data.syncedAt,
        performances: data.performances.length,
      }),
    };
  } catch (err) {
    console.error("eventbrite-webhook failed:", err);
    return { statusCode: 500, body: err.message || "Sync failed" };
  }
};
