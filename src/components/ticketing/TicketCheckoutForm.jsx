import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { readStoredBuyer, writeStoredBuyer } from "../../../js/buyer-storage.js";
import {
  completeCheckout,
  formatCents,
  initSquareCard,
  prepareCheckout,
  validatePromoCode,
} from "../../../js/square-payments.js";
import {
  formatPerformanceDate,
  patronDisplayName,
  sortTicketTypesForDisplay,
  ticketTypeHint,
} from "../../../js/ticketing.js";
import { usePatron } from "../../context/PatronContext.jsx";
import { CheckoutProgress } from "./CheckoutProgress.jsx";
import { HoldTimer } from "./HoldTimer.jsx";
import { TicketQr } from "./TicketQr.jsx";
import { useCheckoutStep } from "../../hooks/useCheckoutStep.js";

const CARD_CONTAINER_ID = "sots-square-card-container";
const DONATION_PRESETS = [0, 500, 1000, 2500, 5000];

function defaultQuantities(ticketTypes) {
  const ga =
    ticketTypes.find((t) => t.slug === "general-admission") ??
    ticketTypes.find((t) => /general admission/i.test(t.name ?? "") && !/child|kid|vip/i.test(t.name ?? ""));
  return ga ? { [ga.id]: 1 } : {};
}

function CheckoutSection({ step, progressStep, title, description, children, className = "" }) {
  const stepKey = progressStep ?? ({ 1: "tickets", 2: "details", 3: "pay" }[step] ?? "tickets");
  return (
    <section
      className={`sots-checkout-section ${className}`.trim()}
      data-checkout-step={stepKey}
      id={`checkout-section-${stepKey}`}
      aria-labelledby={`checkout-${step}-heading`}
    >
      <header className="sots-checkout-section__head">
        <span className="sots-checkout-section__step" aria-hidden="true">
          {step}
        </span>
        <div>
          <h2 id={`checkout-${step}-heading`} className="sots-checkout-section__title">
            {title}
          </h2>
          {description ? <p className="sots-checkout-section__desc">{description}</p> : null}
        </div>
      </header>
      <div className="sots-checkout-section__body">{children}</div>
    </section>
  );
}

function TicketRow({ ticketType, quantity, max, onChange, highlight }) {
  const hint = ticketTypeHint(ticketType);
  const soldOut = max <= 0;
  const lowStock = !soldOut && max <= 5;

  return (
    <article
      className={`sots-checkout-ticket${highlight ? " is-featured" : ""}${quantity > 0 ? " is-selected" : ""}${soldOut ? " is-sold-out" : ""}`}
    >
      <div className="sots-checkout-ticket__main">
        <div className="sots-checkout-ticket__head">
          <strong>{patronDisplayName(ticketType.name)}</strong>
          {soldOut ? <span className="sots-checkout-ticket__badge sots-checkout-ticket__badge--sold-out">Sold out</span> : null}
          {!soldOut && highlight ? <span className="sots-checkout-ticket__badge">Most popular</span> : null}
        </div>
        {hint ? <p className="sots-checkout-ticket__hint">{hint}</p> : null}
        {lowStock ? <p className="sots-checkout-ticket__scarcity">Only {max} left</p> : null}
        <p className="sots-checkout-ticket__price">{ticketType.price?.display}</p>
      </div>
      {soldOut ? null : (
        <div className="sots-checkout-ticket__qty" aria-label={`Quantity for ${ticketType.name}`}>
          <button
            type="button"
            className="sots-checkout-ticket__qty-btn"
            onClick={() => onChange(Math.max(0, quantity - 1))}
            disabled={quantity <= 0}
            aria-label={`Decrease ${ticketType.name}`}
          >
            −
          </button>
          <span className="sots-checkout-ticket__qty-value" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className="sots-checkout-ticket__qty-btn"
            onClick={() => onChange(Math.min(max, quantity + 1))}
            disabled={quantity >= max}
            aria-label={`Increase ${ticketType.name}`}
          >
            +
          </button>
        </div>
      )}
    </article>
  );
}

