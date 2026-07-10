import { randomBytes } from "node:crypto";
import { verifyAdmin } from "./lib/auth.mjs";
import { jsonResponse } from "./lib/cors.mjs";
import { getClientIp, rateLimit } from "./lib/rateLimit.mjs";
import { refundSquarePayment } from "./lib/square.mjs";
import {
  getOrderById,
  listOrdersForAdmin,
  markOrderRefunded,
  publicOrderView,
} from "./lib/ticketing-store.mjs";

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function ordersToCsv(orders) {
  const headers = [
    "id",
    "confirmationCode",
    "status",
    "buyerName",
    "email",
    "performanceStart",
    "productionTitle",
    "totalCents",
    "ticketCount",
    "createdAt",
    "squarePaymentId",
  ];
  const rows = orders.map((order) =>
    [
      order.id,
      order.confirmationCode,
      order.status,
      order.buyer?.name,
      order.buyer?.email,
      order.performanceStart,
      order.productionTitle,
      order.totalCents,
      order.tickets?.length ?? 0,
      order.createdAt,
      order.squarePaymentId,
    ]
      .map(csvEscape)
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "GET, POST, OPTIONS" });
  }

  const admin = verifyAdmin(event);
  if (!admin) {
    return jsonResponse(401, { error: "Unauthorized" }, event, { methods: "GET, POST, OPTIONS" });
  }

  const ip = getClientIp(event);
  const path = (event.rawUrl || event.path || "").replace(/\/$/, "");
  const isExport = path.includes("/ticketing/admin/export");
  const isRefund = path.includes("/ticketing/admin/refund");

  if (event.httpMethod === "GET" && isExport) {
    const params = event.queryStringParameters ?? {};
    const summaries = await listOrdersForAdmin({
      limit: Number(params.limit ?? 500),
      query: params.q ?? "",
    });
    const orders = (
      await Promise.all(summaries.map((summary) => getOrderById(summary.id)))
    ).filter(Boolean);
    const csv = ordersToCsv(orders);
    const { headers, allowed, origin } = (await import("./lib/cors.mjs")).corsHeaders(event, {
      methods: "GET, OPTIONS",
    });
    if (!allowed && origin) {
      return { statusCode: 403, headers, body: JSON.stringify({ error: "Origin not allowed" }) };
    }
    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="sots-ticket-orders.csv"',
      },
      body: csv,
    };
  }

  if (event.httpMethod === "GET") {
    const params = event.queryStringParameters ?? {};
    const orderId = params.id?.trim();
    if (orderId) {
      const order = await getOrderById(orderId);
      if (!order) {
        return jsonResponse(404, { error: "Order not found" }, event, { methods: "GET, POST, OPTIONS" });
      }
      return jsonResponse(200, { order: publicOrderView(order) }, event, { methods: "GET, POST, OPTIONS" });
    }

    const orders = await listOrdersForAdmin({
      limit: Number(params.limit ?? 50),
      query: params.q ?? "",
    });
    return jsonResponse(200, { orders }, event, { methods: "GET, POST, OPTIONS" });
  }

  if (event.httpMethod === "POST" && isRefund) {
    if (!rateLimit(`ticketing-admin-refund:${ip}`, { max: 20, windowMs: 900_000 })) {
      return jsonResponse(429, { error: "Too many refund attempts." }, event, { methods: "GET, POST, OPTIONS" });
    }

    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return jsonResponse(400, { error: "Invalid JSON" }, event, { methods: "GET, POST, OPTIONS" });
    }

    const order = await getOrderById(String(body.orderId ?? "").trim());
    if (!order) {
      return jsonResponse(404, { error: "Order not found" }, event, { methods: "GET, POST, OPTIONS" });
    }
    if (order.status === "refunded") {
      return jsonResponse(400, { error: "Order is already refunded." }, event, { methods: "GET, POST, OPTIONS" });
    }
    if (!order.squarePaymentId) {
      return jsonResponse(400, { error: "No Square payment on this order." }, event, { methods: "GET, POST, OPTIONS" });
    }

    const amountCents = Number(body.amountCents ?? order.totalCents);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      return jsonResponse(400, { error: "Invalid refund amount." }, event, { methods: "GET, POST, OPTIONS" });
    }

    try {
      const refund = await refundSquarePayment({
        paymentId: order.squarePaymentId,
        amountCents,
        currency: order.currency ?? "USD",
        idempotencyKey: randomBytes(16).toString("hex"),
        reason: String(body.reason ?? "Customer refund").slice(0, 192),
      });
      const updated = await markOrderRefunded(order.id, {
        squareRefundId: refund.id,
        amountCents,
      });
      return jsonResponse(200, { ok: true, order: publicOrderView(updated) }, event, {
        methods: "GET, POST, OPTIONS",
      });
    } catch (err) {
      console.error("ticketing-admin refund:", err);
      return jsonResponse(402, { error: err.message || "Refund failed" }, event, {
        methods: "GET, POST, OPTIONS",
      });
    }
  }

  return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "GET, POST, OPTIONS" });
}
