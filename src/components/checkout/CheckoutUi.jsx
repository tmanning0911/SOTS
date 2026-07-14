import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { formatCents } from "../../../js/square-payments.js";

export function CheckoutMobileSummary({
  countLabel,
  totalCents,
  editHref,
  editLabel = "Edit order",
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={`sots-co__mobile-summary${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="sots-co__mobile-summary__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sots-co__mobile-summary__toggle-left">
          <span className="sots-co__mobile-summary__eyebrow">Order summary</span>
          <span className="sots-co__mobile-summary__count">{countLabel}</span>
        </span>
        <span className="sots-co__mobile-summary__toggle-right">
          <strong>{formatCents(totalCents)}</strong>
          <span className="sots-co__mobile-summary__chevron" aria-hidden="true">
            {open ? "▴" : "▾"}
          </span>
        </span>
      </button>
      <div id={panelId} className="sots-co__mobile-summary__panel" hidden={!open}>
        <div className="sots-co__mobile-summary__panel-inner">{children}</div>
        {editHref ? (
          <Link to={editHref} className="sots-co__mobile-summary__edit">
            ← {editLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function CheckoutAlert({ message, hint }) {
  if (!message) return null;
  return (
    <div className="sots-co__alert" role="alert">
      <span className="sots-co__alert-icon" aria-hidden="true">
        !
      </span>
      <div className="sots-co__alert-copy">
        <p className="sots-co__alert-message">{message}</p>
        {hint ? <p className="sots-co__alert-hint">{hint}</p> : null}
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function CheckoutPaymentPanel({
  cardContainerId,
  cardReady,
  loadingMessage = "Loading secure payment form…",
  readyHint = "Enter your card number, expiry, and security code below.",
  onRetry,
  showRetry,
}) {
  return (
    <div className="sots-co__payment-box">
      <div className="sots-co__payment-trust">
        <span className="sots-co__payment-lock">
          <LockIcon />
          Secured by Square
        </span>
        <div className="sots-co__card-icons" aria-label="Accepted cards">
          <span className="sots-co__card-icon">Visa</span>
          <span className="sots-co__card-icon">MC</span>
          <span className="sots-co__card-icon">Amex</span>
          <span className="sots-co__card-icon">Disc</span>
        </div>
      </div>
      {cardReady ? (
        <p className="sots-co__payment-hint">{readyHint}</p>
      ) : (
        <div className="sots-co__card-fallback">
          <p className="sots-co__loading">
            <span className="sots-co__loading-dot" aria-hidden="true" />
            {loadingMessage}
          </p>
          {showRetry && onRetry ? (
            <button type="button" className="sots-shop-btn sots-shop-btn--outline" onClick={onRetry}>
              Retry payment form
            </button>
          ) : null}
        </div>
      )}
      <div id={cardContainerId} className="sots-co__card-mount" />
    </div>
  );
}

export function CheckoutStickyPayBar({ formId, totalCents, payLabel, disabled, loading }) {
  return (
    <div className="sots-co__sticky-pay" aria-hidden={false}>
      <div className="sots-co__sticky-pay-inner">
        <div className="sots-co__sticky-pay-total">
          <span className="sots-co__sticky-pay-label">Total</span>
          <strong>{formatCents(totalCents)}</strong>
        </div>
        <button
          type="submit"
          form={formId}
          className="sots-co__sticky-pay-btn sots-shop-btn sots-shop-btn--pay"
          disabled={disabled}
        >
          {loading ? "Processing…" : payLabel}
        </button>
      </div>
    </div>
  );
}

export function CheckoutSectionHeader({ step, title, description, done = false, headingId }) {
  return (
    <header className="sots-co__section-head">
      <span className="sots-co__section-num" aria-hidden="true">
        {done ? "✓" : step}
      </span>
      <div>
        <h2 id={headingId} className="sots-co__section-title">
          {title}
        </h2>
        {description ? <p className="sots-co__section-desc">{description}</p> : null}
      </div>
    </header>
  );
}
