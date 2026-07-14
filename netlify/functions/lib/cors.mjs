import {
  PREVIEW_SITE_URL,
  PRODUCTION_SITE_HOSTS,
  SITE_ALLOWED_ORIGINS,
} from "../../../scripts/lib/site-domains.mjs";

/** Origin allowlist for admin APIs — set SITE_ALLOWED_ORIGINS in Netlify (comma-separated). */

function parseOrigins() {
  const defaults = SITE_ALLOWED_ORIGINS.join(",");
  const raw = [process.env.SITE_ALLOWED_ORIGINS, defaults, process.env.URL, process.env.DEPLOY_PRIME_URL]
    .filter(Boolean)
    .join(",");
  return [...new Set(raw.split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean))];
}

function getHeader(event, name) {
  const key = name.toLowerCase();
  return event.headers?.[key] || event.headers?.[name] || '';
}

function isLocalDevOrigin(origin) {
  // Vite / local tooling proxies /api to Netlify; allow any localhost port.
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}

export function isAllowedOrigin(event) {
  const origin = getHeader(event, 'origin').replace(/\/$/, '');
  if (!origin) return true;
  if (isLocalDevOrigin(origin)) return true;
  const allowed = parseOrigins();
  if (allowed.includes(origin)) return true;
  // Netlify branch / deploy previews for this site only
  const previewHost = PREVIEW_SITE_URL.replace(/^https?:\/\//, "");
  if (origin.endsWith(previewHost)) return true;
  // Apex without www on production hosts
  if (PRODUCTION_SITE_HOSTS.some((host) => origin === host.replace('www.', ''))) return true;
  if (origin === PREVIEW_SITE_URL) return true;
  return false;
}

export function corsHeaders(event, { methods = 'GET, OPTIONS', allowCredentials = false } = {}) {
  const origin = getHeader(event, 'origin').replace(/\/$/, '');
  const allowed = isAllowedOrigin(event);
  const headers = {
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
  };
  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    if (allowCredentials) headers['Access-Control-Allow-Credentials'] = 'true';
    headers.Vary = 'Origin';
  }
  return { headers, allowed, origin };
}

export function jsonResponse(statusCode, body, event, options = {}) {
  const { headers, allowed, origin } = corsHeaders(event, options);
  if (!allowed && origin) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Origin not allowed' }),
    };
  }
  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };
}
