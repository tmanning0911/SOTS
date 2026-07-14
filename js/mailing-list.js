/**
 * Shared mailing-list signup → /api/contact (Constant Contact when configured).
 */

export async function submitMailingListSignup({ email, name = "", botField = "" }) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      form: "newsletter",
      fields: {
        email: String(email || "").trim(),
        name: String(name || "").trim(),
        "bot-field": String(botField || ""),
      },
    }),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.error || "Signup failed. Please try again.");
  }
  return payload;
}
