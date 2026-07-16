import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { downloadOrderCalendar, isUpcomingOrder } from "../../js/ticket-calendar.js";
import { formatCents } from "../../js/square-payments.js";
import { formatPerformanceDate } from "../../js/ticketing.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { OrderResendButton } from "../components/ticketing/OrderResendButton.jsx";
import { PatronContactForm } from "../components/ticketing/PatronContactForm.jsx";
import { TicketQr } from "../components/ticketing/TicketQr.jsx";
import { usePatron } from "../context/PatronContext.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";
import {
  fetchPasskeyStatus,
  registerPatronPasskey,
  verifyPatronPasskey,
} from "../../js/patron-webauthn.js";

function statusBadge(status) {
  const value = String(status || "").toLowerCase();
  if (!value || value === "paid" || value === "completed" || value === "complete") return null;
  if (value === "refunded") return { label: "Refunded", tone: "warn" };
  if (value === "canceled" || value === "cancelled") return { label: "Canceled", tone: "warn" };
  return { label: value.replace(/_/g, " "), tone: "muted" };
}

function initialsFrom(name, email) {
  return (
    (name || email || "?")
      .split(/\s+|@/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?"
  );
}

function QrExpandModal({ ticket, orderId, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="sots-qr-modal" role="dialog" aria-modal="true" aria-label="Ticket QR code">
      <button type="button" className="sots-qr-modal__backdrop" aria-label="Close" onClick={onClose} />
      <div className="sots-qr-modal__sheet">
        <p className="sots-qr-modal__type">{ticket.ticketTypeName}</p>
        <p className="sots-qr-modal__code">#{ticket.code}</p>
        <TicketQr orderId={orderId} ticketCode={ticket.code} size={280} className="sots-ticket-qr--xl" />
        <p className="sots-qr-modal__hint">Show this code at the entrance</p>
        <ArrowButton type="button" variant="ghost" onClick={onClose}>
          Close
        </ArrowButton>
      </div>
    </div>
  );
}

function OrderCard({ order, email, past = false, spotlight = false }) {
  const [expandedTicket, setExpandedTicket] = useState(null);
  const badge = statusBadge(order.status);

  return (
    <article
      className={`sots-order-card${past ? " sots-order-card--past" : ""}${spotlight ? " sots-order-card--spotlight" : ""}`}
    >
      <header className="sots-order-card__head">
        <div className="sots-order-card__head-copy">
          {spotlight ? <p className="sots-order-card__eyebrow">Next up</p> : null}
          <h3>{order.productionTitle || "Shakespeare on the Sound"}</h3>
          <p className="sots-order-card__when">{formatPerformanceDate(order.performanceStart)}</p>
          {order.venue ? (
            <p className="sots-order-card__venue">
              {order.venue}
              {order.location ? ` · ${order.location}` : ""}
            </p>
          ) : null}
          <p className="sots-order-card__code">Confirmation {order.confirmationCode}</p>
          <div className="sots-order-card__badges">
            {past ? <span className="sots-order-card__badge">Past performance</span> : null}
            {badge ? (
              <span className={`sots-order-card__badge sots-order-card__badge--${badge.tone}`}>{badge.label}</span>
            ) : null}
          </div>
        </div>
        <p className="sots-order-card__total">{formatCents(order.totalCents)}</p>
      </header>

      {!past ? (
        <ul className="sots-order-card__tickets">
          {(order.tickets ?? []).map((ticket) => (
            <li key={ticket.code}>
              <button
                type="button"
                className="sots-order-card__ticket sots-order-card__ticket--expand"
                onClick={() => setExpandedTicket(ticket)}
              >
                <div className="sots-order-card__ticket-meta">
                  <strong>{ticket.ticketTypeName}</strong>
                  <span>#{ticket.code}</span>
                  <span className="sots-order-card__ticket-hint">Tap to enlarge for the gate</span>
                </div>
                <TicketQr
                  orderId={order.id}
                  ticketCode={ticket.code}
                  size={spotlight ? 168 : 148}
                  className={spotlight ? "sots-ticket-qr--lg" : ""}
                />
              </button>
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
          <ArrowButton type="button" onClick={() => downloadOrderCalendar(order)}>
            Add to calendar
          </ArrowButton>
        ) : null}
        <OrderResendButton email={email} confirmationCode={order.confirmationCode} />
      </div>

      {expandedTicket ? (
        <QrExpandModal ticket={expandedTicket} orderId={order.id} onClose={() => setExpandedTicket(null)} />
      ) : null}
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
  const badge = statusBadge(order.status);

  return (
    <article className="sots-order-card sots-order-card--shop">
      <header className="sots-order-card__head">
        <div className="sots-order-card__head-copy">
          <h3>Gift shop</h3>
          <p className="sots-order-card__when">{formatShopDate(order.createdAt)}</p>
          <p className="sots-order-card__venue">
            {fulfillmentLabel}
            {itemCount ? ` · ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}
          </p>
          <p className="sots-order-card__code">Confirmation {order.confirmationCode}</p>
          {badge ? (
            <div className="sots-order-card__badges">
              <span className={`sots-order-card__badge sots-order-card__badge--${badge.tone}`}>{badge.label}</span>
            </div>
          ) : null}
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
        <ArrowButton to="/shop/" variant="ghost">
          Visit shop
        </ArrowButton>
        <OrderResendButton email={email} confirmationCode={order.confirmationCode} />
      </div>
    </article>
  );
}

function OrdersSkeleton() {
  return (
    <div className="sots-my-tickets-page__skeleton" aria-hidden="true">
      <div className="sots-checkout-skeleton sots-checkout-skeleton--line" />
      <div className="sots-checkout-skeleton sots-checkout-skeleton--card" />
      <div className="sots-checkout-skeleton sots-checkout-skeleton--block" />
    </div>
  );
}

export function MyTicketsPage() {
  const [params, setParams] = useSearchParams();
  const {
    isSignedIn,
    bootstrapping,
    needsPasskey,
    hasPassword,
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
    signInWithPassword,
    registerAccount,
    requestPasswordReset,
    completePasswordReset,
    updatePassword,
    signOut,
    signOutEverywhere,
    markPasskeyVerified,
    refreshOrders,
    saveProfile,
    uploadAvatar,
    removeAvatar,
  } = usePatron();

  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [authMode, setAuthMode] = useState("signin"); // signin | register | forgot | magic | reset
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [pendingMagicToken, setPendingMagicToken] = useState("");
  const [pendingResetToken, setPendingResetToken] = useState("");
  const [verifyingToken, setVerifyingToken] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [pastOpen, setPastOpen] = useState(false);
  const [passkeyBusy, setPasskeyBusy] = useState(false);
  const [passkeyMessage, setPasskeyMessage] = useState("");
  const [hasPasskey, setHasPasskey] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const accountDetailsRef = useRef(null);

  usePageMeta("/my-tickets/");

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  useEffect(() => {
    const token = params.get("token");
    const reset = params.get("reset");
    if (reset && !isSignedIn) {
      setPendingResetToken(reset);
      setAuthMode("reset");
      setAuthMessage("Choose a password to finish setting up your account.");
      params.delete("reset");
      setParams(params, { replace: true });
      return;
    }
    if (!token || isSignedIn) return;
    setPendingMagicToken(token);
    setAuthMode("magic");
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

  function switchAuthMode(mode) {
    setAuthMode(mode);
    setAuthError("");
    setAuthMessage("");
    setPassword("");
    setPasswordConfirm("");
  }

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
      setAuthMode("signin");
    } finally {
      setVerifyingToken(false);
    }
  }

  async function handlePasswordSignIn(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    setAuthMessage("");
    try {
      await signInWithPassword(email, password);
      setPassword("");
      setAuthMessage("You're in.");
    } catch (err) {
      setAuthError(err.message || "Incorrect email or password.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    setAuthMessage("");
    if (password !== passwordConfirm) {
      setAuthError("Passwords don’t match.");
      setAuthLoading(false);
      return;
    }
    try {
      await registerAccount({ email, password, name: registerName });
      setPassword("");
      setPasswordConfirm("");
      setAuthMessage("Account created — your tickets will show for this email.");
    } catch (err) {
      setAuthError(err.message || "Couldn't create your account.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    setAuthMessage("");
    try {
      const result = await requestPasswordReset(email);
      setAuthMessage(result.message || "Check your email for a link to set your password.");
    } catch (err) {
      setAuthError(err.message || "Couldn't send the email. Try again in a moment.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (!pendingResetToken) return;
    setAuthLoading(true);
    setAuthError("");
    setAuthMessage("");
    if (password !== passwordConfirm) {
      setAuthError("Passwords don’t match.");
      setAuthLoading(false);
      return;
    }
    try {
      await completePasswordReset(pendingResetToken, password);
      setPendingResetToken("");
      setPassword("");
      setPasswordConfirm("");
      setAuthMessage("Password saved — you're signed in.");
    } catch (err) {
      setAuthError(err.message || "That link expired. Request a new one.");
      setAuthMode("forgot");
    } finally {
      setAuthLoading(false);
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

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await refreshOrders();
    } finally {
      setRefreshing(false);
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

  const nextShow = upcomingOrders[0] || null;
  const otherUpcoming = upcomingOrders.slice(1);
  const displayName = profile?.name?.trim() || "";
  const needsProfilePrompt = Boolean(isSignedIn && !needsPasskey && !loadingProfile && !displayName);

  function openAccount() {
    setAccountOpen(true);
    requestAnimationFrame(() => {
      accountDetailsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordBusy(true);
    setPasswordMessage("");
    setAuthError("");
    if (newPassword !== newPasswordConfirm) {
      setPasswordMessage("");
      setAuthError("Passwords don’t match.");
      setPasswordBusy(false);
      return;
    }
    try {
      const result = await updatePassword({
        currentPassword: hasPassword ? currentPassword : "",
        newPassword,
      });
      setPasswordMessage(result.message || "Password saved.");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (err) {
      setAuthError(err.message || "Couldn't update your password.");
    } finally {
      setPasswordBusy(false);
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
        <InnerPageHero title="My Tickets" />

        {isSignedIn ? (
          <nav className="sots-account-page__quick" aria-label="Account shortcuts">
            <Link to="/tickets/" className="sots-account-page__quick-link">
              Browse tickets
            </Link>
            <Link to="/about/visit/" className="sots-account-page__quick-link">
              Plan a visit
            </Link>
            <Link to="/access-your-tickets/" className="sots-account-page__quick-link">
              Confirmation code
            </Link>
            <Link to="/shop/" className="sots-account-page__quick-link">
              Gift shop
            </Link>
          </nav>
        ) : null}

        <div className="orpheum-inner-page__body">
          <div
            className={`orpheum-container sots-account-page__body${isSignedIn ? "" : " orpheum-container--narrow"}`}
            data-reveal
          >
            {bootstrapping && !isSignedIn ? (
              <section className="sots-account-panel" aria-live="polite" aria-busy="true">
                <OrdersSkeleton />
                <p className="sots-my-tickets-page__sr-only">Loading your session…</p>
              </section>
            ) : !isSignedIn ? (
              <section className="sots-auth" aria-labelledby="my-tickets-sign-in">
                {(authMode === "signin" || authMode === "register") && !pendingMagicToken ? (
                  <div className="sots-auth__tabs" role="tablist" aria-label="Account">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={authMode === "signin"}
                      className={`sots-auth__tab${authMode === "signin" ? " is-active" : ""}`}
                      onClick={() => switchAuthMode("signin")}
                    >
                      Sign in
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={authMode === "register"}
                      className={`sots-auth__tab${authMode === "register" ? " is-active" : ""}`}
                      onClick={() => switchAuthMode("register")}
                    >
                      Create account
                    </button>
                  </div>
                ) : null}

                <div className="sots-auth__stage">
                  {authMode === "forgot" || authMode === "magic" || authMode === "reset" || pendingMagicToken ? (
                    <button
                      type="button"
                      className="sots-auth__back"
                      onClick={() => {
                        setPendingMagicToken("");
                        switchAuthMode("signin");
                      }}
                    >
                      ← Back to sign in
                    </button>
                  ) : null}

                  <p className="sots-auth__eyebrow">My Tickets</p>
                  <h2 id="my-tickets-sign-in">
                    {pendingMagicToken
                      ? "Open your tickets"
                      : authMode === "register"
                        ? "Create your account"
                        : authMode === "forgot"
                          ? "Reset your password"
                          : authMode === "reset"
                            ? "Choose a new password"
                            : authMode === "magic"
                              ? "Email me a link"
                              : "Welcome back"}
                  </h2>
                  <p className="sots-auth__lead">
                    {pendingMagicToken
                      ? "Your email link worked. Open My Tickets to see your shows and QR codes."
                      : authMode === "register"
                        ? "Use the same email from your order so tickets appear automatically."
                        : authMode === "forgot"
                          ? "We’ll send a secure link to set or reset your password."
                          : authMode === "reset"
                            ? "At least 8 characters. You’ll use this password next time."
                            : authMode === "magic"
                              ? "No password needed for this visit — we’ll email a one-time link."
                              : "Sign in with your email and password to see tickets and QR codes."}
                  </p>

                  {pendingMagicToken ? (
                    <div className="sots-auth__confirm">
                      <ArrowButton type="button" onClick={handleConfirmMagicLink} disabled={verifyingToken}>
                        {verifyingToken ? "Opening…" : "Open my tickets"}
                      </ArrowButton>
                    </div>
                  ) : null}

                  {authMode === "signin" && !pendingMagicToken ? (
                    <form className="sots-auth__form" onSubmit={handlePasswordSignIn}>
                      <label className="sots-auth__field">
                        <span>Email</span>
                        <input
                          type="email"
                          name="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </label>
                      <label className="sots-auth__field">
                        <span>Password</span>
                        <input
                          type="password"
                          name="password"
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </label>
                      <div className="sots-auth__field-meta">
                        <button type="button" className="sots-auth__text-btn" onClick={() => switchAuthMode("forgot")}>
                          Forgot password?
                        </button>
                      </div>
                      <ArrowButton type="submit" className="sots-auth__submit" disabled={authLoading}>
                        {authLoading ? "Signing in…" : "Sign in"}
                      </ArrowButton>
                    </form>
                  ) : null}

                  {authMode === "register" ? (
                    <form className="sots-auth__form" onSubmit={handleRegister}>
                      <label className="sots-auth__field">
                        <span>
                          Full name <em className="sots-auth__optional">optional</em>
                        </span>
                        <input
                          type="text"
                          name="name"
                          autoComplete="name"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                        />
                      </label>
                      <label className="sots-auth__field">
                        <span>Email</span>
                        <input
                          type="email"
                          name="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </label>
                      <label className="sots-auth__field">
                        <span>Password</span>
                        <input
                          type="password"
                          name="new-password"
                          autoComplete="new-password"
                          required
                          minLength={8}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </label>
                      <label className="sots-auth__field">
                        <span>Confirm password</span>
                        <input
                          type="password"
                          name="confirm-password"
                          autoComplete="new-password"
                          required
                          minLength={8}
                          value={passwordConfirm}
                          onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                      </label>
                      <p className="sots-auth__hint">Use 8 or more characters.</p>
                      <ArrowButton type="submit" className="sots-auth__submit" disabled={authLoading}>
                        {authLoading ? "Creating…" : "Create account"}
                      </ArrowButton>
                    </form>
                  ) : null}

                  {authMode === "forgot" ? (
                    <form className="sots-auth__form" onSubmit={handleForgotPassword}>
                      <label className="sots-auth__field">
                        <span>Email</span>
                        <input
                          type="email"
                          name="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </label>
                      <ArrowButton type="submit" className="sots-auth__submit" disabled={authLoading}>
                        {authLoading ? "Sending…" : "Send reset link"}
                      </ArrowButton>
                    </form>
                  ) : null}

                  {authMode === "reset" && pendingResetToken ? (
                    <form className="sots-auth__form" onSubmit={handleResetPassword}>
                      <label className="sots-auth__field">
                        <span>New password</span>
                        <input
                          type="password"
                          name="new-password"
                          autoComplete="new-password"
                          required
                          minLength={8}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </label>
                      <label className="sots-auth__field">
                        <span>Confirm password</span>
                        <input
                          type="password"
                          name="confirm-password"
                          autoComplete="new-password"
                          required
                          minLength={8}
                          value={passwordConfirm}
                          onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                      </label>
                      <ArrowButton type="submit" className="sots-auth__submit" disabled={authLoading}>
                        {authLoading ? "Saving…" : "Save password & sign in"}
                      </ArrowButton>
                    </form>
                  ) : null}

                  {authMode === "magic" && !pendingMagicToken ? (
                    <form className="sots-auth__form" onSubmit={handleRequestLink}>
                      <label className="sots-auth__field">
                        <span>Email</span>
                        <input
                          type="email"
                          name="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </label>
                      <ArrowButton type="submit" className="sots-auth__submit" disabled={authLoading || verifyingToken}>
                        {authLoading ? "Sending…" : "Email me a link"}
                      </ArrowButton>
                    </form>
                  ) : null}

                  {authMessage ? (
                    <p className="sots-auth__status" role="status">
                      {authMessage}
                    </p>
                  ) : null}
                  {authError ? (
                    <p className="sots-auth__error" role="alert">
                      {authError}
                    </p>
                  ) : null}

                  {(authMode === "signin" || authMode === "register") && !pendingMagicToken ? (
                    <div className="sots-auth__footer">
                      <div className="sots-auth__divider" aria-hidden="true">
                        <span>or</span>
                      </div>
                      <button type="button" className="sots-auth__alt" onClick={() => switchAuthMode("magic")}>
                        Email me a one-time link
                      </button>
                      <Link to="/access-your-tickets/" className="sots-auth__alt sots-auth__alt--link">
                        Have a confirmation code?
                      </Link>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : (
              <div className="sots-my-tickets-page__signed-in">
                <header className="sots-account-banner">
                  <div className="sots-account-banner__identity">
                    <button
                      type="button"
                      className="sots-account-banner__avatar"
                      onClick={openAccount}
                      aria-label={
                        avatarUrl
                          ? "Open account settings and profile photo"
                          : "Open account settings and add a profile photo"
                      }
                    >
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" />
                      ) : (
                        <span>{initialsFrom(displayName, user?.email)}</span>
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
                      {needsProfilePrompt ? (
                        <p className="sots-account-banner__prompt">
                          <button type="button" className="sots-account-banner__prompt-btn" onClick={openAccount}>
                            Add your name for the box office
                          </button>
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="sots-account-banner__actions">
                    <ArrowButton type="button" variant="ghost" onClick={handleRefresh} disabled={refreshing}>
                      {refreshing ? "Refreshing…" : "Refresh"}
                    </ArrowButton>
                    <ArrowButton type="button" variant="ghost" onClick={openAccount}>
                      Account
                    </ArrowButton>
                  </div>
                </header>

                {needsPasskey ? (
                  <section className="sots-account-panel" aria-labelledby="passkey-unlock-heading">
                    <h2 id="passkey-unlock-heading">Confirm it&apos;s you</h2>
                    <p className="sots-my-tickets-page__lead">
                      Use Face ID, Touch ID, or your device lock to finish opening My Tickets.
                    </p>
                    <ArrowButton type="button" onClick={handlePasskeyUnlock} disabled={passkeyBusy}>
                      {passkeyBusy ? "Waiting…" : "Continue"}
                    </ArrowButton>
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
                    <section className="sots-my-tickets-page__shows" aria-labelledby="patron-tickets-heading">
                      <div className="sots-my-tickets-page__section-head">
                        <h2 id="patron-tickets-heading">Your shows</h2>
                        {ticketOrders.length ? (
                          <p>Show a QR at the entrance — tap any code to enlarge for the gate.</p>
                        ) : (
                          <p>When you buy tickets with this email, they&apos;ll show up here.</p>
                        )}
                      </div>

                      {loadingOrders ? <OrdersSkeleton /> : null}
                      {error ? (
                        <p className="sots-checkout__error" role="alert">
                          {error}
                        </p>
                      ) : null}

                      {!loadingOrders && !ticketOrders.length ? (
                        <div className="sots-my-tickets-page__empty">
                          <p className="sots-my-tickets-page__empty-title">No tickets yet</p>
                          <p>
                            After you buy online, your confirmation email includes QR codes and a
                            confirmation code. Sign in with the same email here to see your orders,
                            or use Confirmation lookup with that code.
                          </p>
                          <div className="sots-my-tickets-page__empty-actions">
                            <ArrowButton to="/events/">Upcoming events</ArrowButton>
                            <ArrowButton to="/access-your-tickets/" variant="ghost">
                              Confirmation lookup
                            </ArrowButton>
                          </div>
                        </div>
                      ) : null}

                      {nextShow ? (
                        <div className="sots-my-tickets-page__group">
                          <OrderCard order={nextShow} email={user?.email} spotlight />
                        </div>
                      ) : null}

                      {otherUpcoming.length ? (
                        <div className="sots-my-tickets-page__group">
                          <h3 className="sots-my-tickets-page__group-title">Coming up</h3>
                          <div className="sots-my-tickets-page__orders">
                            {otherUpcoming.map((order) => (
                              <OrderCard key={order.id} order={order} email={user?.email} />
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {!loadingOrders && ticketOrders.length && !upcomingOrders.length ? (
                        <div className="sots-my-tickets-page__empty sots-my-tickets-page__empty--inline">
                          <p className="sots-my-tickets-page__empty-title">No upcoming shows</p>
                          <p>
                            Your past ticket orders are below. Ready for another night at Shakespeare in Pinkney Park?
                          </p>
                          <ArrowButton to="/tickets/">Browse performances</ArrowButton>
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

                    <section className="sots-my-tickets-page__shop" aria-labelledby="patron-shop-heading">
                      <div className="sots-my-tickets-page__section-head">
                        <h2 id="patron-shop-heading">Gift shop</h2>
                        <p>
                          Receipts for merchandise bought with this email
                          {shopOrders.length ? " — pickup or shipping details included." : "."}
                        </p>
                      </div>

                      {!loadingOrders && !shopOrders.length ? (
                        <div className="sots-my-tickets-page__empty sots-my-tickets-page__empty--inline">
                          <p className="sots-my-tickets-page__empty-title">No shop orders yet</p>
                          <p>Gift shop purchases will show here with your confirmation details.</p>
                          <ArrowButton to="/shop/">Browse the shop</ArrowButton>
                        </div>
                      ) : (
                        <div className="sots-my-tickets-page__orders">
                          {shopOrders.map((order) => (
                            <ShopOrderCard key={order.id} order={order} email={user?.email} />
                          ))}
                        </div>
                      )}
                    </section>

                    <details
                      ref={accountDetailsRef}
                      className="sots-account-panel sots-account-panel--contact sots-account-details"
                      open={accountOpen}
                      onToggle={(e) => setAccountOpen(e.currentTarget.open)}
                    >
                      <summary className="sots-account-details__summary">
                        <span>
                          <span className="sots-account-panel__eyebrow">Account</span>
                          <span className="sots-account-details__title">Profile &amp; security</span>
                        </span>
                        <span className="sots-account-details__hint">{accountOpen ? "Hide" : "Manage"}</span>
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

                        <div className="sots-account-security">
                          <h3 className="sots-account-security__title">Password</h3>
                          <p className="sots-my-tickets-page__lead">
                            {hasPassword
                              ? "Change the password you use to sign in to My Tickets."
                              : "Add a password so you can sign in without waiting for an email link."}
                          </p>
                          <form className="sots-auth__form sots-account-password-form" onSubmit={handleChangePassword}>
                            {hasPassword ? (
                              <label className="sots-auth__field">
                                <span>Current password</span>
                                <input
                                  type="password"
                                  name="current-password"
                                  autoComplete="current-password"
                                  required
                                  value={currentPassword}
                                  onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                              </label>
                            ) : null}
                            <label className="sots-auth__field">
                              <span>{hasPassword ? "New password" : "Password"}</span>
                              <input
                                type="password"
                                name="new-password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                            </label>
                            <label className="sots-auth__field">
                              <span>Confirm password</span>
                              <input
                                type="password"
                                name="confirm-password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                value={newPasswordConfirm}
                                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                              />
                            </label>
                            <ArrowButton type="submit" className="sots-auth__submit" disabled={passwordBusy}>
                              {passwordBusy ? "Saving…" : hasPassword ? "Update password" : "Save password"}
                            </ArrowButton>
                          </form>
                          {passwordMessage ? <p className="sots-auth__status">{passwordMessage}</p> : null}

                          <h3 className="sots-account-security__title">Device unlock</h3>
                          <p className="sots-my-tickets-page__lead">
                            {hasPasskey
                              ? "Face ID or your device lock is set up for this account."
                              : "Optional: unlock My Tickets with Face ID or Touch ID after you open an email link."}
                          </p>
                          {!hasPasskey ? (
                            <ArrowButton type="button" onClick={handleAddPasskey} disabled={passkeyBusy}>
                              {passkeyBusy ? "Waiting…" : "Set up on this device"}
                            </ArrowButton>
                          ) : null}
                          {passkeyMessage ? <p className="sots-checkout__hint">{passkeyMessage}</p> : null}

                          <div className="sots-account-security__actions">
                            <ArrowButton type="button" variant="ghost" onClick={signOut}>
                              Sign out
                            </ArrowButton>
                            <ArrowButton type="button" variant="ghost" onClick={() => signOutEverywhere()}>
                              Sign out everywhere
                            </ArrowButton>
                          </div>
                        </div>
                      </div>
                    </details>
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
