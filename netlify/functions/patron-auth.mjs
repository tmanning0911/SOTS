import { corsHeaders, jsonResponse } from "./lib/cors.mjs";
import { bindBlobs } from "./lib/netlify-blobs.mjs";
import { syncPatronToCrm } from "./lib/crm-sync.mjs";
import { getClientIp, rateLimit } from "./lib/rateLimit.mjs";
import {
  BOX_OFFICE_EMAIL,
  EMAIL_COLORS,
  emailButtonsRow,
  emailHeading,
  escapeHtml,
  renderSotsEmail,
} from "./lib/email-layout.mjs";
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
import {
  deletePatronAvatar,
  getPatronAvatar,
  getPatronProfile,
  publicPatronProfile,
  setPatronAvatar,
  upsertPatronProfile,
} from "./lib/patron-profile.mjs";
import { listPatronOrders, publicOrderView } from "./lib/ticketing-store.mjs";

const C = EMAIL_COLORS;

async function sendMagicLinkEmail(email, token) {
  const siteUrl = getSiteUrl();
  const link = `${siteUrl}/my-tickets/?token=${encodeURIComponent(token)}`;
  const subject = "Sign in to My Tickets — Shakespeare on the Sound";
  const preheader = "Your secure sign-in link expires in 15 minutes.";

  const text = [
    "Use this link to view your Shakespeare on the Sound tickets:",
    "",
    link,
    "",
    "This link expires in 15 minutes. If you did not request it, you can ignore this email.",
    "",
    "Shakespeare on the Sound",
  ].join("\n");

  const bodyHtml = `
    ${emailHeading("Sign in to My Tickets")}
    <p style="margin:0 0 18px;">
      Use the button below to view your tickets. This link expires in <strong>15 minutes</strong>.
    </p>
    ${emailButtonsRow([{ href: link, label: "View My Tickets", variant: "primary" }])}
    <p style="margin:0 0 12px;font-size:13px;color:${C.muted};line-height:1.55;">
      If the button does not work, copy and paste this URL into your browser:<br />
      <a href="${escapeHtml(link)}" style="color:${C.blue};word-break:break-all;">${escapeHtml(link)}</a>
    </p>
    <p style="margin:0;font-size:13px;color:${C.muted};">
      If you did not request this email, you can ignore it. Your tickets remain safe.
    </p>
  `;

  const html = renderSotsEmail({
    title: subject,
    preheader,
    siteUrl,
    eyebrow: "My Tickets",
    bodyHtml,
  });

  return sendEmail({ to: email, subject, html, text, replyTo: BOX_OFFICE_EMAIL });
}

async function resolveProfileForPatron(email) {
  let profile = await getPatronProfile(email);
  if (profile?.name) return publicPatronProfile(profile);

  // Prefill from most recent order when no saved profile yet.
  const orders = await listPatronOrders(email);
  const latest = orders[0];
  if (latest?.buyer) {
    profile = await upsertPatronProfile(
      email,
      {
        name: latest.buyer.name,
        phone: latest.buyer.phone,
        marketingOptIn: Boolean(latest.buyer.marketingOptIn),
      },
      { source: "order-prefill", overwrite: false },
    );
  }

  return publicPatronProfile(profile) ?? {
    email,
    name: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: { line1: "", line2: "", city: "", state: "", postalCode: "" },
    marketingOptIn: false,
    marketingOptInAt: null,
    hasAvatar: false,
    avatarUpdatedAt: null,
    updatedAt: null,
    createdAt: null,
    crmSyncStatus: "pending",
  };
}

function binaryResponse(statusCode, bodyBuffer, contentType, event, { methods = "GET, OPTIONS" } = {}) {
  const { headers, allowed, origin } = corsHeaders(event, { methods });
  if (!allowed && origin) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: "Origin not allowed" }),
    };
  }
  return {
    statusCode,
    headers: {
      ...headers,
      "Content-Type": contentType || "application/octet-stream",
      "Cache-Control": "private, max-age=300",
    },
    body: Buffer.from(bodyBuffer).toString("base64"),
    isBase64Encoded: true,
  };
}

