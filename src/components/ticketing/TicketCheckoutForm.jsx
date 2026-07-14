import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { readStoredBuyer, writeStoredBuyer } from "../../../js/buyer-storage.js";
import {
  completeCheckout,
  formatCents,
  initSquareCard,
  prepareCheckout,
  resetSquareCheckoutCache,
  validatePromoCode,
} from "../../../js/square-payments.js";
import {
  groupCartByPerformance,
  maxQtyForTicket,
  otherPerformanceCount,
  primaryCheckoutPerformanceId,
  quantitiesFromCartLines,
  ticketCartTotalCents,
} from "../../../js/ticket-cart.js";
import {
  formatPerformanceDate,
  formatPerformanceListDate,
  patronDisplayName,
  sortTicketTypesForDisplay,
  ticketTypeHint,
  TICKETS_PAGE_PATH,
} from "../../../js/ticketing.js";
import { usePatron } from "../../context/PatronContext.jsx";
import { useTickets } from "../../context/TicketProvider.jsx";
import {
  CheckoutAlert,
  CheckoutMobileSummary,
  CheckoutPaymentPanel,
  CheckoutSectionHeader,
  CheckoutStickyPayBar,
} from "../checkout/CheckoutUi.jsx";
import { CheckoutProgress } from "./CheckoutProgress.jsx";
import { HoldTimer } from "./HoldTimer.jsx";
import { TicketQr } from "./TicketQr.jsx";

const CARD_CONTAINER_ID = "sots-co-card-mount";
const FORM_ID = "sots-ticket-checkout";
const DONATION_PRESETS = [0, 500, 1000, 2500, 5000];

