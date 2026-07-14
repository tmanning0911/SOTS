import { startAuthentication, startRegistration } from "@simplewebauthn/browser";

async function patronFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });
}

export async function fetchPasskeyStatus() {
  const res = await patronFetch("/api/patron/webauthn/status");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not load passkey status");
  return data;
}

export async function registerPatronPasskey() {
  const optRes = await patronFetch("/api/patron/webauthn/register/options", { method: "POST" });
  const optData = await optRes.json().catch(() => ({}));
  if (!optRes.ok) throw new Error(optData.error || "Could not start passkey setup");

  const attestation = await startRegistration({ optionsJSON: optData.options });
  const verifyRes = await patronFetch("/api/patron/webauthn/register/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ response: attestation }),
  });
  const verifyData = await verifyRes.json().catch(() => ({}));
  if (!verifyRes.ok) throw new Error(verifyData.error || "Could not save passkey");
  return verifyData;
}

export async function verifyPatronPasskey() {
  const optRes = await patronFetch("/api/patron/webauthn/auth/options", { method: "POST" });
  const optData = await optRes.json().catch(() => ({}));
  if (!optRes.ok) throw new Error(optData.error || "Could not start passkey check");

  const assertion = await startAuthentication({ optionsJSON: optData.options });
  const verifyRes = await patronFetch("/api/patron/webauthn/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ response: assertion }),
  });
  const verifyData = await verifyRes.json().catch(() => ({}));
  if (!verifyRes.ok) throw new Error(verifyData.error || "Passkey verification failed");
  return verifyData;
}
