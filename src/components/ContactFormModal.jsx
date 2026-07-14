import { useEffect, useId, useRef, useState } from "react";
import { CONTACT_GENERAL, resolveContactRecipient } from "../../js/contact-recipients.js";
import { ArrowButton } from "./ArrowButton.jsx";

export function ContactFormModal({ open, onClose, target }) {
  const titleId = useId();
  const firstFieldRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const recipient = resolveContactRecipient(target?.to || CONTACT_GENERAL);
  const toLabel = target?.toLabel || recipient.label;
  const formType = target?.form || recipient.form;

  useEffect(() => {
    if (!open) return undefined;

    setStatus("idle");
    setError("");
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 40);

    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, target?.to]);

  if (!open) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === "loading") return;

    const formEl = event.currentTarget;
    const data = new FormData(formEl);
    const fields = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      message: String(data.get("message") || "").trim(),
      recipient: recipient.email,
      recipientLabel: toLabel,
      requestedRecipient: target?.requested || recipient.requested || "",
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      "bot-field": String(data.get("bot-field") || ""),
    };

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: formType, fields }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload.error || "Could not send your message.");
      }
      setStatus("success");
      formEl.reset();
    } catch (err) {
      setStatus("error");
      setError(err?.message || "Could not send your message. Please try again.");
    }
  }

  return (
    <div className="orpheum-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="orpheum-modal__backdrop" aria-label="Close" onClick={onClose} />
      <div className="orpheum-modal__panel orpheum-modal__panel--wide sots-contact-modal">
        <button type="button" className="orpheum-modal__close" aria-label="Close" onClick={onClose}>
          &times;
        </button>

        <h2 id={titleId}>Send a message</h2>
        <p className="sots-contact-modal__to">
          To: <strong>{toLabel}</strong>
        </p>

        {status === "success" ? (
          <div className="sots-contact-modal__success" role="status">
            <p>Thanks — your message is on its way. We&apos;ll get back to you soon.</p>
            <ArrowButton type="button" onClick={onClose}>
              Close
            </ArrowButton>
          </div>
        ) : (
          <form className="sots-contact-modal__form" onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              name="bot-field"
              tabIndex={-1}
              autoComplete="off"
              className="sots-contact-modal__honeypot"
              aria-hidden="true"
            />

            <label>
              Your name
              <input ref={firstFieldRef} name="name" type="text" required autoComplete="name" />
            </label>

            <label>
              Your email
              <input name="email" type="email" required autoComplete="email" />
            </label>

            <label>
              Phone <span className="sots-contact-modal__optional">(optional)</span>
              <input name="phone" type="tel" autoComplete="tel" />
            </label>

            <label>
              Message
              <textarea name="message" rows={5} required minLength={10} />
            </label>

            {error ? (
              <p className="sots-checkout__error" role="alert">
                {error}
              </p>
            ) : null}

            <div className="sots-contact-modal__actions">
              <ArrowButton type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Sending…" : "Send message"}
              </ArrowButton>
              <button type="button" className="sots-contact-modal__cancel" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
