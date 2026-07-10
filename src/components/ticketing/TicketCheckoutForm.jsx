import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { readStoredBuyer, writeStoredBuyer } from "../../../js/buyer-storage.js";
import {
  completeCheckout,
  formatCents,
  initSquareCard,
  prepareCheckout,
} from "../../../js/square-payments.js";
import { formatPerformanceDate } from "../../../js/ticketing.js";
import { usePatron } from "../../context/PatronContext.jsx";
import { TicketQr } from "./TicketQr.jsx";

const CARD_CONTAINER_ID = "sots-square-card-container";
const DONATION_PRESETS = [0, 500, 1000, 2500, 5000];
const STEPS = ["Tickets", "Pay"];

function defaultQuantities(ticketTypes) {
  const ga =
    ticketTypes.find((t) => t.slug === "general-admission") ??
    ticketTypes.find((t) => /general admission/i.test(t.name ?? ""));
  return ga ? { [ga.id]: 1 } : {};
}

function StepIndicator({ step }) {
  return (
    <ol className="sots-checkout__steps sots-checkout__steps--two" aria-label="Checkout progress">
      {STEPS.map((label, index) => {
        const current = index + 1;
        const state = current < step ? "complete" : current === step ? "current" : "upcoming";
        return (
          <li key={label} className={`sots-checkout__step is-${state}`}>
            <span className="sots-checkout__step-num">{current}</span>
            <span className="sots-checkout__step-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function TicketRow({ ticketType, quantity, max, onChange, highlight }) {
  return (
    <div className={`sots-checkout__ticket-row${highlight ? " is-highlight" : ""}`}>
      <div>
        <strong>{ticketType.name}</strong>
        <span>{ticketType.price?.display}</span>
        {highlight ? <span className="sots-checkout__ticket-note">Most popular</span> : null}
      </div>
      <div className="sots-checkout__qty" aria-label={`Quantity for ${ticketType.name}`}>
        <button
          type="button"
          onClick={() => onChange(Math.max(0, quantity - 1))}
          disabled={quantity <= 0}
          aria-label={`Decrease ${ticketType.name}`}
        >
          −
        </button>
        <span aria-live="polite">{quantity}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, quantity + 1))}
          disabled={quantity >= max}
          aria-label={`Increase ${ticketType.name}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function ConfirmationView({ order, emailSent }) {
  return (
    <div className="sots-checkout__confirmation">
      <h2>Order confirmed</h2>
      <p className="sots-checkout__confirm-code">
        Confirmation code <strong>{order.confirmationCode}</strong>
      </p>
      <p>{formatPerformanceDate(order.performanceStart)}</p>
      {emailSent ? (
        <p className="sots-checkout__hint">
          We emailed your tickets to <strong>{order.buyer?.email}</strong>.
        </p>
      ) : (
        <p className="sots-checkout__hint">
          Save your confirmation code, or find these tickets anytime in{" "}
          <Link to="/my-tickets/">My Tickets</Link>.
        </p>
      )}
      <ul className="sots-checkout__ticket-list">
        {order.tickets.map((ticket) => (
          <li key={ticket.code}>
            <div className="sots-checkout__ticket-item">
              <div>
                <strong>{ticket.ticketTypeName}</strong>
                <span>#{ticket.code}</span>
              </div>
              <TicketQr orderId={order.id} ticketCode={ticket.code} />
            </div>
          </li>
        ))}
      </ul>
      {order.donationCents ? (
        <p className="sots-checkout__hint">Includes a {formatCents(order.donationCents)} donation.</p>
      ) : null}
      {order.discountCents ? (
        <p className="sots-checkout__hint">
          Promo {order.promoCode}: −{formatCents(order.discountCents)}
        </p>
      ) : null}
      <p className="sots-checkout__total">Total paid: {formatCents(order.totalCents)}</p>
      <div className="sots-checkout__confirm-actions">
        <Link to="/my-tickets/" className="orpheum-arrow-btn orpheum-arrow-btn--gold">
          My Tickets
        </Link>
        <Link to="/tickets/" className="orpheum-arrow-btn orpheum-arrow-btn--ghost">
          Back to tickets
        </Link>
      </div>
    </div>
  );
}

export function TicketCheckoutForm({ data, performanceId }) {
  const cardRef = useRef(null);
  const patron = usePatron();
  const patronUser = patron?.user;
  const storedBuyer = useMemo(() => readStoredBuyer(), []);

  const [step, setStep] = useState(1);
  const [name, setName] = useState(storedBuyer.name);
  const [email, setEmail] = useState(patronUser?.email || storedBuyer.email);
  const [quantities, setQuantities] = useState({});
  const [promoCode, setPromoCode] = useState("");
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

  const performance = useMemo(
    () => data?.performances?.find((p) => p.id === performanceId) ?? null,
    [data, performanceId],
  );

  const ticketTypes = useMemo(
    () => (data?.ticketTypes ?? data?.ticketClasses ?? []).filter((t) => t.price?.value > 0),
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

  const estimatedTotal = hold?.totalCents ?? ticketSubtotal + donationCents;
  const ticketCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (patronUser?.email) setEmail(patronUser.email);
  }, [patronUser?.email]);

  useEffect(() => {
    setQuantities(defaultQuantities(ticketTypes));
    setName(storedBuyer.name);
    setEmail(patronUser?.email || storedBuyer.email);
    setStep(1);
    setHold(null);
    setOrder(null);
    setEmailSent(false);
    setError("");
    setLoading(false);
    setCardReady(false);
    setPaymentError(false);
    setPromoCode("");
    setShowPromo(false);
    setDonationCents(0);
    setShowDonation(false);
    cardRef.current?.destroy?.();
    cardRef.current = null;
  }, [performanceId, ticketTypes, storedBuyer.name, storedBuyer.email, patronUser?.email]);

  useEffect(() => {
    if (step !== 2) return undefined;

    let cancelled = false;
    setError("");

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
  }, [step, performanceId]);

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

  function handleContinueFromTickets(e) {
    e.preventDefault();
    setError("");
    if (!selectedItems.length) {
      setError("Choose at least one ticket.");
      return;
    }
    setHold(null);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handlePay(e) {
    e.preventDefault();
    setError("");
    setPaymentError(false);

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
    } finally {
      setLoading(false);
    }
  }

  if (order) {
    return <ConfirmationView order={order} emailSent={emailSent} />;
  }

  return (
    <div className="sots-checkout-page__form">
      <StepIndicator step={step} />

      {step === 1 ? (
        <form id="sots-ticket-step-1" className="sots-checkout__form" onSubmit={handleContinueFromTickets}>
          <fieldset className="sots-checkout__tickets">
            <legend>How many tickets?</legend>
            {ticketTypes.map((tt) => {
              const max = performance?.ticketAvailability?.[tt.id] ?? tt.capacity ?? 10;
              return (
                <TicketRow
                  key={tt.id}
                  ticketType={tt}
                  quantity={quantities[tt.id] ?? 0}
                  max={max}
                  highlight={tt.id === gaTicketId}
                  onChange={(qty) => setQuantities((prev) => ({ ...prev, [tt.id]: qty }))}
                />
              );
            })}
          </fieldset>

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
              <label className="sots-checkout__optional-field">
                Promo code
                <input
                  type="text"
                  name="promo"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  autoComplete="off"
                />
              </label>
            ) : null}

            <button
              type="button"
              className="sots-checkout__optional-toggle"
              aria-expanded={showDonation}
              onClick={() => setShowDonation((v) => !v)}
            >
              {showDonation ? "Hide donation" : "Add a donation?"}
            </button>
            {showDonation ? (
              <fieldset className="sots-checkout__donation">
                <legend className="visually-hidden">Donation amount</legend>
                <div className="sots-checkout__donation-options">
                  {DONATION_PRESETS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className={`sots-checkout__donation-btn${donationCents === amount ? " is-selected" : ""}`}
                      onClick={() => setDonationCents(amount)}
                    >
                      {amount === 0 ? "None" : formatCents(amount)}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </div>

          {error ? (
            <p className="sots-checkout__error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="sots-checkout-page__actions">
            <p className="sots-checkout__total">
              Subtotal <strong>{formatCents(ticketSubtotal + donationCents)}</strong>
            </p>
            <button
              type="submit"
              className="orpheum-arrow-btn orpheum-arrow-btn--gold sots-checkout__submit"
              disabled={!selectedItems.length}
            >
              Continue to payment
            </button>
          </div>
        </form>
      ) : null}

      {step === 2 ? (
        <form id="sots-ticket-step-2" className="sots-checkout__form" onSubmit={handlePay}>
          <button
            type="button"
            className="sots-checkout__back-link"
            onClick={() => {
              setStep(1);
              setError("");
              setHold(null);
            }}
          >
            ← Edit tickets
          </button>

          <div className="sots-checkout__summary">
            <p className="sots-checkout__summary-title">
              {ticketCount} ticket{ticketCount === 1 ? "" : "s"} · {formatPerformanceDate(performance?.start)}
            </p>
            <ul className="sots-checkout__summary-list">
              {selectedItems.map((item) => {
                const tt = ticketTypes.find((t) => t.id === item.ticketTypeId);
                return (
                  <li key={item.ticketTypeId}>
                    {item.quantity}× {tt?.name} — {formatCents((tt?.price?.value ?? 0) * item.quantity)}
                  </li>
                );
              })}
            </ul>
            {donationCents ? <p className="sots-checkout__hint">Donation: {formatCents(donationCents)}</p> : null}
          </div>

          <div className="sots-checkout__buyer">
            <label>
              Name
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>
          <p className="sots-checkout__hint">
            Tickets go to this email. <Link to="/my-tickets/">My Tickets</Link> saves them for next time.
          </p>

          <div className="sots-checkout__card">
            <p className="sots-checkout__card-label">Card</p>
            <div id={CARD_CONTAINER_ID} className="sots-checkout__card-container" />
            {!cardReady ? <p className="sots-checkout__loading">Loading card form…</p> : null}
          </div>

          {error ? (
            <p className="sots-checkout__error" role="alert">
              {error}
            </p>
          ) : null}
          {paymentError ? (
            <p className="sots-checkout__hint">Your tickets are still held — try payment again.</p>
          ) : null}

          <div className="sots-checkout-page__actions">
            <p className="sots-checkout__total">
              Total <strong>{formatCents(estimatedTotal)}</strong>
            </p>
            <button
              type="submit"
              className="orpheum-arrow-btn orpheum-arrow-btn--gold sots-checkout__submit"
              disabled={loading || !cardReady}
            >
              {loading ? "Processing…" : `Pay ${formatCents(estimatedTotal)}`}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
