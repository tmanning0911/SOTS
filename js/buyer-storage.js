const STORAGE_KEY = "sots-buyer";

export function readStoredBuyer() {
  if (typeof window === "undefined") {
    return { name: "", email: "", phone: "", marketingOptIn: false };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { name: "", email: "", phone: "", marketingOptIn: false };
    const parsed = JSON.parse(raw);
    return {
      name: String(parsed?.name ?? "").slice(0, 200),
      email: String(parsed?.email ?? "").slice(0, 254),
      phone: String(parsed?.phone ?? "").slice(0, 40),
      marketingOptIn: Boolean(parsed?.marketingOptIn),
    };
  } catch {
    return { name: "", email: "", phone: "", marketingOptIn: false };
  }
}

export function writeStoredBuyer({ name, email, phone, marketingOptIn }) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        name: String(name ?? "")
          .trim()
          .slice(0, 200),
        email: String(email ?? "")
          .trim()
          .toLowerCase()
          .slice(0, 254),
        phone: String(phone ?? "")
          .trim()
          .slice(0, 40),
        marketingOptIn: Boolean(marketingOptIn),
      }),
    );
  } catch {
    /* ignore quota errors */
  }
}
