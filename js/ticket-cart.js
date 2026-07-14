import {
  formatPerformanceListDate,
  isPurchasablePerformance,
  patronDisplayName,
  sortTicketTypesForDisplay,
} from "./ticketing.js";

export const TICKET_CART_KEY = "sots-ticket-cart";
export const TICKET_CART_MAX_QTY = 10;
export const TICKET_CART_OPEN_KEY = "sots-ticket-cart-open";

export function ticketCartLineKey(line) {
  return `${line.performanceId}:${line.ticketTypeId}`;
}

export function ticketCartItemCount(cart = []) {
  return cart.reduce((sum, line) => sum + (line.quantity || 0), 0);
}

export function ticketCartTotalCents(cart = []) {
  return cart.reduce((sum, line) => sum + (line.price?.value ?? 0) * (line.quantity || 0), 0);
}

export function linesForPerformance(cart = [], performanceId) {
  if (!performanceId) return [];
  return cart.filter((line) => line.performanceId === String(performanceId));
}

export function otherPerformanceCount(cart = [], performanceId) {
  const id = String(performanceId ?? "");
  return cart.filter((line) => line.performanceId !== id).reduce((sum, line) => sum + (line.quantity || 0), 0);
}

export function groupCartByPerformance(cart = []) {
  const groups = new Map();
  for (const line of cart) {
    const key = String(line.performanceId);
    if (!groups.has(key)) {
      groups.set(key, {
        performanceId: key,
        performanceStart: line.performanceStart,
        performanceLabel: line.performanceLabel,
        venue: line.venue,
        lines: [],
      });
    }
    groups.get(key).lines.push(line);
  }
  return [...groups.values()].sort((a, b) =>
    String(a.performanceStart ?? "").localeCompare(String(b.performanceStart ?? "")),
  );
}

export function primaryCheckoutPerformanceId(cart = []) {
  const groups = groupCartByPerformance(cart);
  return groups[0]?.performanceId ?? null;
}

export function quantitiesFromCartLines(lines = []) {
  const quantities = {};
  for (const line of lines) {
    if (!line.ticketTypeId || !line.quantity) continue;
    quantities[line.ticketTypeId] = line.quantity;
  }
  return quantities;
}

export function maxQtyForTicket(performance, ticketType) {
  if (!ticketType) return 0;
  const fromAvailability = performance?.ticketAvailability?.[ticketType.id];
  if (typeof fromAvailability === "number") {
    return Math.min(TICKET_CART_MAX_QTY, Math.max(0, fromAvailability));
  }
  const cap = ticketType.capacity;
  if (typeof cap === "number" && cap > 0) {
    return Math.min(TICKET_CART_MAX_QTY, cap);
  }
  return TICKET_CART_MAX_QTY;
}

export function buildTicketCartLine({ performance, ticketType, quantity }) {
  if (!performance?.id || !ticketType?.id || quantity <= 0) return null;
  const max = maxQtyForTicket(performance, ticketType);
  if (max <= 0) return null;
  return {
    performanceId: String(performance.id),
    performanceStart: performance.start ?? null,
    performanceLabel: formatPerformanceListDate(performance.start) || performance.name || "Performance",
    venue: performance.venue ?? "Pinkney Park",
    ticketTypeId: String(ticketType.id),
    ticketTypeName: patronDisplayName(ticketType.name) || "Ticket",
    price: ticketType.price
      ? {
          display: ticketType.price.display,
          currency: ticketType.price.currency ?? "USD",
          value: ticketType.price.value ?? 0,
        }
      : { display: "$0", currency: "USD", value: 0 },
    quantity: Math.min(max, quantity),
  };
}

export function cartLinesEqual(a = [], b = []) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    const left = a[i];
    const right = b[i];
    if (
      left.performanceId !== right.performanceId ||
      left.ticketTypeId !== right.ticketTypeId ||
      left.quantity !== right.quantity ||
      (left.price?.value ?? 0) !== (right.price?.value ?? 0) ||
      left.ticketTypeName !== right.ticketTypeName ||
      left.performanceLabel !== right.performanceLabel
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Rebuild cart lines from live catalog. Returns { cart, notices }.
 */
export function remapTicketCartLines(cart = [], data) {
  if (!Array.isArray(cart) || !cart.length) {
    return { cart: [], notices: [] };
  }
  if (!data?.performances?.length) {
    return { cart, notices: [] };
  }

  const ticketTypes = sortTicketTypesForDisplay(data.ticketTypes ?? data.ticketClasses ?? []);
  const typeById = new Map(ticketTypes.map((t) => [String(t.id), t]));
  const next = [];
  const notices = [];

  for (const line of cart) {
    const performance = data.performances.find((p) => String(p.id) === String(line.performanceId));
    if (!performance || !isPurchasablePerformance(performance)) {
      notices.push(`${line.performanceLabel || "A performance"} is no longer on sale — removed from cart.`);
      continue;
    }

    const ticketType = typeById.get(String(line.ticketTypeId));
    if (!ticketType || !(ticketType.price?.value > 0)) {
      notices.push(`${line.ticketTypeName || "A ticket type"} is no longer available — removed from cart.`);
      continue;
    }

    const max = maxQtyForTicket(performance, ticketType);
    if (max <= 0) {
      notices.push(
        `${line.performanceLabel || "This date"} · ${ticketType.name} sold out — removed from cart.`,
      );
      continue;
    }

    const qty = Math.min(line.quantity || 0, max);
    if (qty < (line.quantity || 0)) {
      notices.push(
        `${line.performanceLabel || "This date"} · ${ticketType.name} reduced to ${qty} available.`,
      );
    }

    const rebuilt = buildTicketCartLine({ performance, ticketType, quantity: qty });
    if (rebuilt) next.push(rebuilt);
  }

  return { cart: next, notices };
}

export function readStoredTicketCart() {
  try {
    const raw = localStorage.getItem(TICKET_CART_KEY);
    const cart = raw ? JSON.parse(raw) : [];
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

export function writeStoredTicketCart(cart) {
  try {
    localStorage.setItem(TICKET_CART_KEY, JSON.stringify(cart));
  } catch {
    /* private mode */
  }
}

export function flagOpenTicketCart() {
  try {
    sessionStorage.setItem(TICKET_CART_OPEN_KEY, "1");
  } catch {
    /* private mode */
  }
}

export function consumeOpenTicketCartFlag() {
  try {
    const value = sessionStorage.getItem(TICKET_CART_OPEN_KEY);
    if (value) sessionStorage.removeItem(TICKET_CART_OPEN_KEY);
    return Boolean(value);
  } catch {
    return false;
  }
}
