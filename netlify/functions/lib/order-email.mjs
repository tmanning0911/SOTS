import { getStore } from "@netlify/blobs";
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

const STORE_NAME = "sots-ticketing";
const C = EMAIL_COLORS;

function store() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
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

function ticketCardsHtml(order, siteUrl) {
  return order.tickets
    .map(
      (ticket) => `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px;border:1px solid ${C.line};">
        <tr>
          <td style="padding:16px 16px 8px;font-family:Arial,Helvetica,sans-serif;">
            <p style="margin:0 0 4px;font-size:15px;font-weight:bold;color:${C.navy};">${escapeHtml(ticket.ticketTypeName)}</p>
            <p style="margin:0;font-size:13px;font-family:Consolas,Monaco,monospace;letter-spacing:0.04em;color:${C.blue};">#${escapeHtml(ticket.code)}</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:8px 16px 16px;">
            <img src="${escapeHtml(ticketQrUrl(siteUrl, ticket.code, order.id))}" width="148" height="148" alt="QR for ticket ${escapeHtml(ticket.code)}" style="display:block;margin:0 auto;border:1px solid ${C.line};border-radius:4px;" />
          </td>
        </tr>
      </table>`,
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
  const firstName = String(order.buyer.name || "").trim().split(/\s+/)[0] || order.buyer.name;

  const subject = `Your tickets — ${order.confirmationCode}`;
  const preheader = performanceWhen
    ? `${productionTitle} · ${performanceWhen}`
    : `Confirmation ${order.confirmationCode} — see you under the stars`;

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
    `My Tickets: ${myTicketsUrl}`,
    "",
    `Questions? Call ${BOX_OFFICE_PHONE} or email ${BOX_OFFICE_EMAIL}.`,
    "",
    "See you under the stars!",
    "Shakespeare on the Sound",
  ]
    .filter(Boolean)
    .join("\n");

  const bodyHtml = `
    ${emailHeading("You're going to the show")}
    <p style="margin:0 0 18px;">Hi ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 22px;">
      Thank you for your purchase. Your tickets for <strong>${escapeHtml(productionTitle)}</strong> are confirmed.
      Show a QR code at the gate, or bring your confirmation code to the box office.
    </p>

    ${emailCard(`
      ${emailLabel("Confirmation")}
      <p style="margin:0 0 14px;font-size:30px;font-family:Consolas,Monaco,monospace;letter-spacing:0.1em;color:${C.navy};font-weight:bold;">${escapeHtml(order.confirmationCode)}</p>
      <p style="margin:0 0 10px;font-size:13px;color:${C.muted};">Order ${escapeHtml(order.id)}</p>
      ${performanceWhen ? `<p style="margin:0 0 4px;font-size:16px;color:${C.ink};"><strong>${escapeHtml(performanceWhen)}</strong></p>` : ""}
      ${venueLine ? `<p style="margin:0;font-size:14px;color:${C.muted};">${escapeHtml(venueLine)}</p>` : ""}
    `)}

    <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${C.navy};font-weight:bold;">Your tickets</p>
    ${ticketCardsHtml(order, siteUrl)}

    ${order.donationCents ? `<p style="margin:0 0 10px;font-size:14px;color:${C.blue};">Includes a ${escapeHtml(formatCents(order.donationCents))} donation — thank you for supporting free Shakespeare.</p>` : ""}
    ${order.discountCents ? `<p style="margin:0 0 10px;font-size:14px;color:#1f6b3a;">Promo ${escapeHtml(order.promoCode ?? "")} saved you ${escapeHtml(formatCents(order.discountCents))}.</p>` : ""}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 22px;border-top:1px solid ${C.line};">
      <tr>
        <td style="padding:14px 0 0;font-size:15px;color:${C.ink};"><strong>Total paid</strong></td>
        <td style="padding:14px 0 0;text-align:right;font-size:18px;color:${C.navy};font-weight:bold;">${escapeHtml(formatCents(order.totalCents))}</td>
      </tr>
    </table>

    ${emailButtonsRow([
      { href: accessUrl, label: "View your tickets", variant: "primary" },
      { href: myTicketsUrl, label: "My Tickets", variant: "secondary" },
    ])}

    <p style="margin:0 0 8px;font-size:14px;color:${C.muted};">
      Gates open at 4pm; box office at 5pm on show days. See our
      <a href="${escapeHtml(`${siteUrl}/about/visit/`)}" style="color:${C.blue};">visit guide</a>
      for parking and accessibility.
    </p>
  `;

  const html = renderSotsEmail({
    title: subject,
    preheader,
    siteUrl,
    eyebrow: "Ticket confirmation",
    bodyHtml,
  });

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
        html: renderSotsEmail({
          title: staffSubject,
          preheader: `New order ${order.confirmationCode}`,
          siteUrl,
          eyebrow: "Box office notification",
          bodyHtml: `<pre style="margin:0;font-family:Consolas,Monaco,monospace;font-size:13px;line-height:1.5;white-space:pre-wrap;color:${C.ink};">${escapeHtml(staffText)}</pre>`,
        }),
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
