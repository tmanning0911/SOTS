/**
 * Send a TEST custom ticket receipt (tickets + gift-shop lines in ONE email).
 *
 * Usage:
 *   RESEND_API_KEY=re_xxx node scripts/send-test-ticket-receipt.mjs
 *   RESEND_API_KEY=re_xxx node scripts/send-test-ticket-receipt.mjs you@email.com
 *
 * Optional: RESEND_FROM_EMAIL, VITE_SITE_URL
 */
import { writeFileSync } from "node:fs";
import { buildOrderConfirmationContent } from "../netlify/functions/lib/order-email.mjs";
import { sendEmail, getSiteUrl, resendConfigured } from "../netlify/functions/lib/resend.mjs";

const to = process.argv[2]?.trim() || "tmanning@mfcgc.org";
const siteUrl = getSiteUrl();

const order = {
  id: "SOTS-TEST-RECV-1",
  confirmationCode: "TEST42",
  productionTitle: "Much Ado About Nothing",
  performanceStart: "2026-06-20T19:30:00",
  venue: "Pinkney Park",
  location: "Rowayton, CT",
  totalCents: 18500,
  donationCents: 1000,
  buyer: { name: "Taylor Manning", email: to },
  lineItems: [
    { quantity: 2, name: "General Admission", unitPrice: 2500, unitPriceDisplay: "$25.00" },
    { quantity: 1, name: "VIP Reserved", unitPrice: 7500, unitPriceDisplay: "$75.00" },
  ],
  tickets: [
    { ticketTypeName: "General Admission", code: "TKT-TEST-0001" },
    { ticketTypeName: "General Admission", code: "TKT-TEST-0002" },
    { ticketTypeName: "VIP Reserved", code: "TKT-TEST-0003" },
  ],
  // Same receipt as tickets — gift certificate + merch in one email
  shopLineItems: [
    { quantity: 1, name: "Gift Certificate — $50", unitPrice: 5000, unitPriceDisplay: "$50.00" },
    { quantity: 1, name: "Season Tote", option: "Natural", unitPrice: 2500, unitPriceDisplay: "$25.00" },
  ],
};

const { subject, text, html, attachments } = await buildOrderConfirmationContent(order, siteUrl);

// Browser preview can't resolve cid: — inline data URLs there only
let previewHtml = html;
for (const file of attachments ?? []) {
  if (!file.contentId) continue;
  previewHtml = previewHtml.replaceAll(
    `cid:${file.contentId}`,
    `data:${file.contentType || "image/png"};base64,${file.content}`,
  );
}
writeFileSync("emails/previews/ticket-confirmation-test.html", previewHtml, "utf8");
console.log("Wrote emails/previews/ticket-confirmation-test.html");

if (!resendConfigured()) {
  console.error("RESEND_API_KEY is not set. Add it to .env or export it, then re-run:");
  console.error("  RESEND_API_KEY=re_xxx node scripts/send-test-ticket-receipt.mjs");
  process.exit(2);
}

const result = await sendEmail({
  to,
  subject: `[TEST] ${subject}`,
  html,
  text: `[TEST CUSTOM RECEIPT — tickets + gift shop items in ONE email]\n\n${text}`,
  replyTo: "aaron@shakespeareonthesound.org",
  attachments,
});

console.log(JSON.stringify({ ok: Boolean(result?.sent), to, subject: `[TEST] ${subject}`, result }, null, 2));
if (!result?.sent) process.exit(1);
