import { isPastPerformance, parseEtLocalIso } from "./performance-dates.js";

const SHOW_DURATION_MS = 3.5 * 60 * 60 * 1000;

function pad(n) {
  return String(n).padStart(2, "0");
}

/** Format a Date as UTC ICS timestamp (YYYYMMDDTHHMMSSZ). */
export function toIcsUtc(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    "T",
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
    "Z",
  ].join("");
}

function icsEscape(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function isUpcomingOrder(order, now = new Date()) {
  if (order?.type === "shop") return false;
  if (!order?.performanceStart) return true;
  return !isPastPerformance({ start: order.performanceStart }, now);
}

export function orderStartDate(order) {
  return parseEtLocalIso(order?.performanceStart) || new Date(order?.performanceStart || Date.now());
}

export function buildOrderCalendarIcs(order) {
  const start = orderStartDate(order);
  const end = new Date(start.getTime() + SHOW_DURATION_MS);
  const title = order.productionTitle || "Shakespeare on the Sound";
  const location = [order.venue, order.location].filter(Boolean).join(", ");
  const ticketCount = order.tickets?.length ?? 0;
  const description = [
    `Confirmation ${order.confirmationCode || ""}`.trim(),
    ticketCount ? `${ticketCount} ticket${ticketCount === 1 ? "" : "s"}` : "",
    "Gates open at 4pm; box office at 5pm on show days.",
    "Shakespeare on the Sound — Shakespeare in Pinkney Park, Rowayton, CT",
  ]
    .filter(Boolean)
    .join("\\n");

  const uid = `${order.id || order.confirmationCode || Date.now()}@shakespeareonthesound.org`;
  const stamp = toIcsUtc(new Date());

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Shakespeare on the Sound//My Tickets//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${icsEscape(title)}`,
    location ? `LOCATION:${icsEscape(location)}` : null,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export function downloadOrderCalendar(order) {
  const ics = buildOrderCalendarIcs(order);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const day = String(order.performanceStart || "").slice(0, 10) || "show";
  link.href = url;
  link.download = `sots-${day}-${order.confirmationCode || "tickets"}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
