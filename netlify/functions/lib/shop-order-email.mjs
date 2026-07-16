import { sendEmail, getSiteUrl, resendConfigured } from "./resend.mjs";
import {
  BOX_OFFICE_EMAIL,
  BOX_OFFICE_PHONE,
  EMAIL_COLORS,
  emailButtonsRow,
  emailCard,
  emailHeading,
  emailLabel,
  escapeHtml,
  formatCents,
  renderSotsEmail,
} from "./email-layout.mjs";

const C = EMAIL_COLORS;

function fulfillmentLabel(fulfillment) {
  return fulfillment === "ship" ? "Ship to address" : "Pick up at Pinkney Park box office";
}

function addressBlock(order) {
  if (order.fulfillment !== "ship" || !order.shippingAddress) return "";
  const a = order.shippingAddress;
  const lines = [a.line1, a.line2, [a.city, a.region, a.postalCode].filter(Boolean).join(", "), a.country]
    .filter(Boolean)
    .map((line) => escapeHtml(line));
  if (!lines.length) return "";
  return `<p style="margin:10px 0 0;font-size:14px;color:${C.muted};line-height:1.5;">${lines.join("<br />")}</p>`;
}

export function buildShopOrderEmail(order, siteUrl = getSiteUrl()) {
  const subject = `Gift shop order · ${order.confirmationCode}`;
  const firstName = String(order.buyer.name || "").trim().split(/\s+/)[0] || order.buyer.name;
  const preheader = `Gift shop confirmation ${order.confirmationCode} · ${formatCents(order.totalCents)}`;

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
        <td style="padding:10px 0;border-bottom:1px solid ${C.line};font-size:14px;color:${C.ink};">
          ${escapeHtml(line.name)}${line.option ? `<br /><span style="color:${C.muted};font-size:13px;">${escapeHtml(line.option)}</span>` : ""}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid ${C.line};text-align:center;font-size:14px;color:${C.muted};vertical-align:top;">${line.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid ${C.line};text-align:right;font-size:14px;color:${C.ink};vertical-align:top;">${escapeHtml(line.unitPriceDisplay ?? formatCents(line.unitPrice))}</td>
      </tr>`,
    )
    .join("");

  const bodyHtml = `
    ${emailHeading("Thank you for your order")}
    <p style="margin:0 0 18px;">Hi ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 22px;">
      Your Shakespeare on the Sound gift shop order is confirmed. A summary is below.
    </p>

    ${emailCard(`
      ${emailLabel("Confirmation")}
      <p style="margin:0 0 12px;font-size:28px;font-family:Consolas,Monaco,monospace;letter-spacing:0.08em;color:${C.navy};font-weight:bold;">${escapeHtml(order.confirmationCode)}</p>
      <p style="margin:0 0 4px;font-size:13px;color:${C.muted};">Order ${escapeHtml(order.id)}</p>
      <p style="margin:10px 0 0;font-size:15px;color:${C.ink};"><strong>${escapeHtml(fulfillmentLabel(order.fulfillment))}</strong></p>
      ${addressBlock(order)}
    `)}

    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${C.navy};font-weight:bold;">Items</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;">
      <tr>
        <td style="padding:0 0 6px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${C.muted};border-bottom:1px solid ${C.line};">Item</td>
        <td style="padding:0 0 6px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${C.muted};border-bottom:1px solid ${C.line};text-align:center;">Qty</td>
        <td style="padding:0 0 6px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${C.muted};border-bottom:1px solid ${C.line};text-align:right;">Price</td>
      </tr>
      ${itemsHtml}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;border-top:1px solid ${C.line};">
      <tr>
        <td style="padding:14px 0 0;font-size:15px;color:${C.ink};"><strong>Total paid</strong></td>
        <td style="padding:14px 0 0;text-align:right;font-size:18px;color:${C.navy};font-weight:bold;">${escapeHtml(formatCents(order.totalCents))}</td>
      </tr>
    </table>

    ${emailButtonsRow([{ href: `${siteUrl}/shop/`, label: "Visit the gift shop", variant: "primary" }])}

    <p style="margin:0 0 8px;font-size:14px;color:${C.muted};">
      Gift certificates are emailed separately within one business day. Merchandise pickup is available at the box office during performances.
    </p>
  `;

  const html = renderSotsEmail({
    title: subject,
    preheader,
    siteUrl,
    eyebrow: "Gift shop confirmation",
    bodyHtml,
  });

  return { subject, text, html };
}

export async function sendShopOrderConfirmationEmail(order) {
  if (!resendConfigured()) return { sent: false, reason: "not_configured" };

  const siteUrl = getSiteUrl();
  const { subject, text, html } = buildShopOrderEmail(order, siteUrl);
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
        html: renderSotsEmail({
          title: `[Gift shop] ${order.confirmationCode}`,
          preheader: `New shop order ${order.confirmationCode}`,
          siteUrl,
          eyebrow: "Box office notification",
          bodyHtml: `<pre style="margin:0;font-family:Consolas,Monaco,monospace;font-size:13px;line-height:1.5;white-space:pre-wrap;color:${C.ink};">${escapeHtml(text)}</pre>`,
        }),
        replyTo: order.buyer.email,
      });
    } catch (err) {
      console.error("shop staff email failed:", err);
    }
  }

  return buyerResult;
}
