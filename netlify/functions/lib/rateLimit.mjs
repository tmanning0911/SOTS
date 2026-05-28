const buckets = new Map();

export function rateLimit(key, { max = 10, windowMs = 600_000 } = {}) {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || now - bucket.start > windowMs) {
    bucket = { start: now, count: 0 };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  return bucket.count <= max;
}

export function getClientIp(event) {
  const headers = event.headers || {};
  const direct =
    headers['x-nf-client-connection-ip'] ||
    headers['X-Nf-Client-Connection-Ip'] ||
    headers['client-ip'];
  if (direct) return String(direct).trim();

  const forwarded = headers['x-forwarded-for'] || headers['X-Forwarded-For'];
  if (forwarded) return String(forwarded).split(',')[0].trim();

  return 'unknown';
}
