export function ticketQrSrc(orderId, ticketCode) {
  const data = `SOTS:${orderId}:${ticketCode}`;
  return `/api/tickets/qr?data=${encodeURIComponent(data)}`;
}
