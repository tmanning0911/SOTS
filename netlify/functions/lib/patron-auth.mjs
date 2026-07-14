import crypto from "node:crypto";
import { isAllowedOrigin } from "./cors.mjs";
import { blobStore } from "./netlify-blobs.mjs";

/** Short-lived, single-use email proof. */
const MAGIC_LINK_TTL_MS = 10 * 60 * 1000;
/** Absolute session lifetime (HttpOnly cookie). */
const SESSION_TTL_MS = 48 * 60 * 60 * 1000;

const COOKIE_LEGACY = "sots_patron";
const COOKIE_HOST = "__Host-sots_patron";
const STORE_NAME = "sots-ticketing";

function getHeader(event, name) {
  const key = name.toLowerCase();
  return event.headers?.[key] || event.headers?.[name] || "";
}

function getSecret() {
  const dedicated = process.env.PATRON_AUTH_SECRET?.trim() || "";
  if (dedicated) return dedicated;
  // Production must use a dedicated secret — never an admin password.
  if ((process.env.CONTEXT || "").toLowerCase() === "production") return "";
  return process.env.ADMIN_SECRET?.trim() || "";
}

function authStore() {
  return blobStore(STORE_NAME);
}

function newJti() {
  return crypto.randomBytes(16).toString("hex");
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
    jti: newJti(),
    exp: Date.now() + MAGIC_LINK_TTL_MS,
  });
}

export function issuePatronSession(email, { ip = "" } = {}) {
  const normalized = normalizePatronEmail(email);
  if (!isValidPatronEmail(normalized)) return null;
  const jti = newJti();
  const exp = Date.now() + SESSION_TTL_MS;
  const token = signPatronToken({
    email: normalized,
    type: "session",
    role: "patron",
    jti,
    exp,
  });
  if (!token) return null;
  return {
    token,
    jti,
    exp,
    ip: String(ip || "").slice(0, 80),
    user: { email: normalized, role: "patron" },
  };
}

export function verifyMagicLinkToken(token) {
  const payload = verifyPatronToken(token);
  if (!payload || payload.type !== "magic" || !payload.email || !payload.jti) return null;
  return payload;
}

