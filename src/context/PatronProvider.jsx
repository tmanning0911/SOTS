import { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearPatronSession,
  exchangePatronToken,
  fetchPatronContactProfile,
  fetchPatronOrders,
  fetchPatronProfile,
  readPatronSession,
  requestPatronMagicLink,
  updatePatronContactProfile,
  writePatronSession,
} from "../../js/patron-auth.js";
import { PatronContext } from "./PatronContext.jsx";

export function PatronProvider({ children }) {
  const [session, setSession] = useState(() => readPatronSession());
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(() => readPatronSession()?.profile ?? null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
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
        setProfile(null);
      }
      setError(err.message || "Could not load your tickets");
      setOrders([]);
      return [];
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const current = readPatronSession();
    if (!current?.token) {
      setProfile(null);
      return null;
    }
    setLoadingProfile(true);
    try {
      const nextProfile = await fetchPatronContactProfile(current.token);
      setProfile(nextProfile);
      const nextSession = { ...current, profile: nextProfile };
      writePatronSession(nextSession);
      setSession(nextSession);
      return nextProfile;
    } catch (err) {
      if (String(err.message).toLowerCase().includes("expired") || String(err.message).includes("Sign in")) {
        clearPatronSession();
        setSession(null);
        setProfile(null);
      }
      return null;
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.token) return;
    refreshOrders();
    refreshProfile();
  }, [session?.token, refreshOrders, refreshProfile]);

  const signInWithToken = useCallback(async (token) => {
    const nextSession = await exchangePatronToken(token);
    setSession(nextSession);
    setProfile(nextSession.profile ?? null);
    return nextSession;
  }, []);

  const requestMagicLink = useCallback(async (email) => requestPatronMagicLink(email), []);

  const signOut = useCallback(() => {
    clearPatronSession();
    setSession(null);
    setOrders([]);
    setProfile(null);
    setError("");
  }, []);

  const saveProfile = useCallback(async (next) => {
    const saved = await updatePatronContactProfile(next);
    setProfile(saved);
    const current = readPatronSession();
    if (current?.token) {
      const nextSession = { ...current, profile: saved };
      writePatronSession(nextSession);
      setSession(nextSession);
    }
    return saved;
  }, []);

  const verifySession = useCallback(async () => {
    const current = readPatronSession();
    if (!current?.token) return null;
    try {
      const data = await fetchPatronProfile(current.token);
      const nextSession = {
        ...current,
        user: data.user,
        profile: data.profile ?? current.profile ?? null,
      };
      writePatronSession(nextSession);
      setSession(nextSession);
      setProfile(nextSession.profile);
      return data.user;
    } catch {
      clearPatronSession();
      setSession(null);
      setProfile(null);
      return null;
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      orders,
      loadingOrders,
      loadingProfile,
      error,
      isSignedIn: Boolean(session?.token),
      refreshOrders,
      refreshProfile,
      saveProfile,
      requestMagicLink,
      signInWithToken,
      signOut,
      verifySession,
      updateSession: (next) => {
        writePatronSession(next);
        setSession(next);
        setProfile(next?.profile ?? null);
      },
    }),
    [
      session,
      profile,
      orders,
      loadingOrders,
      loadingProfile,
      error,
      refreshOrders,
      refreshProfile,
      saveProfile,
      requestMagicLink,
      signInWithToken,
      signOut,
      verifySession,
    ],
  );

  return <PatronContext.Provider value={value}>{children}</PatronContext.Provider>;
}
