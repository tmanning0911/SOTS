/** Origin allowlist for admin APIs — set SITE_ALLOWED_ORIGINS in Netlify (comma-separated). */

function parseOrigins() {
  const defaults = 'https://www.shakespeareonthesound.org,https://shakespeareonthesound.org';
  const raw = [process.env.SITE_ALLOWED_ORIGINS, defaults, process.env.URL, process.env.DEPLOY_PRIME_URL]
    .filter(Boolean)
    .join(',');
  return [...new Set(raw.split(',').map((o) => o.trim().replace(/\/$/, '')).filter(Boolean))];
}

function getHeader(event, name) {
  const key = name.toLowerCase();
  return event.headers?.[key] || event.headers?.[name] || '';
}

export function isAllowedOrigin(event) {
  const origin = getHeader(event, 'origin').replace(/\/$/, '');
  if (!origin) return true;
  const allowed = parseOrigins();
  if (allowed.includes(origin)) return true;
  if (origin.endsWith('.netlify.app') && process.env.CONTEXT !== 'production') {
    return true;
  }
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
