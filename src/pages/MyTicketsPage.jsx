import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { formatCents, resendOrderEmail } from "../../js/square-payments.js";
import { formatPerformanceDate } from "../../js/ticketing.js";
import { usePatron } from "../context/PatronContext.jsx";
import { TicketQr } from "../components/ticketing/TicketQr.jsx";

function OrderCard({ order, email }) {
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
    <article className="sots-order-card">
      <header className="sots-order-card__head">
        <div>
          <p className="sots-order-card__code">Confirmation {order.confirmationCode}</p>
          <h3>{order.productionTitle || "Shakespeare on the Sound"}</h3>
          <p>{formatPerformanceDate(order.performanceStart)}</p>
          {order.venue ? (
            <p className="sots-order-card__venue">
              {order.venue}
              {order.location ? ` · ${order.location}` : ""}
            </p>
          ) : null}
        </div>
        <p className="sots-order-card__total">{formatCents(order.totalCents)}</p>
      </header>

      <ul className="sots-order-card__tickets">
        {order.tickets.map((ticket) => (
          <li key={ticket.code}>
            <div className="sots-order-card__ticket">
              <div>
                <strong>{ticket.ticketTypeName}</strong>
                <span>#{ticket.code}</span>
              </div>
              <TicketQr orderId={order.id} ticketCode={ticket.code} />
            </div>
          </li>
        ))}
      </ul>

      <div className="sots-order-card__actions">
        <button
          type="button"
          className="orpheum-arrow-btn orpheum-arrow-btn--gold"
          onClick={handleResend}
          disabled={resendState === "loading" || resendState === "sent"}
        >
          {resendState === "loading" ? "Sending…" : resendState === "sent" ? "Email sent" : "Resend email"}
        </button>
        {resendError ? (
          <p className="sots-checkout__error" role="alert">
            {resendError}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function MyTicketsPage() {
  const [params, setParams] = useSearchParams();
  const {
    isSignedIn,
    user,
    orders,
    loadingOrders,
    error,
    requestMagicLink,
    signInWithToken,
    signOut,
    refreshOrders,
  } = usePatron();

  const [email, setEmail] = useState(user?.email ?? "");
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(false);

  useEffect(() => {
    document.title = "My Tickets - Shakespeare on the Sound";
  }, []);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  useEffect(() => {
    const token = params.get("token");
    if (!token || isSignedIn) return;

    let cancelled = false;
    setVerifyingToken(true);
    setAuthError("");
    signInWithToken(token)
      .then(() => {
        if (cancelled) return;
        setAuthMessage("You're signed in.");
        params.delete("token");
        setParams(params, { replace: true });
      })
      .catch((err) => {
        if (!cancelled) setAuthError(err.message || "Sign-in link expired");
      })
      .finally(() => {
        if (!cancelled) setVerifyingToken(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params, setParams, signInWithToken, isSignedIn]);

  async function handleRequestLink(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    setAuthMessage("");
    try {
      const result = await requestMagicLink(email);
      setAuthMessage(result.message || "Check your email for a sign-in link.");
    } catch (err) {
      setAuthError(err.message || "Could not send sign-in link");
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <main className="orpheum-page orpheum-page--inner sots-my-tickets-page">
      <div className="orpheum-container orpheum-container--narrow">
        <p className="orpheum-kicker">Tickets</p>
        <h1>My Tickets</h1>
        <p className="sots-my-tickets-page__lead">
          Sign in with your email to see every order in one place — no confirmation codes needed.
        </p>

        {!isSignedIn ? (
          <section className="sots-my-tickets-page__auth" aria-labelledby="my-tickets-sign-in">
            <h2 id="my-tickets-sign-in">Sign in</h2>
            {verifyingToken ? <p>Signing you in…</p> : null}
            <form className="sots-order-lookup" onSubmit={handleRequestLink}>
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
              <button
                type="submit"
                className="orpheum-arrow-btn orpheum-arrow-btn--gold"
                disabled={authLoading || verifyingToken}
              >
                {authLoading ? "Sending link…" : "Email me a sign-in link"}
              </button>
            </form>
            {authMessage ? <p className="sots-checkout__hint">{authMessage}</p> : null}
            {authError ? (
              <p className="sots-checkout__error" role="alert">
                {authError}
              </p>
            ) : null}
            <p className="sots-checkout__hint">
              Have a confirmation code instead?{" "}
              <Link to="/access-your-tickets/">Access Your Tickets</Link>.
            </p>
          </section>
        ) : (
          <section className="sots-my-tickets-page__signed-in">
            <div className="sots-my-tickets-page__signed-in-head">
              <p>
                Signed in as <strong>{user?.email}</strong>
              </p>
              <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--ghost" onClick={signOut}>
                Sign out
              </button>
            </div>

            {loadingOrders ? <p>Loading your tickets…</p> : null}
            {error ? (
              <p className="sots-checkout__error" role="alert">
                {error}
              </p>
            ) : null}

            {!loadingOrders && !orders.length ? (
              <div className="sots-my-tickets-page__empty">
                <p>No ticket orders yet for this email.</p>
                <Link to="/tickets/" className="orpheum-arrow-btn orpheum-arrow-btn--gold">
                  Buy tickets
                </Link>
              </div>
            ) : null}

            <div className="sots-my-tickets-page__orders">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} email={user?.email} />
              ))}
            </div>

            <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--ghost" onClick={() => refreshOrders()}>
              Refresh
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
