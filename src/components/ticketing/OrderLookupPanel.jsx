import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatCents, lookupOrder } from "../../../js/square-payments.js";
import { formatPerformanceDate } from "../../../js/ticketing.js";
import { ArrowButton } from "../ArrowButton.jsx";
import { OrderResendButton } from "./OrderResendButton.jsx";
import { TicketQr } from "./TicketQr.jsx";

function OrderDetails({ order, email }) {
  return (
    <div className="sots-order-lookup__result">
      <p>
        <strong>{order.id}</strong> · Code {order.confirmationCode}
      </p>
      {order.productionTitle ? <p>{order.productionTitle}</p> : null}
      <p>{formatPerformanceDate(order.performanceStart)}</p>
      {order.venue ? (
        <p>
          {order.venue}
          {order.location ? ` · ${order.location}` : ""}
        </p>
      ) : null}
      <ul className="sots-order-lookup__tickets">
        {order.tickets.map((ticket) => (
          <li key={ticket.code}>
            <div className="sots-order-lookup__ticket">
              <div>
                {ticket.ticketTypeName} — <strong>{ticket.code}</strong>
              </div>
              <TicketQr orderId={order.id} ticketCode={ticket.code} />
            </div>
          </li>
        ))}
      </ul>
      <p>Total: {formatCents(order.totalCents)}</p>
      <div className="sots-order-lookup__actions">
        <OrderResendButton
          email={email}
          confirmationCode={order.confirmationCode}
          label="Resend confirmation email"
        />
      </div>
    </div>
  );
}

export function OrderLookupPanel({ initialEmail = "", initialCode = "", onBuyTickets }) {
  const [email, setEmail] = useState(initialEmail);
  const [confirmationCode, setConfirmationCode] = useState(initialCode);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialEmail || !initialCode) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    lookupOrder(initialEmail, initialCode)
      .then((found) => {
        if (!cancelled) setOrder(found);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Order not found");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialEmail, initialCode]);

  async function handleLookup(e) {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const found = await lookupOrder(email, confirmationCode);
      setOrder(found);
    } catch (err) {
      setError(err.message || "Order not found");
    } finally {
      setLoading(false);
    }
  }

  if (order) {
    return <OrderDetails order={order} email={email || initialEmail} />;
  }

  return (
    <>
      <p>
        Look up a single order with the email and confirmation code from an account-flow or
        box-office purchase. Online payment-link orders are not available here — bring your email
        receipt to the gate.
      </p>
      <p className="sots-checkout__hint">
        For all your shows, <Link to="/my-tickets/">open My Tickets</Link>.
      </p>
      <form className="sots-order-lookup" onSubmit={handleLookup}>
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
          Confirmation code
          <input
            type="text"
            required
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
            autoComplete="off"
            placeholder="6-character code"
          />
        </label>
        {error ? (
          <p className="sots-checkout__error" role="alert">
            {error}
          </p>
        ) : null}
        <ArrowButton type="submit" disabled={loading}>
          {loading ? "Looking up…" : "View Tickets"}
        </ArrowButton>
      </form>
      {onBuyTickets ? (
        <p className="sots-checkout__hint">
          Need tickets? <a href="/tickets/">Buy tickets</a>
        </p>
      ) : null}
    </>
  );
}
