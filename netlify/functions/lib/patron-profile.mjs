import { blobStore, isNetlifyRuntime } from "./netlify-blobs.mjs";
import { normalizePatronEmail } from "./patron-auth.mjs";

const STORE_NAME = "sots-ticketing";

function store() {
  return blobStore(STORE_NAME);
}

function profileKey(email) {
  return `patron-profile:${normalizePatronEmail(email)}`;
}

function avatarKey(email) {
  return `patron-avatar:${normalizePatronEmail(email)}`;
}

const ALLOWED_AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_AVATAR_BYTES = 350_000;

export function emptyPatronAddress() {
  return {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
  };
}

export function normalizePhone(phone) {
  return String(phone ?? "")
    .trim()
    .replace(/[^\d+().\-\s]/g, "")
    .slice(0, 40);
}

export function normalizeAddress(address = {}) {
  return {
    line1: String(address?.line1 ?? "")
      .trim()
      .slice(0, 200),
    line2: String(address?.line2 ?? "")
      .trim()
      .slice(0, 200),
    city: String(address?.city ?? "")
      .trim()
      .slice(0, 100),
    state: String(address?.state ?? "")
      .trim()
      .toUpperCase()
      .slice(0, 40),
    postalCode: String(address?.postalCode ?? "")
      .trim()
      .slice(0, 20),
  };
}

