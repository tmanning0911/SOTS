import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { readStoredBuyer, writeStoredBuyer } from "../../../js/buyer-storage.js";
import { completeShopCheckout, formatCents, prepareShopCheckout } from "../../../js/shop.js";
import { initSquareCard } from "../../../js/square-payments.js";
import { useShop } from "../../context/ShopContext.jsx";

const CARD_CONTAINER_ID = "sots-shop-square-card";

function CheckoutSection({ step, title, description, children, className = "" }) {
  return (
    <section className={`sots-checkout-section ${className}`.trim()} aria-labelledby={`shop-checkout-${step}-heading`}>
      <header className="sots-checkout-section__head">
        <span className="sots-checkout-section__step" aria-hidden="true">
          {step}
        </span>
        <div>
          <h2 id={`shop-checkout-${step}-heading`} className="sots-checkout-section__title">
            {title}
          </h2>
          {description ? <p className="sots-checkout-section__desc">{description}</p> : null}
        </div>
      </header>
      <div className="sots-checkout-section__body">{children}</div>
    </section>
  );
}

function CartSummary({ cart, totalCents, compact = false, featuredImage }) {
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div className={`sots-checkout-page__summary-card sots-shop-checkout__summary${compact ? " is-compact" : ""}`}>
      {!compact && featuredImage ? (
        <img src={featuredImage} alt="" className="sots-checkout-page__summary-poster" loading="lazy" />
      ) : null}
      <div className="sots-checkout-page__summary-copy">
        {!compact ? <p className="sots-checkout-page__summary-eyebrow">Order summary</p> : null}
        {!compact ? <p className="sots-checkout-page__summary-show">Gift Shop</p> : null}
        {!compact ? (
          <p className="sots-checkout-page__summary-venue">
            {itemCount} item{itemCount === 1 ? "" : "s"} in your cart
          </p>
        ) : null}
      </div>
      <ul className="sots-checkout-page__summary-lines sots-shop-checkout__summary-lines">
        {cart.map((line) => (
          <li key={`${line.id}:${line.option ?? ""}`} className="sots-shop-checkout__summary-item">
            {line.image ? (
              <img src={line.image} alt="" className="sots-shop-checkout__summary-thumb" loading="lazy" />
            ) : (
              <span className="sots-shop-checkout__summary-thumb sots-shop-checkout__summary-thumb--empty" aria-hidden="true" />
            )}
            <span className="sots-shop-checkout__summary-item-copy">
              <span className="sots-shop-checkout__summary-item-name">
                {line.quantity}× {line.name}
                {line.option ? ` (${line.option})` : ""}
              </span>
              {line.digital ? <span className="sots-shop-checkout__summary-tag">Digital delivery</span> : null}
            </span>
            <span className="sots-shop-checkout__summary-item-price">{formatCents(line.price.value * line.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="sots-checkout-page__summary-total">
        <span>
          Total
          {itemCount ? ` · ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}
        </span>
        <strong>{formatCents(totalCents)}</strong>
      </p>
      {!compact ? (
        <p className="sots-checkout-page__summary-trust">Secure checkout · Instant email confirmation</p>
      ) : null}
    </div>
  );
}

function ConfirmationView({ order, emailSent, returnHref }) {
  return (
    <div className="sots-checkout__confirmation sots-checkout__confirmation--page">
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
      {order.fulfillment === "pickup" ? (
        <div className="sots-checkout__next-steps">
          <h3>Pickup at Pinkney Park</h3>
          <ol>
            <li>Bring your confirmation code to the merchandise table.</li>
            <li>Pickup is available during show nights and select weekend hours.</li>
            <li>Digital items arrive by email — no pickup needed.</li>
          </ol>
        </div>
      ) : (
        <div className="sots-checkout__next-steps">
          <h3>Shipping</h3>
          <ol>
            <li>We&apos;ll email you when your order ships.</li>
            <li>Most orders leave within 3–5 business days.</li>
            <li>Digital gift certificates deliver by email right away.</li>
          </ol>
        </div>
      )}
      <p className="sots-checkout__total sots-checkout__total--confirm">Total paid: {formatCents(order.totalCents)}</p>
      <div className="sots-checkout__confirm-actions">
        <Link to={returnHref} className="orpheum-arrow-btn orpheum-arrow-btn--gold">
          Continue shopping
        </Link>
        <Link to="/tickets/" className="orpheum-arrow-btn orpheum-arrow-btn--ghost">
          Get tickets
        </Link>
      </div>
    </div>
  );
}

export function ShopCheckoutForm({ returnHref = "/shop/", cartTotal }) {
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

  const subtotal = cartTotal ?? cart.reduce((sum, line) => sum + line.price.value * line.quantity, 0);
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const featuredImage = cart.find((line) => line.image)?.image ?? null;

  useEffect(() => {
    const buyer = readStoredBuyer();
    setName(buyer.name);
    setEmail(buyer.email);
  }, []);

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
  }, []);

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
      return;
    }
    if (fulfillment === "ship" && !address.line1.trim()) {
      setError("Enter a shipping address.");
      return;
    }
    if (!cardRef.current) {
      setError("Payment form is not ready yet.");
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

  return (
    <div className="sots-checkout-page__layout sots-checkout-page__layout--form">
      <aside className="sots-checkout-page__summary-pane" aria-label="Order summary">
        <CartSummary cart={cart} totalCents={subtotal} featuredImage={featuredImage} />
        <Link to={returnHref} className="sots-checkout-page__change-date">
          ← Edit cart
        </Link>
      </aside>

      <div className="sots-checkout-page__form-pane">
        <div className="sots-checkout-page__mobile-summary" aria-label="Order total">
          <CartSummary cart={cart} totalCents={subtotal} compact />
        </div>

        <form id="sots-shop-checkout" className="sots-checkout__form" onSubmit={handlePay}>
          <CheckoutSection
            step="1"
            title="Pickup or delivery"
            description="Choose how you'd like to receive your order."
            className="sots-shop-checkout__delivery-section"
          >
            <div className="sots-checkout__segmented sots-shop-checkout__segmented">
              <button
                type="button"
                className={`sots-checkout__segment${fulfillment === "pickup" ? " is-active" : ""}`}
                onClick={() => {
                  setFulfillment("pickup");
                  setHold(null);
                }}
              >
                <span className="sots-shop-checkout__segment-title">Pick up at the park</span>
                <span className="sots-shop-checkout__segment-note">Free · Show nights at Pinkney Park</span>
              </button>
              <button
                type="button"
                className={`sots-checkout__segment${fulfillment === "ship" ? " is-active" : ""}`}
                onClick={() => {
                  setFulfillment("ship");
                  setHold(null);
                }}
              >
                <span className="sots-shop-checkout__segment-title">Ship to me</span>
                <span className="sots-shop-checkout__segment-note">Standard shipping rates apply</span>
              </button>
            </div>
            {fulfillment === "pickup" ? (
              <p className="sots-shop-checkout__pickup-note">
                Pick up merchandise at the Pinkney Park booth. Digital gift certificates are emailed immediately.
              </p>
            ) : null}
            {fulfillment === "ship" ? (
              <div className="sots-checkout__field-grid sots-shop-checkout__address">
                <label className="sots-checkout__field sots-checkout__field--full">
                  <span>Street address</span>
                  <input
                    required
                    value={address.line1}
                    onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
                    autoComplete="address-line1"
                    placeholder="123 Main St"
                  />
                </label>
                <label className="sots-checkout__field">
                  <span>City</span>
                  <input
                    required
                    value={address.city}
                    onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                    autoComplete="address-level2"
                    placeholder="Rowayton"
                  />
                </label>
                <label className="sots-checkout__field">
                  <span>State</span>
                  <input
                    required
                    value={address.state}
                    onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                    autoComplete="address-level1"
                  />
                </label>
                <label className="sots-checkout__field">
                  <span>ZIP code</span>
                  <input
                    required
                    value={address.postalCode}
                    onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value }))}
                    autoComplete="postal-code"
                    placeholder="06853"
                  />
                </label>
              </div>
            ) : null}
          </CheckoutSection>

          <CheckoutSection
            step="2"
            title="Your information"
            description="We'll send your receipt and any digital items here."
          >
            <div className="sots-checkout__field-grid">
              <label className="sots-checkout__field">
                <span>Full name</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Jane Smith"
                />
              </label>
              <label className="sots-checkout__field">
                <span>Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </label>
              <label className="sots-checkout__field sots-checkout__field--full">
                <span>
                  Phone <span className="sots-checkout__optional-label">(optional)</span>
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  placeholder="(203) 555-0100"
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
              <li>Receipt arrives in your inbox within minutes.</li>
              <li>Digital items deliver by email automatically.</li>
              <li>Pickup orders are held at the park merchandise table.</li>
            </ol>
          </div>

          {error ? (
            <div className="sots-checkout__error-panel" role="alert">
              <p className="sots-checkout__error">{error}</p>
              {paymentError ? <p className="sots-checkout__hint">Please check your card details and try again.</p> : null}
            </div>
          ) : null}
        </form>
      </div>

      <div className="sots-checkout-page__paybar">
        <div className="sots-checkout-page__paybar-copy">
          <p className="sots-checkout__total">
            {itemCount ? (
              <>
                {itemCount} item{itemCount === 1 ? "" : "s"} · <strong>{formatCents(subtotal)}</strong>
              </>
            ) : (
              <>
                Total <strong>{formatCents(subtotal)}</strong>
              </>
            )}
          </p>
          <p className="sots-checkout-page__paybar-note">Taxes included where applicable</p>
        </div>
        <button
          type="submit"
          form="sots-shop-checkout"
          className="orpheum-arrow-btn orpheum-arrow-btn--gold sots-checkout__submit"
          disabled={loading || !cardReady || !cart.length}
        >
          {loading ? "Processing…" : cart.length ? `Pay ${formatCents(subtotal)}` : "Cart empty"}
        </button>
      </div>
    </div>
  );
}
