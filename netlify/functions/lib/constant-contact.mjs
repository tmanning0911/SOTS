import { bindBlobs, blobStore } from "./netlify-blobs.mjs";

const API_BASE = "https://api.cc.email/v3";
const TOKEN_URL = "https://authz.constantcontact.com/oauth2/default/v1/token";
const TOKEN_STORE = "sots-secrets";
const TOKEN_KEY = "constant-contact-oauth";

function env(name) {
  return process.env[name]?.trim() || "";
}

export function getConstantContactConfig() {
  const clientId = env("CONSTANT_CONTACT_API_KEY") || env("CONSTANT_CONTACT_CLIENT_ID");
  const clientSecret = env("CONSTANT_CONTACT_CLIENT_SECRET");
  const refreshToken = env("CONSTANT_CONTACT_REFRESH_TOKEN");
  const listId = env("CONSTANT_CONTACT_LIST_ID");
  const accessToken = env("CONSTANT_CONTACT_ACCESS_TOKEN");

  return {
    clientId,
    clientSecret,
    refreshToken,
    listId,
    accessToken,
    configured: Boolean(clientId && clientSecret && refreshToken && listId),
  };
}

function decodeJwtExp(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const data = JSON.parse(json);
    return typeof data.exp === "number" ? data.exp : null;
  } catch {
    return null;
  }
}

function isExpiredOrSoon(accessToken, skewSec = 90) {
  const exp = decodeJwtExp(accessToken);
  if (!exp) return true;
  return exp * 1000 <= Date.now() + skewSec * 1000;
}

async function readStoredTokens(event) {
  try {
    bindBlobs(event);
    const store = blobStore(TOKEN_STORE);
    return (await store.get(TOKEN_KEY, { type: "json" })) || null;
  } catch {
    return null;
  }
}

async function writeStoredTokens(event, tokens) {
  try {
    bindBlobs(event);
    const store = blobStore(TOKEN_STORE);
    await store.setJSON(TOKEN_KEY, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    /* Blobs unavailable in some local/dev contexts — env refresh token still works once */
  }
}

async function refreshAccessToken(config, refreshToken) {
  const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
  const url = new URL(TOKEN_URL);
  url.searchParams.set("refresh_token", refreshToken);
  url.searchParams.set("grant_type", "refresh_token");

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = body.error_description || body.error || res.statusText;
    throw new Error(`Constant Contact token refresh failed: ${detail}`);
  }

  if (!body.access_token || !body.refresh_token) {
    throw new Error("Constant Contact token refresh returned an incomplete response.");
  }

  return {
    access_token: body.access_token,
    refresh_token: body.refresh_token,
  };
}

/**
 * Resolve a usable access token, refreshing + persisting when needed.
 */
export async function getAccessToken(event) {
  const config = getConstantContactConfig();
  if (!config.configured && !config.accessToken) {
    throw new Error("Constant Contact is not configured.");
  }

  const stored = await readStoredTokens(event);
  let accessToken = stored?.access_token || config.accessToken;
  let refreshToken = stored?.refresh_token || config.refreshToken;

  if (accessToken && !isExpiredOrSoon(accessToken)) {
    return accessToken;
  }

  if (!config.clientId || !config.clientSecret || !refreshToken) {
    if (accessToken) return accessToken;
    throw new Error("Constant Contact OAuth credentials are incomplete.");
  }

  const next = await refreshAccessToken(config, refreshToken);
  await writeStoredTokens(event, next);
  return next.access_token;
}

/**
 * Explicit opt-in signup → contact list membership.
 * @see https://developer.constantcontact.com/api_guide/contacts_create_or_update.html
 */
export async function signUpContact(event, { email, firstName = "", lastName = "" }) {
  const config = getConstantContactConfig();
  if (!config.listId) {
    throw new Error("CONSTANT_CONTACT_LIST_ID is not set.");
  }

  const accessToken = await getAccessToken(event);
  const payload = {
    email_address: email,
    list_memberships: [config.listId],
  };
  if (firstName) payload.first_name = firstName.slice(0, 50);
  if (lastName) payload.last_name = lastName.slice(0, 50);

  const res = await fetch(`${API_BASE}/contacts/sign_up_form`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => ({}));

  // Retry once on auth failure after forced refresh
  if (res.status === 401 && config.refreshToken) {
    const stored = await readStoredTokens(event);
    const refreshToken = stored?.refresh_token || config.refreshToken;
    const next = await refreshAccessToken(config, refreshToken);
    await writeStoredTokens(event, next);

    const retry = await fetch(`${API_BASE}/contacts/sign_up_form`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${next.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const retryBody = await retry.json().catch(() => ({}));
    if (!retry.ok) {
      const detail = retryBody.error_message || retryBody.message || retry.statusText;
      throw new Error(`Constant Contact signup failed: ${detail}`);
    }
    return { status: retry.status, ...retryBody };
  }

  if (!res.ok) {
    const detail = body.error_message || body.message || res.statusText;
    throw new Error(`Constant Contact signup failed: ${detail}`);
  }

  return { status: res.status, ...body };
}