function OrderSummary({
  performance,
  showTitle,
  showImage,
  selectedItems,
  ticketTypes,
  donationCents,
  discountCents,
  totalCents,
  compact = false,
  promoLabel,
}) {
  const ticketCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`sots-checkout-page__summary-card${compact ? " is-compact" : ""}`}>
      {!compact && showImage ? (
        <img src={showImage} alt="" className="sots-checkout-page__summary-poster" loading="lazy" />
      ) : null}
      <div className="sots-checkout-page__summary-copy">
        {!compact ? <p className="sots-checkout-page__summary-eyebrow">Order summary</p> : null}
        {showTitle && !compact ? <p className="sots-checkout-page__summary-show">{showTitle}</p> : null}
        {performance ? (
          <p className="sots-checkout-page__summary-date">{formatPerformanceDate(performance.start)}</p>
        ) : null}
        {performance?.venue ? <p className="sots-checkout-page__summary-venue">{performance.venue}</p> : null}
      </div>
      <ul className="sots-checkout-page__summary-lines">
        {selectedItems.length ? (
          selectedItems.map((item) => {
            const tt = ticketTypes.find((t) => t.id === item.ticketTypeId);
            return (
              <li key={item.ticketTypeId}>
                <span>
                  {item.quantity}× {patronDisplayName(tt?.name)}
                </span>
                <span>{formatCents((tt?.price?.value ?? 0) * item.quantity)}</span>
              </li>
            );
          })
        ) : (
          <li className="sots-checkout-page__summary-empty">Select tickets to continue</li>
        )}
      </ul>
      {donationCents ? (
        <p className="sots-checkout-page__summary-line">
          <span>Donation</span>
          <span>{formatCents(donationCents)}</span>
        </p>
      ) : null}
      {discountCents ? (
        <p className="sots-checkout-page__summary-line is-discount">
          <span>{promoLabel ?? "Promo discount"}</span>
          <span>−{formatCents(discountCents)}</span>
        </p>
      ) : null}
      <p className="sots-checkout-page__summary-total">
        <span>
          Total
          {ticketCount ? ` · ${ticketCount} ticket${ticketCount === 1 ? "" : "s"}` : ""}
        </span>
        <strong>{formatCents(totalCents)}</strong>
      </p>
      {!compact ? (
        <p className="sots-checkout-page__summary-trust">Secure checkout · Instant email confirmation</p>
      ) : null}
    </div>
  );
}

function ConfirmationView({ order, emailSent, showTitle }) {
  return (
    <div className="sots-checkout__confirmation sots-checkout__confirmation--page">
      <div className="sots-checkout__success-badge" aria-hidden="true">
        ✓
      </div>
      <p className="sots-checkout__confirmation-eyebrow">You&apos;re going to the show</p>
      <h2 className="sots-checkout__confirmation-title">{showTitle ?? formatPerformanceDate(order.performanceStart)}</h2>
      <p className="sots-checkout__confirmation-date">{formatPerformanceDate(order.performanceStart)}</p>
      <p className="sots-checkout__confirm-code">
        Confirmation <strong>{order.confirmationCode}</strong>
      </p>
      {emailSent ? (
        <p className="sots-checkout__hint sots-checkout__hint--success">
          Tickets sent to <strong>{order.buyer?.email}</strong>. Check your inbox (and spam folder).
        </p>
      ) : (
        <p className="sots-checkout__hint">
          Save your confirmation code or open <Link to="/my-tickets/">My Tickets</Link>.
        </p>
      )}
      <ul className="sots-checkout__ticket-list">
        {order.tickets.map((ticket) => (
          <li key={ticket.code}>
            <div className="sots-checkout__ticket-item">
              <div>
                <strong>{patronDisplayName(ticket.ticketTypeName)}</strong>
                <span>#{ticket.code}</span>
              </div>
              <TicketQr orderId={order.id} ticketCode={ticket.code} />
            </div>
          </li>
        ))}
      </ul>
      <div className="sots-checkout__next-steps">
        <h3>At the park</h3>
        <ol>
          <li>Show your QR code at the gate.</li>
          <li>Arrive early — seating is first come.</li>
          <li>Bring a blanket or low-back chair for general admission.</li>
        </ol>
      </div>
      {order.donationCents ? (
        <p className="sots-checkout__hint">Includes a {formatCents(order.donationCents)} donation. Thank you.</p>
      ) : null}
      <p className="sots-checkout__total sots-checkout__total--confirm">Total paid: {formatCents(order.totalCents)}</p>
      <div className="sots-checkout__confirm-actions">
        <Link to="/my-tickets/" className="orpheum-arrow-btn orpheum-arrow-btn--gold">
          View My Tickets
        </Link>
        <Link to="/tickets/" className="orpheum-arrow-btn orpheum-arrow-btn--ghost">
          Buy more tickets
        </Link>
      </div>
    </div>
  );
}