function parseCookies(event) {
  const raw = event.headers?.cookie || event.headers?.Cookie || "";
  const out = {};
  for (const part of String(raw).split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

/** Cookie-only sessions — never accept Authorization Bearer (XSS-stealable). */
export function getPatronSessionToken(event) {
  const cookies = parseCookies(event);
  return cookies[COOKIE_HOST] || cookies[COOKIE_LEGACY] || null;
}

function requestIsHttps(event) {
  const proto = String(getHeader(event, "x-forwarded-proto") || "")
    .split(",")[0]
    .trim()
    .toLowerCase();
  if (proto === "https") return true;
  if (proto === "http") return false;
  return (process.env.CONTEXT || "").toLowerCase() === "production";
}

function formatCookie(name, value, event, { clear = false, hostPrefix = false } = {}) {
  const parts = [
    `${name}=${clear ? "" : encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (clear) parts.push("Max-Age=0");
  else parts.push(`Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`);

  // __Host- requires Secure + Path=/ and forbids Domain.
  if (hostPrefix || requestIsHttps(event)) parts.push("Secure");
  return parts.join("; ");
}

/**
 * Prefer __Host- cookie on HTTPS (strongest cookie flags).
 * Always clear the legacy name when rotating.
 */
export function buildPatronSessionCookies(token, event, { clear = false } = {}) {
  const https = requestIsHttps(event);
  if (https) {
    return [
      formatCookie(COOKIE_HOST, token, event, { clear, hostPrefix: true }),
      formatCookie(COOKIE_LEGACY, "", event, { clear: true }),
    ];
  }
  return [formatCookie(COOKIE_LEGACY, token, event, { clear })];
}

/** @deprecated use buildPatronSessionCookies */
export function buildPatronSessionCookie(token, event, options = {}) {
  return buildPatronSessionCookies(token, event, options)[0];
}

/**
 * CSRF defense for cookie auth: mutating requests must come from an allowlisted Origin
 * (or a matching Referer when Origin is absent).
 */
export function assertPatronMutationAllowed(event) {
  const method = String(event.httpMethod || "GET").toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return true;

  const origin = getHeader(event, "origin").replace(/\/$/, "");
  if (origin) return isAllowedOrigin(event);

  const referer = getHeader(event, "referer");
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      return isAllowedOrigin({
        headers: { origin: refOrigin, Origin: refOrigin },
      });
    } catch {
      return false;
    }
  }

  // Same-origin fetch always sends Origin in modern browsers. Fail closed in production.
  return (process.env.CONTEXT || "").toLowerCase() !== "production";
}

export async function consumeMagicLink(payload) {
  if (!payload?.jti || !payload?.email) return { ok: false, reason: "invalid" };
  const key = `magic-used:${payload.jti}`;
  try {
    const existing = await authStore().get(key, { type: "json" });
    if (existing) return { ok: false, reason: "used" };
    await authStore().setJSON(key, {
      email: payload.email,
      usedAt: new Date().toISOString(),
      exp: payload.exp ?? null,
    });
    return { ok: true };
  } catch (err) {
    console.error("magic link consume failed:", err);
    if ((process.env.CONTEXT || "").toLowerCase() === "production") {
      return { ok: false, reason: "store" };
    }
    return consumeMagicLinkMemory(payload);
  }
}

const magicMemory = new Set();
function consumeMagicLinkMemory(payload) {
  if (magicMemory.has(payload.jti)) return { ok: false, reason: "used" };
  magicMemory.add(payload.jti);
  return { ok: true };
}

export async function revokePatronSession(jti) {
  if (!jti) return;
  try {
    await authStore().setJSON(`session-revoked:${jti}`, {
      revokedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("session revoke failed:", err);
  }
}

export async function recordPatronSession(session) {
  if (!session?.jti) return;
  try {
    await authStore().setJSON(`session-meta:${session.jti}`, {
      email: session.user?.email,
      createdAt: new Date().toISOString(),
      exp: session.exp,
      ip: session.ip || "",
    });
  } catch {
    /* optional */
  }
}

export async function isPatronSessionRevoked(jti) {
  if (!jti) return true;
  try {
    const hit = await authStore().get(`session-revoked:${jti}`, { type: "json" });
    return Boolean(hit);
  } catch {
    return false;
  }
}

export async function verifyPatronSession(event) {
  const token = getPatronSessionToken(event);
  if (!token) return null;
  const payload = verifyPatronToken(token);
  if (
    !payload ||
    payload.type !== "session" ||
    payload.role !== "patron" ||
    !payload.email ||
    !payload.jti
  ) {
    return null;
  }
  if (await isPatronSessionRevoked(payload.jti)) return null;
  return { ...payload, token };
}

export async function rateLimitPatronMagic({ ip, email }) {
  const windowMs = 900_000;
  const maxPerIp = 5;
  const maxPerEmail = 3;
  const now = Date.now();

  async function touch(key, max) {
    try {
      const current = (await authStore().get(key, { type: "json" })) ?? null;
      let start = current?.start ?? now;
      let count = current?.count ?? 0;
      if (now - start > windowMs) {
        start = now;
        count = 0;
      }
      count += 1;
      await authStore().setJSON(key, { start, count });
      return count <= max;
    } catch {
      return true;
    }
  }

  const ipOk = await touch(`rate:patron-magic-ip:${ip || "unknown"}`, maxPerIp);
  const emailOk = await touch(`rate:patron-magic-email:${normalizePatronEmail(email)}`, maxPerEmail);
  return ipOk && emailOk;
}

export function patronAuthConfigured() {
  return Boolean(getSecret());
}

export const PATRON_SESSION_COOKIE = COOKIE_HOST;
export const PATRON_SESSION_TTL_MS = SESSION_TTL_MS;
export const PATRON_MAGIC_TTL_MS = MAGIC_LINK_TTL_MS;
