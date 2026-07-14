import { randomBytes } from "node:crypto";
import { isTicketCatalogSku, ticketTypeSku } from "../../../js/square-ticket-skus.js";
import { resolveLocationId, squareEnvironment, squareRequest } from "./square.mjs";

export const TICKET_CATEGORY_NAME = "SOTS — Event Tickets";
export const SQUARE_TICKET_CATALOG_FILENAME = "square-ticket-catalog.json";

function idempotencyKey() {
  return randomBytes(16).toString("hex");
}

function formatPerformanceNote(productionTitle, performanceStart) {
  const title = String(productionTitle ?? "SOTS performance").trim();
  const when = String(performanceStart ?? "").trim();
  return when ? `${title} — ${when}` : title;
}

export function indexSquareCatalogBySku(items = [], relatedObjects = []) {
  const lookup = new Map();
  for (const obj of [...items, ...relatedObjects]) {
    lookup.set(obj.id, obj);
  }

  const bySku = new Map();
  for (const item of items) {
    if (item.type !== "ITEM" || item.is_deleted) continue;
    for (const varRef of item.item_data?.variations ?? []) {
      const variation = lookup.get(varRef.id);
      const sku = variation?.item_variation_data?.sku;
      if (!sku || !isTicketCatalogSku(sku)) continue;
      bySku.set(sku, {
        sku,
        itemId: item.id,
        variationId: variation.id,
        name: item.item_data?.name ?? sku,
        priceCents: variation.item_variation_data?.price_money?.amount ?? null,
      });
    }
  }
  return bySku;
}

export async function listTicketCatalogBySku() {
  const locationId = await resolveLocationId();
  const data = await squareRequest("/v2/catalog/search-catalog-items", {
    method: "POST",
    body: {
      enabled_location_ids: [locationId],
      product_types: ["REGULAR"],
    },
  });
  return indexSquareCatalogBySku(data.items ?? [], data.related_objects ?? []);
}

function catalogObjectForCategory(tempId) {
  return {
    type: "CATEGORY",
    id: tempId,
    category_data: { name: TICKET_CATEGORY_NAME },
  };
}

function catalogObjectForTicketType({ tempItemId, tempVariationId, categoryId, ticketType, locationId }) {
  const sku = ticketTypeSku(ticketType.slug ?? ticketType.name);
  const description =
    "Ticket tier for Shakespeare on the Sound website checkout. Performance date is recorded on the Square order.";

  return {
    type: "ITEM",
    id: tempItemId,
    item_data: {
      name: ticketType.name,
      description,
      description_plaintext: description,
      category_id: categoryId,
      present_at_all_locations: false,
      present_at_location_ids: [locationId],
      ecom_available: false,
      variations: [
        {
          type: "ITEM_VARIATION",
          id: tempVariationId,
          item_variation_data: {
            item_id: tempItemId,
            name: "Regular",
            sku,
            pricing_type: "FIXED_PRICING",
            price_money: {
              amount: ticketType.price.value,
              currency: ticketType.price.currency ?? "USD",
            },
            track_inventory: false,
            present_at_all_locations: false,
            present_at_location_ids: [locationId],
          },
        },
      ],
    },
  };
}

function catalogObjectForTicketTypeUpdate({ existing, ticketType, categoryId, locationId }) {
  const sku = ticketTypeSku(ticketType.slug ?? ticketType.name);
  const description =
    "Ticket tier for Shakespeare on the Sound website checkout. Performance date is recorded on the Square order.";

  return {
    type: "ITEM",
    id: existing.itemId,
    item_data: {
      name: ticketType.name,
      description,
      description_plaintext: description,
      category_id: categoryId,
      present_at_all_locations: false,
      present_at_location_ids: [locationId],
      ecom_available: false,
      variations: [
        {
          type: "ITEM_VARIATION",
          id: existing.variationId,
          item_variation_data: {
            item_id: existing.itemId,
            name: "Regular",
            sku,
            pricing_type: "FIXED_PRICING",
            price_money: {
              amount: ticketType.price.value,
              currency: ticketType.price.currency ?? "USD",
            },
            track_inventory: false,
            present_at_all_locations: false,
            present_at_location_ids: [locationId],
          },
        },
      ],
    },
  };
}

function mapUpsertedIds(idMappings = []) {
  const map = new Map();
  for (const entry of idMappings) {
    if (entry.client_object_id && entry.object_id) {
      map.set(entry.client_object_id, entry.object_id);
    }
  }
  return map;
}

async function batchUpsert(objects) {
  return squareRequest("/v2/catalog/batch-upsert", {
    method: "POST",
    body: {
      idempotency_key: idempotencyKey(),
      batches: [{ objects }],
    },
  });
}

async function resolveCategoryId() {
  const data = await squareRequest("/v2/catalog/list?types=CATEGORY");
  for (const obj of data.objects ?? []) {
    if (obj.type === "CATEGORY" && obj.category_data?.name === TICKET_CATEGORY_NAME) {
      return obj.id;
    }
  }

  const tempId = "#sots-tix-category";
  const result = await batchUpsert([catalogObjectForCategory(tempId)]);
  const idMap = mapUpsertedIds(result.id_mappings);
  const categoryId = idMap.get(tempId);
  if (!categoryId) {
    throw new Error("Could not create Square ticket category");
  }
  return categoryId;
}

