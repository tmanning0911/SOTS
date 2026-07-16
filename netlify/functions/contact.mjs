import { getStore } from "@netlify/blobs";
import { jsonResponse } from "./lib/cors.mjs";
import { getConstantContactConfig, signUpContact } from "./lib/constant-contact.mjs";
import { escapeHtml, renderSotsEmail } from "./lib/email-layout.mjs";
import { bindBlobs } from "./lib/netlify-blobs.mjs";
import { getClientIp, rateLimit } from "./lib/rateLimit.mjs";
import { getSiteUrl, getResendNotificationsFromAddress, resendConfigured, sendEmail } from "./lib/resend.mjs";

const FORMS = new Set(["contact", "education", "newsletter", "sponsorship", "apprentice"]);
const STORE_NAME = "sots-form-submissions";
const APPRENTICE_RECIPIENT = "stephanie@shakespeareonthesound.org";
const MAX_RESUME_BYTES = 1_800_000; // ~1.8MB raw → stays under Netlify/Resend limits once base64'd
const RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ALLOWED_RECIPIENTS = new Set([
  "contactus@shakespeareonthesound.org",
  "aaron@shakespeareonthesound.org",
  "stephanie@shakespeareonthesound.org",
  "marketing@shakespeareonthesound.org",
]);

const DEFAULT_RECIPIENT = "contactus@shakespeareonthesound.org";
const APPRENTICE_TRACKS = new Set([
  "Acting — SOS Players",
  "Directing",
  "Education",
  "Playwriting",
  "Costuming",
  "Production",
  "Other",
]);

function sanitize(str, max = 5000) {
  if (str == null) return "";
  return String(str).trim().slice(0, max);
}

function splitName(name) {
  const parts = sanitize(name, 200).split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ").slice(0, 50),
  };
}

function resolveRecipient(fields) {
  const candidate = sanitize(fields.recipient || fields.to, 254).toLowerCase();
  if (ALLOWED_RECIPIENTS.has(candidate)) return candidate;
  return DEFAULT_RECIPIENT;
}

function validateResumeAttachment(raw) {
  if (!raw || typeof raw !== "object") return { ok: true, attachment: null };
  const filename = sanitize(raw.filename, 120) || "resume.pdf";
  const contentType = sanitize(raw.contentType, 120) || "application/pdf";
  const content = sanitize(raw.content, MAX_RESUME_BYTES * 2);
  if (!content) return { ok: true, attachment: null };
  if (!RESUME_TYPES.has(contentType) && !/\.(pdf|docx?)$/i.test(filename)) {
    return { error: "Resume must be a PDF or Word document." };
  }
  // Rough decoded size check from base64 length
  const approxBytes = Math.floor((content.length * 3) / 4);
  if (approxBytes > MAX_RESUME_BYTES) {
    return { error: "Resume file is too large (max about 1.5 MB). Email it to Stephanie instead." };
  }
  return {
    ok: true,
    attachment: {
      filename,
      contentType,
      content,
    },
  };
}