function splitName(fullName) {
  const parts = String(fullName ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export function publicPatronProfile(profile) {
  if (!profile) return null;
  const { firstName, lastName } = splitName(profile.name);
  return {
    email: profile.email,
    name: profile.name ?? "",
    firstName,
    lastName,
    phone: profile.phone ?? "",
    address: normalizeAddress(profile.address),
    marketingOptIn: Boolean(profile.marketingOptIn),
    marketingOptInAt: profile.marketingOptInAt ?? null,
    hasAvatar: Boolean(profile.hasAvatar),
    avatarUpdatedAt: profile.avatarUpdatedAt ?? null,
    updatedAt: profile.updatedAt ?? null,
    createdAt: profile.createdAt ?? null,
    crmSyncStatus: profile.crmSyncStatus ?? "pending",
  };
}

export async function getPatronProfile(email) {
  const normalized = normalizePatronEmail(email);
  if (!normalized) return null;
  try {
    return (await store().get(profileKey(normalized), { type: "json" })) ?? null;
  } catch {
    return null;
  }
}

/**
 * Create or merge a patron profile. Empty incoming fields do not wipe existing values
 * unless `overwrite` is true.
 *
 * My Tickets and checkout use merge mode so a partially hydrated form cannot erase
 * address/phone already stored in Blobs.
 */
export async function upsertPatronProfile(email, patch = {}, { overwrite = false, source = "account" } = {}) {
  const normalized = normalizePatronEmail(email);
  if (!normalized) throw new Error("A valid email is required");

  const existing = (await getPatronProfile(normalized)) ?? null;
  const now = new Date().toISOString();
  const nextName = String(patch.name ?? "").trim().slice(0, 200);
  const nextPhone = normalizePhone(patch.phone);
  const nextAddress = normalizeAddress(patch.address);
  const hasMarketingFlag = typeof patch.marketingOptIn === "boolean";
  const marketingOptIn = hasMarketingFlag
    ? patch.marketingOptIn
    : Boolean(existing?.marketingOptIn);

  const profile = {
    email: normalized,
    name: overwrite ? nextName : nextName || existing?.name || "",
    phone: overwrite ? nextPhone : nextPhone || existing?.phone || "",
    address: overwrite
      ? nextAddress
      : {
          line1: nextAddress.line1 || existing?.address?.line1 || "",
          line2: nextAddress.line2 || existing?.address?.line2 || "",
          city: nextAddress.city || existing?.address?.city || "",
          state: nextAddress.state || existing?.address?.state || "",
          postalCode: nextAddress.postalCode || existing?.address?.postalCode || "",
        },
    marketingOptIn,
    marketingOptInAt:
      marketingOptIn && !existing?.marketingOptIn
        ? now
        : marketingOptIn
          ? existing?.marketingOptInAt ?? now
          : null,
    hasAvatar: Boolean(existing?.hasAvatar),
    avatarUpdatedAt: existing?.avatarUpdatedAt ?? null,
    avatarMime: existing?.avatarMime ?? null,
    source: existing?.source || source,
    lastSource: source,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    crmSyncedAt: existing?.crmSyncedAt ?? null,
    crmSyncStatus: existing?.crmSyncStatus ?? "pending",
  };

  // Mark for re-sync when contact or consent changed.
  const contactChanged =
    profile.name !== (existing?.name ?? "") ||
    profile.phone !== (existing?.phone ?? "") ||
    JSON.stringify(profile.address) !== JSON.stringify(normalizeAddress(existing?.address)) ||
    profile.marketingOptIn !== Boolean(existing?.marketingOptIn);

  if (!existing || contactChanged) {
    profile.crmSyncStatus = "pending";
  }

  try {
    const key = profileKey(normalized);
    await store().setJSON(key, profile);
    // Same pattern as checkout holds — confirm the blob landed in Netlify runtime.
    if (isNetlifyRuntime()) {
      const verified = await store().get(key, { type: "json" });
      if (!verified?.email) {
        throw new Error("Profile write could not be verified.");
      }
    }
  } catch (err) {
    console.error("patron profile persist failed:", err);
    throw new Error("Could not save your contact information.");
  }

  return profile;
}

export async function setPatronAvatar(email, { bytes, contentType }) {
  const normalized = normalizePatronEmail(email);
  if (!normalized) throw new Error("A valid email is required");

  const mime = String(contentType ?? "").toLowerCase().split(";")[0].trim();
  if (!ALLOWED_AVATAR_TYPES.has(mime)) {
    throw new Error("Use a JPEG, PNG, or WebP image.");
  }

  const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes ?? []);
  if (!buffer.length) throw new Error("Image file is empty.");
  if (buffer.length > MAX_AVATAR_BYTES) {
    throw new Error("Image is too large. Please use a photo under 350 KB.");
  }

  const existing = (await getPatronProfile(normalized)) ?? {
    email: normalized,
    name: "",
    phone: "",
    address: emptyPatronAddress(),
    marketingOptIn: false,
    createdAt: new Date().toISOString(),
  };

  const now = new Date().toISOString();
  try {
    await store().set(avatarKey(normalized), buffer, {
      metadata: { contentType: mime },
    });
  } catch (err) {
    console.error("patron avatar persist failed:", err);
    throw new Error("Could not save your profile photo.");
  }

  const profile = {
    ...existing,
    email: normalized,
    hasAvatar: true,
    avatarUpdatedAt: now,
    avatarMime: mime,
    updatedAt: now,
    lastSource: "avatar",
  };

  try {
    await store().setJSON(profileKey(normalized), profile);
  } catch (err) {
    console.error("patron avatar metadata persist failed:", err);
    throw new Error("Could not save your profile photo.");
  }

  return profile;
}

export async function getPatronAvatar(email) {
  const normalized = normalizePatronEmail(email);
  if (!normalized) return null;
  try {
    const result = await store().getWithMetadata(avatarKey(normalized), { type: "arrayBuffer" });
    if (!result?.data) return null;
    const contentType =
      result.metadata?.contentType ||
      result.metadata?.metadata?.contentType ||
      "image/jpeg";
    return {
      bytes: Buffer.from(result.data),
      contentType: String(contentType),
    };
  } catch {
    return null;
  }
}

export async function deletePatronAvatar(email) {
  const normalized = normalizePatronEmail(email);
  if (!normalized) throw new Error("A valid email is required");

  const existing = await getPatronProfile(normalized);
  try {
    await store().delete(avatarKey(normalized));
  } catch {
    /* missing avatar is fine */
  }

  if (!existing) {
    return {
      email: normalized,
      name: "",
      phone: "",
      address: emptyPatronAddress(),
      marketingOptIn: false,
      hasAvatar: false,
      avatarUpdatedAt: null,
      avatarMime: null,
    };
  }

  const now = new Date().toISOString();
  const profile = {
    ...existing,
    hasAvatar: false,
    avatarUpdatedAt: null,
    avatarMime: null,
    updatedAt: now,
    lastSource: "avatar",
  };
  await store().setJSON(profileKey(normalized), profile);
  return profile;
}

export async function markPatronCrmSync(email, { status, detail = "" } = {}) {
  const profile = await getPatronProfile(email);
  if (!profile) return null;
  const next = {
    ...profile,
    crmSyncStatus: status || "synced",
    crmSyncedAt: status === "synced" ? new Date().toISOString() : profile.crmSyncedAt,
    crmSyncDetail: String(detail ?? "").slice(0, 500),
    updatedAt: profile.updatedAt,
  };
  try {
    await store().setJSON(profileKey(profile.email), next);
  } catch {
    /* optional */
  }
  return next;
}

export function buyerFromProfile(profile) {
  if (!profile) return { name: "", email: "", phone: "", marketingOptIn: false };
  return {
    name: profile.name ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    marketingOptIn: Boolean(profile.marketingOptIn),
  };
}
