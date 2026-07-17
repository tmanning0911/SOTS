import { randomBytes } from "node:crypto";
import { getSiteUrl } from "./resend.mjs";
import { formatCents } from "./email-layout.mjs";
import { sendOrderConfirmationEmail } from "./order-email.mjs";
import { sendShopOrderConfirmationEmail } from "./shop-order-email.mjs";
import { sendPurchaseConfirmationEmail } from "./purchase-email.mjs";
import {
  getPaymentLinkFulfillment,
  getPaymentLinkPending,
  getPaymentLinkPendingBySquareOrder,
  markPaymentLinkFulfilled,
} from "./payment-link-pending.mjs";
import { getSquareOrder, getSquarePayment } from "./square.mjs";
import {
  commitOrder,
  getPerformance,
  newHoldId,
  newOrderId,
  readCatalog,
} from "./ticketing-store.mjs";
import { commitShopOrder } from "./shop-store.mjs";

function randomCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(len);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

function buyerFromPayment(payment, pending) {
  const email = String(
    payment.buyer_email_address ||
      payment.receipt_email ||
      pending?.buyer?.email ||
      "",
  )
    .trim()
    .toLowerCase();
  const fromPending =
    pending?.buyer?.contactName || pending?.buyer?.name || pending?.buyer?.businessName || "";
  const fromSquare = [payment.billing_address?.first_name, payment.billing_address?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const name = String(fromPending || fromSquare || "Patron").trim().slice(0, 100);
  return {
    email,
    name,
    phone: String(pending?.buyer?.phone || "").trim(),
    businessName: String(pending?.buyer?.businessName || "").trim(),
    note: String(pending?.buyer?.note || "").trim(),
    marketingOptIn: Boolean(pending?.buyer?.marketingOptIn),
  };
}

function detectKind(pending, payment, squareOrder) {
  if (pending?.kind) return pending.kind;
  const note = String(payment.note || squareOrder?.metadata?.sots_kind || "");
  const match = /\bSOTS\s+([a-z-]+)\b/i.exec(note);
  if (match) return match[1].toLowerCase();
  const lineNotes = (squareOrder?.line_items ?? []).map((l) => String(l.note || ""));
  if (lineNotes.some((n) => /^\w[\w-]+:\w[\w-]+$/.test(n) && !n.startsWith("donate:"))) {
    // ticket notes look like performanceId:ticketTypeId
    if (lineNotes.some((n) => !n.includes("SOTS-") && n.includes(":"))) return "ticket";
  }
  if (lineNotes.some((n) => n.startsWith("donate:"))) return "donate";
  return "purchase";
}

function formatUnitPrice(cents) {
  return formatCents(cents);
}

function isShopLineNote(note) {
  const n = String(note || "");
  return /^(SOTS-|GIFT-)/i.test(n);
}

async function fulfillTicket({ pending, payment, squareOrder, buyer }) {
  const catalog = await readCatalog();
  const typeById = Object.fromEntries(
    (catalog.ticketTypes ?? catalog.ticketClasses ?? []).map((t) => [String(t.id), t]),
  );

  let performanceId = pending?.ticket?.performanceId;
  let lineItems = pending?.ticket?.lineItems;

  if (!lineItems?.length) {
    lineItems = [];
    for (const row of squareOrder?.line_items ?? []) {
      const note = String(row.note || "");
      if (isShopLineNote(note)) continue;
      const [perfId, typeId] = note.split(":");
      if (!perfId || !typeId) continue;
      performanceId = performanceId || perfId;
      if (perfId !== performanceId) continue; // one performance per order email
      const ticketType = typeById[String(typeId)];
      const qty = Number(row.quantity) || 1;
      const unit = Number(row.base_price_money?.amount ?? ticketType?.price?.value ?? 0);
      lineItems.push({
        ticketTypeId: typeId,
        name: ticketType?.name || row.name || "Ticket",
        quantity: qty,
        unitPrice: unit,
        unitPriceDisplay: formatUnitPrice(unit),
      });
    }
  }

  if (!performanceId || !lineItems?.length) {
    throw new Error("Could not resolve ticket line items from payment link");
  }

  let shopLineItems =
    pending?.shop?.lineItems?.map((line) => ({
      ...line,
      unitPriceDisplay: line.unitPriceDisplay || formatUnitPrice(line.unitPrice),
    })) || [];

  if (!shopLineItems.length && squareOrder?.line_items?.length) {
    const { SHOP_PRODUCTS } = await import("../../../js/shop-catalog.js");
    const bySku = Object.fromEntries(SHOP_PRODUCTS.map((p) => [p.sku, p]));
    shopLineItems = squareOrder.line_items
      .filter((row) => isShopLineNote(row.note))
      .map((row) => {
        const note = String(row.note || "");
        const [sku, option] = note.split(":");
        const product = bySku[sku];
        const unit = Number(row.base_price_money?.amount ?? product?.price?.value ?? 0);
        return {
          id: product?.id,
          sku: product?.sku || sku,
          name: product?.name || row.name || "Item",
          option: option || undefined,
          category: product?.category,
          quantity: Number(row.quantity) || 1,
          unitPrice: unit,
          unitPriceDisplay: formatUnitPrice(unit),
        };
      });
  }

  const shopCents = shopLineItems.reduce(
    (sum, line) => sum + (Number(line.unitPrice) || 0) * (Number(line.quantity) || 1),
    0,
  );
  const ticketSubtotal = lineItems.reduce(
    (sum, line) => sum + (Number(line.unitPrice) || 0) * (Number(line.quantity) || 1),
    0,
  );
  const discountCents = Math.max(0, Number(pending?.discountCents ?? 0));
  const promoCode = pending?.promoCode ? String(pending.promoCode) : null;
  const expectedTotal = Math.max(0, ticketSubtotal - discountCents + shopCents);
  const totalCents = Number(
    payment.amount_money?.amount != null ? payment.amount_money.amount : expectedTotal,
  );
  const performance = getPerformance(catalog, performanceId);
  const hold = {
    id: newHoldId(),
    performanceId,
    performanceLabel: performance?.start || "",
    buyer: {
      email: buyer.email,
      name: buyer.name,
      phone: buyer.phone,
      marketingOptIn: buyer.marketingOptIn,
    },
    lineItems,
    shopLineItems,
    subtotalCents: ticketSubtotal,
    discountCents,
    promoCode,
    promoDescription: pending?.promoDescription ?? null,
    donationCents: 0,
    shopCents,
    totalCents,
    currency: payment.amount_money?.currency || "USD",
    reserved: false,
  };

  const order = await commitOrder({
    hold,
    squarePaymentId: payment.id,
    squareOrderId: squareOrder?.id || payment.order_id || null,
  });
  order.source = "payment-link";

  let emailSent = false;
  try {
    const emailResult = await sendOrderConfirmationEmail(order);
    emailSent = Boolean(emailResult.sent);
  } catch (err) {
    console.error("payment-link ticket email failed:", err);
  }

  return { kind: "ticket", orderId: order.id, confirmationCode: order.confirmationCode, emailSent };
}

async function fulfillShop({ pending, payment, squareOrder, buyer }) {
  let lineItems =
    pending?.shop?.lineItems?.map((line) => ({
      ...line,
      unitPriceDisplay: line.unitPriceDisplay || formatUnitPrice(line.unitPrice),
    })) || [];

  if (!lineItems.length && squareOrder?.line_items?.length) {
    const { SHOP_PRODUCTS } = await import("../../../js/shop-catalog.js");
    const bySku = Object.fromEntries(SHOP_PRODUCTS.map((p) => [p.sku, p]));
    lineItems = squareOrder.line_items.map((row) => {
      const note = String(row.note || "");
      const [sku, option] = note.split(":");
      const product = bySku[sku];
      const unit = Number(row.base_price_money?.amount ?? product?.price?.value ?? 0);
      return {
        id: product?.id,
        sku: product?.sku || sku,
        name: product?.name || row.name || "Item",
        option: option || undefined,
        category: product?.category,
        quantity: Number(row.quantity) || 1,
        unitPrice: unit,
        unitPriceDisplay: formatUnitPrice(unit),
      };
    });
  }

  if (!lineItems.length) {
    throw new Error("Could not resolve shop line items from payment link");
  }

  const hold = {
    id: `shop_${randomBytes(10).toString("hex")}`,
    buyer: {
      email: buyer.email,
      name: buyer.name,
      phone: buyer.phone,
      address: pending?.shop?.address || null,
      marketingOptIn: buyer.marketingOptIn,
    },
    lineItems,
    totalCents: Number(payment.amount_money?.amount ?? 0),
    currency: payment.amount_money?.currency || "USD",
    fulfillment: pending?.shop?.fulfillment || "pickup",
    note: buyer.note || "",
  };

  const order = await commitShopOrder({ hold, squarePaymentId: payment.id });
  order.source = "payment-link";

  let emailSent = false;
  try {
    const emailResult = await sendShopOrderConfirmationEmail(order);
    emailSent = Boolean(emailResult.sent);
  } catch (err) {
    console.error("payment-link shop email failed:", err);
  }

  return { kind: "shop", orderId: order.id, confirmationCode: order.confirmationCode, emailSent };
}

function kindTitle(kind, pending) {
  if (pending?.title) return pending.title;
  if (kind === "mahjong") return "Mahjong Midsummer Classic";
  if (kind === "gala") return "Much Ado About Something";
  if (kind === "event-sponsor") return pending?.eventTitle || "Event sponsorship";
  if (kind === "sponsorship") return "Program ads & sponsorship";
  if (kind === "donate") return "Gift to Shakespeare on the Sound";
  return "Shakespeare on the Sound";
}

function returnForKind(kind) {
  const siteUrl = getSiteUrl();
  if (kind === "shop") return { returnUrl: `${siteUrl}/shop/`, ctaLabel: "Visit the gift shop" };
  if (kind === "mahjong") {
    return { returnUrl: `${siteUrl}/events/mahjong-night/`, ctaLabel: "Event details" };
  }
  if (kind === "gala") {
    return { returnUrl: `${siteUrl}/events/much-ado-about-something/`, ctaLabel: "Gala details" };
  }
  if (kind === "donate") return { returnUrl: `${siteUrl}/support/donate/`, ctaLabel: "Ways to give" };
  if (kind === "sponsorship" || kind === "event-sponsor") {
    return { returnUrl: `${siteUrl}/support/`, ctaLabel: "Support SOTS" };
  }
  return { returnUrl: `${siteUrl}/`, ctaLabel: "Visit our site" };
}

async function fulfillGeneric({ kind, pending, payment, squareOrder, buyer }) {
  let lineItems = pending?.lineItems;
  if (!lineItems?.length) {
    lineItems = (squareOrder?.line_items ?? []).map((row) => {
      const unit = Number(row.base_price_money?.amount ?? 0);
      return {
        name: row.name || "Item",
        quantity: Number(row.quantity) || 1,
        unitPrice: unit,
        unitPriceDisplay: formatUnitPrice(unit),
      };
    });
  }

  const { returnUrl, ctaLabel } = returnForKind(kind);
  const order = {
    id: newOrderId(),
    kind,
    title: kindTitle(kind, pending),
    confirmationCode: randomCode(6),
    buyer: {
      email: buyer.email,
      name: buyer.name,
      phone: buyer.phone,
      businessName: buyer.businessName,
    },
    lineItems,
    totalCents: Number(payment.amount_money?.amount ?? 0),
    currency: payment.amount_money?.currency || "USD",
    note: buyer.note || "",
    squarePaymentId: payment.id,
    squareOrderId: squareOrder?.id || payment.order_id || null,
    source: "payment-link",
    returnUrl,
    ctaLabel,
    createdAt: new Date().toISOString(),
  };

  // Persist lightly under ticketing blobs via purchase:* for audit (best-effort).
  try {
    const { blobStore } = await import("./netlify-blobs.mjs");
    await blobStore("sots-payment-links").setJSON(`purchase:${order.id}`, order);
  } catch {
    /* optional */
  }

  let emailSent = false;
  try {
    const emailResult = await sendPurchaseConfirmationEmail(order);
    emailSent = Boolean(emailResult.sent);
  } catch (err) {
    console.error("payment-link purchase email failed:", err);
  }

  return { kind, orderId: order.id, confirmationCode: order.confirmationCode, emailSent };
}

/**
 * Issue tickets for a $0 promo/comp checkout without a Square payment.
 * Used by create-payment-link when a tester/comp code zeros the ticket total.
 */
export async function fulfillCompTicketFromPending({ pending, buyer, event }) {
  if (!pending?.id || pending.kind !== "ticket") {
    throw new Error("Invalid complimentary ticket checkout");
  }
  const email = String(buyer?.email || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("A valid email is required for free tickets");
  }
  const name = String(buyer?.name || buyer?.contactName || "Tester").trim().slice(0, 100);
  const payment = {
    id: `comp:${pending.promoCode || "FREE"}:${pending.id}`,
    amount_money: { amount: 0, currency: "USD" },
    order_id: null,
  };
  const result = await fulfillTicket({
    pending,
    payment,
    squareOrder: null,
    buyer: {
      email,
      name,
      phone: String(buyer?.phone || "").trim(),
      marketingOptIn: Boolean(buyer?.marketingOptIn),
      businessName: String(buyer?.businessName || "").trim(),
      note: String(buyer?.note || "").trim(),
    },
  });
  await markPaymentLinkFulfilled(
    { pendingId: pending.id, squarePaymentId: payment.id, result },
    event,
  );
  return result;
}

/**
 * After a Square Payment Link payment completes, create the SOTS order and send
 * the branded Resend receipt (tickets / shop / events / donate).
 */
export async function fulfillPaymentLinkPayment(paymentInput, event) {
  const paymentId = paymentInput?.id;
  if (!paymentId) return { skipped: true, reason: "no_payment" };

  const already = await getPaymentLinkFulfillment(paymentId, event);
  if (already) {
    return { skipped: true, reason: "already_fulfilled", ...already.result };
  }

  const payment =
    paymentInput.status && paymentInput.amount_money
      ? paymentInput
      : await getSquarePayment(paymentId);

  if (payment.status !== "COMPLETED" && payment.status !== "APPROVED") {
    return { skipped: true, reason: "not_completed", status: payment.status };
  }

  let squareOrder = null;
  if (payment.order_id) {
    try {
      squareOrder = await getSquareOrder(payment.order_id);
    } catch (err) {
      console.warn("payment-link fulfill: could not load Square order", err);
    }
  }

  const refId = String(squareOrder?.reference_id || payment.reference_id || "");
  let pending = null;
  if (refId.startsWith("plink_")) {
    pending = await getPaymentLinkPending(refId, event);
  }
  if (!pending && payment.order_id) {
    pending = await getPaymentLinkPendingBySquareOrder(payment.order_id, event);
  }

  const kind = detectKind(pending, payment, squareOrder);
  const buyer = buyerFromPayment(payment, pending);
  const note = String(payment.note || "");
  const looksLikeSots =
    Boolean(pending) ||
    refId.startsWith("plink_") ||
    /\bSOTS\b/i.test(note) ||
    (squareOrder?.line_items ?? []).some((l) => String(l.note || "").includes(":"));

  if (!looksLikeSots) {
    return { skipped: true, reason: "not_sots_payment_link", paymentId };
  }

  if (!buyer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email)) {
    console.error("payment-link fulfill: missing buyer email", paymentId);
    return { skipped: true, reason: "missing_email", paymentId };
  }

  let result;
  if (kind === "ticket") {
    result = await fulfillTicket({ pending, payment, squareOrder, buyer });
  } else if (kind === "shop") {
    result = await fulfillShop({ pending, payment, squareOrder, buyer });
  } else {
    result = await fulfillGeneric({ kind, pending, payment, squareOrder, buyer });
  }

  await markPaymentLinkFulfilled(
    { pendingId: pending?.id || (refId.startsWith("plink_") ? refId : null), squarePaymentId: paymentId, result },
    event,
  );

  return result;
}
