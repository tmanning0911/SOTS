import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { readStoredBuyer, writeStoredBuyer } from "../../../js/buyer-storage.js";
import {
  completeCheckout,
  formatCents,
  initSquareCard,
  prepareCheckout,
} from "../../../js/square-payments.js";
import {
  formatPerformanceDate,
  patronDisplayName,
  sortTicketTypesForDisplay,
  ticketTypeHint,
} from "../../../js/ticketing.js";
import { usePatron } from "../../context/PatronContext.jsx";
import { TicketQr } from "./TicketQr.jsx";

const CARD_CONTAINER_ID = "sots-square-card-container";
const DONATION_PRESETS = [0, 500, 1000, 2500, 5000];

function defaultQuantities(ticketTypes) {
  const ga =
    ticketTypes.find((t) => t.slug === "general-admission") ??
    ticketTypes.find((t) => /general admission/i.test(t.name ?? "") && !/child|kid|vip/i.test(t.name ?? ""));
  return ga ? { [ga.id]: 1 } : {};
}

function TicketRow({ ticketType, quantity, max, onChange, highlight }) {
  const hint = ticketTypeHint(ticketType);
  return (
    <div className={`sots-checkout__ticket-row${highlight ? " is-highlight" : ""}`}>
      <div>
        <strong>{patronDisplayName(ticketType.name)}</strong>
        <span>{ticketType.price?.display}</span>
        {hint ? <span className="sots-checkout__ticket-hint">{hint}</span> : null}
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

function OrderSummary({ performance, selectedItems, ticketTypes, donationCents, discountCents, totalCents }) {
  const ticketCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <div className="sots-checkout-page__summary-card">
      <h3 className="sots-checkout-page__summary-heading">Order summary</h3>
      {performance ? (
        <p className="sots-checkout-page__summary-date">{formatPerformanceDate(performance.start)}</p>
      ) : null}
      {performance?.venue ? <p className="sots-checkout-page__summary-venue">{performance.venue}</p> : null}
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
          <li className="sots-checkout-page__summary-empty">No tickets selected</li>
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
          <span>Discount</span>
          <span>−{formatCents(discountCents)}</span>
        </p>
      ) : null}
      <p className="sots-checkout-page__summary-total">
        <span>
          Total ({ticketCount} ticket{ticketCount === 1 ? "" : "s"})
        </span>
        <strong>{formatCents(totalCents)}</strong>
      </p>
    </div>
  );
}

function ConfirmationView({ order, emailSent }) {
  return (
    <div className="sots-checkout__confirmation sots-checkout__confirmation--page">
      <p className="sots-checkout__confirmation-eyebrow">You&apos;re going to the show</p>
      <h2 className="sots-checkout__confirmation-title">{formatPerformanceDate(order.performanceStart)}</h2>
      <p className="sots-checkout__confirm-code">
        Confirmation <strong>{order.confirmationCode}</strong>
      </p>
      {emailSent ? (
        <p className="sots-checkout__hint">
          Tickets sent to <strong>{order.buyer?.email}</strong>.
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
      <p className="sots-checkout__total">Total paid: {formatCents(order.totalCents)}</p>
      <div className="sots-checkout__confirm-actions">
        <Link to="/my-tickets/" className="orpheum-arrow-btn orpheum-arrow-btn--gold">
          My Tickets
        </Link>
        <Link to="/tickets/" className="orpheum-arrow-btn orpheum-arrow-btn--ghost">
          Buy more tickets
        </Link>
      </div>
    </div>
  );
}

export function TicketCheckoutForm({ data, performanceId, showImage, changeDateHref = "/tickets/" }) {
  const cardRef = useRef(null);
  const patron = usePatron();
  const patronUser = patron?.user;
  const storedBuyer = useMemo(() => readStoredBuyer(), []);

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

  const estimatedTotal = hold?.totalCents ?? ticketSubtotal + donationCents - (hold?.discountCents ?? 0);

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
    } finally {
      setLoading(false);
    }
  }

  if (order) {
    return <ConfirmationView order={order} emailSent={emailSent} />;
  }

  return (
    <div className="sots-checkout-page__layout sots-checkout-page__layout--form">
      <aside className="sots-checkout-page__summary-pane" aria-label="Order summary">
        {showImage ? (
          <img src={showImage} alt="" className="sots-checkout-page__poster sots-checkout-page__poster--summary" loading="lazy" />
        ) : null}
        <OrderSummary
          performance={performance}
          selectedItems={selectedItems}
          ticketTypes={ticketTypes}
          donationCents={donationCents}
          discountCents={hold?.discountCents}
          totalCents={estimatedTotal}
        />
        <Link to={changeDateHref} className="sots-checkout-page__change-date">
          Change date
        </Link>
      </aside>

      <div className="sots-checkout-page__form-pane">
        <form id="sots-ticket-checkout" className="sots-checkout__form" onSubmit={handlePay}>
          <fieldset className="sots-checkout__tickets">
            <legend>Tickets</legend>
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
                  }}
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
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setHold(null);
                  }}
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

          <div className="sots-checkout__buyer">
            <h3 className="sots-checkout-page__section-title">Your info</h3>
            {patronUser?.email ? (
              <p className="sots-checkout__hint">
                Signed in as <strong>{patronUser.email}</strong>
              </p>
            ) : null}
            <label>
              Name
              <input type="text" name="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
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

          <div className="sots-checkout__card">
            <h3 className="sots-checkout-page__section-title">Payment</h3>
            <div id={CARD_CONTAINER_ID} className="sots-checkout__card-container" />
            {!cardReady ? <p className="sots-checkout__loading">Loading card form…</p> : null}
          </div>

          <div className="sots-checkout__next-steps sots-checkout__next-steps--inline">
            <h3>What happens next</h3>
            <ol>
              <li>Tickets email to you immediately.</li>
              <li>QR codes save in My Tickets.</li>
              <li>Show your QR at Pinkney Park.</li>
            </ol>
          </div>

          {error ? (
            <p className="sots-checkout__error" role="alert">
              {error}
            </p>
          ) : null}
          {paymentError ? <p className="sots-checkout__hint">Your tickets are still held — try again.</p> : null}
        </form>
      </div>

      <div className="sots-checkout-page__paybar">
        <p className="sots-checkout__total">
          Total <strong>{formatCents(estimatedTotal)}</strong>
        </p>
        <button
          type="submit"
          form="sots-ticket-checkout"
          className="orpheum-arrow-btn orpheum-arrow-btn--gold sots-checkout__submit"
          disabled={loading || !cardReady || !selectedItems.length}
        >
          {loading ? "Processing…" : `Pay ${formatCents(estimatedTotal)}`}
        </button>
      </div>
    </div>
  );
}
