import { ticketQrSrc } from "../../../js/ticket-qr.js";

export function TicketQr({ orderId, ticketCode, label, size = 140, className = "" }) {
  const src = ticketQrSrc(orderId, ticketCode);
  const dim = Number(size) || 140;
  return (
    <img
      className={`sots-ticket-qr ${className}`.trim()}
      src={src}
      width={dim}
      height={dim}
      alt={label || `QR code for ticket ${ticketCode}`}
      loading="lazy"
    />
  );
}
