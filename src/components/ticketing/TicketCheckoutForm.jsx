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

const CARD_CONTAINER_ID = "sots-co-card-mount";
const DONATION_PRESETS = [0, 500, 1000, 2500, 5000];

function defaultQuantities(ticketTypes) {
  const ga =
    ticketTypes.find((t) => t.slug === "general-admission") ??
    ticketTypes.find((t) => /general admission/i.test(t.name ?? "") && !/child|kid|vip/i.test(t.name ?? ""));
  return ga ? { [ga.id]: 1 } : {};
}

function TicketRow({ ticketType, quantity, max, onChange, highlight }) {
  const hint = ticketTypeHint(ticketType);
  const soldOut = max <= 0;
  const lowStock = !soldOut && max <= 5;

  return (
    <article
      className={`sots-co__ticket${highlight ? " is-featured" : ""}${quantity > 0 ? " is-selected" : ""}${soldOut ? " is-sold-out" : ""}`}
    >
      <div>
        <div className="sots-co__ticket-head">
          <strong>{patronDisplayName(ticketType.name)}</strong>
          {soldOut ? <span className="sots-co__ticket-badge sots-co__ticket-badge--sold-out">Sold out</span> : null}
          {!soldOut && highlight ? <span className="sots-co__ticket-badge">Most popular</span> : null}
        </div>
        {hint ? <p className="sots-co__ticket-hint">{hint}</p> : null}
        {lowStock ? <p className="sots-co__ticket-scarcity">Only {max} left</p> : null}
        <p className="sots-co__ticket-price">{ticketType.price?.display}</p>
      </div>
      {soldOut ? null : (
        <div className="sots-co__qty" aria-label={`Quantity for ${ticketType.name}`}>
          <button
            type="button"
            className="sots-co__qty-btn"
            onClick={() => onChange(Math.max(0, quantity - 1))}
            disabled={quantity <= 0}
            aria-label={`Decrease ${ticketType.name}`}
          >
            −
          </button>
          <span className="sots-co__qty-value" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className="sots-co__qty-btn"
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

  if (compact) {
    return (
      <div className="sots-co__mobile-total">
        <div className="sots-co__mobile-total-row">
          <span>
            {ticketCount ? `${ticketCount} ticket${ticketCount === 1 ? "" : "s"}` : "Order total"}
          </span>
          <strong>{ticketCount ? formatCents(totalCents) : "—"}</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="sots-co__aside-card">
      {showImage ? <img src={showImage} alt="" className="sots-co__aside-poster" loading="lazy" /> : null}
      <div className="sots-co__aside-body">
        <p className="sots-co__aside-label">Order summary</p>
        {showTitle ? <p className="sots-co__aside-show">{showTitle}</p> : null}
        {performance ? <p className="sots-co__aside-date">{formatPerformanceDate(performance.start)}</p> : null}
        {performance?.venue ? <p className="sots-co__aside-venue">{performance.venue}</p> : null}
      </div>
      <ul className="sots-co__lines">
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
          <li className="sots-co__lines-empty">Select tickets below</li>
        )}
      </ul>
      {donationCents ? (
        <p className="sots-co__line-row">
          <span>Donation</span>
          <span>{formatCents(donationCents)}</span>
        </p>
      ) : null}
      {discountCents ? (
        <p className="sots-co__line-row is-discount">
          <span>{promoLabel ?? "Promo discount"}</span>
          <span>−{formatCents(discountCents)}</span>
        </p>
      ) : null}
      <p className="sots-co__total">
        <span>Total{ticketCount ? ` · ${ticketCount} ticket${ticketCount === 1 ? "" : "s"}` : ""}</span>
        <strong>{formatCents(totalCents)}</strong>
      </p>
      <p className="sots-co__trust">Secure checkout · Instant email confirmation</p>
    </div>
  );
}

function ConfirmationView({ order, emailSent, showTitle }) {
  return (
    <div className="sots-co__confirm sots-checkout__confirmation sots-checkout__confirmation--page">
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
  const [cardMountKey, setCardMountKey] = useState(0);

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

  const discountCents = hold?.discountCents ?? promoPreview?.discountCents ?? 0;
  const estimatedTotal = selectedItems.length
    ? (hold?.totalCents ?? Math.max(100, ticketSubtotal + donationCents - discountCents))
    : 0;

  const scrollToCheckoutStep = useCallback((stepId) => {
    const targets = {
      tickets: "co-section-tickets",
      details: "co-section-details",
      pay: "co-section-payment",
    };
    document.getElementById(targets[stepId])?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const checkoutStep = useMemo(() => {
    if (!selectedItems.length) return "tickets";
    if (!name.trim() || !email.trim()) return "details";
    return "pay";
  }, [selectedItems.length, name, email]);

  const ticketsDone = selectedItems.length > 0;
  const detailsDone = Boolean(name.trim() && email.trim());

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
    setCardMountKey((key) => key + 1);
  }, [performanceId, storedBuyer.name, storedBuyer.email, patronUser?.email, ticketTypes]);

  useEffect(() => {
    let cancelled = false;

    async function mountCard() {
      setCardReady(false);
      setPaymentError(false);

      for (let attempt = 0; attempt < 40; attempt += 1) {
        if (cancelled) return;
        if (document.getElementById(CARD_CONTAINER_ID)) break;
        await new Promise((resolve) => window.setTimeout(resolve, 50));
      }
      if (cancelled || !document.getElementById(CARD_CONTAINER_ID)) {
        if (!cancelled) setError("Could not load payment form. Refresh and try again.");
        return;
      }

      try {
        const { card } = await initSquareCard(CARD_CONTAINER_ID);
        if (cancelled) {
          card.destroy?.();
          return;
        }
        cardRef.current = card;
        setCardReady(true);
        setError((prev) => (prev === "Could not load payment form. Refresh and try again." ? "" : prev));
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load payment form");
      }
    }

    mountCard();
    return () => {
      cancelled = true;
      cardRef.current?.destroy?.();
      cardRef.current = null;
    };
  }, [performanceId, cardMountKey]);

  function retryCardMount() {
    setError("");
    cardRef.current?.destroy?.();
    cardRef.current = null;
    setCardMountKey((key) => key + 1);
  }

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
      document.getElementById("co-section-tickets")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      document.getElementById("co-section-details")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!cardRef.current) {
      setError("Payment form is not ready yet.");
      document.getElementById("co-section-payment")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      <div className="sots-co__progress-wrap">
        <CheckoutProgress current={checkoutStep} onStepSelect={scrollToCheckoutStep} />
      </div>

      <div className="sots-co__body">
        <div className="sots-co__grid">
          <aside className="sots-co__aside" aria-label="Order summary">
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
            <Link to={changeDateHref} className="sots-co__change-date">
              ← Choose a different date
            </Link>
          </aside>

          <div className="sots-co__main">
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
            <Link to={changeDateHref} className="sots-co__change-date sots-co__change-date--mobile">
              ← Choose a different date
            </Link>

            {error ? (
              <div className="sots-co__alert" role="alert">
                {error}
                {paymentError ? (
                  <p style={{ margin: "0.35rem 0 0", fontSize: "0.86rem" }}>
                    {hold?.expiresAt
                      ? "Your tickets are still held — please try again before the timer runs out."
                      : "Please check your card details and try again."}
                  </p>
                ) : null}
              </div>
            ) : null}

            <form id="sots-ticket-checkout" className="sots-co__form" onSubmit={handlePay}>
              <section
                id="co-section-tickets"
                className={`sots-co__section${ticketsDone ? " sots-co__section--done" : ""}`}
                aria-labelledby="co-tickets-heading"
              >
                <header className="sots-co__section-head">
                  <span className="sots-co__section-num" aria-hidden="true">
                    {ticketsDone ? "✓" : "1"}
                  </span>
                  <div>
                    <h2 id="co-tickets-heading" className="sots-co__section-title">
                      Choose your tickets
                    </h2>
                    <p className="sots-co__section-desc">All prices include fees. Kids 12 and under need a child ticket.</p>
                  </div>
                </header>
                <div className="sots-co__section-body">
                  <div className="sots-co__tickets">
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

                  <div className="sots-co__extras">
                    <button
                      type="button"
                      className="sots-co__extras-toggle"
                      aria-expanded={showPromo}
                      onClick={() => setShowPromo((v) => !v)}
                    >
                      {showPromo ? "Hide promo code" : "Have a promo code?"}
                    </button>
                    {showPromo ? (
                      <div className="sots-co__extras-panel">
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
                      className="sots-co__extras-toggle"
                      aria-expanded={showDonation}
                      onClick={() => setShowDonation((v) => !v)}
                    >
                      {showDonation ? "Hide donation" : "Add a donation?"}
                    </button>
                    {showDonation ? (
                      <div className="sots-co__extras-panel">
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
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>

              <section
                id="co-section-details"
                className={`sots-co__section${detailsDone ? " sots-co__section--done" : ""}`}
                aria-labelledby="co-details-heading"
              >
                <header className="sots-co__section-head">
                  <span className="sots-co__section-num" aria-hidden="true">
                    {detailsDone ? "✓" : "2"}
                  </span>
                  <div>
                    <h2 id="co-details-heading" className="sots-co__section-title">
                      Your information
                    </h2>
                    <p className="sots-co__section-desc">We&apos;ll email your tickets and QR codes here.</p>
                  </div>
                </header>
                <div className="sots-co__section-body">
                  {patronUser?.email ? (
                    <p className="sots-co__signed-in">
                      Signed in as <strong>{patronUser.email}</strong> ·{" "}
                      <Link to="/my-tickets/">My Tickets</Link>
                    </p>
                  ) : null}
                  <div className="sots-co__fields">
                    <label className="sots-co__field">
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
                    <label className="sots-co__field">
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
                </div>
              </section>

              <section
                id="co-section-payment"
                className="sots-co__section sots-co__section--payment"
                aria-labelledby="co-payment-heading"
              >
                <header className="sots-co__section-head">
                  <span className="sots-co__section-num" aria-hidden="true">
                    3
                  </span>
                  <div>
                    <h2 id="co-payment-heading" className="sots-co__section-title">
                      Payment
                    </h2>
                    <p className="sots-co__section-desc">All major cards accepted. Charged securely by Square.</p>
                  </div>
                </header>

                {hold?.expiresAt ? (
                  <HoldTimer expiresAt={hold.expiresAt} onExpired={handleHoldExpired} className="sots-co__hold" />
                ) : null}

                <div className="sots-co__section-body">
                  <div className="sots-co__payment-box">
                    <div className="sots-co__payment-trust">
                      <span className="sots-co__payment-lock" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="5" y="11" width="14" height="10" rx="2" />
                          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                        </svg>
                        Secure payment
                      </span>
                      <span className="sots-co__card-brands">Visa · Mastercard · Amex · Discover</span>
                    </div>
                    {cardReady ? (
                      <p className="sots-checkout__payment-hint" style={{ margin: 0, fontSize: "0.86rem", color: "#4a5560" }}>
                        Click below and type your card number, expiry, and CVV.
                      </p>
                    ) : (
                      <div className="sots-co__card-fallback">
                        <p className="sots-co__loading">
                          <span className="sots-co__loading-dot" aria-hidden="true" />
                          Loading secure payment form…
                        </p>
                        {error && !cardReady ? (
                          <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--ghost" onClick={retryCardMount}>
                            Retry payment form
                          </button>
                        ) : null}
                      </div>
                    )}
                    <div id={CARD_CONTAINER_ID} className="sots-co__card-mount" />
                  </div>

                  <p className="sots-co__terms">
                    By paying you agree to our <Link to="/about/faq/">ticket policies</Link> (all sales final except
                    weather cancellations).
                  </p>

                  <div className="sots-co__pay-row">
                    <p className="sots-co__pay-note">Taxes and fees included · Tickets emailed instantly</p>
                    <button
                      type="submit"
                      className="orpheum-arrow-btn orpheum-arrow-btn--gold sots-co__submit"
                      disabled={loading || !cardReady || !selectedItems.length || !name.trim() || !email.trim()}
                    >
                      {loading
                        ? "Processing…"
                        : selectedItems.length
                          ? `Pay ${formatCents(estimatedTotal)}`
                          : "Choose tickets to continue"}
                    </button>
                  </div>
                </div>
              </section>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
