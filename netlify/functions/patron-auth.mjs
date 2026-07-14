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
  assertPatronMutationAllowed,
  buildPatronSessionCookies,
  consumeMagicLink,
  isValidPatronEmail,
  issueMagicLinkToken,
  issuePatronSession,
  normalizePatronEmail,
  patronAuthConfigured,
  rateLimitPatronMagic,
  recordPatronSession,
  revokeAllPatronSessions,
  revokePatronSession,
  setPatronSessionAmr,
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
import {
  beginPasskeyAuthentication,
  beginPasskeyRegistration,
  finishPasskeyAuthentication,
  finishPasskeyRegistration,
  listPatronPasskeys,
  patronHasPasskeys,
} from "./lib/patron-webauthn.mjs";
import { listPatronShopOrders, publicShopOrderView } from "./lib/shop-store.mjs";
import { listPatronOrders, publicOrderView } from "./lib/ticketing-store.mjs";

const C = EMAIL_COLORS;
const PATRON_CORS = { allowCredentials: true };

function patronHasWebauthn(patron) {
  return Array.isArray(patron?.amr) && patron.amr.includes("webauthn");
}

async function gatePasskeyIfRequired(event, patron) {
  if (!patron?.email) return null;
  if (patronHasWebauthn(patron)) return null;
  if (!(await patronHasPasskeys(patron.email))) return null;
  return patronJson(
    403,
    {
      error: "Confirm with Face ID or your device lock to continue.",
      needsPasskey: true,
    },
    event,
    { methods: "GET, POST, PUT, DELETE, OPTIONS" },
  );
}

