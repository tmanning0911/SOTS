import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { readStoredBuyer, writeStoredBuyer } from "../../../js/buyer-storage.js";
import { completeShopCheckout, formatCents, prepareShopCheckout } from "../../../js/shop.js";
import { initSquareCard } from "../../../js/square-payments.js";
import { useShop } from "../../context/ShopContext.jsx";

const CARD_CONTAINER_ID = "sots-shop-square-card";

function ConfirmationView({ order, emailSent, returnHref }) {
  return (
    <div className="sots-checkout__confirmation sots-checkout__confirmation--page">
      <h2>Order confirmed</h2>
      <p className="sots-checkout__confirm-code">
        Confirmation <strong>{order.confirmationCode}</strong>
      </p>
      {emailSent ? (
        <p className="sots-checkout__hint">
          Receipt sent to <strong>{order.buyer?.email}</strong>.
        </p>
      ) : null}
      <ul className="sots-checkout__ticket-list">
        {order.lineItems.map((line) => (
          <li key={`${line.productId}-${line.name}`}>
            <strong>{line.name}</strong>
            <span>×{line.quantity}</span>
          </li>
        ))}
      </ul>
      <p className="sots-checkout__total">Total paid: {formatCents(order.totalCents)}</p>
      <Link to={returnHref} className="orpheum-arrow-btn orpheum-arrow-btn--gold">
        Continue shopping
      </Link>
    </div>
  );
}

export function ShopCheckoutForm({ returnHref = "/shop/" }) {
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

  const subtotal = cart.reduce((sum, line) => sum + line.price.value * line.quantity, 0);

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
      setError(err.message || "Checkout failed");
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
        <div className="sots-checkout-page__summary-card">
          <h3 className="sots-checkout-page__summary-heading">Your cart</h3>
          <ul className="sots-checkout-page__summary-lines">
            {cart.map((line) => (
              <li key={`${line.id}:${line.option ?? ""}`}>
                <span>
                  {line.quantity}× {line.name}
                  {line.option ? ` (${line.option})` : ""}
                </span>
                <span>{formatCents(line.price.value * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="sots-checkout-page__summary-total">
            <span>Total</span>
            <strong>{formatCents(subtotal)}</strong>
          </p>
        </div>
        <Link to={returnHref} className="sots-checkout-page__change-date">
          Edit cart
        </Link>
      </aside>

      <div className="sots-checkout-page__form-pane">
        <form id="sots-shop-checkout" className="sots-checkout__form" onSubmit={handlePay}>
          <div className="sots-checkout__buyer">
            <h3 className="sots-checkout-page__section-title">Your info</h3>
            <label>
              Name
              <input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </label>
            <label>
              Email
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
            <label>
              Phone <span className="sots-checkout__optional-label">(optional)</span>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
            </label>
          </div>

          <fieldset className="sots-shop-checkout__fulfillment">
            <legend>Pickup or ship</legend>
            <div className="sots-checkout__segmented">
              <button
                type="button"
                className={`sots-checkout__segment${fulfillment === "pickup" ? " is-active" : ""}`}
                onClick={() => setFulfillment("pickup")}
              >
                Pick up at the park
              </button>
              <button
                type="button"
                className={`sots-checkout__segment${fulfillment === "ship" ? " is-active" : ""}`}
                onClick={() => setFulfillment("ship")}
              >
                Ship to me
              </button>
            </div>
          </fieldset>

          {fulfillment === "ship" ? (
            <div className="sots-checkout__buyer">
              <label>
                Street address
                <input
                  required
                  value={address.line1}
                  onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
                  autoComplete="address-line1"
                />
              </label>
              <label>
                City
                <input
                  required
                  value={address.city}
                  onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                  autoComplete="address-level2"
                />
              </label>
              <div className="sots-checkout__buyer-row">
                <label>
                  State
                  <input
                    required
                    value={address.state}
                    onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                    autoComplete="address-level1"
                  />
                </label>
                <label>
                  ZIP
                  <input
                    required
                    value={address.postalCode}
                    onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value }))}
                    autoComplete="postal-code"
                  />
                </label>
              </div>
            </div>
          ) : null}

          <div className="sots-checkout__card">
            <h3 className="sots-checkout-page__section-title">Payment</h3>
            <div id={CARD_CONTAINER_ID} className="sots-checkout__card-container" />
            {!cardReady ? <p className="sots-checkout__loading">Loading card form…</p> : null}
          </div>

          {error ? (
            <p className="sots-checkout__error" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </div>

      <div className="sots-checkout-page__paybar">
        <p className="sots-checkout__total">
          Total <strong>{formatCents(subtotal)}</strong>
        </p>
        <button
          type="submit"
          form="sots-shop-checkout"
          className="orpheum-arrow-btn orpheum-arrow-btn--gold sots-checkout__submit"
          disabled={loading || !cardReady || !cart.length}
        >
          {loading ? "Processing…" : `Pay ${formatCents(subtotal)}`}
        </button>
      </div>
    </div>
  );
}
