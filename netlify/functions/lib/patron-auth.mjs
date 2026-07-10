import crypto from "node:crypto";

const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret() {
  return (
    process.env.PATRON_AUTH_SECRET?.trim() ||
    process.env.ADMIN_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    ""
  );
}

export function signPatronToken(payload) {
  const secret = getSecret();
  if (!secret) return null;
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyPatronToken(token) {
  const secret = getSecret();
  if (!secret || !token) return null;
  const [body, sig] = String(token).split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function normalizePatronEmail(email) {
  return String(email ?? "")
    .trim()
    .toLowerCase()
    .slice(0, 254);
}

export function isValidPatronEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function issueMagicLinkToken(email) {
  const normalized = normalizePatronEmail(email);
  if (!isValidPatronEmail(normalized)) return null;
  return signPatronToken({
    email: normalized,
    type: "magic",
    exp: Date.now() + MAGIC_LINK_TTL_MS,
  });
}

export function issuePatronSession(email) {
  const normalized = normalizePatronEmail(email);
  if (!isValidPatronEmail(normalized)) return null;
  const token = signPatronToken({
    email: normalized,
    type: "session",
    role: "patron",
    exp: Date.now() + SESSION_TTL_MS,
  });
  if (!token) return null;
  return { token, user: { email: normalized, role: "patron" } };
}

export function verifyMagicLinkToken(token) {
  const payload = verifyPatronToken(token);
  if (!payload || payload.type !== "magic" || !payload.email) return null;
  return payload;
}

export function verifyPatronSession(event) {
  const header = event.headers?.authorization || event.headers?.Authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1]?.trim();
  if (!token) return null;
  const payload = verifyPatronToken(token);
  if (!payload || payload.type !== "session" || payload.role !== "patron" || !payload.email) return null;
  return payload;
}

export function patronAuthConfigured() {
  return Boolean(getSecret());
}