function validatePayload(form, fields) {
  const email = sanitize(fields.email, 254).toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "A valid email address is required." };
  }

  const name = sanitize(fields.name, 200);
  if (!name && form !== "newsletter") {
    return { error: "Name is required." };
  }

  if (form === "contact" || form === "education" || form === "sponsorship") {
    const message = sanitize(fields.message, 5000);
    if (!message || message.length < 10) {
      return { error: "Please enter a message (at least 10 characters)." };
    }
  }

  if (form === "apprentice") {
    const track = sanitize(fields.track, 80);
    if (!APPRENTICE_TRACKS.has(track)) {
      return { error: "Please choose an apprenticeship track." };
    }
    const statementDrew = sanitize(fields.statementDrew, 4000);
    const statementArtist = sanitize(fields.statementArtist, 4000);
    const statementInterest = sanitize(fields.statementInterest, 4000);
    if (statementDrew.length < 40 || statementArtist.length < 40 || statementInterest.length < 40) {
      return { error: "Please answer each personal-statement question (at least a short paragraph)." };
    }
    const ref1Name = sanitize(fields.ref1Name, 200);
    const ref1Email = sanitize(fields.ref1Email, 254).toLowerCase();
    const ref2Name = sanitize(fields.ref2Name, 200);
    const ref2Email = sanitize(fields.ref2Email, 254).toLowerCase();
    if (!ref1Name || !ref1Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ref1Email)) {
      return { error: "Professional/educational reference name and email are required." };
    }
    if (!ref2Name || !ref2Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ref2Email)) {
      return { error: "Personal reference name and email are required." };
    }
    const resumeCheck = validateResumeAttachment(fields.resume);
    if (resumeCheck.error) return { error: resumeCheck.error };
    if (!resumeCheck.attachment && !fields.resumeWillEmail) {
      return { error: "Attach a resume (PDF/Word) or check that you will email it separately." };
    }

    return {
      data: {
        ...fields,
        name,
        email,
        phone: sanitize(fields.phone, 40),
        location: sanitize(fields.location, 200),
        track,
        trackOther: sanitize(fields.trackOther, 200),
        availableConfirm: Boolean(fields.availableConfirm),
        statementDrew,
        statementArtist,
        statementInterest,
        ref1Name,
        ref1Email,
        ref1Phone: sanitize(fields.ref1Phone, 40),
        ref1Relation: sanitize(fields.ref1Relation, 200),
        ref2Name,
        ref2Email,
        ref2Phone: sanitize(fields.ref2Phone, 40),
        ref2Relation: sanitize(fields.ref2Relation, 200),
        resumeWillEmail: Boolean(fields.resumeWillEmail),
        resume: resumeCheck.attachment,
        recipient: APPRENTICE_RECIPIENT,
        recipientLabel: "Stephanie Eiss, Director of Education and Outreach",
        submittedAt: new Date().toISOString(),
      },
    };
  }

  return {
    data: {
      ...fields,
      name,
      email,
      submittedAt: new Date().toISOString(),
    },
  };
}

