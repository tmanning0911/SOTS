import { sendEmail, getSiteUrl, resendConfigured } from "./resend.mjs";

const BOX_OFFICE_PHONE = "(203) 957-1006";
const BOX_OFFICE_EMAIL = "contactus@shakespeareonthesound.org";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatCents(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    (cents ?? 0) / 100,
  );
}

function fulfillmentLabel(fulfillment) {
  return fulfillment === "ship" ? "Ship to address" : "Pick up at Pinkney Park box office";
}

export function buildShopOrderEmail(order, siteUrl = getSiteUrl()) {
  const subject = `Your order — ${order.confirmationCode}`;
  const lines = order.lineItems
    .map((line) => `${line.quantity}× ${line.name}${line.option ? ` (${line.option})` : ""}`)
    .join("\n");

  const text = [
    `Hi ${order.buyer.name},`,
    "",
    "Thank you for your Shakespeare on the Sound gift shop order.",
    "",
    `Confirmation: ${order.confirmationCode}`,
    `Order: ${order.id}`,
    `Fulfillment: ${fulfillmentLabel(order.fulfillment)}`,
    "",
    lines,
    "",
    `Total paid: ${formatCents(order.totalCents)}`,
    "",
    `Questions? Call ${BOX_OFFICE_PHONE} or email ${BOX_OFFICE_EMAIL}.`,
    "",
    "Shakespeare on the Sound",
  ].join("\n");

  const itemsHtml = order.lineItems
    .map(
      (line) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #e5e9ed;">${escapeHtml(line.name)}${line.option ? ` <span style="color:#525252;">(${escapeHtml(line.option)})</span>` : ""}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e5e9ed;text-align:center;">${line.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e5e9ed;text-align:right;">${escapeHtml(line.unitPriceDisplay ?? formatCents(line.unitPrice))}</td>
      </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:24px;background:#eef1f4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #d4d9de;">
    <tr><td style="background:#0f2d4d;padding:20px 28px;color:#fff;font-family:Georgia,serif;font-size:20px;">Shakespeare on the Sound Gift Shop</td></tr>
    <tr><td style="padding:28px;color:#2b2b2b;">
      <p>Hi ${escapeHtml(order.buyer.name)},</p>
      <p>Thank you for your order. Here is your confirmation.</p>
      <p style="font-size:24px;font-family:monospace;color:#1a5090;"><strong>${escapeHtml(order.confirmationCode)}</strong></p>
      <p>Order ${escapeHtml(order.id)} · ${escapeHtml(fulfillmentLabel(order.fulfillment))}</p>
      <table width="100%" style="margin:16px 0;">${itemsHtml}</table>
      <p><strong>Total paid:</strong> ${escapeHtml(formatCents(order.totalCents))}</p>
      <p style="color:#525252;font-size:14px;">Gift certificates are emailed separately within one business day. Merchandise pickup is available at the box office during performances.</p>
    </td></tr>
  </table>
</body></html>`;

  return { subject, text, html };
}

export async function sendShopOrderConfirmationEmail(order) {
  if (!resendConfigured()) return { sent: false, reason: "not_configured" };

  const { subject, text, html } = buildShopOrderEmail(order);
  const notifyEmail = process.env.TICKETING_NOTIFY_EMAIL?.trim();

  const buyerResult = await sendEmail({
    to: order.buyer.email,
    subject,
    html,
    text,
    replyTo: BOX_OFFICE_EMAIL,
  });

  if (notifyEmail && notifyEmail !== order.buyer.email) {
    try {
      await sendEmail({
        to: notifyEmail,
        subject: `[Gift shop] ${order.confirmationCode} — ${formatCents(order.totalCents)}`,
        text: `New shop order ${order.id}\n${text}`,
        html: `<pre>${escapeHtml(text)}</pre>`,
        replyTo: order.buyer.email,
      });
    } catch (err) {
      console.error("shop staff email failed:", err);
    }
  }

  return buyerResult;
}
