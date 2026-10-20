import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { readStoredBuyer, writeStoredBuyer } from "../../../js/buyer-storage.js";
import { completeShopCheckout, formatCents, prepareShopCheckout } from "../../../js/shop.js";
import { initSquareCard, resetSquareCheckoutCache } from "../../../js/square-payments.js";
import {
  CheckoutAlert,
  CheckoutMobileSummary,
  CheckoutPaymentPanel,
  CheckoutSectionHeader,
  CheckoutStickyPayBar,
} from "../checkout/CheckoutUi.jsx";
import { useShop } from "../../context/ShopContext.jsx";

const CARD_CONTAINER_ID = "sots-co-shop-card-mount";
const FORM_ID = "sots-shop-checkout";

function CartSummaryLines({ cart }) {
  return (
    <ul className="sots-co__lines sots-shop-checkout__summary-lines">
      {cart.map((line) => (
        <li key={`${line.id}:${line.option ?? ""}`} className="sots-shop-checkout__summary-item">
          <span>
            {line.quantity}× {line.name}
            {line.option ? ` (${line.option})` : ""}
            {line.digital ? " · Digital" : ""}
          </span>
          <span>{formatCents(line.price.value * line.quantity)}</span>
        </li>
      ))}
    </ul>
  );
}

function CartSummary({ cart, totalCents, featuredImage }) {
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div className="sots-co__aside-card">
      {featuredImage ? <img src={featuredImage} alt="" className="sots-co__aside-poster" loading="lazy" /> : null}
      <div className="sots-co__aside-body">
        <p className="sots-co__aside-label">Order summary</p>
        <p className="sots-co__aside-show">Gift Shop</p>
        <p className="sots-co__aside-venue">
          {itemCount} item{itemCount === 1 ? "" : "s"} in your cart
        </p>
      </div>
      <CartSummaryLines cart={cart} />
      <p className="sots-co__total">
        <span>Total{itemCount ? ` · ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}</span>
        <strong>{formatCents(totalCents)}</strong>
      </p>
    </div>
  );
}

function ConfirmationView({ order, emailSent, returnHref }) {
  return (
    <div className="sots-co__confirm sots-checkout__confirmation sots-checkout__confirmation--page">
      <div className="sots-checkout__success-badge" aria-hidden="true">
        ✓
      </div>
      <p className="sots-checkout__confirmation-eyebrow">Order confirmed</p>
      <h2 className="sots-checkout__confirmation-title">Thank you for your purchase</h2>
      <p className="sots-checkout__confirm-code">
        Confirmation <strong>{order.confirmationCode}</strong>
      </p>
      {emailSent ? (
        <p className="sots-checkout__hint sots-checkout__hint--success">
          Receipt sent to <strong>{order.buyer?.email}</strong>. Check your inbox (and spam folder).
        </p>
      ) : (
        <p className="sots-checkout__hint">Save your confirmation code for pickup or delivery questions.</p>
      )}
      <ul className="sots-checkout__ticket-list sots-shop-checkout__order-lines">
        {order.lineItems.map((line) => (
          <li key={`${line.productId}-${line.name}`}>
            <div>
              <strong>{line.name}</strong>
              <span>Qty {line.quantity}</span>
            </div>
            <span>{formatCents(line.lineTotal ?? (line.unitPrice ?? 0) * line.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="sots-checkout__next-steps">
        <h3>{order.fulfillment === "pickup" ? "Pickup at Shakespeare in Pinkney Park" : "Shipping"}</h3>
        <ol>
          {order.fulfillment === "pickup" ? (
            <>
              <li>Bring your confirmation code to the merchandise table.</li>
              <li>Pickup is available during show nights and select weekend hours.</li>
              <li>Digital items arrive by email — no pickup needed.</li>
            </>
          ) : (
            <>
              <li>We&apos;ll email you when your order ships.</li>
              <li>Most orders leave within 3–5 business days.</li>
              <li>Digital gift certificates deliver by email right away.</li>
            </>
          )}
        </ol>
      </div>
      <p className="sots-checkout__total sots-checkout__total--confirm">Total paid: {formatCents(order.totalCents)}</p>
      <div className="sots-checkout__confirm-actions">
        <Link to={returnHref} className="orpheum-arrow-btn orpheum-arrow-btn--gold">
          Continue shopping
        </Link>
        <Link to="/support/donate/" className="orpheum-arrow-btn orpheum-arrow-btn--ghost">
          Give now
        </Link>
      </div>
    </div>
  );
}

export function ShopCheckoutForm({ returnHref = "/shop/", cartTotal, featuredImage }) {
  const { cart, clearCart } = useShop();
  const cardRef = useRef(null);
  const storedBuyer = useMemo(() => readStoredBuyer(), []);

  const [name, setName] = useState(storedBuyer.name);
  const [email, setEmail] = useState(storedBuyer.email);
  const [phone, setPhone] = useState("");
  const [fulfillment, setFulfillment] = useState("pickup");
  const [address, setAddress] = useState({ line1: "", city: "", state: "CT", postalCode: "" });
  const [hold, setHold] = useState(null);
  const [order, setOrder] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [cardMountKey, setCardMountKey] = useState(0);

  const subtotal = cartTotal ?? cart.reduce((sum, line) => sum + line.price.value * line.quantity, 0);
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const deliveryDone =
    fulfillment === "pickup" ||
    Boolean(address.line1.trim() && address.city.trim() && address.state.trim() && address.postalCode.trim());
  const detailsDone = Boolean(name.trim() && email.trim());

  useEffect(() => {
    document.body.classList.add("sots-co-has-sticky-pay");
    return () => document.body.classList.remove("sots-co-has-sticky-pay");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function mountCard() {
      setCardReady(false);
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
  }, [cardMountKey]);

  function retryCardMount() {
    setError("");
    resetSquareCheckoutCache();
    cardRef.current?.destroy?.();
    cardRef.current = null;
    setCardMountKey((key) => key + 1);
  }

  const errorHint = paymentError
    ? error.toLowerCase().includes("session expired")
      ? "Go back to the shop, add your items again, and retry checkout."
      : "Please check your card details and try again."
    : null;

  async function handlePay(e) {
    e.preventDefault();
    setError("");
    setPaymentError(false);

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      document.getElementById("shop-co-section-details")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (fulfillment === "ship" && !address.line1.trim()) {
      setError("Enter a shipping address.");
      document.getElementById("shop-co-section-delivery")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!cardRef.current) {
      setError("Payment form is not ready yet.");
      document.getElementById("shop-co-section-payment")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    writeStoredBuyer({ name, email });
    setLoading(true);
    try {
      const prepared =
        hold ??
        (await prepareShopCheckout({
          items: cart.map((line) => ({
            productId: line.id,
            quantity: line.quantity,
            option: line.option,
          })),
          buyer: { name, email, phone, address: fulfillment === "ship" ? address : undefined },
          fulfillment,
        }));
      if (!hold) setHold(prepared);

      const tokenResult = await cardRef.current.tokenize();
      if (tokenResult.status !== "OK") {
        throw new Error(tokenResult.errors?.[0]?.message || "Card could not be verified");
      }

      const result = await completeShopCheckout({
        holdId: prepared.holdId,
        sourceId: tokenResult.token,
      });
      setOrder(result.order);
      setEmailSent(result.emailSent);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setPaymentError(true);
      setError(err.message || "Checkout failed. Check your card and try again.");
      setHold(null);
    } finally {
      setLoading(false);
    }
  }

  if (order) {
    return <ConfirmationView order={order} emailSent={emailSent} returnHref={returnHref} />;
  }

  const payDisabled = loading || !cardReady || !cart.length;
  const payLabel = cart.length ? `Pay ${formatCents(subtotal)}` : "Cart empty";

  return (
    <>
      <div className="sots-co__body">
        <div className="sots-co__grid">
          <aside className="sots-co__aside" aria-label="Order summary">
            <CartSummary cart={cart} totalCents={subtotal} featuredImage={featuredImage} />
            <Link to={returnHref} className="sots-co__change-date">
              ← Edit cart
            </Link>
          </aside>

          <div className="sots-co__main">
            <CheckoutMobileSummary
              countLabel={itemCount ? `${itemCount} item${itemCount === 1 ? "" : "s"}` : "Your cart"}
              totalCents={subtotal}
              editHref={returnHref}
              editLabel="Edit cart"
            >
              <CartSummaryLines cart={cart} />
              <p className="sots-co__total">
                <span>Total</span>
                <strong>{formatCents(subtotal)}</strong>
              </p>
            </CheckoutMobileSummary>

            <CheckoutAlert message={error} hint={errorHint} />

            <form id={FORM_ID} className="sots-co__form" onSubmit={handlePay}>
              <section
                id="shop-co-section-delivery"
                className={`sots-co__section${deliveryDone ? " sots-co__section--done" : ""}`}
                aria-labelledby="shop-co-delivery-heading"
              >
                <CheckoutSectionHeader
                  step={1}
                  done={deliveryDone}
                  headingId="shop-co-delivery-heading"
                  title="Pickup or delivery"
                  description="Choose how you'd like to receive your order."
                />
                <div className="sots-co__section-body">
                  <div className="sots-checkout__segmented sots-shop-checkout__segmented">
                    <button
                      type="button"
                      className={`sots-checkout__segment${fulfillment === "pickup" ? " is-active" : ""}`}
                      onClick={() => {
                        setFulfillment("pickup");
                        setHold(null);
                      }}
                    >
                      Pick up at the park
                    </button>
                    <button
                      type="button"
                      className={`sots-checkout__segment${fulfillment === "ship" ? " is-active" : ""}`}
                      onClick={() => {
                        setFulfillment("ship");
                        setHold(null);
                      }}
                    >
                      Ship to me
                    </button>
                  </div>
                  {fulfillment === "pickup" ? (
                    <p className="sots-shop-checkout__pickup-note">
                      Pick up at the Shakespeare in Pinkney Park booth. Digital gift certificates are emailed immediately.
                    </p>
                  ) : (
                    <div className="sots-co__fields">
                      <label className="sots-co__field" style={{ gridColumn: "1 / -1" }}>
                        <span>Street address</span>
                        <input
                          required={fulfillment === "ship"}
                          value={address.line1}
                          onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
                          autoComplete="address-line1"
                          placeholder="123 Main St"
                        />
                      </label>
                      <label className="sots-co__field">
                        <span>City</span>
                        <input
                          required={fulfillment === "ship"}
                          value={address.city}
                          onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                          autoComplete="address-level2"
                          placeholder="Rowayton"
                        />
                      </label>
                      <label className="sots-co__field">
                        <span>State</span>
                        <input
                          required={fulfillment === "ship"}
                          value={address.state}
                          onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                          autoComplete="address-level1"
                        />
                      </label>
                      <label className="sots-co__field">
                        <span>ZIP code</span>
                        <input
                          required={fulfillment === "ship"}
                          value={address.postalCode}
                          onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value }))}
                          autoComplete="postal-code"
                          placeholder="06853"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </section>

              <section
                id="shop-co-section-details"
                className={`sots-co__section${detailsDone ? " sots-co__section--done" : ""}`}
                aria-labelledby="shop-co-details-heading"
              >
                <CheckoutSectionHeader
                  step={2}
                  done={detailsDone}
                  headingId="shop-co-details-heading"
                  title="Your information"
                  description="We'll send your receipt and any digital items here."
                />
                <div className="sots-co__section-body">
                  <div className="sots-co__fields">
                    <label className="sots-co__field">
                      <span>Full name</span>
                      <input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Jane Smith" />
                    </label>
                    <label className="sots-co__field">
                      <span>Email</span>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" />
                    </label>
                    <label className="sots-co__field" style={{ gridColumn: "1 / -1" }}>
                      <span>Phone (optional)</span>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="(203) 555-0100" />
                    </label>
                  </div>
                </div>
              </section>

              <section
                id="shop-co-section-payment"
                className="sots-co__section sots-co__section--payment"
                aria-labelledby="shop-co-payment-heading"
              >
                <CheckoutSectionHeader
                  step={3}
                  headingId="shop-co-payment-heading"
                  title="Payment"
                  description="All major cards accepted."
                />
                <div className="sots-co__section-body">
                  <CheckoutPaymentPanel
                    cardContainerId={CARD_CONTAINER_ID}
                    cardReady={cardReady}
                    onRetry={retryCardMount}
                    showRetry={Boolean(error && !cardReady)}
                  />
                  <div className="sots-co__pay-row">
                    <p className="sots-co__pay-note">Taxes included where applicable</p>
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

      <CheckoutStickyPayBar
        formId={FORM_ID}
        totalCents={subtotal}
        payLabel={payLabel}
        disabled={payDisabled}
        loading={loading}
      />
    </>
  );
}
