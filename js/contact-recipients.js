/**
 * Staff inboxes that website forms may deliver to.
 * Unknown addresses fall back to general inquiries.
 */

export const CONTACT_GENERAL = "contactus@shakespeareonthesound.org";

/** @type {Record<string, { label: string; form: "contact" | "education" | "sponsorship" }>} */
export const CONTACT_RECIPIENTS = {
  "contactus@shakespeareonthesound.org": {
    label: "General Inquiries",
    form: "contact",
  },
  "aaron@shakespeareonthesound.org": {
    label: "Aaron Simms, Executive Director",
    form: "contact",
  },
  "stephanie@shakespeareonthesound.org": {
    label: "Stephanie Eiss, Director of Education and Outreach",
    form: "education",
  },
  "marketing@shakespeareonthesound.org": {
    label: "Marketing",
    form: "sponsorship",
  },
};

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const EMAIL_ONLY_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^mailto:/i, "")
    .split("?")[0]
    .trim();
}

export function looksLikeEmail(value) {
  return EMAIL_ONLY_RE.test(String(value || "").trim());
}

export function extractMailtoAddress(href) {
  if (!href || typeof href !== "string") return "";
  if (!/^mailto:/i.test(href)) return "";
  return normalizeEmail(href);
}

export function resolveContactRecipient(raw) {
  const email = normalizeEmail(raw);
  const known = CONTACT_RECIPIENTS[email];
  if (known) {
    return { email, ...known };
  }
  return {
    email: CONTACT_GENERAL,
    label: CONTACT_RECIPIENTS[CONTACT_GENERAL].label,
    form: "contact",
    requested: email && email !== CONTACT_GENERAL ? email : null,
  };
}

export function isContactMailto(href) {
  return Boolean(extractMailtoAddress(href));
}

/**
 * Split text so emails can be rendered as interactive links.
 * @returns {Array<{ type: "text" | "email", value: string }>}
 */
export function splitTextWithEmails(text) {
  const source = String(text ?? "");
  if (!source) return [];

  const parts = [];
  let lastIndex = 0;
  EMAIL_RE.lastIndex = 0;
  let match;
  while ((match = EMAIL_RE.exec(source)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: source.slice(lastIndex, match.index) });
    }
    parts.push({ type: "email", value: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < source.length) {
    parts.push({ type: "text", value: source.slice(lastIndex) });
  }
  return parts.length ? parts : [{ type: "text", value: source }];
}
