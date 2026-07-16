/**
 * Send TEST branded receipts as if a Square Payment Link just completed.
 *
 * Usage:
 *   RESEND_API_KEY=re_xxx node scripts/send-test-payment-link-receipt.mjs
 *   RESEND_API_KEY=re_xxx node scripts/send-test-payment-link-receipt.mjs you@email.com
 */
import { writeFileSync } from "node:fs";
import { buildOrderConfirmationContent } from "../netlify/functions/lib/order-email.mjs";
import { buildPurchaseConfirmationContent } from "../netlify/functions/lib/purchase-email.mjs";
import { sendEmail, getSiteUrl, resendConfigured } from "../netlify/functions/lib/resend.mjs";

const to = process.argv[2]?.trim() || "tmanning@mfcgc.org";
const siteUrl = getSiteUrl();

const ticketOrder = {
  id: "SOTS-PLTEST1",
  confirmationCode: "PLINK7",
  productionTitle: "Much Ado About Nothing",
  performanceStart: "2026-06-20T19:30:00",
  venue: "Pinkney Park",
  location: "Rowayton, CT",
  totalCents: 7500,
  donationCents: 0,
  source: "payment-link",
  buyer: { name: "Taylor Manning", email: to },
  lineItems: [
    { quantity: 2, name: "General Admission", unitPrice: 2500, unitPriceDisplay: "$25.00" },
    { quantity: 1, name: "VIP Reserved", unitPrice: 2500, unitPriceDisplay: "$25.00" },
  ],
  tickets: [
    { ticketTypeName: "General Admission", code: "TKT-PLINK-0001" },
    { ticketTypeName: "General Admission", code: "TKT-PLINK-0002" },
    { ticketTypeName: "VIP Reserved", code: "TKT-PLINK-0003" },
  ],
  shopLineItems: [],
};

const eventOrder = {
  id: "SOTS-PLGALA1",
  kind: "gala",
  title: "Much Ado About Something",
  confirmationCode: "GALA42",
  totalCents: 35000,
  buyer: { name: "Taylor Manning", email: to },
  lineItems: [
    {
      quantity: 2,
      name: "Much Ado About Something — Patron Ticket",
      unitPrice: 17500,
      unitPriceDisplay: "$175.00",
    },
  ],
  returnUrl: `${siteUrl}/events/much-ado-about-something/`,
  ctaLabel: "Gala details",
  source: "payment-link",
};

if (!resendConfigured()) {
  console.error("RESEND_API_KEY is not set.");
  process.exit(2);
}

const ticket = await buildOrderConfirmationContent(ticketOrder, siteUrl);
let ticketPreview = ticket.html;
for (const file of ticket.attachments ?? []) {
  if (!file.contentId) continue;
  ticketPreview = ticketPreview.replaceAll(
    `cid:${file.contentId}`,
    `data:${file.contentType || "image/png"};base64,${file.content}`,
  );
}
writeFileSync("emails/previews/payment-link-ticket-test.html", ticketPreview, "utf8");

const purchase = buildPurchaseConfirmationContent(eventOrder, siteUrl);
writeFileSync("emails/previews/payment-link-purchase-test.html", purchase.html, "utf8");

const ticketResult = await sendEmail({
  to,
  subject: `[TEST · Payment Link] ${ticket.subject}`,
  html: ticket.html,
  text: `[TEST — Payment Link ticket fulfillment]\n\n${ticket.text}`,
  replyTo: "aaron@shakespeareonthesound.org",
  attachments: ticket.attachments,
});

const purchaseResult = await sendEmail({
  to,
  subject: `[TEST · Payment Link] ${purchase.subject}`,
  html: purchase.html,
  text: `[TEST — Payment Link event/purchase fulfillment]\n\n${purchase.text}`,
  replyTo: "aaron@shakespeareonthesound.org",
});

console.log(
  JSON.stringify(
    {
      to,
      ticket: { subject: `[TEST · Payment Link] ${ticket.subject}`, result: ticketResult },
      purchase: { subject: `[TEST · Payment Link] ${purchase.subject}`, result: purchaseResult },
    },
    null,
    2,
  ),
);

if (!ticketResult?.sent || !purchaseResult?.sent) process.exit(1);