function TicketRow({ ticketType, quantity, max, onChange, highlight }) {
  const hint = ticketTypeHint(ticketType);
  const unavailable = max <= 0;
  const lowStock = !unavailable && max <= 5;

  if (unavailable && quantity <= 0) return null;

  return (
    <article
      className={`sots-co__ticket${highlight ? " is-featured" : ""}${quantity > 0 ? " is-selected" : ""}`}
    >
      <div>
        <div className="sots-co__ticket-head">
          <strong>{patronDisplayName(ticketType.name)}</strong>
          {highlight ? <span className="sots-co__ticket-badge">Most popular</span> : null}
        </div>
        {hint ? <p className="sots-co__ticket-hint">{hint}</p> : null}
        {lowStock ? <p className="sots-co__ticket-scarcity">Only {max} left</p> : null}
        <p className="sots-co__ticket-price">{ticketType.price?.display}</p>
      </div>
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
  promoLabel,
}) {
  const ticketCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

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
          <li className="sots-co__lines-empty">No tickets selected</li>
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

function ConfirmationView({ order, emailSent, showTitle, nextGroup, onCheckoutNext }) {
  const nextTotal = nextGroup ? ticketCartTotalCents(nextGroup.lines) : 0;
  const nextCount = nextGroup?.lines?.reduce((sum, line) => sum + line.quantity, 0) ?? 0;

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

      {nextGroup ? (
        <div className="sots-co__cart-next">
          <p className="sots-co__cart-next-label">Still in your cart</p>
          <strong className="sots-co__cart-next-date">{nextGroup.performanceLabel}</strong>
          {nextGroup.venue ? <span className="sots-co__cart-next-venue">{nextGroup.venue}</span> : null}
          <ul className="sots-co__lines">
            {nextGroup.lines.map((line) => (
              <li key={`${line.performanceId}:${line.ticketTypeId}`}>
                <span>
                  {line.quantity}× {line.ticketTypeName}
                </span>
                <span>{formatCents((line.price?.value ?? 0) * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="sots-co__total">
            <span>
              {nextCount} ticket{nextCount === 1 ? "" : "s"}
            </span>
            <strong>{formatCents(nextTotal)}</strong>
          </p>
          <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--gold" onClick={onCheckoutNext}>
            Checkout this date · {formatCents(nextTotal)}
          </button>
        </div>
      ) : null}

      <div className="sots-checkout__confirm-actions">
        <Link to="/my-tickets/" className="orpheum-arrow-btn orpheum-arrow-btn--gold">
          View My Tickets
        </Link>
        <Link to={TICKETS_PAGE_PATH} className="orpheum-arrow-btn orpheum-arrow-btn--ghost">
          {nextGroup ? "View cart & dates" : "Buy more tickets"}
        </Link>
      </div>
    </div>
  );
}

function EmptyCheckout({ changeDateHref }) {
  return (
    <div className="sots-co__empty-cart">
      <h2>No tickets in checkout</h2>
      <p>Add tickets for this date from the calendar, then return here to pay.</p>
      <div className="sots-co__empty-cart-actions">
        <Link to={changeDateHref} className="orpheum-arrow-btn orpheum-arrow-btn--gold">
          Choose a date
        </Link>
        <Link to={`${TICKETS_PAGE_PATH}?cart=1`} className="orpheum-arrow-btn orpheum-arrow-btn--ghost">
          View cart
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
  const patronProfile = patron?.profile;
  const storedBuyer = useMemo(() => readStoredBuyer(), []);
  const {
    cart,
    setPerformanceQuantities,
    clearPerformance,
    openCartCheckout,
    linesForPerformance,
    saveAndBrowse,
  } = useTickets();

  const [name, setName] = useState(patronProfile?.name || storedBuyer.name);
  const [email, setEmail] = useState(patronUser?.email || storedBuyer.email);
  const [phone, setPhone] = useState(patronProfile?.phone || storedBuyer.phone || "");
  const [marketingOptIn, setMarketingOptIn] = useState(
    Boolean(patronProfile?.marketingOptIn ?? storedBuyer.marketingOptIn),
  );
  const [quantities, setQuantities] = useState(() =>
    quantitiesFromCartLines(linesForPerformance(performanceId)),
  );
  const [hydratedFor, setHydratedFor] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoPreview, setPromoPreview] = useState(null);
  const [promoMessage, setPromoMessage] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [donationCents, setDonationCents] = useState(0);
  const [showDonation, setShowDonation] = useState(false);
  const [hold, setHold] = useState(null);
  const [order, setOrder] = useState(null);
  const [remainingAfterPay, setRemainingAfterPay] = useState([]);
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

  // Hydrate from cart once per performance — empty means empty (no GA auto-add).
  useEffect(() => {
    if (!performanceId) return;
    const fromCart = quantitiesFromCartLines(linesForPerformance(performanceId));
    setQuantities(fromCart);
    setHydratedFor(performanceId);
    setName(patronProfile?.name || storedBuyer.name);
    setEmail(patronUser?.email || storedBuyer.email);
    setPhone(patronProfile?.phone || storedBuyer.phone || "");
    setMarketingOptIn(Boolean(patronProfile?.marketingOptIn ?? storedBuyer.marketingOptIn));
    setHold(null);
    setOrder(null);
    setRemainingAfterPay([]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional one-shot hydrate per performance
  }, [performanceId, ticketTypes]);

  const syncQuantities = useCallback(
    (nextQuantities) => {
      setQuantities(nextQuantities);
      setHold(null);
      clearPromoPreview();
      if (hydratedFor === performanceId) {
        setPerformanceQuantities(performanceId, nextQuantities);
      }
    },
    [clearPromoPreview, hydratedFor, performanceId, setPerformanceQuantities],
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

  const otherInCart = otherPerformanceCount(cart, performanceId);
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
  const readyForCard = ticketsDone && detailsDone && !order;

  useEffect(() => {
    document.body.classList.add("sots-co-has-sticky-pay");
    return () => document.body.classList.remove("sots-co-has-sticky-pay");
  }, []);

  const ticketCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (patronUser?.email) setEmail(patronUser.email);
  }, [patronUser?.email]);

  useEffect(() => {
    if (!readyForCard) {
      cardRef.current?.destroy?.();
      cardRef.current = null;
      setCardReady(false);
      return undefined;
    }

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
        const { card } = await initSquareCard(CARD_CONTAINER_ID, { fresh: cardMountKey > 0 });
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
  }, [readyForCard, performanceId, cardMountKey]);

  function retryCardMount() {
    setError("");
    resetSquareCheckoutCache();
    cardRef.current?.destroy?.();
    cardRef.current = null;
    setCardMountKey((key) => key + 1);
  }

  function handleSaveAndBrowse() {
    if (!selectedItems.length) {
      setError("Choose at least one ticket before saving to your cart.");
      document.getElementById("co-section-tickets")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    saveAndBrowse(performanceId, quantities);
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
    const buyer = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      marketingOptIn: Boolean(marketingOptIn),
    };
    const holdMatchesBuyer =
      hold &&
      hold.buyer?.name === buyer.name &&
      hold.buyer?.email === buyer.email &&
      (hold.buyer?.phone || "") === buyer.phone &&
      Boolean(hold.buyer?.marketingOptIn) === buyer.marketingOptIn;

    if (holdMatchesBuyer) return hold;

    const prepared = await prepareCheckout({
      performanceId,
      items: selectedItems,
      buyer,
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

    writeStoredBuyer({ name, email, phone, marketingOptIn });
    setPerformanceQuantities(performanceId, quantities);
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
      const remaining = cart.filter((line) => line.performanceId !== String(performanceId));
      setRemainingAfterPay(remaining);
      clearPerformance(performanceId);
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
    const nextGroups = groupCartByPerformance(remainingAfterPay);
    const nextGroup = nextGroups[0] ?? null;
    return (
      <ConfirmationView
        order={order}
        emailSent={emailSent}
        showTitle={showTitle}
        nextGroup={nextGroup}
        onCheckoutNext={() => openCartCheckout(primaryCheckoutPerformanceId(remainingAfterPay))}
      />
    );
  }

  const hasAnyQty = Object.values(quantities).some((q) => q > 0);
  const showEmpty =
    hydratedFor === performanceId && !selectedItems.length && !hasAnyQty && !linesForPerformance(performanceId).length;

  if (showEmpty) {
    return <EmptyCheckout changeDateHref={changeDateHref} />;
  }

  const payDisabled = loading || !cardReady || !selectedItems.length || !name.trim() || !email.trim();
  const payLabel = selectedItems.length ? `Pay ${formatCents(estimatedTotal)}` : "Choose tickets";
  const errorHint = paymentError
    ? hold?.expiresAt
      ? "Your tickets are still held — please try again before the timer runs out."
      : "Please check your card details and try again."
    : null;

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
            {otherInCart > 0 ? (
              <p className="sots-co__cart-banner">
                + {otherInCart} ticket{otherInCart === 1 ? "" : "s"} for other dates in your cart
              </p>
            ) : null}
            <Link to={changeDateHref} className="sots-co__change-date">
              ← Choose a different date
            </Link>
          </aside>

          <div className="sots-co__main">
            <CheckoutMobileSummary
              countLabel={ticketCount ? `${ticketCount} ticket${ticketCount === 1 ? "" : "s"}` : "Select tickets"}
              totalCents={estimatedTotal}
              editHref={changeDateHref}
              editLabel="Choose a different date"
            >
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
                  <span>{promoPreview?.description ?? hold?.promoCode ?? "Promo discount"}</span>
                  <span>−{formatCents(discountCents)}</span>
                </p>
              ) : null}
              {otherInCart > 0 ? (
                <p className="sots-co__line-row sots-co__line-row--note">
                  <span>+ {otherInCart} more in cart (other dates)</span>
                </p>
              ) : null}
              <p className="sots-co__total">
                <span>Total this date</span>
                <strong>{formatCents(estimatedTotal)}</strong>
              </p>
            </CheckoutMobileSummary>

            <CheckoutAlert message={error} hint={errorHint} />

            <form id={FORM_ID} className="sots-co__form" onSubmit={handlePay}>
              <section
                id="co-section-tickets"
                className={`sots-co__section${ticketsDone ? " sots-co__section--done" : ""}`}
                aria-labelledby="co-tickets-heading"
              >
                <CheckoutSectionHeader
                  step={1}
                  done={ticketsDone}
                  headingId="co-tickets-heading"
                  title="Your tickets"
                  description="Adjust quantities for this performance. Changes save to your cart."
                />
                <div className="sots-co__section-body">
                  <div className="sots-co__tickets">
                    {ticketTypes.map((tt) => {
                      const max = maxQtyForTicket(performance, tt);
                      return (
                        <TicketRow
                          key={tt.id}
                          ticketType={tt}
                          quantity={quantities[tt.id] ?? 0}
                          max={max}
                          highlight={tt.id === gaTicketId}
                          onChange={(qty) => {
                            syncQuantities({ ...quantities, [tt.id]: qty });
                          }}
                        />
                      );
                    })}
                  </div>

                  <div className="sots-co__cart-actions">
                    <button
                      type="button"
                      className="orpheum-arrow-btn orpheum-arrow-btn--ghost"
                      onClick={handleSaveAndBrowse}
                      disabled={!selectedItems.length}
                    >
                      Save &amp; add another date
                    </button>
                    <button
                      type="button"
                      className="orpheum-arrow-btn orpheum-arrow-btn--ghost"
                      onClick={() => scrollToCheckoutStep("details")}
                      disabled={!selectedItems.length}
                    >
                      Continue to details
                    </button>
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
                        <p className="sots-checkout__donation-note">Support accessible Shakespeare in the park for everyone.</p>
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
                <CheckoutSectionHeader
                  step={2}
                  done={detailsDone}
                  headingId="co-details-heading"
                  title="Your information"
                  description="We'll email your tickets and QR codes here."
                />
                <div className="sots-co__section-body">
                  {patronUser?.email ? (
                    <p className="sots-co__signed-in">
                      Tickets for <strong>{patronUser.email}</strong> ·{" "}
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
                    <label className="sots-co__field sots-co__field--wide">
                      <span>
                        Phone <span className="sots-co__optional">(optional)</span>
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(203) 555-0100"
                      />
                    </label>
                  </div>
                  <label className="sots-co__consent">
                    <input
                      type="checkbox"
                      checked={marketingOptIn}
                      onChange={(e) => setMarketingOptIn(e.target.checked)}
                    />
                    <span>
                      Keep me updated about performances, community programs, and ways to support Shakespeare
                      on the Sound.
                    </span>
                  </label>
                </div>
              </section>

              <section
                id="co-section-payment"
                className="sots-co__section sots-co__section--payment"
                aria-labelledby="co-payment-heading"
              >
                <CheckoutSectionHeader
                  step={3}
                  headingId="co-payment-heading"
                  title="Review & pay"
                  description="Confirm this performance, then pay securely with Square. Ticket holds last 15 minutes."
                />

                <div className="sots-co__review">
                  <p className="sots-co__review-label">You&apos;re buying</p>
                  <p className="sots-co__review-show">{showTitle}</p>
                  {performance ? (
                    <p className="sots-co__review-date">
                      {formatPerformanceListDate(performance.start) || formatPerformanceDate(performance.start)}
                    </p>
                  ) : null}
                  <ul className="sots-co__lines sots-co__review-lines">
                    {selectedItems.map((item) => {
                      const tt = ticketTypes.find((t) => t.id === item.ticketTypeId);
                      return (
                        <li key={item.ticketTypeId}>
                          <span>
                            {item.quantity}× {patronDisplayName(tt?.name)}
                          </span>
                          <span>{formatCents((tt?.price?.value ?? 0) * item.quantity)}</span>
                        </li>
                      );
                    })}
                    {donationCents ? (
                      <li>
                        <span>Donation</span>
                        <span>{formatCents(donationCents)}</span>
                      </li>
                    ) : null}
                    {discountCents ? (
                      <li className="is-discount">
                        <span>{promoPreview?.description ?? hold?.promoCode ?? "Promo"}</span>
                        <span>−{formatCents(discountCents)}</span>
                      </li>
                    ) : null}
                  </ul>
                  <p className="sots-co__total">
                    <span>Total due now</span>
                    <strong>{formatCents(estimatedTotal)}</strong>
                  </p>
                </div>

                {hold?.expiresAt ? (
                  <HoldTimer expiresAt={hold.expiresAt} onExpired={handleHoldExpired} className="sots-co__hold" />
                ) : null}

                <div className="sots-co__section-body">
                  {readyForCard ? (
                    <CheckoutPaymentPanel
                      cardContainerId={CARD_CONTAINER_ID}
                      cardReady={cardReady}
                      onRetry={retryCardMount}
                      showRetry={Boolean(error && !cardReady)}
                    />
                  ) : (
                    <p className="sots-co__pay-gate">Enter your tickets and contact details to unlock payment.</p>
                  )}

                  <p className="sots-co__terms">
                    By paying you agree to our <Link to="/about/faq/">ticket policies</Link> (all sales final except
                    weather cancellations).
                  </p>

                  <div className="sots-co__pay-row">
                    <p className="sots-co__pay-note">Taxes and fees included · Tickets emailed instantly</p>
                    <button
                      type="submit"
                      className="sots-shop-btn sots-shop-btn--pay sots-shop-btn--lg sots-co__submit"
                      disabled={payDisabled}
                    >
                      {loading ? "Processing…" : payLabel}
                    </button>
                  </div>
                </div>
              </section>
            </form>
          </div>
        </div>
      </div>

      {selectedItems.length ? (
        <CheckoutStickyPayBar
          formId={FORM_ID}
          totalCents={estimatedTotal}
          payLabel={payLabel}
          disabled={payDisabled}
          loading={loading}
        />
      ) : null}
    </>
  );
}
