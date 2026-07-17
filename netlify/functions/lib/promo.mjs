import { readStaticJsonCatalog } from "./static-catalog.mjs";

export async function loadPromos() {
  try {
    const data = await readStaticJsonCatalog("promos.json");
    return Array.isArray(data?.codes) ? data.codes : [];
  } catch {
    return [];
  }
}

export async function validatePromo(code) {
  const normalized = String(code ?? "")
    .trim()
    .toUpperCase();
  if (!normalized) return null;

  const promos = await loadPromos();
  const promo = promos.find((entry) => String(entry.code ?? "").toUpperCase() === normalized);
  if (!promo || promo.active === false) return null;
  if (promo.expiresAt && new Date(promo.expiresAt).getTime() < Date.now()) return null;
  if (promo.startsAt && new Date(promo.startsAt).getTime() > Date.now()) return null;
  return { ...promo, code: normalized };
}

export function calculateDiscountCents(subtotalCents, promo) {
  if (!promo || subtotalCents <= 0) return 0;
  const type = String(promo.type ?? "percent").toLowerCase();
  const value = Number(promo.value ?? 0);
  if (!Number.isFinite(value) || value <= 0) return 0;

  if (type === "fixed") {
    return Math.min(subtotalCents, Math.round(value));
  }

  return Math.min(subtotalCents, Math.round((subtotalCents * value) / 100));
}

/** True when a promo is allowed to produce a $0 ticket total (comps / testers). */
export function promoAllowsZeroTotal(promo) {
  return Boolean(promo?.allowZero || promo?.tester);
}

/**
 * Ticket charge after promo. Shop/donation are added by the caller.
 * Partial promos still floor at $1 unless the promo allows a true $0 total.
 */
export function ticketChargeCents(subtotalCents, discountCents, promo) {
  const raw = Math.max(0, Number(subtotalCents) - Number(discountCents || 0));
  if (raw === 0 && promoAllowsZeroTotal(promo)) return 0;
  return Math.max(100, raw);
}
