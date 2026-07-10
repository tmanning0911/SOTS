import { getStore } from "@netlify/blobs";
import { sendEmail, getSiteUrl, resendConfigured } from "./resend.mjs";

const STORE_NAME = "sots-ticketing";
const BOX_OFFICE_PHONE = "(203) 957-1006";
const BOX_OFFICE_EMAIL = "contactus@shakespeareonthesound.org";

function store() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

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

function formatPerformanceDate(isoLocal) {
  if (!isoLocal) return "";
  const date = new Date(isoLocal);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  }).format(date);
}

function ticketQrUrl(siteUrl, ticketCode, orderId) {
  const data = `SOTS:${orderId}:${ticketCode}`;
  return `${siteUrl}/api/tickets/qr?data=${encodeURIComponent(data)}`;
}

function ticketRowsHtml(order, siteUrl) {
  return order.tickets
    .map(
      (ticket) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e5e9ed;color:#2b2b2b;font-family:Georgia,'Times New Roman',serif;">
            ${escapeHtml(ticket.ticketTypeName)}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e9ed;text-align:right;color:#1a5090;font-family:monospace;font-weight:bold;">
            ${escapeHtml(ticket.code)}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:0 0 14px;text-align:center;">
            <img src="${escapeHtml(ticketQrUrl(siteUrl, ticket.code, order.id))}" width="140" height="140" alt="QR code for ticket ${escapeHtml(ticket.code)}" style="display:inline-block;border:1px solid #d4d9de;border-radius:8px;" />
          </td>
        </tr>`,
    )
    .join("");
}

function lineItemsText(order) {
  return order.lineItems
    .map((line) => `${line.quantity}× ${line.name} — ${line.unitPriceDisplay ?? formatCents(line.unitPrice)}`)
    .join("\n");
}

function ticketsText(order) {
  return order.tickets.map((t) => `${t.ticketTypeName}: ${t.code}`).join("\n");
}

export function buildOrderConfirmationContent(order, siteUrl = getSiteUrl()) {
  const performanceWhen = formatPerformanceDate(order.performanceStart);
  const accessUrl = `${siteUrl}/access-your-tickets/?email=${encodeURIComponent(order.buyer.email)}&code=${encodeURIComponent(order.confirmationCode)}`;
  const myTicketsUrl = `${siteUrl}/my-tickets/`;
  const productionTitle = order.productionTitle || "Shakespeare on the Sound";
  const venueLine = [order.venue, order.location].filter(Boolean).join(" · ");

  const subject = `Your tickets — ${order.confirmationCode}`;

  const text = [
    `Hi ${order.buyer.name},`,
    "",
    `Thank you for your order for ${productionTitle}.`,
    "",
    `Confirmation code: ${order.confirmationCode}`,
    `Order: ${order.id}`,
    performanceWhen ? `Performance: ${performanceWhen}` : "",
    venueLine ? `Venue: ${venueLine}` : "",
    "",
    "Tickets:",
    ticketsText(order),
    "",
    `Total paid: ${formatCents(order.totalCents)}`,
    "",
    `View your tickets anytime: ${accessUrl}`,
    `My Tickets account: ${myTicketsUrl}`,
    "",
    `Questions? Call ${BOX_OFFICE_PHONE} or email ${BOX_OFFICE_EMAIL}.`,
    "",
    "See you under the stars!",
    "Shakespeare on the Sound",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#eef1f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f4;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #d4d9de;">
          <tr>
            <td style="background:#0f2d4d;padding:20px 28px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#ffffff;">Shakespeare on the Sound</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;font-family:Arial,Helvetica,sans-serif;color:#2b2b2b;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">Hi ${escapeHtml(order.buyer.name)},</p>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.5;">
                Thank you for your purchase. Your tickets for <strong>${escapeHtml(productionTitle)}</strong> are confirmed.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f9fb;border:1px solid #d4d9de;margin-bottom:24px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#525252;">Confirmation</p>
                    <p style="margin:0 0 12px;font-size:28px;font-family:monospace;color:#1a5090;letter-spacing:0.06em;">${escapeHtml(order.confirmationCode)}</p>
                    <p style="margin:0 0 4px;font-size:14px;color:#525252;">Order ${escapeHtml(order.id)}</p>
                    ${performanceWhen ? `<p style="margin:8px 0 0;font-size:16px;color:#1a1a1a;"><strong>${escapeHtml(performanceWhen)}</strong></p>` : ""}
                    ${venueLine ? `<p style="margin:4px 0 0;font-size:14px;color:#525252;">${escapeHtml(venueLine)}</p>` : ""}
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:#1a1a1a;">Your tickets</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                ${ticketRowsHtml(order, siteUrl)}
              </table>

              ${order.donationCents ? `<p style="margin:0 0 12px;font-size:14px;color:#1a5090;">Includes a ${escapeHtml(formatCents(order.donationCents))} donation — thank you!</p>` : ""}
              ${order.discountCents ? `<p style="margin:0 0 12px;font-size:14px;color:#1f6b3a;">Promo ${escapeHtml(order.promoCode ?? "")} saved you ${escapeHtml(formatCents(order.discountCents))}.</p>` : ""}

              <p style="margin:0 0 24px;font-size:16px;"><strong>Total paid:</strong> ${escapeHtml(formatCents(order.totalCents))}</p>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#0f2d4d;border-radius:2px;">
                    <a href="${escapeHtml(accessUrl)}" style="display:inline-block;padding:14px 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;">View your tickets</a>
                  </td>
                  <td style="width:12px;"></td>
                  <td style="background:#1a5090;border-radius:2px;">
                    <a href="${escapeHtml(myTicketsUrl)}" style="display:inline-block;padding:14px 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;">My Tickets</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;line-height:1.6;color:#525252;">
                Bring this confirmation code to the box office, or show this email on your phone.
                Questions? Call <a href="tel:+12039571006" style="color:#1a5090;">${BOX_OFFICE_PHONE}</a>
                or email <a href="mailto:${BOX_OFFICE_EMAIL}" style="color:#1a5090;">${BOX_OFFICE_EMAIL}</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#eef1f4;padding:16px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#525252;text-align:center;">
              Shakespeare on the Sound · Pinkney Park, Norwalk, CT
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const staffSubject = `[New order] ${order.confirmationCode} — ${formatCents(order.totalCents)}`;
  const staffText = [
    `New ticket order ${order.id}`,
    `Confirmation: ${order.confirmationCode}`,
    `Buyer: ${order.buyer.name} <${order.buyer.email}>`,
    performanceWhen ? `Performance: ${performanceWhen}` : "",
    venueLine ? `Venue: ${venueLine}` : "",
    "",
    lineItemsText(order),
    "",
    ticketsText(order),
    "",
    `Total: ${formatCents(order.totalCents)}`,
    `Square payment: ${order.squarePaymentId ?? "n/a"}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, text, html, staffSubject, staffText };
}

export async function markOrderEmailSent(orderId) {
  try {
    const order = await store().get(`order:${orderId}`, { type: "json" });
    if (!order) return;
    order.emailSentAt = new Date().toISOString();
    await store().setJSON(`order:${orderId}`, order);
  } catch {
    /* optional */
  }
}

export async function sendOrderConfirmationEmail(order) {
  if (!resendConfigured()) {
    return { sent: false, reason: "not_configured" };
  }

  const siteUrl = getSiteUrl();
  const { subject, text, html, staffSubject, staffText } = buildOrderConfirmationContent(order, siteUrl);
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
        subject: staffSubject,
        html: `<pre style="font-family:monospace;font-size:13px;white-space:pre-wrap;">${escapeHtml(staffText)}</pre>`,
        text: staffText,
        replyTo: order.buyer.email,
      });
    } catch (err) {
      console.error("staff notification email failed:", err);
    }
  }

  if (buyerResult.sent) {
    await markOrderEmailSent(order.id);
  }

  return buyerResult;
}