export async function handler(event) {
  bindBlobs(event);
  const path = (event.rawUrl || event.path || "").replace(/\/$/, "");
  const isSessionRoute = path.includes("/patron/session");
  const isOrdersRoute = path.includes("/patron/orders");
  const isProfileRoute = path.includes("/patron/profile");
  const isAvatarRoute = path.includes("/patron/avatar");

  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "GET, POST, PUT, DELETE, OPTIONS" });
  }

  if (
    event.httpMethod === "POST" &&
    !isSessionRoute &&
    !isOrdersRoute &&
    !isProfileRoute &&
    !isAvatarRoute
  ) {
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

    const profile = await resolveProfileForPatron(magic.email);
    return jsonResponse(200, { ...session, profile }, event, { methods: "POST, OPTIONS" });
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

  if (isAvatarRoute) {
    const patron = verifyPatronSession(event);
    if (!patron?.email) {
      return jsonResponse(401, { error: "Sign in required." }, event, {
        methods: "GET, PUT, DELETE, OPTIONS",
      });
    }

    if (event.httpMethod === "GET") {
      const avatar = await getPatronAvatar(patron.email);
      if (!avatar) {
        return jsonResponse(404, { error: "No profile photo yet." }, event, {
          methods: "GET, PUT, DELETE, OPTIONS",
        });
      }
      return binaryResponse(200, avatar.bytes, avatar.contentType, event, {
        methods: "GET, PUT, DELETE, OPTIONS",
      });
    }

    if (event.httpMethod === "PUT") {
      const ip = getClientIp(event);
      if (!rateLimit(`patron-avatar:${ip}`, { max: 12, windowMs: 900_000 })) {
        return jsonResponse(429, { error: "Too many photo uploads. Please try again later." }, event, {
          methods: "GET, PUT, DELETE, OPTIONS",
        });
      }

      let body;
      try {
        body = JSON.parse(event.body || "{}");
      } catch {
        return jsonResponse(400, { error: "Invalid JSON" }, event, {
          methods: "GET, PUT, DELETE, OPTIONS",
        });
      }

      const contentType = String(body.contentType ?? body.mimeType ?? "").trim();
      const dataUrl = String(body.dataUrl ?? "").trim();
      const base64 = String(body.imageBase64 ?? "").trim();

      let bytes;
      let mime = contentType;
      if (dataUrl.startsWith("data:")) {
        const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/i);
        if (!match) {
          return jsonResponse(400, { error: "Invalid image data." }, event, {
            methods: "GET, PUT, DELETE, OPTIONS",
          });
        }
        mime = match[1];
        bytes = Buffer.from(match[2], "base64");
      } else if (base64) {
        bytes = Buffer.from(base64, "base64");
      } else {
        return jsonResponse(400, { error: "Missing image data." }, event, {
          methods: "GET, PUT, DELETE, OPTIONS",
        });
      }

      try {
        const profile = await setPatronAvatar(patron.email, { bytes, contentType: mime });
        return jsonResponse(
          200,
          { ok: true, profile: publicPatronProfile(profile) },
          event,
          { methods: "GET, PUT, DELETE, OPTIONS" },
        );
      } catch (err) {
        return jsonResponse(400, { error: err.message || "Could not save photo" }, event, {
          methods: "GET, PUT, DELETE, OPTIONS",
        });
      }
    }

    if (event.httpMethod === "DELETE") {
      try {
        const profile = await deletePatronAvatar(patron.email);
        return jsonResponse(
          200,
          { ok: true, profile: publicPatronProfile(profile) },
          event,
          { methods: "GET, PUT, DELETE, OPTIONS" },
        );
      } catch (err) {
        return jsonResponse(400, { error: err.message || "Could not remove photo" }, event, {
          methods: "GET, PUT, DELETE, OPTIONS",
        });
      }
    }

    return jsonResponse(405, { error: "Method not allowed" }, event, {
      methods: "GET, PUT, DELETE, OPTIONS",
    });
  }

  if (isProfileRoute) {
    const patron = verifyPatronSession(event);
    if (!patron?.email) {
      return jsonResponse(401, { error: "Sign in required." }, event, {
        methods: "GET, PUT, OPTIONS",
      });
    }

    if (event.httpMethod === "GET") {
      const profile = await resolveProfileForPatron(patron.email);
      return jsonResponse(200, { profile }, event, { methods: "GET, PUT, OPTIONS" });
    }

    if (event.httpMethod === "PUT") {
      const ip = getClientIp(event);
      if (!rateLimit(`patron-profile:${ip}`, { max: 20, windowMs: 900_000 })) {
        return jsonResponse(429, { error: "Too many requests. Please try again later." }, event, {
          methods: "GET, PUT, OPTIONS",
        });
      }

      let body;
      try {
        body = JSON.parse(event.body || "{}");
      } catch {
        return jsonResponse(400, { error: "Invalid JSON" }, event, { methods: "GET, PUT, OPTIONS" });
      }

      const name = String(body.name ?? "").trim();
      if (!name) {
        return jsonResponse(400, { error: "Full name is required." }, event, {
          methods: "GET, PUT, OPTIONS",
        });
      }

      try {
        // Merge (not overwrite): empty phone/address fields must not wipe values already
        // on file if the form hydrated before a profile GET finished.
        const profile = await upsertPatronProfile(
          patron.email,
          {
            name,
            phone: body.phone,
            address: body.address,
            marketingOptIn: Boolean(body.marketingOptIn),
          },
          { overwrite: false, source: "my-tickets" },
        );

        // Fire-and-forget CRM sync — do not block the patron on webhook latency.
        syncPatronToCrm(event, profile, { event: "patron.profile_update", source: "my-tickets" }).catch(
          (err) => console.error("patron profile CRM sync:", err),
        );

        return jsonResponse(
          200,
          { ok: true, profile: publicPatronProfile(profile) },
          event,
          { methods: "GET, PUT, OPTIONS" },
        );
      } catch (err) {
        return jsonResponse(400, { error: err.message || "Could not save profile" }, event, {
          methods: "GET, PUT, OPTIONS",
        });
      }
    }

    return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "GET, PUT, OPTIONS" });
  }

  if (event.httpMethod === "GET") {
    const patron = verifyPatronSession(event);
    if (!patron?.email) {
      return jsonResponse(401, { error: "Sign in required." }, event, { methods: "GET, POST, OPTIONS" });
    }
    const profile = await resolveProfileForPatron(patron.email);
    return jsonResponse(
      200,
      { user: { email: patron.email, role: patron.role }, profile },
      event,
      { methods: "GET, POST, OPTIONS" },
    );
  }

  return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "GET, POST, OPTIONS" });
}