async function appendSubmission(event, form, entry) {
  try {
    bindBlobs(event);
    const store = getStore({ name: STORE_NAME, consistency: "strong" });
    const key = `${form}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    await store.setJSON(key, entry);
  } catch {
    /* Blobs optional on some deploy types */
  }
}

async function deliverStaffMessage(form, data) {
  const to = resolveRecipient(data);
  const phone = sanitize(data.phone, 40);
  const recipientLabel = sanitize(data.recipientLabel, 200) || to;
  const requested = sanitize(data.requestedRecipient, 254);
  const pageUrl = sanitize(data.pageUrl, 500);
  const message = sanitize(data.message, 5000);

  const subjectPrefix =
    form === "education" ? "Education inquiry" : form === "sponsorship" ? "Sponsorship inquiry" : "Website message";

  const rows = [
    ["From", `${data.name} <${data.email}>`],
    phone ? ["Phone", phone] : null,
    ["Deliver to", recipientLabel],
    requested && requested !== to ? ["Originally requested", requested] : null,
    pageUrl ? ["Page", pageUrl] : null,
    ["Form", form],
  ].filter(Boolean);

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#2b2b2b;">
      A visitor sent a message through the Shakespeare on the Sound website.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;border:1px solid #e5e9ed;">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;width:32%;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#5a6570;border-bottom:1px solid #e5e9ed;background:#f7f9fc;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;font-size:14px;color:#2b2b2b;border-bottom:1px solid #e5e9ed;">${escapeHtml(value)}</td>
        </tr>`,
        )
        .join("")}
    </table>
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5a6570;">Message</p>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#2b2b2b;white-space:pre-wrap;">${escapeHtml(message)}</p>
  `;

  const html = renderSotsEmail({
    title: `${subjectPrefix} from ${data.name}`,
    preheader: message.slice(0, 120),
    siteUrl: getSiteUrl(),
    bodyHtml,
    eyebrow: "Website contact form",
  });

  const text = [
    `${subjectPrefix} from ${data.name}`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    message,
  ].join("\n");

  return sendEmail({
    from: getResendNotificationsFromAddress(),
    to,
    replyTo: data.email,
    subject: `${subjectPrefix}: ${data.name}`,
    html,
    text,
  });
}

async function deliverApprenticeApplication(data) {
  const trackLabel =
    data.track === "Other" && data.trackOther ? `Other — ${data.trackOther}` : data.track;
  const rows = [
    ["Applicant", `${data.name} <${data.email}>`],
    data.phone ? ["Phone", data.phone] : null,
    data.location ? ["City / State", data.location] : null,
    ["Track", trackLabel],
    ["Available May 4, 2026", data.availableConfirm ? "Yes" : "Not confirmed"],
    [
      "Reference 1 (professional/educational)",
      `${data.ref1Name} <${data.ref1Email}>${data.ref1Phone ? ` · ${data.ref1Phone}` : ""}${data.ref1Relation ? ` · ${data.ref1Relation}` : ""}`,
    ],
    [
      "Reference 2 (personal)",
      `${data.ref2Name} <${data.ref2Email}>${data.ref2Phone ? ` · ${data.ref2Phone}` : ""}${data.ref2Relation ? ` · ${data.ref2Relation}` : ""}`,
    ],
    data.resume ? ["Resume", data.resume.filename] : ["Resume", "Will email separately"],
    data.pageUrl ? ["Page", data.pageUrl] : null,
  ].filter(Boolean);

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#2b2b2b;">
      A new <strong>2026 Apprentice Company</strong> application was submitted on the website.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;border:1px solid #e5e9ed;">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;width:34%;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#5a6570;border-bottom:1px solid #e5e9ed;background:#f7f9fc;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;font-size:14px;color:#2b2b2b;border-bottom:1px solid #e5e9ed;">${escapeHtml(value)}</td>
        </tr>`,
        )
        .join("")}
    </table>
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5a6570;">What drew you to theater?</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#2b2b2b;white-space:pre-wrap;">${escapeHtml(data.statementDrew)}</p>
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5a6570;">Who are you as an artist?</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#2b2b2b;white-space:pre-wrap;">${escapeHtml(data.statementArtist)}</p>
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5a6570;">Why Shakespeare on the Sound?</p>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#2b2b2b;white-space:pre-wrap;">${escapeHtml(data.statementInterest)}</p>
  `;

  const html = renderSotsEmail({
    title: `Apprentice application — ${data.name}`,
    preheader: `${trackLabel} · ${data.name}`,
    siteUrl: getSiteUrl(),
    bodyHtml,
    eyebrow: "Apprentice application",
  });

  const text = [
    `Apprentice application from ${data.name}`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "What drew you to theater?",
    data.statementDrew,
    "",
    "Who are you as an artist?",
    data.statementArtist,
    "",
    "Why Shakespeare on the Sound?",
    data.statementInterest,
  ].join("\n");

  const attachments = data.resume
    ? [
        {
          filename: data.resume.filename,
          content: data.resume.content,
          contentType: data.resume.contentType,
        },
      ]
    : undefined;

  return sendEmail({
    from: getResendNotificationsFromAddress(),
    to: APPRENTICE_RECIPIENT,
    replyTo: data.email,
    subject: `Apprentice application: ${data.name} — ${trackLabel}`,
    html,
    text,
    attachments,
  });
}

function confirmationCopy(form, data) {
  const greetName = splitName(data.name).firstName || "there";
  const siteUrl = getSiteUrl();

  if (form === "newsletter") {
    return {
      subject: "You're on the Shakespeare on the Sound list",
      eyebrow: "Newsletter confirmation",
      title: "Thanks for signing up",
      preheader: "You're on our list — watch for season news and events.",
      bodyHtml: `
        <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#2b2b2b;">Hi ${escapeHtml(greetName)},</p>
        <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#2b2b2b;">
          You're confirmed on the Shakespeare on the Sound mailing list. We'll send seasonal news,
          performance updates, and community events to <strong>${escapeHtml(data.email)}</strong>.
        </p>
        <p style="margin:0;font-size:15px;line-height:1.55;color:#2b2b2b;">
          Prefer fewer emails? Use the unsubscribe link in any message we send.
        </p>
      `,
      text: [
        `Hi ${greetName},`,
        "",
        "You're confirmed on the Shakespeare on the Sound mailing list.",
        `We'll send updates to ${data.email}.`,
        "",
        siteUrl,
      ].join("\n"),
    };
  }

  if (form === "apprentice") {
    const trackLabel =
      data.track === "Other" && data.trackOther ? `Other — ${data.trackOther}` : data.track;
    return {
      subject: "We received your apprentice application — Shakespeare on the Sound",
      eyebrow: "Application confirmation",
      title: "Thanks for applying",
      preheader: "Your 2026 Apprentice Company application was received.",
      bodyHtml: `
        <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#2b2b2b;">Hi ${escapeHtml(greetName)},</p>
        <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#2b2b2b;">
          Thank you for applying to the Shakespeare on the Sound Apprentice Company.
          We received your <strong>${escapeHtml(trackLabel)}</strong> application and will be in touch
          about next steps.
        </p>
        <p style="margin:0;font-size:15px;line-height:1.55;color:#2b2b2b;">
          Questions? Email Stephanie Eiss at
          <a href="mailto:stephanie@shakespeareonthesound.org" style="color:#1a5090;">stephanie@shakespeareonthesound.org</a>.
        </p>
      `,
      text: [
        `Hi ${greetName},`,
        "",
        "Thank you for applying to the Shakespeare on the Sound Apprentice Company.",
        `We received your ${trackLabel} application and will be in touch about next steps.`,
        "",
        "Questions? stephanie@shakespeareonthesound.org",
        "",
        siteUrl,
      ].join("\n"),
    };
  }

  const kind =
    form === "education"
      ? "education inquiry"
      : form === "sponsorship"
        ? "sponsorship inquiry"
        : "message";
  const message = sanitize(data.message, 5000);
  const recipientLabel = sanitize(data.recipientLabel, 200) || resolveRecipient(data);

  return {
    subject: "We received your message — Shakespeare on the Sound",
    eyebrow: "Message confirmation",
    title: "Thanks — we got your note",
    preheader: "Your message was received. We'll reply as soon as we can.",
    bodyHtml: `
      <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#2b2b2b;">Hi ${escapeHtml(greetName)},</p>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#2b2b2b;">
        Thanks for writing. We received your ${escapeHtml(kind)} and will get back to you soon.
      </p>
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5a6570;">Sent to</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#2b2b2b;">${escapeHtml(recipientLabel)}</p>
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5a6570;">Your message</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#2b2b2b;white-space:pre-wrap;">${escapeHtml(message)}</p>
    `,
    text: [
      `Hi ${greetName},`,
      "",
      `Thanks for writing. We received your ${kind} and will get back to you soon.`,
      "",
      `Sent to: ${recipientLabel}`,
      "",
      "Your message:",
      message,
      "",
      siteUrl,
    ].join("\n"),
  };
}

