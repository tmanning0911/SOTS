export const TICKET_SKU_PREFIX = "SOTS-TIX-";

export function slugTicketType(name) {
  return String(name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ticketTypeSku(slugOrName) {
  const slug =
    typeof slugOrName === "string" && !slugOrName.includes(" ")
      ? slugOrName
      : slugTicketType(slugOrName);
  const normalized = String(slug).toUpperCase().replace(/[^A-Z0-9-]/g, "");
  return `${TICKET_SKU_PREFIX}${normalized}`;
}

export function isTicketCatalogSku(sku) {
  return typeof sku === "string" && (sku.startsWith(TICKET_SKU_PREFIX) || sku.startsWith("TEST-TIX-"));
}
