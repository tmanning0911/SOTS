import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { heroImageForHref } from "../../js/page-heroes.js";
import { downloadOrderCalendar, isUpcomingOrder } from "../../js/ticket-calendar.js";
import { formatCents, resendOrderEmail } from "../../js/square-payments.js";
import { formatPerformanceDate } from "../../js/ticketing.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { PatronContactForm } from "../components/ticketing/PatronContactForm.jsx";
import { TicketQr } from "../components/ticketing/TicketQr.jsx";
import { usePatron } from "../context/PatronContext.jsx";

function OrderCard({ order, email, past = false }) {
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
    <article className={`sots-order-card${past ? " sots-order-card--past" : ""}`}>
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
          {past ? <p className="sots-order-card__badge">Past performance</p> : null}
        </div>
        <p className="sots-order-card__total">{formatCents(order.totalCents)}</p>
      </header>

      {!past ? (
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
      ) : (
        <p className="sots-order-card__past-summary">
          {order.tickets?.length ?? 0} ticket{(order.tickets?.length ?? 0) === 1 ? "" : "s"} · kept for your records
        </p>
      )}

      <div className="sots-order-card__actions">
        {!past ? (
          <button
            type="button"
            className="orpheum-arrow-btn orpheum-arrow-btn--gold"
            onClick={() => downloadOrderCalendar(order)}
          >
            Add to calendar
          </button>
        ) : null}
        <button
          type="button"
          className="orpheum-arrow-btn orpheum-arrow-btn--ghost"
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
    avatarUrl,
    orders,
    loadingOrders,
    loadingProfile,
    uploadingAvatar,
    error,
    requestMagicLink,
    signInWithToken,
    signOut,
    refreshOrders,
    saveProfile,
    uploadAvatar,
    removeAvatar,
  } = usePatron();

  const [email, setEmail] = useState(user?.email ?? "");
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [pastOpen, setPastOpen] = useState(false);
  const contactDetailsRef = useRef(null);

  useEffect(() => {
    document.title = "My Tickets - Shakespeare on the Sound";
  }, []);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  useEffect(() => {
    if (!isSignedIn || loadingProfile) return;
    if (!profile?.name?.trim()) setContactOpen(true);
  }, [isSignedIn, loadingProfile, profile?.name]);

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

  const { upcomingOrders, pastOrders } = useMemo(() => {
    const upcoming = [];
    const past = [];
    for (const order of orders) {
      if (isUpcomingOrder(order)) upcoming.push(order);
      else past.push(order);
    }
    upcoming.sort((a, b) => String(a.performanceStart).localeCompare(String(b.performanceStart)));
    past.sort((a, b) => String(b.performanceStart).localeCompare(String(a.performanceStart)));
    return { upcomingOrders: upcoming, pastOrders: past };
  }, [orders]);

  const displayName = profile?.name?.trim() || "";

  function openContact() {
    setContactOpen(true);
    requestAnimationFrame(() => {
      contactDetailsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

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
      <article className={`orpheum-inner-page sots-account-page${isSignedIn ? " sots-account-page--signed-in" : ""}`}>
        {isSignedIn ? (
          <InnerPageHero
            className="sots-account-page__hero"
            compact
            variant="plain"
            eyebrow="Patron account"
            title="My Tickets"
            intro="Your tickets and QR codes for Shakespeare on the Sound."
          />
        ) : (
          <InnerPageHero
            className="sots-account-page__hero"
            compact
            eyebrow="Patron account"
            title="My Tickets"
            intro="Sign in with the email from checkout to view tickets and QR codes."
            image={heroImageForHref("/my-tickets/")}
            actions={
              <ArrowButton href="/access-your-tickets/" variant="ghost">
                Have a confirmation code?
              </ArrowButton>
            }
          />
        )}

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
                  <div className="sots-account-banner__identity">
                    <button
                      type="button"
                      className="sots-account-banner__avatar"
                      onClick={openContact}
                      aria-label={avatarUrl ? "Edit profile photo and contact information" : "Add profile photo and contact information"}
                    >
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" />
                      ) : (
                        <span>
                          {(displayName || user?.email || "?")
                            .split(/\s+|@/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase() || "?"}
                        </span>
                      )}
                    </button>
                    <div className="sots-account-banner__copy">
                      <h2 className="sots-account-banner__title">
                        {displayName ? `Welcome, ${displayName.split(" ")[0]}` : "Signed in"}
                      </h2>
                      <p className="sots-account-banner__meta">
                        <strong>{user?.email}</strong>
                        {orders.length ? (
                          <>
                            {" "}
                            · {orders.length} order{orders.length === 1 ? "" : "s"} · {ticketCount} ticket
                            {ticketCount === 1 ? "" : "s"}
                          </>
                        ) : null}
                      </p>
                    </div>
                  </div>
                  <div className="sots-account-banner__actions">
                    <button
                      type="button"
                      className="orpheum-arrow-btn orpheum-arrow-btn--ghost"
                      onClick={() => refreshOrders()}
                    >
                      Refresh
                    </button>
                    <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--ghost" onClick={signOut}>
                      Sign out
                    </button>
                  </div>
                </header>

                <div className="sots-account-layout">
                  <section
                    className="sots-account-panel sots-account-panel--tickets"
                    aria-labelledby="patron-tickets-heading"
                  >
                    <div className="sots-patron-contact__intro">
                      <h2 id="patron-tickets-heading">Your tickets</h2>
                      {orders.length ? (
                        <p>
                          Upcoming shows first — present QR codes at the entrance. Add a show to your calendar
                          so you don’t miss the night.
                        </p>
                      ) : (
                        <p>Orders placed with this email will show up here with entry QR codes.</p>
                      )}
                    </div>

                    {loadingOrders ? <p>Loading your tickets…</p> : null}
                    {error ? (
                      <p className="sots-checkout__error" role="alert">
                        {error}
                      </p>
                    ) : null}

                    {!loadingOrders && !orders.length ? (
                      <div className="sots-my-tickets-page__empty">
                        <p className="sots-my-tickets-page__empty-title">No tickets yet</p>
                        <p>When you buy tickets with {user?.email}, they&apos;ll appear here automatically.</p>
                        <Link to="/tickets/" className="orpheum-arrow-btn orpheum-arrow-btn--gold">
                          Browse performances
                        </Link>
                      </div>
                    ) : null}

                    {upcomingOrders.length ? (
                      <div className="sots-my-tickets-page__group">
                        <h3 className="sots-my-tickets-page__group-title">Upcoming</h3>
                        <div className="sots-my-tickets-page__orders">
                          {upcomingOrders.map((order) => (
                            <OrderCard key={order.id} order={order} email={user?.email} />
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {!loadingOrders && orders.length && !upcomingOrders.length ? (
                      <div className="sots-my-tickets-page__empty sots-my-tickets-page__empty--inline">
                        <p className="sots-my-tickets-page__empty-title">No upcoming shows</p>
                        <p>Your past orders are below. Ready for another night at Pinkney Park?</p>
                        <Link to="/tickets/" className="orpheum-arrow-btn orpheum-arrow-btn--gold">
                          Browse performances
                        </Link>
                      </div>
                    ) : null}

                    {pastOrders.length ? (
                      <details
                        className="sots-my-tickets-page__past"
                        open={pastOpen}
                        onToggle={(e) => setPastOpen(e.currentTarget.open)}
                      >
                        <summary className="sots-my-tickets-page__past-summary">
                          Past performances ({pastOrders.length})
                        </summary>
                        <div className="sots-my-tickets-page__orders">
                          {pastOrders.map((order) => (
                            <OrderCard key={order.id} order={order} email={user?.email} past />
                          ))}
                        </div>
                      </details>
                    ) : null}
                  </section>

                  <details
                    ref={contactDetailsRef}
                    className="sots-account-panel sots-account-panel--contact sots-account-details"
                    open={contactOpen}
                    onToggle={(e) => setContactOpen(e.currentTarget.open)}
                  >
                    <summary className="sots-account-details__summary">
                      <span>
                        <span className="sots-account-panel__eyebrow">Optional</span>
                        <span className="sots-account-details__title">Contact information</span>
                      </span>
                      <span className="sots-account-details__hint">
                        {contactOpen ? "Hide" : "Edit for box office"}
                      </span>
                    </summary>
                    <div className="sots-account-details__body">
                      {loadingProfile && !profile ? (
                        <p>Loading your contact information…</p>
                      ) : (
                        <PatronContactForm
                          profile={profile}
                          email={user?.email}
                          avatarUrl={avatarUrl}
                          onSave={handleSaveProfile}
                          onUploadAvatar={uploadAvatar}
                          onRemoveAvatar={removeAvatar}
                          saving={savingProfile}
                          loading={loadingProfile && !profile?.name}
                          uploadingAvatar={uploadingAvatar}
                          showIntro={false}
                        />
                      )}
                    </div>
                  </details>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </InnerPageShell>
  );
}