async function sendMagicLinkEmail(email, token) {
  const siteUrl = getSiteUrl();
  const link = `${siteUrl}/my-tickets/?token=${encodeURIComponent(token)}`;
  const subject = "Your tickets — Shakespeare on the Sound";
  const preheader = "Here's a link to My Tickets. It expires in 10 minutes.";

  const text = [
    "Open this link, then tap “Open my tickets” on the page:",
    "",
    link,
    "",
    "This link works once and expires in 10 minutes. If you didn't ask for it, you can ignore this email.",
    "",
    "Shakespeare on the Sound",
  ].join("\n");

  const bodyHtml = `
    ${emailHeading("Your tickets")}
    <p style="margin:0 0 18px;">
      Tap the button below, then choose <strong>Open my tickets</strong> on the website.
      The link works once and expires in <strong>10 minutes</strong>.
    </p>
    ${emailButtonsRow([{ href: link, label: "View My Tickets", variant: "primary" }])}
    <p style="margin:0 0 12px;font-size:13px;color:${C.muted};line-height:1.55;">
      If the button doesn't work, copy and paste this into your browser:<br />
      <a href="${escapeHtml(link)}" style="color:${C.blue};word-break:break-all;">${escapeHtml(link)}</a>
    </p>
    <p style="margin:0;font-size:13px;color:${C.muted};">
      Didn't ask for this? You can ignore the email.
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
  const { headers, allowed, origin } = corsHeaders(event, { methods, ...PATRON_CORS });
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

function patronJson(statusCode, body, event, options = {}) {
  return jsonResponse(statusCode, body, event, { ...PATRON_CORS, ...options });
}

export async function handler(event) {
  bindBlobs(event);
  const path = (event.rawUrl || event.path || "").replace(/\/$/, "");
  const isSessionRoute = path.includes("/patron/session");
  const isLogoutRoute = path.includes("/patron/logout") && !path.includes("/patron/logout-all");
  const isLogoutAllRoute = path.includes("/patron/logout-all");
  const isOrdersRoute = path.includes("/patron/orders");
  const isProfileRoute = path.includes("/patron/profile");
  const isAvatarRoute = path.includes("/patron/avatar");
  const isWebauthnRoute = path.includes("/patron/webauthn");

  if (event.httpMethod === "OPTIONS") {
    return patronJson(204, {}, event, { methods: "GET, POST, PUT, DELETE, OPTIONS" });
  }

  if (["POST", "PUT", "DELETE"].includes(event.httpMethod) && !assertPatronMutationAllowed(event)) {
    return patronJson(403, { error: "Request origin not allowed." }, event, {
      methods: "GET, POST, PUT, DELETE, OPTIONS",
    });
  }

  if (event.httpMethod === "POST" && isLogoutAllRoute) {
    const patron = await verifyPatronSession(event);
    if (!patron?.email) {
      return patronJson(401, { error: "Sign in required." }, event, { methods: "POST, OPTIONS" });
    }
    await revokeAllPatronSessions(patron.email);
    return patronJson(
      200,
      { ok: true },
      event,
      {
        methods: "POST, OPTIONS",
        cookies: buildPatronSessionCookies("", event, { clear: true }),
      },
    );
  }

  if (event.httpMethod === "POST" && isLogoutRoute) {
    const patron = await verifyPatronSession(event);
    if (patron?.jti) await revokePatronSession(patron.jti);
    return patronJson(
      200,
      { ok: true },
      event,
      {
        methods: "POST, OPTIONS",
        cookies: buildPatronSessionCookies("", event, { clear: true }),
      },
    );
  }

  if (isWebauthnRoute) {
    const patron = await verifyPatronSession(event);
    if (!patron?.email) {
      return patronJson(401, { error: "Sign in required." }, event, {
        methods: "GET, POST, OPTIONS",
      });
    }

    const action = path.split("/webauthn/")[1] || "";

    try {
      if (event.httpMethod === "GET" && action.startsWith("status")) {
        const passkeys = await listPatronPasskeys(patron.email);
        return patronJson(
          200,
          {
            hasPasskeys: passkeys.length > 0,
            count: passkeys.length,
            verified: patronHasWebauthn(patron),
          },
          event,
          { methods: "GET, POST, OPTIONS" },
        );
      }

      if (event.httpMethod === "POST" && action === "register/options") {
        const options = await beginPasskeyRegistration(patron.email, event);
        return patronJson(200, { options }, event, { methods: "GET, POST, OPTIONS" });
      }

      if (event.httpMethod === "POST" && action === "register/verify") {
        const body = JSON.parse(event.body || "{}");
        const result = await finishPasskeyRegistration(patron.email, body.response, event);
        await setPatronSessionAmr(patron.jti, ["magic", "webauthn"]);
        return patronJson(200, { ok: true, ...result, verified: true }, event, {
          methods: "GET, POST, OPTIONS",
        });
      }

      if (event.httpMethod === "POST" && action === "auth/options") {
        const options = await beginPasskeyAuthentication(patron.email, event);
        return patronJson(200, { options }, event, { methods: "GET, POST, OPTIONS" });
      }

      if (event.httpMethod === "POST" && action === "auth/verify") {
        const body = JSON.parse(event.body || "{}");
        await finishPasskeyAuthentication(patron.email, body.response, event);
        await setPatronSessionAmr(patron.jti, ["magic", "webauthn"]);
        return patronJson(200, { ok: true, verified: true }, event, {
          methods: "GET, POST, OPTIONS",
        });
      }
    } catch (err) {
      return patronJson(400, { error: err.message || "Passkey request failed" }, event, {
        methods: "GET, POST, OPTIONS",
      });
    }

    return patronJson(405, { error: "Method not allowed" }, event, {
      methods: "GET, POST, OPTIONS",
    });
  }

  if (
    event.httpMethod === "POST" &&
    !isSessionRoute &&
    !isLogoutRoute &&
    !isLogoutAllRoute &&
    !isOrdersRoute &&
    !isProfileRoute &&
    !isAvatarRoute &&
    !isWebauthnRoute
  ) {
    const ip = getClientIp(event);

    if (!patronAuthConfigured()) {
      return patronJson(503, { error: "My Tickets email isn't available right now. Try Look Up an Order, or contact the box office." }, event, {
        methods: "POST, OPTIONS",
      });
    }

    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return patronJson(400, { error: "Invalid JSON" }, event, { methods: "POST, OPTIONS" });
    }

    const email = normalizePatronEmail(body.email);
    if (!isValidPatronEmail(email)) {
      return patronJson(400, { error: "Enter a valid email address." }, event, { methods: "POST, OPTIONS" });
    }

    // Memory limit (fast) + durable blob limit (cross-instance).
    if (
      !rateLimit(`patron-auth:${ip}`, { max: 8, windowMs: 900_000 }) ||
      !(await rateLimitPatronMagic({ ip, email }))
    ) {
      return patronJson(429, { error: "Too many requests. Please try again later." }, event, {
        methods: "POST, OPTIONS",
      });
    }

    const token = issueMagicLinkToken(email);
    if (!token) {
      return patronJson(503, { error: "Couldn't create a link right now. Try again shortly." }, event, {
        methods: "POST, OPTIONS",
      });
    }

    if (resendConfigured()) {
      try {
        await sendMagicLinkEmail(email, token);
      } catch (err) {
        console.error("patron magic link email failed:", err);
        return patronJson(502, { error: "Couldn't send the email. Try again in a moment." }, event, {
          methods: "POST, OPTIONS",
        });
      }
    }

    return patronJson(
      200,
      {
        ok: true,
        emailSent: resendConfigured(),
        message: resendConfigured()
          ? "Check your email — we sent you a link."
          : "Email isn't set up yet. Use Look Up an Order with your confirmation code.",
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
      return patronJson(400, { error: "Invalid JSON" }, event, { methods: "POST, OPTIONS" });
    }

    const magic = verifyMagicLinkToken(body.token);
    if (!magic?.email) {
      return patronJson(401, { error: "That link expired. Request a new one." }, event, {
        methods: "POST, OPTIONS",
      });
    }

    const consumed = await consumeMagicLink(magic);
    if (!consumed.ok) {
      return patronJson(
        401,
        {
          error:
            consumed.reason === "used"
              ? "That link was already used. Request a new one."
              : "That link isn't working. Request a new one.",
        },
        event,
        { methods: "POST, OPTIONS" },
      );
    }

    const session = issuePatronSession(magic.email, { ip: getClientIp(event) });
    if (!session) {
      return patronJson(503, { error: "Couldn't start your session. Try again shortly." }, event, {
        methods: "POST, OPTIONS",
      });
    }

    await recordPatronSession({ ...session, amr: ["magic"] });
    const profile = await resolveProfileForPatron(magic.email);
    const needsPasskey = await patronHasPasskeys(magic.email);
    // Do not return the raw session token in JSON — the HttpOnly cookie is the session.
    return patronJson(
      200,
      { ok: true, user: session.user, profile, needsPasskey },
      event,
      {
        methods: "POST, OPTIONS",
        cookies: buildPatronSessionCookies(session.token, event),
      },
    );
  }

  if (event.httpMethod === "GET" && isOrdersRoute) {
    const patron = await verifyPatronSession(event);
    if (!patron?.email) {
      return patronJson(401, { error: "Sign in required." }, event, { methods: "GET, POST, OPTIONS" });
    }
    const blocked = await gatePasskeyIfRequired(event, patron);
    if (blocked) return blocked;

    const [ticketOrders, shopOrders] = await Promise.all([
      listPatronOrders(patron.email),
      listPatronShopOrders(patron.email),
    ]);
    const orders = [
      ...ticketOrders.map((order) => publicOrderView({ ...order, type: "ticket" })),
      ...shopOrders.map(publicShopOrderView),
    ]
      .filter(Boolean)
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));

    return patronJson(200, { orders }, event, { methods: "GET, POST, OPTIONS" });
  }

  if (isAvatarRoute) {
    const patron = await verifyPatronSession(event);
    if (!patron?.email) {
      return patronJson(401, { error: "Sign in required." }, event, {
        methods: "GET, PUT, DELETE, OPTIONS",
      });
    }
    const blocked = await gatePasskeyIfRequired(event, patron);
    if (blocked) return blocked;

    if (event.httpMethod === "GET") {
      const avatar = await getPatronAvatar(patron.email);
      if (!avatar) {
        return patronJson(404, { error: "No profile photo yet." }, event, {
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
        return patronJson(429, { error: "Too many photo uploads. Please try again later." }, event, {
          methods: "GET, PUT, DELETE, OPTIONS",
        });
      }

      let body;
      try {
        body = JSON.parse(event.body || "{}");
      } catch {
        return patronJson(400, { error: "Invalid JSON" }, event, {
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
          return patronJson(400, { error: "Invalid image data." }, event, {
            methods: "GET, PUT, DELETE, OPTIONS",
          });
        }
        mime = match[1];
        bytes = Buffer.from(match[2], "base64");
      } else if (base64) {
        bytes = Buffer.from(base64, "base64");
      } else {
        return patronJson(400, { error: "Missing image data." }, event, {
          methods: "GET, PUT, DELETE, OPTIONS",
        });
      }

      try {
        const profile = await setPatronAvatar(patron.email, { bytes, contentType: mime });
        return patronJson(
          200,
          { ok: true, profile: publicPatronProfile(profile) },
          event,
          { methods: "GET, PUT, DELETE, OPTIONS" },
        );
      } catch (err) {
        return patronJson(400, { error: err.message || "Could not save photo" }, event, {
          methods: "GET, PUT, DELETE, OPTIONS",
        });
      }
    }

    if (event.httpMethod === "DELETE") {
      try {
        const profile = await deletePatronAvatar(patron.email);
        return patronJson(
          200,
          { ok: true, profile: publicPatronProfile(profile) },
          event,
          { methods: "GET, PUT, DELETE, OPTIONS" },
        );
      } catch (err) {
        return patronJson(400, { error: err.message || "Could not remove photo" }, event, {
          methods: "GET, PUT, DELETE, OPTIONS",
        });
      }
    }

    return patronJson(405, { error: "Method not allowed" }, event, {
      methods: "GET, PUT, DELETE, OPTIONS",
    });
  }

  if (isProfileRoute) {
    const patron = await verifyPatronSession(event);
    if (!patron?.email) {
      return patronJson(401, { error: "Sign in required." }, event, {
        methods: "GET, PUT, OPTIONS",
      });
    }
    const blocked = await gatePasskeyIfRequired(event, patron);
    if (blocked) return blocked;

    if (event.httpMethod === "GET") {
      const profile = await resolveProfileForPatron(patron.email);
      return patronJson(200, { profile }, event, { methods: "GET, PUT, OPTIONS" });
    }

    if (event.httpMethod === "PUT") {
      const ip = getClientIp(event);
      if (!rateLimit(`patron-profile:${ip}`, { max: 20, windowMs: 900_000 })) {
        return patronJson(429, { error: "Too many requests. Please try again later." }, event, {
          methods: "GET, PUT, OPTIONS",
        });
      }

      let body;
      try {
        body = JSON.parse(event.body || "{}");
      } catch {
        return patronJson(400, { error: "Invalid JSON" }, event, { methods: "GET, PUT, OPTIONS" });
      }

      const name = String(body.name ?? "").trim();
      if (!name) {
        return patronJson(400, { error: "Full name is required." }, event, {
          methods: "GET, PUT, OPTIONS",
        });
      }

      try {
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

        syncPatronToCrm(event, profile, { event: "patron.profile_update", source: "my-tickets" }).catch(
          (err) => console.error("patron profile CRM sync:", err),
        );

        return patronJson(
          200,
          { ok: true, profile: publicPatronProfile(profile) },
          event,
          { methods: "GET, PUT, OPTIONS" },
        );
      } catch (err) {
        return patronJson(400, { error: err.message || "Could not save profile" }, event, {
          methods: "GET, PUT, OPTIONS",
        });
      }
    }

    return patronJson(405, { error: "Method not allowed" }, event, { methods: "GET, PUT, OPTIONS" });
  }

  if (event.httpMethod === "GET") {
    const patron = await verifyPatronSession(event);
    if (!patron?.email) {
      return patronJson(401, { error: "Sign in required." }, event, { methods: "GET, POST, OPTIONS" });
    }
    const profile = await resolveProfileForPatron(patron.email);
    const needsPasskey = (await patronHasPasskeys(patron.email)) && !patronHasWebauthn(patron);
    return patronJson(
      200,
      {
        user: { email: patron.email, role: patron.role },
        profile,
        needsPasskey,
        amr: patron.amr || ["magic"],
      },
      event,
      { methods: "GET, POST, OPTIONS" },
    );
  }

  return patronJson(405, { error: "Method not allowed" }, event, { methods: "GET, POST, OPTIONS" });
}
