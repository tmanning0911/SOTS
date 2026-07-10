const STORAGE_KEY = "sots-buyer";

export function readStoredBuyer() {
  if (typeof window === "undefined") return { name: "", email: "" };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { name: "", email: "" };
    const parsed = JSON.parse(raw);
    return {
      name: String(parsed?.name ?? "").slice(0, 200),
      email: String(parsed?.email ?? "").slice(0, 254),
    };
  } catch {
    return { name: "", email: "" };
  }
}

export function writeStoredBuyer({ name, email }) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        name: String(name ?? "").trim().slice(0, 200),
        email: String(email ?? "").trim().toLowerCase().slice(0, 254),
      }),
    );
  } catch {
    /* ignore quota errors */
  }
}
