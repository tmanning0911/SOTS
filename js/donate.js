/**
 * Online donations via Square (one-time checkout + optional monthly link).
 */

export const DONATE_PATH = "/support/donate/";

/** Approximate Square online rate: 2.9% + $0.30 — used when donor covers fees. */
export const DONATE_FEE_PERCENT = 0.029;
export const DONATE_FEE_FIXED_CENTS = 30;

export const DONATE_SUGGESTED = [
  { amount: 25, label: "$25", hint: "Friend" },
  { amount: 67, label: "$67", hint: "Cost per patron" },
  { amount: 100, label: "$100", hint: "Supporter" },
  { amount: 250, label: "$250", hint: "Advocate" },
  { amount: 500, label: "$500", hint: "Patron" },
];

/**
 * Paste a Square Dashboard recurring “Accept a donation” payment link here
 * (Payment links → Create → Accept a donation → Frequency: Recurring).
 * Until set, monthly gifts use one-time checkout with a note to contact Aaron to continue monthly.
 */
export const DONATE_MONTHLY_LINK = "";

export const DONATE_CONTACT = {
  name: "Aaron Simms, Executive Director",
  email: "aaron@shakespeareonthesound.org",
  phone: "(203) 957-1006",
  phoneHref: "tel:+12039571006",
};

export function dollarsToCents(dollars) {
  const n = Number(dollars);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100);
}

export function centsToDollarsLabel(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format((Number(cents) || 0) / 100);
}

/** Charge amount so ~net ≈ base gift after Square online fees. */
export function chargeCentsWithFeesCovered(baseCents) {
  const base = Math.max(0, Math.round(Number(baseCents) || 0));
  if (!base) return 0;
  // charge = (base + fixed) / (1 - rate)
  return Math.ceil((base + DONATE_FEE_FIXED_CENTS) / (1 - DONATE_FEE_PERCENT));
}

export function feeCoverDeltaCents(baseCents) {
  const base = Math.max(0, Math.round(Number(baseCents) || 0));
  if (!base) return 0;
  return Math.max(0, chargeCentsWithFeesCovered(base) - base);
}
