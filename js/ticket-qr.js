/** Payload encoded into every ticket QR (must match gate scanners / email QRs). */
export function ticketQrPayload(orderId, ticketCode) {
  return `SOTS:${orderId}:${ticketCode}`;
}

/** @deprecated Prefer client-side QR via TicketQr; kept for API-based fallbacks. */
export function ticketQrSrc(orderId, ticketCode) {
  const data = ticketQrPayload(orderId, ticketCode);
  return `/api/tickets/qr?data=${encodeURIComponent(data)}`;
}
