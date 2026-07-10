const RESEND_API = "https://api.resend.com/emails";

export function resendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function getResendFromAddress() {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Shakespeare on the Sound <onboarding@resend.dev>"
  );
}

export function getSiteUrl() {
  return (
    process.env.SITE_URL?.replace(/\/$/, "") ||
    process.env.URL?.replace(/\/$/, "") ||
    process.env.DEPLOY_PRIME_URL?.replace(/\/$/, "") ||
    "https://www.shakespeareonthesound.org"
  );
}

/**
 * @param {{ to: string | string[], subject: string, html: string, text?: string, bcc?: string | string[], replyTo?: string }} payload
 */
export async function sendEmail({ to, subject, html, text, bcc, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return { sent: false, reason: "not_configured" };
  }

  const body = {
    from: getResendFromAddress(),
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  };
  if (text) body.text = text;
  if (bcc) body.bcc = Array.isArray(bcc) ? bcc : [bcc];
  if (replyTo) body.reply_to = replyTo;

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Resend error:", res.status, data);
    throw new Error(data.message || "Could not send email");
  }

  return { sent: true, id: data.id };
}
