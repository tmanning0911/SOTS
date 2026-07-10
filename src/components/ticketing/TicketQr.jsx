import { ticketQrSrc } from "../../../js/ticket-qr.js";

export function TicketQr({ orderId, ticketCode, label }) {
  const src = ticketQrSrc(orderId, ticketCode);
  return (
    <img
      className="sots-ticket-qr"
      src={src}
      width={140}
      height={140}
      alt={label || `QR code for ticket ${ticketCode}`}
      loading="lazy"
    />
  );
}
