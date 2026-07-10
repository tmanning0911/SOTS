/** Canonical site URLs — used by Eventbrite setup, CORS, and deploy scripts. */

export const PRODUCTION_SITE_URL = "https://www.shakespeareonthesound.org";
export const PRODUCTION_SITE_HOSTS = [
  "https://www.shakespeareonthesound.org",
  "https://shakespeareonthesound.org",
];

/** Netlify site URL used for preview / QA before the custom domain is live. */
export const PREVIEW_SITE_URL = "https://ubiquitous-maamoul-8b9b7f.netlify.app";

export const SITE_ALLOWED_ORIGINS = [
  ...PRODUCTION_SITE_HOSTS,
  PREVIEW_SITE_URL,
];

export function eventbriteWebhookUrl(baseUrl, secret) {
  const base = baseUrl.replace(/\/$/, "");
  const path = "/api/eventbrite-webhook";
  if (!secret) return `${base}${path}`;
  return `${base}${path}?secret=${encodeURIComponent(secret)}`;
}

export const EVENTBRITE_WEBHOOK_ACTIONS = [
  "event.published",
  "event.updated",
  "event.unpublished",
  "ticket_class.created",
  "ticket_class.updated",
  "ticket_class.deleted",
  "order.placed",
  "order.updated",
].join(",");
