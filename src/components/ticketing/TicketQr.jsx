import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ticketQrPayload, ticketQrSrc } from "../../../js/ticket-qr.js";

export function TicketQr({ orderId, ticketCode, label, size = 140, className = "" }) {
  const dim = Number(size) || 140;
  const [src, setSrc] = useState(() => ticketQrSrc(orderId, ticketCode));

  useEffect(() => {
    let cancelled = false;
    const payload = ticketQrPayload(orderId, ticketCode);
    QRCode.toDataURL(payload, {
      width: Math.max(148, dim * 2),
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#0f2d4d", light: "#ffffff" },
    })
      .then((url) => {
        if (!cancelled) setSrc(url);
      })
      .catch(() => {
        if (!cancelled) setSrc(ticketQrSrc(orderId, ticketCode));
      });
    return () => {
      cancelled = true;
    };
  }, [orderId, ticketCode, dim]);

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
