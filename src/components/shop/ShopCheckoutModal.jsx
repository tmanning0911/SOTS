import { useEffect, useId, useMemo, useRef, useState } from "react";
import { readStoredBuyer, writeStoredBuyer } from "../../../js/buyer-storage.js";
import { completeShopCheckout, formatCents, prepareShopCheckout } from "../../../js/shop.js";
import { initSquareCard } from "../../../js/square-payments.js";
import { useShop } from "../../context/ShopContext.jsx";

const CARD_CONTAINER_ID = "sots-shop-square-card";

function ConfirmationView({ order, emailSent, onClose }) {
  return (
    <div className="sots-checkout__confirmation">
      <h3>Order confirmed</h3>
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
  const storedBuyer = useMemo(() => readStoredBuyer(), []);

  const [step, setStep] = useState(1);
  const [name, setName] = useState(storedBuyer.name);
  const [email, setEmail] = useState(storedBuyer.email);
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

  const subtotal = cart.reduce((sum, line) => sum + line.price.value * line.quantity, 0);

  useEffect(() => {
    if (!open) {
      setStep(1);
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

    const buyer = readStoredBuyer();
    setName(buyer.name);
    setEmail(buyer.email);

    if (step !== 2) return undefined;

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
  }, [open, step]);

  if (!open) return null;

  function handleContinue(e) {
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
    writeStoredBuyer({ name, email });
    setHold(null);
    setStep(2);
  }

  async function handlePay(e) {
    e.preventDefault();
    setError("");
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

  return (
    <div className="sots-checkout" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="sots-checkout__backdrop" aria-label="Close" onClick={handleClose} />
      <div className="sots-checkout__panel">
        <button type="button" className="sots-checkout__close" aria-label="Close" onClick={handleClose}>
          &times;
        </button>

        {order ? (
          <div className="sots-checkout__body">
            <ConfirmationView order={order} emailSent={emailSent} onClose={handleClose} />
          </div>
        ) : (
          <>
            <div className="sots-checkout__body">
              <h2 id={titleId}>Checkout</h2>

              <ol className="sots-checkout__steps sots-checkout__steps--two" aria-label="Checkout progress">
                <li className={`sots-checkout__step is-${step === 1 ? "current" : "complete"}`}>
                  <span className="sots-checkout__step-num">1</span>
                  <span className="sots-checkout__step-label">Details</span>
                </li>
                <li className={`sots-checkout__step is-${step === 2 ? "current" : "upcoming"}`}>
                  <span className="sots-checkout__step-num">2</span>
                  <span className="sots-checkout__step-label">Pay</span>
                </li>
              </ol>

              <ul className="sots-shop-checkout__summary">
                {cart.map((line) => (
                  <li key={`${line.id}:${line.option ?? ""}`}>
                    {line.quantity}× {line.name}
                    {line.option ? ` (${line.option})` : ""} — {formatCents(line.price.value * line.quantity)}
                  </li>
                ))}
              </ul>

              {step === 1 ? (
                <form id="sots-shop-step-1" className="sots-checkout__form" onSubmit={handleContinue}>
                  <div className="sots-checkout__buyer">
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

                  {error ? (
                    <p className="sots-checkout__error" role="alert">
                      {error}
                    </p>
                  ) : null}
                </form>
              ) : null}

              {step === 2 ? (
                <form id="sots-shop-step-2" className="sots-checkout__form" onSubmit={handlePay}>
                  <button
                    type="button"
                    className="sots-checkout__back-link"
                    onClick={() => {
                      setStep(1);
                      setError("");
                      setHold(null);
                    }}
                  >
                    ← Edit details
                  </button>

                  <div className="sots-checkout__summary">
                    <p>
                      <strong>{name}</strong> · {email}
                    </p>
                    <p className="sots-checkout__hint">
                      {fulfillment === "pickup" ? "Pick up at Pinkney Park box office" : "Shipping to your address"}
                    </p>
                  </div>

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
                </form>
              ) : null}
            </div>

            <div className="sots-checkout__footer">
              <div className="sots-checkout__footer-row">
                <p className="sots-checkout__total">
                  Total <strong>{formatCents(subtotal)}</strong>
                </p>
                {step === 1 ? (
                  <button
                    type="submit"
                    form="sots-shop-step-1"
                    className="orpheum-arrow-btn orpheum-arrow-btn--gold sots-checkout__submit"
                    disabled={!cart.length}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="sots-shop-step-2"
                    className="orpheum-arrow-btn orpheum-arrow-btn--gold sots-checkout__submit"
                    disabled={loading || !cardReady || !cart.length}
                  >
                    {loading ? "Processing…" : `Pay ${formatCents(subtotal)}`}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