async function deliverSubmitterConfirmation(form, data) {
  if (!resendConfigured()) return { sent: false, reason: "not_configured" };

  const copy = confirmationCopy(form, data);
  const html = renderSotsEmail({
    title: copy.title,
    preheader: copy.preheader,
    siteUrl: getSiteUrl(),
    bodyHtml: copy.bodyHtml,
    eyebrow: copy.eyebrow,
  });

  return sendEmail({
    from: getResendNotificationsFromAddress(),
    to: data.email,
    replyTo: DEFAULT_RECIPIENT,
    subject: copy.subject,
    html,
    text: copy.text,
  });
}

async function sendConfirmationBestEffort(form, data) {
  try {
    const result = await deliverSubmitterConfirmation(form, data);
    return {
      confirmationSent: Boolean(result?.sent),
      confirmationId: result?.id || null,
      confirmationReason: result?.reason || null,
    };
  } catch (err) {
    console.error("contact confirmation email failed:", err);
    return {
      confirmationSent: false,
      confirmationId: null,
      confirmationReason: String(err?.message || err).slice(0, 200),
    };
  }
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "POST, OPTIONS" });
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "POST, OPTIONS" });
  }

  const ip = getClientIp(event);
  if (!rateLimit(`contact:${ip}`, { max: 8, windowMs: 900_000 })) {
    return jsonResponse(429, { error: "Too many submissions. Please try again later." }, event, {
      methods: "POST, OPTIONS",
    });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid JSON" }, event, { methods: "POST, OPTIONS" });
  }

  const form = sanitize(body.form, 40);
  if (!FORMS.has(form)) {
    return jsonResponse(400, { error: "Unknown form" }, event, { methods: "POST, OPTIONS" });
  }

  const fields = body.fields && typeof body.fields === "object" ? body.fields : {};
  if (fields["bot-field"]) {
    return jsonResponse(200, { ok: true }, event, { methods: "POST, OPTIONS" });
  }

  const validation = validatePayload(form, fields);
  if (validation.error) {
    return jsonResponse(400, { error: validation.error }, event, { methods: "POST, OPTIONS" });
  }

  if (form === "newsletter") {
    const config = getConstantContactConfig();
    if (!config.configured) {
      await appendSubmission(event, form, {
        form,
        ...validation.data,
        ip,
        sync: "skipped",
        reason: "constant_contact_not_configured",
      });
      return jsonResponse(
        503,
        {
          error: "Newsletter signup is being set up. Please use the contact form for now.",
        },
        event,
        { methods: "POST, OPTIONS" },
      );
    }

    try {
      const { firstName, lastName } = splitName(validation.data.name);
      const result = await signUpContact(event, {
        email: validation.data.email,
        firstName,
        lastName,
      });
      const confirmation = await sendConfirmationBestEffort(form, validation.data);
      await appendSubmission(event, form, {
        form,
        ...validation.data,
        ip,
        sync: "constant_contact",
        contactId: result.contact_id || null,
        action: result.action || null,
        ...confirmation,
      });
      return jsonResponse(
        200,
        { ok: true, action: result.action || "subscribed", confirmationSent: confirmation.confirmationSent },
        event,
        {
          methods: "POST, OPTIONS",
        },
      );
    } catch (err) {
      await appendSubmission(event, form, {
        form,
        ...validation.data,
        ip,
        sync: "failed",
        error: String(err?.message || err).slice(0, 500),
      });
      return jsonResponse(
        502,
        {
          error: "We couldn’t complete your signup. Please try again in a moment.",
        },
        event,
        { methods: "POST, OPTIONS" },
      );
    }
  }

  if (!resendConfigured()) {
    await appendSubmission(event, form, {
      form,
      ...validation.data,
      ip,
      deliver: "skipped",
      reason: "resend_not_configured",
    });
    return jsonResponse(
      503,
      {
        error: "Messaging is being set up. Please call the box office at (203) 957-1006 for now.",
      },
      event,
      { methods: "POST, OPTIONS" },
    );
  }

  try {
    const delivery =
      form === "apprentice"
        ? await deliverApprenticeApplication(validation.data)
        : await deliverStaffMessage(form, validation.data);
    const confirmation = await sendConfirmationBestEffort(form, validation.data);
    await appendSubmission(event, form, {
      form,
      ...validation.data,
      // Don't persist resume binary in blobs long-term
      resume: validation.data.resume
        ? { filename: validation.data.resume.filename, contentType: validation.data.resume.contentType }
        : null,
      ip,
      deliver: "resend",
      recipient: form === "apprentice" ? APPRENTICE_RECIPIENT : resolveRecipient(validation.data),
      emailId: delivery.id || null,
      ...confirmation,
    });
    return jsonResponse(
      200,
      { ok: true, confirmationSent: confirmation.confirmationSent },
      event,
      { methods: "POST, OPTIONS" },
    );
  } catch (err) {
    await appendSubmission(event, form, {
      form,
      ...validation.data,
      ip,
      deliver: "failed",
      error: String(err?.message || err).slice(0, 500),
    });
    return jsonResponse(
      502,
      { error: "We couldn’t send your message. Please try again in a moment." },
      event,
      { methods: "POST, OPTIONS" },
    );
  }
}
