import { jsonResponse } from "./lib/cors.mjs";
import { getClientIp, rateLimit } from "./lib/rateLimit.mjs";
import { getSiteUrl, resendConfigured, sendEmail } from "./lib/resend.mjs";
import {
  isValidPatronEmail,
  issueMagicLinkToken,
  issuePatronSession,
  normalizePatronEmail,
  patronAuthConfigured,
  verifyMagicLinkToken,
  verifyPatronSession,
} from "./lib/patron-auth.mjs";
import { listPatronOrders, publicOrderView } from "./lib/ticketing-store.mjs";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendMagicLinkEmail(email, token) {
  const siteUrl = getSiteUrl();
  const link = `${siteUrl}/my-tickets/?token=${encodeURIComponent(token)}`;
  const subject = "Sign in to My Tickets — Shakespeare on the Sound";
  const text = [
    "Use this link to view your Shakespeare on the Sound tickets:",
    "",
    link,
    "",
    "This link expires in 15 minutes. If you did not request it, you can ignore this email.",
  ].join("\n");
  const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#2b2b2b;padding:24px;">
    <p>Tap below to view your tickets. This link expires in <strong>15 minutes</strong>.</p>
    <p><a href="${escapeHtml(link)}" style="display:inline-block;background:#0f2d4d;color:#fff;padding:12px 18px;text-decoration:none;font-weight:bold;">View My Tickets</a></p>
    <p style="font-size:13px;color:#525252;">If the button does not work, copy and paste this URL:<br>${escapeHtml(link)}</p>
  </body></html>`;

  return sendEmail({ to: email, subject, html, text });
}

export async function handler(event) {
  const path = (event.rawUrl || event.path || "").replace(/\/$/, "");
  const isSessionRoute = path.includes("/patron/session");
  const isOrdersRoute = path.includes("/patron/orders");

  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "GET, POST, OPTIONS" });
  }

  if (event.httpMethod === "POST" && !isSessionRoute && !isOrdersRoute) {
    const ip = getClientIp(event);
    if (!rateLimit(`patron-auth:${ip}`, { max: 8, windowMs: 900_000 })) {
      return jsonResponse(429, { error: "Too many requests. Please try again later." }, event, {
        methods: "POST, OPTIONS",
      });
    }

    if (!patronAuthConfigured()) {
      return jsonResponse(503, { error: "Patron sign-in is not configured yet." }, event, {
        methods: "POST, OPTIONS",
      });
    }

    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return jsonResponse(400, { error: "Invalid JSON" }, event, { methods: "POST, OPTIONS" });
    }

    const email = normalizePatronEmail(body.email);
    if (!isValidPatronEmail(email)) {
      return jsonResponse(400, { error: "Enter a valid email address." }, event, { methods: "POST, OPTIONS" });
    }

    const token = issueMagicLinkToken(email);
    if (!token) {
      return jsonResponse(503, { error: "Could not create sign-in link." }, event, { methods: "POST, OPTIONS" });
    }

    if (resendConfigured()) {
      try {
        await sendMagicLinkEmail(email, token);
      } catch (err) {
        console.error("patron magic link email failed:", err);
        return jsonResponse(502, { error: "Could not send sign-in email. Try again shortly." }, event, {
          methods: "POST, OPTIONS",
        });
      }
    }

    return jsonResponse(
      200,
      {
        ok: true,
        emailSent: resendConfigured(),
        message: resendConfigured()
          ? "Check your email for a sign-in link."
          : "Sign-in email is not configured — use Access Your Tickets with your confirmation code.",
      },
      event,
      { methods: "POST, OPTIONS" },
    );
  }

  if (event.httpMethod === "POST" && isSessionRoute) {
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return jsonResponse(400, { error: "Invalid JSON" }, event, { methods: "POST, OPTIONS" });
    }

    const magic = verifyMagicLinkToken(body.token);
    if (!magic?.email) {
      return jsonResponse(401, { error: "This sign-in link is invalid or expired." }, event, {
        methods: "POST, OPTIONS",
      });
    }

    const session = issuePatronSession(magic.email);
    if (!session) {
      return jsonResponse(503, { error: "Could not start your session." }, event, { methods: "POST, OPTIONS" });
    }

    return jsonResponse(200, session, event, { methods: "POST, OPTIONS" });
  }

  if (event.httpMethod === "GET" && isOrdersRoute) {
    const patron = verifyPatronSession(event);
    if (!patron?.email) {
      return jsonResponse(401, { error: "Sign in required." }, event, { methods: "GET, POST, OPTIONS" });
    }

    const orders = await listPatronOrders(patron.email);
    return jsonResponse(
      200,
      { orders: orders.map(publicOrderView) },
      event,
      { methods: "GET, POST, OPTIONS" },
    );
  }

  if (event.httpMethod === "GET") {
    const patron = verifyPatronSession(event);
    if (!patron?.email) {
      return jsonResponse(401, { error: "Sign in required." }, event, { methods: "GET, POST, OPTIONS" });
    }
    return jsonResponse(200, { user: { email: patron.email, role: patron.role } }, event, {
      methods: "GET, POST, OPTIONS",
    });
  }

  return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "GET, POST, OPTIONS" });
}
