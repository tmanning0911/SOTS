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

const KIND_LABELS = {
  mahjong: "Mahjong Midsummer Classic",
  gala: "Much Ado About Something",
  "event-sponsor": "Event sponsorship",
  sponsorship: "Program ads & sponsorship",
  donate: "Thank-you gift",
  purchase: "Your purchase",
};

function titleFor(order) {
  return order.title || KIND_LABELS[order.kind] || KIND_LABELS.purchase;
}

export function buildPurchaseConfirmationContent(order, siteUrl = getSiteUrl()) {
  const title = titleFor(order);
  const subject = `${title} · ${order.confirmationCode}`;
  const firstName = String(order.buyer?.name || "").trim().split(/\s+/)[0] || order.buyer?.name || "there";
  const preheader = `${title} · confirmation ${order.confirmationCode}`;

  const lines = (order.lineItems ?? [])
    .map((line) => `${line.quantity}× ${line.name} — ${line.unitPriceDisplay ?? formatCents(line.unitPrice)}`)
    .join("\n");

  const text = [
    `Hi ${order.buyer?.name || "friend"},`,
    "",
    `Thank you for your purchase with Shakespeare on the Sound.`,
    "",
    `Confirmation: ${order.confirmationCode}`,
    `Order: ${order.id}`,
    "",
    lines,
    "",
    order.note ? `Note: ${order.note}` : "",
    `Total paid: ${formatCents(order.totalCents)}`,
    "",
    `Questions? Call ${BOX_OFFICE_PHONE} or email ${BOX_OFFICE_EMAIL}.`,
    "",
    "Shakespeare on the Sound",
  ]
    .filter(Boolean)
    .join("\n");

  const itemsHtml = (order.lineItems ?? [])
    .map(
      (line) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid ${C.line};font-size:14px;color:${C.ink};">${escapeHtml(line.name)}</td>
        <td style="padding:10px 0;border-bottom:1px solid ${C.line};text-align:center;font-size:14px;color:${C.muted};vertical-align:top;">${escapeHtml(String(line.quantity))}</td>
        <td style="padding:10px 0;border-bottom:1px solid ${C.line};text-align:right;font-size:14px;color:${C.ink};vertical-align:top;">${escapeHtml(line.unitPriceDisplay ?? formatCents(line.unitPrice))}</td>
      </tr>`,
    )
    .join("");

  const ctaHref = order.returnUrl || `${siteUrl}/`;
  const ctaLabel = order.ctaLabel || "Visit our site";

  const bodyHtml = `
    ${emailHeading("Thank you")}
    <p style="margin:0 0 18px;">Hi ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 22px;">
      Your <strong>${escapeHtml(title)}</strong> purchase is confirmed.
    </p>

    ${emailCard(`
      ${emailLabel("Confirmation")}
      <p style="margin:0 0 12px;font-size:28px;font-family:Consolas,Monaco,monospace;letter-spacing:0.08em;color:${C.navy};font-weight:bold;">${escapeHtml(order.confirmationCode)}</p>
      <p style="margin:0;font-size:13px;color:${C.muted};">Order ${escapeHtml(order.id)}</p>
    `)}

    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${C.navy};font-weight:bold;">Items</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;">
      ${itemsHtml}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;border-top:1px solid ${C.line};">
      <tr>
        <td style="padding:14px 0 0;font-size:15px;color:${C.ink};"><strong>Total paid</strong></td>
        <td style="padding:14px 0 0;text-align:right;font-size:18px;color:${C.navy};font-weight:bold;">${escapeHtml(formatCents(order.totalCents))}</td>
      </tr>
    </table>

    ${emailButtonsRow([{ href: ctaHref, label: ctaLabel, variant: "primary" }])}

    <p style="margin:0 0 8px;font-size:14px;color:${C.muted};">
      A receipt from Square may also arrive separately. Keep this confirmation for your records.
    </p>
  `;

  const html = renderSotsEmail({
    title: subject,
    preheader,
    siteUrl,
    eyebrow: "Purchase confirmation",
    bodyHtml,
  });

  return { subject, text, html };
}

export async function sendPurchaseConfirmationEmail(order) {
  if (!resendConfigured()) return { sent: false, reason: "not_configured" };

  const siteUrl = getSiteUrl();
  const { subject, text, html } = buildPurchaseConfirmationContent(order, siteUrl);
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
        subject: `[Purchase] ${order.confirmationCode} — ${formatCents(order.totalCents)}`,
        text: `New purchase ${order.id}\n${text}`,
        html: renderSotsEmail({
          title: `[Purchase] ${order.confirmationCode}`,
          preheader: `New purchase ${order.confirmationCode}`,
          siteUrl,
          eyebrow: "Box office notification",
          bodyHtml: `<pre style="margin:0;font-family:Consolas,Monaco,monospace;font-size:13px;line-height:1.5;white-space:pre-wrap;color:${C.ink};">${escapeHtml(text)}</pre>`,
        }),
        replyTo: order.buyer.email,
      });
    } catch (err) {
      console.error("purchase staff email failed:", err);
    }
  }

  return buyerResult;
}
