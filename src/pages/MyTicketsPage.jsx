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
import {
  fetchPasskeyStatus,
  registerPatronPasskey,
  verifyPatronPasskey,
} from "../../js/patron-webauthn.js";

function ResendButton({ email, confirmationCode }) {
  const [resendState, setResendState] = useState("idle");
  const [resendError, setResendError] = useState("");

  async function handleResend() {
    setResendState("loading");
    setResendError("");
    try {
      await resendOrderEmail(email, confirmationCode);
      setResendState("sent");
    } catch (err) {
      setResendError(err.message || "Could not resend email");
      setResendState("idle");
    }
  }

  return (
    <>
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
    </>
  );
}

function OrderCard({ order, email, past = false }) {
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
          {(order.tickets ?? []).map((ticket) => (
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

      {order.shopLineItems?.length ? (
        <div className="sots-order-card__shop">
          <p className="sots-order-card__shop-label">Souvenirs · park pickup</p>
          <ul className="sots-order-card__shop-list">
            {order.shopLineItems.map((line, index) => (
              <li key={`${line.productId}-${line.option ?? ""}-${index}`}>
                {line.quantity}× {line.name}
                {line.option ? ` (${line.option})` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

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
        <ResendButton email={email} confirmationCode={order.confirmationCode} />
      </div>
    </article>
  );
}

function formatShopDate(iso) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function ShopOrderCard({ order, email }) {
  const itemCount = (order.lineItems ?? []).reduce((sum, line) => sum + (line.quantity || 0), 0);
  const fulfillmentLabel = order.fulfillment === "ship" ? "Ship to me" : "Park pickup";

  return (
    <article className="sots-order-card sots-order-card--shop">
      <header className="sots-order-card__head">
        <div>
          <p className="sots-order-card__code">Confirmation {order.confirmationCode}</p>
          <h3>Gift shop</h3>
          <p>{formatShopDate(order.createdAt)}</p>
          <p className="sots-order-card__venue">
            {fulfillmentLabel}
            {itemCount ? ` · ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}
          </p>
        </div>
        <p className="sots-order-card__total">{formatCents(order.totalCents)}</p>
      </header>

      <ul className="sots-order-card__lines">
        {(order.lineItems ?? []).map((line, index) => (
          <li key={`${line.productId || line.sku || line.name}-${index}`}>
            <span>
              {line.quantity}× {line.name}
              {line.option ? ` (${line.option})` : ""}
            </span>
            <span>{formatCents(line.lineTotal ?? (line.unitPrice || 0) * (line.quantity || 0))}</span>
          </li>
        ))}
      </ul>

      <div className="sots-order-card__actions">
        <Link to="/shop/" className="orpheum-arrow-btn orpheum-arrow-btn--ghost">
          Visit shop
        </Link>
        <ResendButton email={email} confirmationCode={order.confirmationCode} />
      </div>
    </article>
  );
}

export function MyTicketsPage() {
  const [params, setParams] = useSearchParams();
  const {
    isSignedIn,
    bootstrapping,
    needsPasskey,
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
    signOutEverywhere,
    markPasskeyVerified,
    refreshOrders,
    saveProfile,
    uploadAvatar,
    removeAvatar,
  } = usePatron();

  const [email, setEmail] = useState(user?.email ?? "");
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [pendingMagicToken, setPendingMagicToken] = useState("");
  const [verifyingToken, setVerifyingToken] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [pastOpen, setPastOpen] = useState(false);
  const [passkeyBusy, setPasskeyBusy] = useState(false);
  const [passkeyMessage, setPasskeyMessage] = useState("");
  const [hasPasskey, setHasPasskey] = useState(false);
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
    // Prefetch-safe: hold the token until the patron explicitly confirms.
    setPendingMagicToken(token);
    setAuthMessage("Almost there — tap below to open your tickets.");
    params.delete("token");
    setParams(params, { replace: true });
  }, [params, setParams, isSignedIn]);

  useEffect(() => {
    if (!isSignedIn || needsPasskey) return;
    let cancelled = false;
    fetchPasskeyStatus()
      .then((status) => {
        if (!cancelled) setHasPasskey(Boolean(status.hasPasskeys));
      })
      .catch(() => {
        if (!cancelled) setHasPasskey(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, needsPasskey]);

  async function handleConfirmMagicLink() {
    if (!pendingMagicToken) return;
    setVerifyingToken(true);
    setAuthError("");
    try {
      const session = await signInWithToken(pendingMagicToken);
      setPendingMagicToken("");
      setAuthMessage("You're in.");
      if (session?.needsPasskey) {
        setPasskeyMessage("One more step — confirm with Face ID or your device lock.");
      }
    } catch (err) {
      setAuthError(err.message || "That link expired. Request a new one.");
      setPendingMagicToken("");
    } finally {
      setVerifyingToken(false);
    }
  }

  async function handlePasskeyUnlock() {
    setPasskeyBusy(true);
    setPasskeyMessage("");
    setAuthError("");
    try {
      await verifyPatronPasskey();
      markPasskeyVerified();
      setHasPasskey(true);
      await refreshOrders();
      setPasskeyMessage("You're all set.");
    } catch (err) {
      setAuthError(err.message || "Couldn't confirm. Try again.");
    } finally {
      setPasskeyBusy(false);
    }
  }

  async function handleAddPasskey() {
    setPasskeyBusy(true);
    setPasskeyMessage("");
    setAuthError("");
    try {
      await registerPatronPasskey();
      markPasskeyVerified();
      setHasPasskey(true);
      setPasskeyMessage("Saved. Next time you can unlock with Face ID or your device lock.");
      await refreshOrders();
    } catch (err) {
      setAuthError(err.message || "Couldn't set that up. Try again.");
    } finally {
      setPasskeyBusy(false);
    }
  }

  const ticketOrders = useMemo(
    () => orders.filter((order) => order.type !== "shop"),
    [orders],
  );
  const shopOrders = useMemo(
    () =>
      orders
        .filter((order) => order.type === "shop")
        .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))),
    [orders],
  );

  const ticketCount = useMemo(
    () => ticketOrders.reduce((sum, order) => sum + (order.tickets?.length ?? 0), 0),
    [ticketOrders],
  );

  const { upcomingOrders, pastOrders } = useMemo(() => {
    const upcoming = [];
    const past = [];
    for (const order of ticketOrders) {
      if (isUpcomingOrder(order)) upcoming.push(order);
      else past.push(order);
    }
    upcoming.sort((a, b) => String(a.performanceStart).localeCompare(String(b.performanceStart)));
    past.sort((a, b) => String(b.performanceStart).localeCompare(String(a.performanceStart)));
    return { upcomingOrders: upcoming, pastOrders: past };
  }, [ticketOrders]);

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
      setAuthMessage(result.message || "Check your email — we sent you a link.");
    } catch (err) {
      setAuthError(err.message || "Couldn't send the email. Try again in a moment.");
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
            eyebrow="Tickets"
            title="My Tickets"
            intro="Your shows, QR codes, and gift shop orders."
          />
        ) : (
          <InnerPageHero
            className="sots-account-page__hero"
            compact
            eyebrow="Tickets"
            title="My Tickets"
            intro="Use the email from your order to see your tickets and QR codes."
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
            {bootstrapping && !isSignedIn ? (
              <section className="sots-account-panel" aria-live="polite">
                <p className="sots-my-tickets-page__lead">One moment…</p>
              </section>
            ) : !isSignedIn ? (
              <section className="sots-my-tickets-page__auth sots-account-panel" aria-labelledby="my-tickets-sign-in">
                <h2 id="my-tickets-sign-in">See your tickets</h2>
                <p className="sots-my-tickets-page__lead">
                  Enter the email you used when you bought tickets. We&apos;ll send a link — no password
                  needed.
                </p>
                {pendingMagicToken ? (
                  <div className="sots-my-tickets-page__confirm-link">
                    <p className="sots-checkout__hint">
                      Your email link worked. Tap below to open your tickets.
                    </p>
                    <button
                      type="button"
                      className="orpheum-arrow-btn orpheum-arrow-btn--gold"
                      onClick={handleConfirmMagicLink}
                      disabled={verifyingToken}
                    >
                      {verifyingToken ? "Opening…" : "Open my tickets"}
                    </button>
                  </div>
                ) : (
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
                      {authLoading ? "Sending…" : "Email me a link"}
                    </button>
                  </form>
                )}
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
                        {displayName ? `Hi, ${displayName.split(" ")[0]}` : "Hi there"}
                      </h2>
                      <p className="sots-account-banner__meta">
                        <strong>{user?.email}</strong>
                        {orders.length ? (
                          <>
                            {" "}
                            · {ticketOrders.length} ticket order{ticketOrders.length === 1 ? "" : "s"}
                            {ticketCount ? ` · ${ticketCount} ticket${ticketCount === 1 ? "" : "s"}` : ""}
                            {shopOrders.length
                              ? ` · ${shopOrders.length} shop order${shopOrders.length === 1 ? "" : "s"}`
                              : ""}
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
                    <button
                      type="button"
                      className="orpheum-arrow-btn orpheum-arrow-btn--ghost"
                      onClick={() => signOutEverywhere()}
                    >
                      Sign out everywhere
                    </button>
                  </div>
                </header>

                {needsPasskey ? (
                  <section className="sots-account-panel" aria-labelledby="passkey-unlock-heading">
                    <h2 id="passkey-unlock-heading">Confirm it&apos;s you</h2>
                    <p className="sots-my-tickets-page__lead">
                      Use Face ID, Touch ID, or your device lock to finish opening My Tickets.
                    </p>
                    <button
                      type="button"
                      className="orpheum-arrow-btn orpheum-arrow-btn--gold"
                      onClick={handlePasskeyUnlock}
                      disabled={passkeyBusy}
                    >
                      {passkeyBusy ? "Waiting…" : "Continue"}
                    </button>
                    {passkeyMessage ? <p className="sots-checkout__hint">{passkeyMessage}</p> : null}
                    {authError ? (
                      <p className="sots-checkout__error" role="alert">
                        {authError}
                      </p>
                    ) : null}
                  </section>
                ) : null}

                {!needsPasskey ? (
                <div className="sots-account-layout">
                  <section
                    className="sots-account-panel sots-account-panel--tickets"
                    aria-labelledby="patron-tickets-heading"
                  >
                    <div className="sots-patron-contact__intro">
                      <h2 id="patron-tickets-heading">Your tickets</h2>
                      {ticketOrders.length ? (
                        <p>Show your QR code at the entrance. You can also add a night to your calendar.</p>
                      ) : (
                        <p>When you buy tickets with this email, they&apos;ll show up here.</p>
                      )}
                    </div>

                    {loadingOrders ? <p>Loading your orders…</p> : null}
                    {error ? (
                      <p className="sots-checkout__error" role="alert">
                        {error}
                      </p>
                    ) : null}

                    {!loadingOrders && !ticketOrders.length ? (
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

                    {!loadingOrders && ticketOrders.length && !upcomingOrders.length ? (
                      <div className="sots-my-tickets-page__empty sots-my-tickets-page__empty--inline">
                        <p className="sots-my-tickets-page__empty-title">No upcoming shows</p>
                        <p>Your past ticket orders are below. Ready for another night at Shakespeare in Pinkney Park?</p>
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

                    <div className="sots-my-tickets-page__group sots-my-tickets-page__group--shop">
                      <div className="sots-patron-contact__intro">
                        <h2 id="patron-shop-heading">Gift shop purchases</h2>
                        <p>
                          Receipts for merchandise bought with this email
                          {shopOrders.length ? " — pickup or shipping details included." : "."}
                        </p>
                      </div>

                      {!loadingOrders && !shopOrders.length ? (
                        <div className="sots-my-tickets-page__empty sots-my-tickets-page__empty--inline">
                          <p className="sots-my-tickets-page__empty-title">No shop orders yet</p>
                          <p>Gift shop purchases will show here with your confirmation details.</p>
                          <Link to="/shop/" className="orpheum-arrow-btn orpheum-arrow-btn--gold">
                            Browse the shop
                          </Link>
                        </div>
                      ) : (
                        <div className="sots-my-tickets-page__orders">
                          {shopOrders.map((order) => (
                            <ShopOrderCard key={order.id} order={order} email={user?.email} />
                          ))}
                        </div>
                      )}
                    </div>
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

                  <section className="sots-account-panel" aria-labelledby="passkey-security-heading">
                    <h2 id="passkey-security-heading">Faster next time</h2>
                    <p className="sots-my-tickets-page__lead">
                      {hasPasskey
                        ? "Face ID or your device lock is set up for this account."
                        : "Optional: unlock My Tickets with Face ID or Touch ID after you open the email link."}
                    </p>
                    {!hasPasskey ? (
                      <button
                        type="button"
                        className="orpheum-arrow-btn orpheum-arrow-btn--gold"
                        onClick={handleAddPasskey}
                        disabled={passkeyBusy}
                      >
                        {passkeyBusy ? "Waiting…" : "Set up on this device"}
                      </button>
                    ) : null}
                    {passkeyMessage ? <p className="sots-checkout__hint">{passkeyMessage}</p> : null}
                  </section>
                </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </article>
    </InnerPageShell>
  );
}
