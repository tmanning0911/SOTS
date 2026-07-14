const SESSION_KEY = "sots-patron-session";

export function readPatronSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.user?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writePatronSession(session) {
  if (typeof window === "undefined" || !session?.token) return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearPatronSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export async function requestPatronMagicLink(email) {
  const res = await fetch("/api/patron/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not send sign-in link");
  return data;
}

export async function exchangePatronToken(token) {
  const res = await fetch("/api/patron/session", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ token }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Sign-in link expired");
  writePatronSession(data);
  return data;
}

export async function fetchPatronProfile(token = readPatronSession()?.token) {
  if (!token) throw new Error("Not signed in");
  const res = await fetch("/api/patron/auth", {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Session expired");
  return data;
}

export async function fetchPatronContactProfile(token = readPatronSession()?.token) {
  if (!token) throw new Error("Not signed in");
  const res = await fetch("/api/patron/profile", {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not load your contact information");
  return data.profile ?? null;
}

export async function updatePatronContactProfile(profile, token = readPatronSession()?.token) {
  if (!token) throw new Error("Not signed in");
  const res = await fetch("/api/patron/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not save your contact information");
  return data.profile ?? null;
}

export async function fetchPatronOrders(token = readPatronSession()?.token) {
  if (!token) throw new Error("Not signed in");
  const res = await fetch("/api/patron/orders", {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not load orders");
  return data.orders ?? [];
}
