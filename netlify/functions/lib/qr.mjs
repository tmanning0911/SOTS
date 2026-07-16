import QRCode from "qrcode";

const QR_DARK = "#0f2d4d";
const QR_LIGHT = "#ffffff";

/** Payload encoded into every ticket QR (gate scanners / My Tickets). */
export function ticketQrPayload(orderId, ticketCode) {
  return `SOTS:${orderId}:${ticketCode}`;
}

export async function qrPngBuffer(data, { width = 296, margin = 2 } = {}) {
  return QRCode.toBuffer(String(data), {
    type: "png",
    width,
    margin,
    errorCorrectionLevel: "M",
    color: { dark: QR_DARK, light: QR_LIGHT },
  });
}

export async function qrDataUrl(data, { width = 296, margin = 2 } = {}) {
  return QRCode.toDataURL(String(data), {
    type: "image/png",
    width,
    margin,
    errorCorrectionLevel: "M",
    color: { dark: QR_DARK, light: QR_LIGHT },
  });
}
