const SESSION_KEY = "sots-patron-session";

/** Cookie session is authoritative; localStorage only caches user/profile for UI. */
export function readPatronSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.user?.email) return null;
    // Legacy localStorage tokens are no longer used — strip if present.
    const { token: _legacyToken, ...safe } = parsed;
    return { ...safe, signedIn: true };
  } catch {
    return null;
  }
}

export function writePatronSession(session) {
  if (typeof window === "undefined" || !session?.user?.email) return;
  const { token: _legacyToken, ...safe } = session;
  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      user: safe.user,
      profile: safe.profile ?? null,
      signedIn: true,
    }),
  );
}

export function clearPatronSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

async function patronFetch(url, options = {}) {
  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });
  return res;
}

export async function requestPatronMagicLink(email) {
  const res = await patronFetch("/api/patron/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Couldn't send the email. Try again in a moment.");
  return data;
}

export async function exchangePatronToken(token) {
  const res = await patronFetch("/api/patron/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "That link expired. Request a new one.");
  const session = {
    signedIn: true,
    user: data.user,
    profile: data.profile ?? null,
    needsPasskey: Boolean(data.needsPasskey),
  };
  writePatronSession(session);
  return session;
}

export async function signOutPatron() {
  try {
    await patronFetch("/api/patron/logout", { method: "POST" });
  } catch {
    /* still clear local UI state */
  }
  clearPatronSession();
}

export async function signOutPatronEverywhere() {
  try {
    await patronFetch("/api/patron/logout-all", { method: "POST" });
  } catch {
    /* still clear local UI state */
  }
  clearPatronSession();
}

export async function fetchPatronProfile() {
  const res = await patronFetch("/api/patron/auth");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Session expired");
  return data;
}

export async function fetchPatronContactProfile() {
  const res = await patronFetch("/api/patron/profile");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not load your contact information");
  return data.profile ?? null;
}

export async function updatePatronContactProfile(profile) {
  const res = await patronFetch("/api/patron/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not save your contact information");
  return data.profile ?? null;
}

export async function fetchPatronOrders() {
  const res = await patronFetch("/api/patron/orders");
  const data = await res.json().catch(() => ({}));
  if (res.status === 403 && data.needsPasskey) {
    const err = new Error(data.error || "Confirm with Face ID or your device lock to continue.");
    err.needsPasskey = true;
    throw err;
  }
  if (!res.ok) throw new Error(data.error || "Could not load orders");
  return data.orders ?? [];
}
