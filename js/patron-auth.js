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
      hasPassword: Boolean(safe.hasPassword),
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

function storeSessionFromAuth(data) {
  const session = {
    signedIn: true,
    user: data.user,
    profile: data.profile ?? null,
    needsPasskey: Boolean(data.needsPasskey),
    hasPassword: Boolean(data.hasPassword),
  };
  writePatronSession(session);
  return session;
}

export async function registerPatronAccount({ email, password, name = "" } = {}) {
  const res = await patronFetch("/api/patron/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Account signup isn’t live on the server yet. Try again in a minute, or use Email me a link.");
    }
    throw new Error(data.error || "Couldn't create your account.");
  }
  return storeSessionFromAuth(data);
}

export async function loginPatronWithPassword(email, password) {
  const res = await patronFetch("/api/patron/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Password sign-in isn’t live on the server yet. Try again in a minute, or use Email me a link.");
    }
    throw new Error(data.error || "Incorrect email or password.");
  }
  return storeSessionFromAuth(data);
}

export async function requestPatronPasswordReset(email) {
  const res = await patronFetch("/api/patron/password/forgot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Couldn't send the email. Try again in a moment.");
  return data;
}

export async function resetPatronPassword(token, password) {
  const res = await patronFetch("/api/patron/password/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "That link expired. Request a new one.");
  return storeSessionFromAuth(data);
}

export async function changePatronPassword({ currentPassword = "", newPassword } = {}) {
  const res = await patronFetch("/api/patron/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Couldn't update your password.");
  return data;
}

export async function fetchPatronPasswordStatus() {
  const res = await patronFetch("/api/patron/password");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not check password status");
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
  return storeSessionFromAuth(data);
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
