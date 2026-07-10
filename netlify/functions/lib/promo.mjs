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
