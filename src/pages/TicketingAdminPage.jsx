import { useEffect, useState } from "react";
import {
  fetchTicketingAdminOrders,
  formatCents,
  refundTicketingOrder,
} from "../../js/square-payments.js";
import { formatPerformanceDate } from "../../js/ticketing.js";

const ADMIN_TOKEN_KEY = "sots-admin-token";

function readAdminToken() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

function writeAdminToken(token) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

function clearAdminToken() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function TicketingAdminPage() {
  const [token, setToken] = useState(readAdminToken);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("admin@shakespeareonthesound.org");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Ticketing Admin - Shakespeare on the Sound";
  }, []);

  useEffect(() => {
    if (!token) return;
    loadOrders();
  }, [token]);

  async function handleLogin(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ password, email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Login failed");
      writeAdminToken(data.token);
      setToken(data.token);
      setPassword("");
    } catch (err) {
      setAuthError(err.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  }

  async function loadOrders(search = query) {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const nextOrders = await fetchTicketingAdminOrders({ token, q: search, limit: 100 });
      setOrders(nextOrders);
    } catch (err) {
      if (String(err.message).toLowerCase().includes("unauthorized")) {
        clearAdminToken();
        setToken("");
      }
      setError(err.message || "Could not load orders");
    } finally {
      setLoading(false);
    }
  }

  async function handleRefund(orderId, totalCents) {
    if (!window.confirm(`Refund order ${orderId} for ${formatCents(totalCents)}?`)) return;
    setMessage("");
    setError("");
    try {
      await refundTicketingOrder({ token, orderId, amountCents: totalCents, reason: "Admin refund" });
      setMessage(`Refunded ${orderId}`);
      await loadOrders();
    } catch (err) {
      setError(err.message || "Refund failed");
    }
  }

  function handleExport() {
    if (!token) return;
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    const url = `/api/ticketing/admin/export${params.toString() ? `?${params}` : ""}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) throw new Error("Export failed");
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = "sots-ticket-orders.csv";
        link.click();
        URL.revokeObjectURL(objectUrl);
      })
      .catch((err) => setError(err.message || "Export failed"));
  }

  if (!token) {
    return (
      <div className="orpheum-page orpheum-page--inner sots-ticketing-admin">
        <div className="orpheum-container orpheum-container--narrow">
          <p className="orpheum-kicker">Staff</p>
          <h1>Ticketing Admin</h1>
          <form className="sots-order-lookup" onSubmit={handleLogin}>
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <button type="submit" className="orpheum-arrow-btn orpheum-arrow-btn--gold" disabled={authLoading}>
              {authLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          {authError ? (
            <p className="sots-checkout__error" role="alert">
              {authError}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="orpheum-page orpheum-page--inner sots-ticketing-admin">
      <div className="orpheum-container">
        <div className="sots-ticketing-admin__head">
          <div>
            <p className="orpheum-kicker">Staff</p>
            <h1>Ticketing Admin</h1>
          </div>
          <button
            type="button"
            className="orpheum-arrow-btn orpheum-arrow-btn--ghost"
            onClick={() => {
              clearAdminToken();
              setToken("");
            }}
          >
            Sign out
          </button>
        </div>

        <form
          className="sots-ticketing-admin__search"
          onSubmit={(e) => {
            e.preventDefault();
            loadOrders(query);
          }}
        >
          <label>
            Search orders
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Email, code, order id, name"
            />
          </label>
          <button type="submit" className="orpheum-arrow-btn orpheum-arrow-btn--gold" disabled={loading}>
            Search
          </button>
          <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--ghost" onClick={handleExport}>
            Export CSV
          </button>
        </form>

        {message ? <p className="sots-checkout__hint">{message}</p> : null}
        {error ? (
          <p className="sots-checkout__error" role="alert">
            {error}
          </p>
        ) : null}
        {loading ? <p>Loading orders…</p> : null}

        <div className="sots-ticketing-admin__table-wrap">
          <table className="sots-ticketing-admin__table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Buyer</th>
                <th>Performance</th>
                <th>Total</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.confirmationCode}</strong>
                    <div className="sots-ticketing-admin__sub">{order.id}</div>
                  </td>
                  <td>
                    {order.buyerName || order.email}
                    <div className="sots-ticketing-admin__sub">{order.email}</div>
                  </td>
                  <td>
                    {formatPerformanceDate(order.performanceStart)}
                    <div className="sots-ticketing-admin__sub">{order.productionTitle}</div>
                  </td>
                  <td>{formatCents(order.totalCents)}</td>
                  <td>{order.status || "completed"}</td>
                  <td>
                    {order.status !== "refunded" ? (
                      <button
                        type="button"
                        className="orpheum-arrow-btn orpheum-arrow-btn--ghost"
                        onClick={() => handleRefund(order.id, order.totalCents)}
                      >
                        Refund
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && !orders.length ? <p>No orders found.</p> : null}
      </div>
    </div>
  );
}
