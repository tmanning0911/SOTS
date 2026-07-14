/**
 * Shared transactional email chrome for Shakespeare on the Sound.
 * Table-based, inline CSS — safe for Gmail / Outlook / Apple Mail.
 */

export const BOX_OFFICE_PHONE = "(203) 957-1006";
export const BOX_OFFICE_EMAIL = "contactus@shakespeareonthesound.org";
export const BOX_OFFICE_TEL = "+12039571006";

/** Hosted logo used by newsletters (absolute URL required in email). */
export const SOTS_LOGO_URL =
  "https://static.wixstatic.com/media/2fda61_2e65ecb094584570823c5e5c30d11c49~mv2.jpg/v1/fit/w_360,h_120,al_c,q_90/FINAL_LOGO_COLORS_042812.jpg";

export const EMAIL_COLORS = {
  navy: "#0f2d4d",
  blue: "#1a5090",
  gold: "#c9a227",
  ink: "#2b2b2b",
  muted: "#5a6570",
  line: "#e5e9ed",
  paper: "#ffffff",
  wash: "#f4f6f8",
  card: "#f7f9fc",
};

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatCents(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    (cents ?? 0) / 100,
  );
}

/**
 * @param {{
 *   title: string,
 *   preheader?: string,
 *   siteUrl: string,
 *   bodyHtml: string,
 *   eyebrow?: string,
 * }} opts
 */
export function renderSotsEmail({ title, preheader = "", siteUrl, bodyHtml, eyebrow = "Shakespeare on the Sound" }) {
  const C = EMAIL_COLORS;
  const safeTitle = escapeHtml(title);
  const safePreheader = escapeHtml(preheader);
  const safeEyebrow = escapeHtml(eyebrow);
  const homeUrl = escapeHtml(siteUrl?.replace(/\/$/, "") || "https://www.shakespeareonthesound.org");

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light" />
  <title>${safeTitle}</title>
</head>
<body style="margin:0;padding:0;background-color:${C.wash};font-family:Arial,Helvetica,sans-serif;color:${C.ink};-webkit-text-size-adjust:100%;">
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    ${safePreheader}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.wash};">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:${C.paper};border:1px solid ${C.line};">
          <tr>
            <td align="center" style="padding:28px 28px 18px;border-bottom:3px solid ${C.gold};">
              <a href="${homeUrl}/" style="text-decoration:none;">
                <img src="${SOTS_LOGO_URL}" width="200" alt="Shakespeare on the Sound" style="display:block;width:200px;max-width:70%;height:auto;margin:0 auto;" />
              </a>
              <p style="margin:14px 0 0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted};">${safeEyebrow}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;font-family:Arial,Helvetica,sans-serif;color:${C.ink};font-size:15px;line-height:1.6;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:${C.muted};border-top:1px solid ${C.line};">
              <p style="margin:18px 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${C.navy};">Box office</p>
              <p style="margin:0 0 4px;">
                <a href="tel:${BOX_OFFICE_TEL}" style="color:${C.blue};text-decoration:none;">${BOX_OFFICE_PHONE}</a>
                &nbsp;·&nbsp;
                <a href="mailto:${BOX_OFFICE_EMAIL}" style="color:${C.blue};text-decoration:none;">${BOX_OFFICE_EMAIL}</a>
              </p>
              <p style="margin:12px 0 0;font-size:12px;color:${C.muted};">
                Shakespeare on the Sound · Pinkney Park · Rowayton, CT<br />
                <a href="${homeUrl}/" style="color:${C.blue};text-decoration:underline;">shakespeareonthesound.org</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailButton({ href, label, variant = "primary" }) {
  const C = EMAIL_COLORS;
  const bg = variant === "secondary" ? C.blue : C.navy;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;">
  <tr>
    <td style="background:${bg};border-radius:2px;">
      <a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;letter-spacing:0.02em;">${escapeHtml(label)}</a>
    </td>
  </tr>
</table>`;
}

export function emailButtonsRow(buttons = []) {
  const cells = buttons
    .map(
      (btn, index) =>
        `${index > 0 ? `<td style="width:10px;font-size:0;line-height:0;">&nbsp;</td>` : ""}<td style="padding:0;">${emailButton(btn)}</td>`,
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;">
  <tr>${cells}</tr>
</table>`;
}

export function emailCard(innerHtml) {
  const C = EMAIL_COLORS;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.card};border:1px solid ${C.line};margin:0 0 22px;">
  <tr>
    <td style="padding:18px 20px;">${innerHtml}</td>
  </tr>
</table>`;
}

export function emailHeading(text) {
  const C = EMAIL_COLORS;
  return `<h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:400;line-height:1.3;color:${C.navy};">${escapeHtml(text)}</h1>`;
}

export function emailLabel(text) {
  const C = EMAIL_COLORS;
  return `<p style="margin:0 0 6px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${C.muted};">${escapeHtml(text)}</p>`;
}