export function TicketCheckoutForm({
  data,
  performanceId,
  showImage,
  showTitle,
  changeDateHref = "/tickets/",
}) {
  const cardRef = useRef(null);
  const patron = usePatron();
  const patronUser = patron?.user;
  const storedBuyer = useMemo(() => readStoredBuyer(), []);

  const [name, setName] = useState(storedBuyer.name);
  const [email, setEmail] = useState(patronUser?.email || storedBuyer.email);
  const [quantities, setQuantities] = useState({});
  const [promoCode, setPromoCode] = useState("");
  const [promoPreview, setPromoPreview] = useState(null);
  const [promoMessage, setPromoMessage] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [donationCents, setDonationCents] = useState(0);
  const [showDonation, setShowDonation] = useState(false);
  const [hold, setHold] = useState(null);
  const [order, setOrder] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const formLayoutRef = useRef(null);
  const checkoutStep = useCheckoutStep(formLayoutRef);

  const clearPromoPreview = useCallback(() => {
    setPromoPreview(null);
    setPromoMessage("");
  }, []);

  const handleHoldExpired = useCallback(() => {
    setHold(null);
    setError("Your ticket hold expired. Review your order and pay again.");
  }, []);

  const performance = useMemo(
    () => data?.performances?.find((p) => p.id === performanceId) ?? null,
    [data, performanceId],
  );

  const ticketTypes = useMemo(
    () =>
      sortTicketTypesForDisplay(
        (data?.ticketTypes ?? data?.ticketClasses ?? []).filter((t) => t.price?.value > 0),
      ),
    [data],
  );

  const gaTicketId = useMemo(() => {
    const ga =
      ticketTypes.find((t) => t.slug === "general-admission") ??
      ticketTypes.find((t) => /general admission/i.test(t.name ?? "") && !/child|kid|vip/i.test(t.name ?? ""));
    return ga?.id ?? null;
  }, [ticketTypes]);

  const selectedItems = useMemo(
    () =>
      ticketTypes
        .map((t) => ({ ticketTypeId: t.id, quantity: quantities[t.id] ?? 0 }))
        .filter((item) => item.quantity > 0),
    [ticketTypes, quantities],
  );

  const ticketSubtotal = useMemo(
    () =>
      selectedItems.reduce((sum, item) => {
        const tt = ticketTypes.find((t) => t.id === item.ticketTypeId);
        return sum + (tt?.price?.value ?? 0) * item.quantity;
      }, 0),
    [selectedItems, ticketTypes],
  );

  const ticketCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const discountCents = hold?.discountCents ?? promoPreview?.discountCents ?? 0;
  const estimatedTotal = hold?.totalCents ?? Math.max(100, ticketSubtotal + donationCents - discountCents);

  useEffect(() => {
    if (patronUser?.email) setEmail(patronUser.email);
  }, [patronUser?.email]);

  useEffect(() => {
    setQuantities(defaultQuantities(ticketTypes));
    setName(storedBuyer.name);
    setEmail(patronUser?.email || storedBuyer.email);
    setHold(null);
    setOrder(null);
    setEmailSent(false);
    setError("");
    setLoading(false);
    setCardReady(false);
    setPaymentError(false);
    setPromoCode("");
    setPromoPreview(null);
    setPromoMessage("");
    setPromoLoading(false);
    setShowPromo(false);
    setDonationCents(0);
    setShowDonation(false);
    cardRef.current?.destroy?.();
    cardRef.current = null;
  }, [performanceId, ticketTypes, storedBuyer.name, storedBuyer.email, patronUser?.email]);

  useEffect(() => {
    let cancelled = false;
    initSquareCard(CARD_CONTAINER_ID)
      .then(({ card }) => {
        if (cancelled) return;
        cardRef.current = card;
        setCardReady(true);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load payment form");
      });

    return () => {
      cancelled = true;
      cardRef.current?.destroy?.();
      cardRef.current = null;
      setCardReady(false);
    };
  }, [performanceId]);

  async function handleApplyPromo() {
    setError("");
    setPromoMessage("");
    if (!selectedItems.length) {
      setPromoMessage("Select tickets before applying a code.");
      return;
    }
    if (!promoCode.trim()) {
      setPromoMessage("Enter a promo code.");
      return;
    }
    setPromoLoading(true);
    try {
      const result = await validatePromoCode({
        promoCode: promoCode.trim(),
        subtotalCents: ticketSubtotal,
      });
      setPromoPreview(result);
      setHold(null);
      setPromoMessage(result.description ? `${result.description} applied.` : "Promo code applied.");
    } catch (err) {
      clearPromoPreview();
      setPromoMessage(err.message || "Promo code is not valid");
    } finally {
      setPromoLoading(false);
    }
  }

  async function ensureHold() {
    if (hold) return hold;
    const prepared = await prepareCheckout({
      performanceId,
      items: selectedItems,
      buyer: { name, email },
      promoCode: promoCode.trim() || undefined,
      donationCents,
    });
    setHold(prepared);
    return prepared;
  }

  async function handlePay(e) {
    e.preventDefault();
    setError("");
    setPaymentError(false);

    if (!selectedItems.length) {
      setError("Choose at least one ticket.");
      return;
    }
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    if (!cardRef.current) {
      setError("Payment form is not ready yet.");
      return;
    }

    writeStoredBuyer({ name, email });
    setLoading(true);
    try {
      const prepared = await ensureHold();
      const tokenResult = await cardRef.current.tokenize();
      if (tokenResult.status !== "OK") {
        throw new Error(tokenResult.errors?.[0]?.message || "Card could not be verified");
      }

      const { order: completedOrder, emailSent: sent } = await completeCheckout({
        holdId: prepared.holdId,
        sourceId: tokenResult.token,
      });
      setOrder(completedOrder);
      setEmailSent(sent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setPaymentError(true);
      setError(err.message || "Payment failed. Check your card and try again.");
      if (String(err.message).toLowerCase().includes("hold")) {
        setHold(null);
      }
    } finally {
      setLoading(false);
    }
  }

  if (order) {
    return <ConfirmationView order={order} emailSent={emailSent} showTitle={showTitle} />;
  }

  return (
    <>
      <div className="sots-checkout-page__progress-wrap sots-checkout-page__progress-wrap--inline">
        <CheckoutProgress current={checkoutStep} />
      </div>
      <div ref={formLayoutRef} className="sots-checkout-page__layout sots-checkout-page__layout--form">
      <aside className="sots-checkout-page__summary-pane" aria-label="Order summary">
        <OrderSummary
          performance={performance}
          showTitle={showTitle}
          showImage={showImage}
          selectedItems={selectedItems}
          ticketTypes={ticketTypes}
          donationCents={donationCents}
          discountCents={discountCents}
          promoLabel={promoPreview?.description ?? hold?.promoCode ?? undefined}
          totalCents={estimatedTotal}
        />
        <Link to={changeDateHref} className="sots-checkout-page__change-date">
          ← Choose a different date
        </Link>
      </aside>

      <div className="sots-checkout-page__form-pane">
        <div className="sots-checkout-page__mobile-summary" aria-label="Order total">
          <OrderSummary
            performance={performance}
            showTitle={showTitle}
            selectedItems={selectedItems}
            ticketTypes={ticketTypes}
            donationCents={donationCents}
            discountCents={discountCents}
            promoLabel={promoPreview?.description ?? hold?.promoCode ?? undefined}
            totalCents={estimatedTotal}
            compact
          />
        </div>

        <HoldTimer expiresAt={hold?.expiresAt} onExpired={handleHoldExpired} />

        <form id="sots-ticket-checkout" className="sots-checkout__form" onSubmit={handlePay}>
          <CheckoutSection step="1" title="Choose your tickets" description="All prices include fees. Kids 12 and under need a child ticket.">
            <div className="sots-checkout-ticket-list">
              {ticketTypes.map((tt) => {
                const max = performance?.ticketAvailability?.[tt.id] ?? tt.capacity ?? 10;
                return (
                  <TicketRow
                    key={tt.id}
                    ticketType={tt}
                    quantity={quantities[tt.id] ?? 0}
                    max={max}
                    highlight={tt.id === gaTicketId}
                    onChange={(qty) => {
                      setQuantities((prev) => ({ ...prev, [tt.id]: qty }));
                      setHold(null);
                      clearPromoPreview();
                    }}
                  />
                );
              })}
            </div>
          </CheckoutSection>

          <div className="sots-checkout__optional">
            <button
              type="button"
              className="sots-checkout__optional-toggle"
              aria-expanded={showPromo}
              onClick={() => setShowPromo((v) => !v)}
            >
              {showPromo ? "Hide promo code" : "Have a promo code?"}
            </button>
            {showPromo ? (
              <div className="sots-checkout__promo">
                <label className="sots-checkout__optional-field">
                  Promo code
                  <div className="sots-checkout__promo-row">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        setHold(null);
                        clearPromoPreview();
                      }}
                      placeholder="Enter code"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      className="orpheum-arrow-btn orpheum-arrow-btn--ghost sots-checkout__promo-apply"
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !selectedItems.length}
                    >
                      {promoLoading ? "Checking…" : "Apply"}
                    </button>
                  </div>
                </label>
                {promoMessage ? (
                  <p className={`sots-checkout__promo-message${promoPreview ? " is-success" : ""}`}>{promoMessage}</p>
                ) : null}
              </div>
            ) : null}

            <button
              type="button"
              className="sots-checkout__optional-toggle"
              aria-expanded={showDonation}
              onClick={() => setShowDonation((v) => !v)}
            >
              {showDonation ? "Hide donation" : "Add a tax-deductible donation?"}
            </button>
            {showDonation ? (
              <fieldset className="sots-checkout__donation">
                <legend className="visually-hidden">Donation amount</legend>
                <p className="sots-checkout__donation-note">Support free Shakespeare in the park for everyone.</p>
                <div className="sots-checkout__donation-options">
                  {DONATION_PRESETS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className={`sots-checkout__donation-btn${donationCents === amount ? " is-selected" : ""}`}
                      onClick={() => {
                        setDonationCents(amount);
                        setHold(null);
                      }}
                    >
                      {amount === 0 ? "None" : formatCents(amount)}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </div>

          <CheckoutSection step="2" title="Your information" description="We'll email your tickets and QR codes here.">
            {patronUser?.email ? (
              <p className="sots-checkout__signed-in">
                Signed in as <strong>{patronUser.email}</strong> ·{" "}
                <Link to="/my-tickets/">My Tickets</Link>
              </p>
            ) : null}
            <div className="sots-checkout__field-grid">
              <label className="sots-checkout__field">
                <span>Full name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                />
              </label>
              <label className="sots-checkout__field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
            </div>
          </CheckoutSection>

          <CheckoutSection step="3" title="Payment" description="All major cards accepted. Charged securely by Square.">
            <div className="sots-checkout__card">
              <div id={CARD_CONTAINER_ID} className="sots-checkout__card-container" />
              {!cardReady ? (
                <p className="sots-checkout__loading">
                  <span className="sots-checkout__loading-dot" aria-hidden="true" />
                  Loading secure payment form…
                </p>
              ) : null}
            </div>
          </CheckoutSection>

          <div className="sots-checkout__next-steps sots-checkout__next-steps--inline">
            <h3>What happens next</h3>
            <ol>
              <li>Tickets arrive in your inbox within minutes.</li>
              <li>QR codes are saved in My Tickets for easy access.</li>
              <li>Show your QR at the gate in Pinkney Park.</li>
            </ol>
          </div>

          <p className="sots-checkout__terms">
            By paying you agree to our{" "}
            <Link to="/about/faq/">ticket policies</Link> (all sales final except weather cancellations).
          </p>

          {error ? (
            <div className="sots-checkout__error-panel" role="alert">
              <p className="sots-checkout__error">{error}</p>
              {paymentError ? (
                <p className="sots-checkout__hint">
                  {hold?.expiresAt
                    ? "Your tickets are still held — please try again before the timer runs out."
                    : "Please check your card details and try again."}
                </p>
              ) : null}
            </div>
          ) : null}
        </form>
      </div>

      <div className="sots-checkout-page__paybar">
        <div className="sots-checkout-page__paybar-copy">
          <p className="sots-checkout__total">
            {ticketCount ? (
              <>
                {ticketCount} ticket{ticketCount === 1 ? "" : "s"} · <strong>{formatCents(estimatedTotal)}</strong>
              </>
            ) : (
              <>
                Total <strong>{formatCents(estimatedTotal)}</strong>
              </>
            )}
          </p>
          <p className="sots-checkout-page__paybar-note">Taxes and fees included</p>
        </div>
        <button
          type="submit"
          form="sots-ticket-checkout"
          className="orpheum-arrow-btn orpheum-arrow-btn--gold sots-checkout__submit"
          disabled={loading || !cardReady || !selectedItems.length}
        >
          {loading ? "Processing…" : ticketCount ? `Pay ${formatCents(estimatedTotal)}` : "Select tickets"}
        </button>
      </div>
    </div>
    </>
  );
}
