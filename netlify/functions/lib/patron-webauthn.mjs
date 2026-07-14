import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { blobStore } from "./netlify-blobs.mjs";
import { normalizePatronEmail } from "./patron-auth.mjs";
import { PREVIEW_SITE_URL, PRODUCTION_SITE_URL } from "../../../scripts/lib/site-domains.mjs";
import { getSiteUrl } from "./resend.mjs";

const STORE_NAME = "sots-ticketing";

function store() {
  return blobStore(STORE_NAME);
}

function passkeysKey(email) {
  return `patron-passkeys:${normalizePatronEmail(email)}`;
}

function challengeKey(email, kind) {
  return `webauthn-challenge:${kind}:${normalizePatronEmail(email)}`;
}

export function getWebAuthnConfig(event) {
  const siteUrl = (getSiteUrl() || PRODUCTION_SITE_URL).replace(/\/$/, "");
  let origin = siteUrl;
  try {
    const headerOrigin = event?.headers?.origin || event?.headers?.Origin;
    if (headerOrigin) origin = String(headerOrigin).replace(/\/$/, "");
  } catch {
    /* keep siteUrl */
  }
  const hostname = new URL(origin.includes("://") ? origin : `https://${origin}`).hostname;
  const rpID =
    hostname === "localhost" || hostname === "127.0.0.1"
      ? "localhost"
      : hostname.includes("netlify.app")
        ? hostname
        : hostname.replace(/^www\./, "") === "shakespeareonthesound.org"
          ? hostname
          : hostname;

  return {
    rpID,
    rpName: "Shakespeare on the Sound",
    origin: origin.startsWith("http") ? origin : `https://${origin}`,
    // Also accept preview/production origins for options verification.
    expectedOrigins: [
      origin.startsWith("http") ? origin : `https://${origin}`,
      PRODUCTION_SITE_URL,
      PREVIEW_SITE_URL,
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
    ],
  };
}

export async function listPatronPasskeys(email) {
  const normalized = normalizePatronEmail(email);
  if (!normalized) return [];
  try {
    return (await store().get(passkeysKey(normalized), { type: "json" })) ?? [];
  } catch {
    return [];
  }
}

export async function patronHasPasskeys(email) {
  const keys = await listPatronPasskeys(email);
  return keys.length > 0;
}

async function savePasskeys(email, passkeys) {
  await store().setJSON(passkeysKey(email), passkeys);
}

async function saveChallenge(email, kind, challenge) {
  await store().setJSON(challengeKey(email, kind), {
    challenge,
    createdAt: new Date().toISOString(),
  });
}

async function takeChallenge(email, kind) {
  const key = challengeKey(email, kind);
  const stored = (await store().get(key, { type: "json" })) ?? null;
  try {
    await store().delete(key);
  } catch {
    /* ignore */
  }
  return stored?.challenge || null;
}

function toBase64URL(buffer) {
  return Buffer.from(buffer).toString("base64url");
}

export async function beginPasskeyRegistration(email, event) {
  const passkeys = await listPatronPasskeys(email);
  const { rpID, rpName } = getWebAuthnConfig(event);
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: email,
    userDisplayName: email,
    userID: new TextEncoder().encode(email),
    attestationType: "none",
    excludeCredentials: passkeys.map((pk) => ({
      id: pk.credentialID,
      transports: pk.transports,
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
      authenticatorAttachment: "platform",
    },
  });
  await saveChallenge(email, "register", options.challenge);
  return options;
}

export async function finishPasskeyRegistration(email, response, event) {
  const expectedChallenge = await takeChallenge(email, "register");
  if (!expectedChallenge) throw new Error("Registration challenge expired. Try again.");
  const { rpID, expectedOrigins } = getWebAuthnConfig(event);

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: expectedOrigins,
    expectedRPID: rpID,
  });

  if (!verification.verified || !verification.registrationInfo) {
    throw new Error("Passkey registration could not be verified.");
  }

  const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;
  const passkeys = await listPatronPasskeys(email);
  const credentialID = typeof credential.id === "string" ? credential.id : toBase64URL(credential.id);

  const next = [
    ...passkeys.filter((pk) => pk.credentialID !== credentialID),
    {
      credentialID,
      publicKey: toBase64URL(credential.publicKey),
      counter: credential.counter ?? 0,
      transports: response.response?.transports || credential.transports || [],
      deviceType: credentialDeviceType,
      backedUp: credentialBackedUp,
      createdAt: new Date().toISOString(),
    },
  ].slice(0, 5);

  await savePasskeys(email, next);
  return { ok: true, count: next.length };
}

export async function beginPasskeyAuthentication(email, event) {
  const passkeys = await listPatronPasskeys(email);
  if (!passkeys.length) throw new Error("No passkey is registered for this account.");
  const { rpID } = getWebAuthnConfig(event);
  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: passkeys.map((pk) => ({
      id: pk.credentialID,
      transports: pk.transports,
    })),
    userVerification: "preferred",
  });
  await saveChallenge(email, "auth", options.challenge);
  return options;
}

export async function finishPasskeyAuthentication(email, response, event) {
  const expectedChallenge = await takeChallenge(email, "auth");
  if (!expectedChallenge) throw new Error("Passkey challenge expired. Try again.");
  const passkeys = await listPatronPasskeys(email);
  const credentialID = response.id;
  const stored = passkeys.find((pk) => pk.credentialID === credentialID);
  if (!stored) throw new Error("Unknown passkey.");

  const { rpID, expectedOrigins } = getWebAuthnConfig(event);
  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: expectedOrigins,
    expectedRPID: rpID,
    credential: {
      id: stored.credentialID,
      publicKey: Buffer.from(stored.publicKey, "base64url"),
      counter: stored.counter ?? 0,
      transports: stored.transports,
    },
  });

  if (!verification.verified) throw new Error("Passkey could not be verified.");

  const nextCounter = verification.authenticationInfo?.newCounter ?? stored.counter;
  const next = passkeys.map((pk) =>
    pk.credentialID === credentialID ? { ...pk, counter: nextCounter } : pk,
  );
  await savePasskeys(email, next);
  return { ok: true };
}

export async function removeAllPatronPasskeys(email) {
  try {
    await store().delete(passkeysKey(email));
  } catch {
    /* ignore */
  }
}
