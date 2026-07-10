import { resolveLocationId, squareRequest } from "./square.mjs";

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
        image: resolveImageUrl(data.image_ids, lookup),
        sku: varData.sku ?? null,
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

  return normalizeCatalogProducts(data.items ?? [], data.related_objects ?? []);
}
