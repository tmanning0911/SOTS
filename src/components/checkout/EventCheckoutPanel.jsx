import { useId, useState } from "react";
import { ArrowButton } from "../ArrowButton.jsx";

/**
 * Shared event ticket/sponsor checkout panel.
 * Sticky on dedicated event pages; inline on event cards.
 */
export function EventCheckoutPanel({
  lines = [],
  totalQty,
  totalLabel,
  busy = false,
  error = "",
  onCheckout,
  sticky = true,
  requireBusiness = false,
  businessName = "",
  onBusinessName,
  note = "",
  onNote,
  notePlaceholder = "Accessibility needs, table mates, dietary notes…",
  noteHelper = "Optional — we’ll include this with your Square receipt note.",
  checkoutLabel = "Continue to payment",
  businessFieldId,
}) {
  const uid = useId();
  const bizId = businessFieldId || `event-biz-${uid}`;
  const noteId = `event-note-${uid}`;
  const [showNote, setShowNote] = useState(() => Boolean(note?.trim()));

  const rootClass = [
    "sots-event-co",
    sticky ? "sots-event-co--sticky" : "sots-event-co--inline",
    requireBusiness ? "sots-event-co--sponsor" : "",
    showNote ? "sots-event-co--note-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  function handlePay() {
    onCheckout?.();
  }

  return (
    <div className={rootClass} role="region" aria-label="Checkout">
      <div className="sots-event-co__inner">
        <div className="sots-event-co__summary">
          <p className="sots-event-co__eyebrow">Your order</p>
          {lines.length ? (
            <ul className="sots-event-co__lines">
              {lines.map((line) => (
                <li key={line.id || line.name}>
                  <span>
                    {line.name}
                    {line.quantity > 1 ? ` ×${line.quantity}` : ""}
                  </span>
                  {line.priceLabel ? <strong>{line.priceLabel}</strong> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="sots-event-co__count">
              {totalQty} item{totalQty === 1 ? "" : "s"}
            </p>
          )}
        </div>

        {requireBusiness ? (
          <label className="sots-event-co__field" id={bizId}>
            <span>
              Business / organization <em>*</em>
            </span>
            <input
              type="text"
              name="businessName"
              autoComplete="organization"
              enterKeyHint="next"
              maxLength={100}
              value={businessName}
              onChange={(e) => onBusinessName?.(e.target.value)}
              placeholder="Name as you’d like it listed"
              aria-required="true"
            />
            <span className="sots-event-co__hint">Required for sponsorship recognition.</span>
          </label>
        ) : null}

        <div className="sots-event-co__comments">
          {showNote ? (
            <label className="sots-event-co__field" htmlFor={noteId}>
              <span className="sots-event-co__comments-head">
                <span>Order comments</span>
                <button
                  type="button"
                  className="sots-event-co__link-btn"
                  onClick={() => {
                    setShowNote(false);
                    onNote?.("");
                  }}
                >
                  Remove
                </button>
              </span>
              <textarea
                id={noteId}
                name="note"
                rows={3}
                maxLength={400}
                value={note}
                onChange={(e) => onNote?.(e.target.value)}
                placeholder={notePlaceholder}
              />
              <span className="sots-event-co__hint">{noteHelper}</span>
            </label>
          ) : (
            <button
              type="button"
              className="sots-event-co__add-note"
              onClick={() => setShowNote(true)}
            >
              + Add a comment <span>(optional)</span>
            </button>
          )}
        </div>

        <div className="sots-event-co__pay">
          <p className="sots-event-co__total">
            <span>
              {totalQty} item{totalQty === 1 ? "" : "s"}
            </span>
            <strong>{totalLabel}</strong>
          </p>
          <ArrowButton type="button" onClick={handlePay} disabled={busy || totalQty < 1}>
            {busy ? "Starting…" : checkoutLabel}
          </ArrowButton>
        </div>

        {error ? (
          <p className="sots-event-co__error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
