import { useEffect, useId, useMemo, useRef, useState } from "react";
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
const STEPS = ["Tickets", "Your info", "Payment"];

function StepIndicator({ step }) {
  return (
    <ol className="sots-checkout__steps" aria-label="Checkout progress">
      {STEPS.map((label, index) => {
        const current = index + 1;
        const state =
          current < step ? "complete" : current === step ? "current" : "upcoming";
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

function TicketRow({ ticketType, quantity, max, onChange }) {
  return (
    <div className="sots-checkout__ticket-row">
      <div>
        <strong>{ticketType.name}</strong>
        <span>{ticketType.price?.display}</span>
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
        <span>{quantity}</span>
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

function ConfirmationView({ order, emailSent, onClose }) {
  return (
    <div className="sots-checkout__confirmation">
      <h3>You're all set!</h3>
      {emailSent ? (
        <p className="sots-checkout__hint">
          A confirmation email was sent to <strong>{order.buyer?.email}</strong> with your ticket codes
          and QR codes.
        </p>
      ) : (
        <p className="sots-checkout__hint">
          Save your confirmation code below. You can also find these tickets anytime under{" "}
          <Link to="/my-tickets/">My Tickets</Link>.
        </p>
      )}
      <p className="sots-checkout__confirm-code">
        Confirmation <strong>{order.confirmationCode}</strong>
      </p>
      <p>
        Order <strong>{order.id}</strong>
      </p>
      <p>{formatPerformanceDate(order.performanceStart)}</p>
      <ul className="sots-checkout__ticket-list">
        {order.tickets.map((ticket) => (
          <li key={ticket.code}>
            <div className="sots-checkout__ticket-item">
              <div>
                <strong>{ticket.ticketTypeName}</strong>
                <span>Ticket #{ticket.code}</span>
              </div>
              <TicketQr orderId={order.id} ticketCode={ticket.code} />
            </div>
          </li>
        ))}
      </ul>
      {order.donationCents ? (
        <p className="sots-checkout__hint">Includes a {formatCents(order.donationCents)} donation — thank you!</p>
      ) : null}
      {order.discountCents ? (
        <p className="sots-checkout__hint">
          Promo <strong>{order.promoCode}</strong> saved you {formatCents(order.discountCents)}.
        </p>
      ) : null}
      <p className="sots-checkout__total">Total paid: {formatCents(order.totalCents)}</p>
      <div className="sots-checkout__confirm-actions">
        <Link to="/my-tickets/" className="orpheum-arrow-btn orpheum-arrow-btn--gold">
          My Tickets
        </Link>
        <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--ghost" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}

export function CheckoutModal({ open, onClose, data, performanceId }) {
  const titleId = useId();
  const cardRef = useRef(null);
  const patron = usePatron();
  const patronUser = patron?.user;
  const storedBuyer = useMemo(() => readStoredBuyer(), []);

  const [step, setStep] = useState(1);
  const [name, setName] = useState(storedBuyer.name);
  const [email, setEmail] = useState(patronUser?.email || storedBuyer.email);
  const [quantities, setQuantities] = useState({});
  const [promoCode, setPromoCode] = useState("");
  const [donationCents, setDonationCents] = useState(0);
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

  useEffect(() => {
    if (patronUser?.email) setEmail(patronUser.email);
  }, [patronUser?.email]);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setHold(null);
      setOrder(null);
      setEmailSent(false);
      setError("");
      setLoading(false);
      setCardReady(false);
      setPaymentError(false);
      setPromoCode("");
      setDonationCents(0);
      cardRef.current?.destroy?.();
      cardRef.current = null;
      return undefined;
    }

    if (step !== 3) return undefined;

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
  }, [open, step, performanceId]);

  if (!open) return null;

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

  async function handleContinueFromTickets(e) {
    e.preventDefault();
    setError("");
    if (!selectedItems.length) {
      setError("Select at least one ticket.");
      return;
    }
    setStep(2);
  }

  async function handleContinueFromInfo(e) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    writeStoredBuyer({ name, email });
    setLoading(true);
    try {
      setHold(null);
      await ensureHold();
      setStep(3);
    } catch (err) {
      setError(err.message || "Could not reserve tickets");
    } finally {
      setLoading(false);
    }
  }

  async function handlePay(e) {
    e.preventDefault();
    setError("");
    setPaymentError(false);
    if (!cardRef.current) {
      setError("Payment form is not ready yet.");
      return;
    }

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
      setStep(4);
    } catch (err) {
      setPaymentError(true);
      setError(err.message || "Payment failed. Please check your card and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sots-checkout" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="sots-checkout__backdrop" aria-label="Close" onClick={onClose} />
      <div className="sots-checkout__panel">
        <button type="button" className="sots-checkout__close" aria-label="Close" onClick={onClose}>
          &times;
        </button>

        {order ? (
          <ConfirmationView order={order} emailSent={emailSent} onClose={onClose} />
        ) : (
          <>
            <h2 id={titleId}>Buy Tickets</h2>
            {performance ? (
              <p className="sots-checkout__performance">
                {formatPerformanceDate(performance.start)}
                {performance.venue ? ` · ${performance.venue}` : ""}
              </p>
            ) : null}

            <StepIndicator step={step} />

            {step === 1 ? (
              <form className="sots-checkout__form" onSubmit={handleContinueFromTickets}>
                <fieldset className="sots-checkout__tickets">
                  <legend>Select tickets</legend>
                  {ticketTypes.map((tt) => {
                    const max = performance?.ticketAvailability?.[tt.id] ?? tt.capacity ?? 10;
                    return (
                      <TicketRow
                        key={tt.id}
                        ticketType={tt}
                        quantity={quantities[tt.id] ?? 0}
                        max={max}
                        onChange={(qty) => setQuantities((prev) => ({ ...prev, [tt.id]: qty }))}
                      />
                    );
                  })}
                </fieldset>

                <div className="sots-checkout__extras">
                  <label>
                    Promo code
                    <input
                      type="text"
                      name="promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Optional"
                      autoComplete="off"
                    />
                  </label>

                  <fieldset className="sots-checkout__donation">
                    <legend>Add a donation?</legend>
                    <div className="sots-checkout__donation-options">
                      {DONATION_PRESETS.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          className={`sots-checkout__donation-btn${donationCents === amount ? " is-selected" : ""}`}
                          onClick={() => setDonationCents(amount)}
                        >
                          {amount === 0 ? "No thanks" : formatCents(amount)}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <p className="sots-checkout__total">
                  Estimated total: <strong>{formatCents(ticketSubtotal + donationCents)}</strong>
                </p>

                {error ? (
                  <p className="sots-checkout__error" role="alert">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="orpheum-arrow-btn orpheum-arrow-btn--gold sots-checkout__submit"
                  disabled={!selectedItems.length}
                >
                  Continue
                </button>
              </form>
            ) : null}

            {step === 2 ? (
              <form className="sots-checkout__form" onSubmit={handleContinueFromInfo}>
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
                  We'll send your tickets here. Already have an account?{" "}
                  <Link to="/my-tickets/">Sign in to My Tickets</Link>.
                </p>

                {error ? (
                  <p className="sots-checkout__error" role="alert">
                    {error}
                  </p>
                ) : null}

                <div className="sots-checkout__nav">
                  <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--ghost" onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button
                    type="submit"
                    className="orpheum-arrow-btn orpheum-arrow-btn--gold sots-checkout__submit"
                    disabled={loading}
                  >
                    {loading ? "Reserving…" : "Continue to payment"}
                  </button>
                </div>
              </form>
            ) : null}

            {step === 3 ? (
              <form className="sots-checkout__form" onSubmit={handlePay}>
                <div className="sots-checkout__summary">
                  <p>
                    <strong>{name}</strong> · {email}
                  </p>
                  <ul className="sots-checkout__summary-list">
                    {(hold?.lineItems ?? selectedItems.map((item) => {
                      const tt = ticketTypes.find((t) => t.id === item.ticketTypeId);
                      return {
                        name: tt?.name,
                        quantity: item.quantity,
                        lineTotal: (tt?.price?.value ?? 0) * item.quantity,
                      };
                    })).map((line) => (
                      <li key={`${line.name}-${line.quantity}`}>
                        {line.quantity}× {line.name} — {formatCents(line.lineTotal)}
                      </li>
                    ))}
                  </ul>
                  {hold?.discountCents ? (
                    <p className="sots-checkout__hint">
                      Promo {hold.promoCode}: −{formatCents(hold.discountCents)}
                    </p>
                  ) : null}
                  {donationCents ? (
                    <p className="sots-checkout__hint">Donation: {formatCents(donationCents)}</p>
                  ) : null}
                </div>

                <div className="sots-checkout__card">
                  <p className="sots-checkout__card-label">Payment</p>
                  <div id={CARD_CONTAINER_ID} className="sots-checkout__card-container" />
                  {!cardReady ? <p className="sots-checkout__loading">Loading secure payment…</p> : null}
                </div>

                <p className="sots-checkout__total">
                  Total: <strong>{formatCents(estimatedTotal)}</strong>
                </p>

                {error ? (
                  <p className="sots-checkout__error" role="alert">
                    {error}
                  </p>
                ) : null}
                {paymentError ? (
                  <p className="sots-checkout__hint">Your ticket selection is still reserved — you can try payment again.</p>
                ) : null}

                <div className="sots-checkout__nav">
                  <button
                    type="button"
                    className="orpheum-arrow-btn orpheum-arrow-btn--ghost"
                    onClick={() => setStep(2)}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="orpheum-arrow-btn orpheum-arrow-btn--gold sots-checkout__submit"
                    disabled={loading || !cardReady}
                  >
                    {loading ? "Processing…" : "Pay Now"}
                  </button>
                </div>
              </form>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
