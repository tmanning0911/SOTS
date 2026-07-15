import crypto from "node:crypto";
import { promisify } from "node:util";
import { blobStore, isNetlifyRuntime } from "./netlify-blobs.mjs";
import { normalizePatronEmail } from "./patron-auth.mjs";

const scrypt = promisify(crypto.scrypt);
const STORE_NAME = "sots-ticketing";
const KEY_PREFIX = "patron-password:";
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEYLEN = 64;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

function store() {
  return blobStore(STORE_NAME);
}

function credentialKey(email) {
  return `${KEY_PREFIX}${normalizePatronEmail(email)}`;
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/** Blobs can lag briefly after setJSON — retry until the record is readable. */
async function readCredential(key, { attempts = 6 } = {}) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const record = (await store().get(key, { type: "json" })) ?? null;
      if (record?.hash && record?.salt) return record;
    } catch {
      /* retry */
    }
    if (attempt < attempts - 1) await sleep(75 * (attempt + 1));
  }
  return null;
}

export function validatePatronPassword(password) {
  const value = String(password ?? "");
  if (value.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (value.length > MAX_PASSWORD_LENGTH) {
    return { ok: false, error: "That password is too long." };
  }
  return { ok: true };
}

async function hashPassword(password, salt = crypto.randomBytes(16)) {
  const derived = await scrypt(String(password), salt, KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return {
    algorithm: "scrypt",
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    salt: salt.toString("base64"),
    hash: Buffer.from(derived).toString("base64"),
  };
}

export async function getPatronPasswordRecord(email) {
  const normalized = normalizePatronEmail(email);
  if (!normalized) return null;
  return readCredential(credentialKey(normalized), { attempts: 1 });
}

export async function patronHasPassword(email) {
  const record = await getPatronPasswordRecord(email);
  return Boolean(record?.hash && record?.salt);
}

export async function setPatronPassword(email, password) {
  const normalized = normalizePatronEmail(email);
  const check = validatePatronPassword(password);
  if (!check.ok) throw new Error(check.error);
  if (!normalized) throw new Error("Email is required.");

  const hashed = await hashPassword(password);
  const key = credentialKey(normalized);
  const existing = await readCredential(key, { attempts: 1 });
  const now = new Date().toISOString();
  const record = {
    email: normalized,
    ...hashed,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  await store().setJSON(key, record);

  // Blobs can lag after writes; wait until readable when possible, but don't
  // fail the whole signup if the write simply hasn't replicated yet.
  const verified = await readCredential(key, { attempts: 12 });
  if (!verified?.hash && isNetlifyRuntime()) {
    console.warn("patron password write lag:", key);
  }

  return { email: normalized, updatedAt: now, hasPassword: true };
}

export async function verifyPatronPassword(email, password) {
  const normalized = normalizePatronEmail(email);
  if (!normalized) return false;
  // Extra attempts — blobs can lag several seconds after a fresh register.
  const record = await readCredential(credentialKey(normalized), { attempts: 10 });
  if (!record?.hash || !record?.salt) return false;

  const salt = Buffer.from(record.salt, "base64");
  const expected = Buffer.from(record.hash, "base64");
  const N = Number(record.N) || SCRYPT_N;
  const r = Number(record.r) || SCRYPT_R;
  const p = Number(record.p) || SCRYPT_P;
  const derived = await scrypt(String(password ?? ""), salt, expected.length, { N, r, p });
  try {
    return crypto.timingSafeEqual(Buffer.from(derived), expected);
  } catch {
    return false;
  }
}

export async function clearPatronPassword(email) {
  const normalized = normalizePatronEmail(email);
  if (!normalized) return;
  try {
    await store().delete(credentialKey(normalized));
  } catch {
    /* optional */
  }
}

export { MIN_PASSWORD_LENGTH };
