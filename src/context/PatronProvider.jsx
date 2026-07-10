import { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearPatronSession,
  exchangePatronToken,
  fetchPatronOrders,
  fetchPatronProfile,
  readPatronSession,
  requestPatronMagicLink,
  writePatronSession,
} from "../../js/patron-auth.js";
import { PatronContext } from "./PatronContext.jsx";

export function PatronProvider({ children }) {
  const [session, setSession] = useState(() => readPatronSession());
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState("");

  const refreshOrders = useCallback(async () => {
    const current = readPatronSession();
    if (!current?.token) {
      setOrders([]);
      return [];
    }
    setLoadingOrders(true);
    setError("");
    try {
      const nextOrders = await fetchPatronOrders(current.token);
      setOrders(nextOrders);
      return nextOrders;
    } catch (err) {
      if (String(err.message).toLowerCase().includes("expired") || String(err.message).includes("Sign in")) {
        clearPatronSession();
        setSession(null);
      }
      setError(err.message || "Could not load your tickets");
      setOrders([]);
      return [];
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.token) return;
    refreshOrders();
  }, [session?.token, refreshOrders]);

  const signInWithToken = useCallback(async (token) => {
    const nextSession = await exchangePatronToken(token);
    setSession(nextSession);
    return nextSession;
  }, []);

  const requestMagicLink = useCallback(async (email) => requestPatronMagicLink(email), []);

  const signOut = useCallback(() => {
    clearPatronSession();
    setSession(null);
    setOrders([]);
    setError("");
  }, []);

  const verifySession = useCallback(async () => {
    const current = readPatronSession();
    if (!current?.token) return null;
    try {
      const user = await fetchPatronProfile(current.token);
      setSession({ ...current, user });
      return user;
    } catch {
      clearPatronSession();
      setSession(null);
      return null;
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      orders,
      loadingOrders,
      error,
      isSignedIn: Boolean(session?.token),
      refreshOrders,
      requestMagicLink,
      signInWithToken,
      signOut,
      verifySession,
      updateSession: (next) => {
        writePatronSession(next);
        setSession(next);
      },
    }),
    [
      session,
      orders,
      loadingOrders,
      error,
      refreshOrders,
      requestMagicLink,
      signInWithToken,
      signOut,
      verifySession,
    ],
  );

  return <PatronContext.Provider value={value}>{children}</PatronContext.Provider>;
}
