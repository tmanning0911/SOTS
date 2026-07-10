import { resolveLocationId, squareRequest } from "./square.mjs";

const TEST_IMAGE_FALLBACKS = {
  "TEST-SOTS-TEE": "/images/hero-much-ado.jpg",
  "TEST-SOTS-TOTE": "/images/news/kids-kings.jpg",
  "TEST-SOTS-PIN": "/images/decor/shakespeare-portrait.png",
  "TEST-PLAYBILL-2026": "/images/news/season-maan-banner.jpg",
  "TEST-GIFT-50": "/images/backgrounds/park-audience-nyt.jpg",
  "TEST-GIFT-100": "/images/backgrounds/park-audience-nyt.jpg",
};

function formatMoney(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    (cents ?? 0) / 100,
  );
}

function slugify(value) {
  return String(value ?? "gifts")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveImageUrl(imageIds, lookup) {
  const imageId = imageIds?.[0];
  if (!imageId) return null;
  const image = lookup.get(imageId);
  return image?.image_data?.url ?? null;
}

export function normalizeCatalogProducts(items = [], relatedObjects = []) {
  const lookup = new Map();
  for (const obj of [...items, ...relatedObjects]) {
    lookup.set(obj.id, obj);
  }
  for (const item of items) {
    if (item.type !== "ITEM") continue;
    for (const variation of item.item_data?.variations ?? []) {
      if (variation?.id && variation.item_variation_data) {
        lookup.set(variation.id, variation);
      }
    }
  }

  const products = [];
  for (const item of items) {
    if (item.type !== "ITEM" || item.is_deleted) continue;
    const data = item.item_data;
    if (!data) continue;

    const categoryObj = data.category_id ? lookup.get(data.category_id) : null;
    const categoryLabel = categoryObj?.category_data?.name ?? "Gifts";
    const category = slugify(categoryLabel);
    const variationIds = (data.variations ?? []).map((v) => v.id);

    for (const variationId of variationIds) {
      const variation = lookup.get(variationId);
      const varData = variation?.item_variation_data;
      if (!variation || variation.is_deleted || !varData) continue;

      const amount = varData.price_money?.amount;
      if (amount == null || amount < 0) continue;

      const variationName = varData.name && varData.name !== "Regular" ? varData.name : null;
      const name = variationName ? `${data.name} — ${variationName}` : data.name;
      const sku = varData.sku ?? null;
      if (sku?.startsWith("TEST-TIX-")) continue;

      products.push({
        id: variation.id,
        itemId: item.id,
        name,
        description: data.description_plaintext || data.description || "",
        category,
        categoryLabel,
        price: {
          value: amount,
          display: formatMoney(amount),
          currency: varData.price_money?.currency ?? "USD",
        },
        image: resolveImageUrl(data.image_ids, lookup) || TEST_IMAGE_FALLBACKS[sku] || null,
        sku,
        onSale: data.ecom_available !== false,
      });
    }
  }

  return products.sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchSquareShopCatalog() {
  const locationId = await resolveLocationId();
  const data = await squareRequest("/v2/catalog/search-catalog-items", {
    method: "POST",
    body: {
      enabled_location_ids: [locationId],
      product_types: ["REGULAR"],
    },
  });

  const items = data.items ?? [];
  const related = [...(data.related_objects ?? [])];

  for (const item of items) {
    if (item.item_data?.image_ids?.length) continue;
    try {
      const detail = await squareRequest(
        `/v2/catalog/object/${item.id}?include_related_objects=true`,
      );
      if (detail.object?.item_data?.image_ids) {
        item.item_data.image_ids = detail.object.item_data.image_ids;
      }
      for (const obj of detail.related_objects ?? []) {
        related.push(obj);
      }
    } catch {
      /* optional enrichment */
    }
  }

  const products = normalizeCatalogProducts(items, related);
  const bySku = new Map();
  for (const product of products) {
    const key = product.sku || product.id;
    const existing = bySku.get(key);
    if (!existing || (product.image && !existing.image)) {
      bySku.set(key, product);
    }
  }
  return [...bySku.values()].sort((a, b) => a.name.localeCompare(b.name));
}
