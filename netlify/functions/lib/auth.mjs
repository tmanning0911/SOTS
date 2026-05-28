import crypto from 'node:crypto';

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

function getSecret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || '';
}

export function signToken(payload) {
  const secret = getSecret();
  if (!secret) return null;
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifyToken(token) {
  const secret = getSecret();
  if (!secret || !token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getBearerToken(event) {
  const header = event.headers?.authorization || event.headers?.Authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || '';
}

export function verifyAdmin(event) {
  return verifyToken(getBearerToken(event));
}

export function issueAdminSession(email = 'admin@shakespeareonthesound.org') {
  const password = process.env.ADMIN_PASSWORD || '';
  const secret = getSecret();
  if (!password || !secret) return { error: 'Admin login is not configured' };
  const token = signToken({
    email,
    role: 'admin',
    exp: Date.now() + TOKEN_TTL_MS,
  });
  if (!token) return { error: 'Admin login is not configured' };
  return { token, user: { email, role: 'admin' } };
}

export function verifyPassword(password) {
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected) return false;
  const a = Buffer.from(String(password));
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
