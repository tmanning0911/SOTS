import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { heroImageForHref } from "../../js/page-heroes.js";
import { formatCents, resendOrderEmail } from "../../js/square-payments.js";
import { formatPerformanceDate } from "../../js/ticketing.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { PatronContactForm } from "../components/ticketing/PatronContactForm.jsx";
import { TicketQr } from "../components/ticketing/TicketQr.jsx";
import { usePatron } from "../context/PatronContext.jsx";

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
    profile,
    orders,
    loadingOrders,
    loadingProfile,
    error,
    requestMagicLink,
    signInWithToken,
    signOut,
    refreshOrders,
    saveProfile,
  } = usePatron();

  const [email, setEmail] = useState(user?.email ?? "");
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

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

  const ticketCount = useMemo(
    () => orders.reduce((sum, order) => sum + (order.tickets?.length ?? 0), 0),
    [orders],
  );

  const displayName = profile?.name?.trim() || "";

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

  async function handleSaveProfile(next) {
    setSavingProfile(true);
    try {
      await saveProfile(next);
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <InnerPageShell showVisit={false} showNewsletter={false}>
      <article className="orpheum-inner-page sots-account-page">
        <InnerPageHero
          className="sots-account-page__hero"
          eyebrow="Patron Account"
          title="My Tickets"
          intro="Your official Shakespeare on the Sound account — tickets, QR codes, and contact details for the box office."
          image={heroImageForHref("/my-tickets/")}
          actions={
            <>
              <ArrowButton href="/tickets/">Buy Tickets</ArrowButton>
              <ArrowButton href="/access-your-tickets/" variant="ghost">
                Confirmation code lookup
              </ArrowButton>
            </>
          }
        />

        <div className="orpheum-inner-page__body">
          <div className="orpheum-container sots-account-page__body" data-reveal>
            {!isSignedIn ? (
              <section className="sots-my-tickets-page__auth sots-account-panel" aria-labelledby="my-tickets-sign-in">
                <p className="sots-account-panel__eyebrow">Secure access</p>
                <h2 id="my-tickets-sign-in">Sign in to your account</h2>
                <p className="sots-my-tickets-page__lead">
                  Enter the email used at checkout. We&apos;ll send a secure one-time link — no password
                  required.
                </p>
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
              </section>
            ) : (
              <div className="sots-my-tickets-page__signed-in">
                <header className="sots-account-banner">
                  <div className="sots-account-banner__copy">
                    <p className="sots-account-banner__eyebrow">Shakespeare on the Sound</p>
                    <h2 className="sots-account-banner__title">
                      {displayName ? `Welcome, ${displayName.split(" ")[0]}` : "Your patron account"}
                    </h2>
                    <p className="sots-account-banner__meta">
                      Signed in as <strong>{user?.email}</strong>
                      {orders.length ? (
                        <>
                          {" "}
                          · {orders.length} order{orders.length === 1 ? "" : "s"} · {ticketCount} ticket
                          {ticketCount === 1 ? "" : "s"}
                        </>
                      ) : null}
                    </p>
                  </div>
                  <div className="sots-account-banner__actions">
                    <button
                      type="button"
                      className="orpheum-arrow-btn orpheum-arrow-btn--ghost"
                      onClick={() => refreshOrders()}
                    >
                      Refresh tickets
                    </button>
                    <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--ghost" onClick={signOut}>
                      Sign out
                    </button>
                  </div>
                </header>

                <div className="sots-account-layout">
                  <section
                    className="sots-account-panel sots-account-panel--contact"
                    aria-labelledby="patron-contact-heading"
                  >
                    {loadingProfile && !profile ? (
                      <p>Loading your contact information…</p>
                    ) : (
                      <PatronContactForm
                        profile={profile}
                        email={user?.email}
                        onSave={handleSaveProfile}
                        saving={savingProfile}
                      />
                    )}
                  </section>

                  <section className="sots-account-panel sots-account-panel--tickets" aria-labelledby="patron-tickets-heading">
                    <div className="sots-patron-contact__intro">
                      <h2 id="patron-tickets-heading">Your tickets</h2>
                      <p>Present these QR codes at the entrance. You can also resend confirmation emails below.</p>
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
                  </section>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </InnerPageShell>
  );
}