export function buildSquareTicketCatalogMapping(ticketTypes = [], existingBySku = new Map(), locationId = null) {
  const ticketTypeMap = {};
  for (const ticketType of ticketTypes) {
    if (!ticketType?.id || !ticketType?.price?.value) continue;
    const sku = ticketTypeSku(ticketType.slug ?? ticketType.name);
    const existing = existingBySku.get(sku);
    ticketTypeMap[ticketType.id] = {
      ticketTypeId: ticketType.id,
      slug: ticketType.slug ?? ticketType.name,
      name: ticketType.name,
      sku,
      catalogItemId: existing?.itemId ?? null,
      catalogVariationId: existing?.variationId ?? null,
      priceCents: ticketType.price.value,
    };
  }

  return {
    syncedAt: new Date().toISOString(),
    environment: squareEnvironment(),
    locationId,
    ticketTypes: ticketTypeMap,
    bySku: Object.fromEntries(
      Object.values(ticketTypeMap)
        .filter((entry) => entry.sku)
        .map((entry) => [entry.sku, entry]),
    ),
  };
}

export async function syncTicketTypesToSquareCatalog(ticketTypes = []) {
  const locationId = await resolveLocationId();
  const existingBySku = await listTicketCatalogBySku();
  const categoryId = await resolveCategoryId();

  const creates = [];
  const updates = [];

  for (const ticketType of ticketTypes) {
    if (!ticketType?.id || !ticketType?.price?.value) continue;
    const sku = ticketTypeSku(ticketType.slug ?? ticketType.name);
    const existing = existingBySku.get(sku);
    if (existing?.itemId && existing?.variationId) {
      updates.push(catalogObjectForTicketTypeUpdate({ existing, ticketType, categoryId, locationId }));
    } else {
      const tempItemId = `#sots-item-${ticketType.slug ?? ticketType.id}`;
      const tempVariationId = `${tempItemId}-var`;
      creates.push(
        catalogObjectForTicketType({
          tempItemId,
          tempVariationId,
          categoryId,
          ticketType,
          locationId,
        }),
      );
    }
  }

  if (creates.length) {
    const result = await batchUpsert(creates);
    const idMap = mapUpsertedIds(result.id_mappings);
    for (const ticketType of ticketTypes) {
      const sku = ticketTypeSku(ticketType.slug ?? ticketType.name);
      if (existingBySku.has(sku)) continue;
      const tempItemId = `#sots-item-${ticketType.slug ?? ticketType.id}`;
      const tempVariationId = `${tempItemId}-var`;
      const itemId = idMap.get(tempItemId);
      const variationId = idMap.get(tempVariationId);
      if (itemId && variationId) {
        existingBySku.set(sku, {
          sku,
          itemId,
          variationId,
          name: ticketType.name,
          priceCents: ticketType.price.value,
        });
      }
    }
  }

  if (updates.length) {
    await batchUpsert(updates);
    for (const ticketType of ticketTypes) {
      const sku = ticketTypeSku(ticketType.slug ?? ticketType.name);
      const existing = existingBySku.get(sku);
      if (existing) {
        existing.priceCents = ticketType.price.value;
        existing.name = ticketType.name;
      }
    }
  }

  return buildSquareTicketCatalogMapping(ticketTypes, existingBySku, locationId);
}

export function canBuildSquareTicketOrder(hold, catalogMapping) {
  if (!hold?.lineItems?.length || !catalogMapping?.ticketTypes) return false;
  return hold.lineItems.every((line) => catalogMapping.ticketTypes[line.ticketTypeId]?.catalogVariationId);
}

export function buildSquareTicketOrderPayload({
  hold,
  catalogMapping,
  productionTitle,
  performanceStart,
  locationId,
}) {
  const performanceNote = formatPerformanceNote(productionTitle, performanceStart);
  const lineItems = hold.lineItems.map((line) => {
    const map = catalogMapping.ticketTypes[line.ticketTypeId];
    return {
      quantity: String(line.quantity),
      catalog_object_id: map.catalogVariationId,
      base_price_money: { amount: line.unitPrice, currency: hold.currency ?? "USD" },
      note: performanceNote,
    };
  });

  if (hold.donationCents > 0) {
    lineItems.push({
      uid: "donation-line",
      name: "Donation",
      quantity: "1",
      base_price_money: { amount: hold.donationCents, currency: hold.currency ?? "USD" },
    });
  }

  for (const [index, line] of (hold.shopLineItems ?? []).entries()) {
    const noteParts = ["Park pickup"];
    if (line.option) noteParts.push(`Size ${line.option}`);
    lineItems.push({
      uid: `shop-line-${index}`,
      name: line.name,
      quantity: String(line.quantity),
      base_price_money: { amount: line.unitPrice, currency: hold.currency ?? "USD" },
      note: noteParts.join(" · "),
    });
  }

  const discounts = [];
  if (hold.discountCents > 0) {
    discounts.push({
      uid: "promo-discount",
      name: hold.promoCode ? `Promo: ${hold.promoCode}` : "Discount",
      amount_money: { amount: hold.discountCents, currency: hold.currency ?? "USD" },
      type: "FIXED_AMOUNT",
      scope: "ORDER",
    });
  }

  return {
    location_id: locationId,
    reference_id: hold.id,
    line_items: lineItems,
    discounts: discounts.length ? discounts : undefined,
    metadata: {
      performanceId: hold.performanceId,
      performanceStart: String(performanceStart ?? hold.performanceLabel ?? ""),
      productionTitle: String(productionTitle ?? ""),
      source: "sots-website",
    },
  };
}
