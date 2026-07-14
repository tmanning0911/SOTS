import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatCents, lookupOrder, resendOrderEmail } from "../../../js/square-payments.js";
import { formatPerformanceDate } from "../../../js/ticketing.js";
import { ArrowButton } from "../ArrowButton.jsx";
import { TicketQr } from "./TicketQr.jsx";

function OrderDetails({ order, email }) {
  const [resendState, setResendState] = useState("idle");
  const [resendError, setResendError] = useState("");

  async function handleResend() {
    setResendState("loading");
    setResendError("");
    try {
      await resendOrderEmail(email, order.confirmationCode);
      setResendState("sent");
    } catch (err) {
      setResendError(err.message || "Could not resend email");
      setResendState("idle");
    }
  }

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
        <ArrowButton
          type="button"
          onClick={handleResend}
          disabled={resendState === "loading" || resendState === "sent"}
        >
          {resendState === "loading"
            ? "Sending…"
            : resendState === "sent"
              ? "Email sent"
              : "Resend confirmation email"}
        </ArrowButton>
        {resendError ? (
          <p className="sots-checkout__error" role="alert">
            {resendError}
          </p>
        ) : null}
        {resendState === "sent" ? (
          <p className="sots-checkout__hint">Check your inbox for your tickets and confirmation code.</p>
        ) : null}
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
      <p>Look up a single order with the email and confirmation code from checkout.</p>
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
