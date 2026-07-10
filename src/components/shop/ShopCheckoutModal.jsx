import { useEffect, useId, useRef, useState } from "react";
import { completeShopCheckout, formatCents, prepareShopCheckout } from "../../../js/shop.js";
import { initSquareCard } from "../../../js/square-payments.js";
import { useShop } from "../../context/ShopContext.jsx";

const CARD_CONTAINER_ID = "sots-shop-square-card";

function ConfirmationView({ order, emailSent, onClose }) {
  return (
    <div className="sots-checkout__confirmation">
      <h3>Thank you!</h3>
      {emailSent ? (
        <p className="sots-checkout__hint">
          A confirmation email was sent to <strong>{order.buyer?.email}</strong>.
        </p>
      ) : null}
      <p className="sots-checkout__confirm-code">
        Confirmation <strong>{order.confirmationCode}</strong>
      </p>
      <p>Order <strong>{order.id}</strong></p>
      <ul className="sots-checkout__ticket-list">
        {order.lineItems.map((line) => (
          <li key={`${line.productId}-${line.name}`}>
            <strong>{line.name}</strong>
            <span>×{line.quantity}</span>
          </li>
        ))}
      </ul>
      <p className="sots-checkout__total">Total paid: {formatCents(order.totalCents)}</p>
      <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--gold" onClick={onClose}>
        Continue shopping
      </button>
    </div>
  );
}

export function ShopCheckoutModal({ open, onClose, onSuccess }) {
  const titleId = useId();
  const { cart } = useShop();
  const cardRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfillment, setFulfillment] = useState("pickup");
  const [address, setAddress] = useState({ line1: "", line2: "", city: "", state: "CT", postalCode: "" });
  const [note, setNote] = useState("");
  const [hold, setHold] = useState(null);
  const [order, setOrder] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardReady, setCardReady] = useState(false);

  useEffect(() => {
    if (!open) {
      setHold(null);
      setOrder(null);
      setEmailSent(false);
      setError("");
      setLoading(false);
      setCardReady(false);
      cardRef.current?.destroy?.();
      cardRef.current = null;
      return undefined;
    }

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
    };
  }, [open]);

  if (!open) return null;

  async function handlePay(e) {
    e.preventDefault();
    setError("");
    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }
    if (!cardRef.current) {
      setError("Payment form is not ready yet.");
      return;
    }

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
          note,
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
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Checkout failed");
      setHold(null);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (order) onSuccess?.();
    onClose();
  }

  const subtotal = cart.reduce((sum, line) => sum + line.price.value * line.quantity, 0);

  return (
    <div className="sots-checkout" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="sots-checkout__backdrop" aria-label="Close" onClick={handleClose} />
      <div className="sots-checkout__panel">
        <button type="button" className="sots-checkout__close" aria-label="Close" onClick={handleClose}>
          &times;
        </button>

        {order ? (
          <ConfirmationView order={order} emailSent={emailSent} onClose={handleClose} />
        ) : (
          <>
            <h2 id={titleId}>Checkout</h2>
            <ul className="sots-shop-checkout__summary">
              {cart.map((line) => (
                <li key={`${line.id}:${line.option ?? ""}`}>
                  {line.quantity}× {line.name}
                  {line.option ? ` (${line.option})` : ""} — {formatCents(line.price.value * line.quantity)}
                </li>
              ))}
            </ul>

            <form className="sots-checkout__form" onSubmit={handlePay}>
              <fieldset className="sots-checkout__buyer">
                <legend>Your details</legend>
                <label>
                  Name
                  <input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </label>
                <label>
                  Phone
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
                </label>
              </fieldset>

              <fieldset className="sots-shop-checkout__fulfillment">
                <legend>Fulfillment</legend>
                <label>
                  <input
                    type="radio"
                    name="fulfillment"
                    value="pickup"
                    checked={fulfillment === "pickup"}
                    onChange={() => setFulfillment("pickup")}
                  />
                  Pick up at Pinkney Park box office
                </label>
                <label>
                  <input
                    type="radio"
                    name="fulfillment"
                    value="ship"
                    checked={fulfillment === "ship"}
                    onChange={() => setFulfillment("ship")}
                  />
                  Ship to me
                </label>
              </fieldset>

              {fulfillment === "ship" ? (
                <fieldset className="sots-checkout__buyer">
                  <legend>Shipping address</legend>
                  <label>
                    Address
                    <input
                      required
                      value={address.line1}
                      onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
                      autoComplete="address-line1"
                    />
                  </label>
                  <label>
                    Apt / suite
                    <input
                      value={address.line2}
                      onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))}
                      autoComplete="address-line2"
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
                </fieldset>
              ) : null}

              <label>
                Order notes (optional)
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
              </label>

              <div className="sots-checkout__card">
                <p className="sots-checkout__card-label">Payment</p>
                <div id={CARD_CONTAINER_ID} className="sots-checkout__card-container" />
                {!cardReady ? <p className="sots-checkout__loading">Loading secure payment…</p> : null}
              </div>

              <p className="sots-checkout__total">
                Total: <strong>{formatCents(subtotal)}</strong>
              </p>

              {error ? (
                <p className="sots-checkout__error" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="orpheum-arrow-btn orpheum-arrow-btn--gold sots-checkout__submit"
                disabled={loading || !cardReady || !cart.length}
              >
                {loading ? "Processing…" : "Pay Now"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
