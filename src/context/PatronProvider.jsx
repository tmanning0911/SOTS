import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  deletePatronAvatar,
  fetchPatronAvatarObjectUrl,
  uploadPatronAvatar,
} from "../../js/patron-avatar.js";
import {
  clearPatronSession,
  exchangePatronToken,
  fetchPatronContactProfile,
  fetchPatronOrders,
  fetchPatronProfile,
  readPatronSession,
  requestPatronMagicLink,
  signOutPatron,
  updatePatronContactProfile,
  writePatronSession,
} from "../../js/patron-auth.js";
import { PatronContext } from "./PatronContext.jsx";

function applyProfile(saved, setProfile, setSession) {
  setProfile(saved);
  const current = readPatronSession();
  if (current?.user?.email) {
    const nextSession = { ...current, profile: saved, signedIn: true };
    writePatronSession(nextSession);
    setSession(nextSession);
  }
}

function isAuthError(err) {
  const msg = String(err?.message || "").toLowerCase();
  return msg.includes("expired") || msg.includes("sign in") || msg.includes("required");
}

export function PatronProvider({ children }) {
  const [session, setSession] = useState(() => readPatronSession());
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(() => readPatronSession()?.profile ?? null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [error, setError] = useState("");
  const profileEpochRef = useRef(0);
  const avatarUrlRef = useRef(null);

  const replaceAvatarUrl = useCallback((nextUrl) => {
    if (avatarUrlRef.current) URL.revokeObjectURL(avatarUrlRef.current);
    avatarUrlRef.current = nextUrl;
    setAvatarUrl(nextUrl);
  }, []);

  const clearLocal = useCallback(() => {
    clearPatronSession();
    setSession(null);
    setProfile(null);
    setOrders([]);
    replaceAvatarUrl(null);
  }, [replaceAvatarUrl]);

  const refreshOrders = useCallback(async () => {
    if (!readPatronSession()?.user?.email && !session?.user?.email) {
      setOrders([]);
      return [];
    }
    setLoadingOrders(true);
    setError("");
    try {
      const nextOrders = await fetchPatronOrders();
      setOrders(nextOrders);
      return nextOrders;
    } catch (err) {
      if (isAuthError(err)) clearLocal();
      setError(err.message || "Could not load your tickets");
      setOrders([]);
      return [];
    } finally {
      setLoadingOrders(false);
    }
  }, [clearLocal, session?.user?.email]);

  const refreshAvatar = useCallback(
    async (hasAvatar = profile?.hasAvatar) => {
      if (!hasAvatar) {
        replaceAvatarUrl(null);
        return null;
      }
      try {
        const url = await fetchPatronAvatarObjectUrl();
        replaceAvatarUrl(url);
        return url;
      } catch {
        replaceAvatarUrl(null);
        return null;
      }
    },
    [profile?.hasAvatar, replaceAvatarUrl],
  );

  const refreshProfile = useCallback(async () => {
    if (!readPatronSession()?.user?.email && !session?.user?.email) {
      setProfile(null);
      replaceAvatarUrl(null);
      return null;
    }
    const epoch = profileEpochRef.current;
    setLoadingProfile(true);
    try {
      const nextProfile = await fetchPatronContactProfile();
      if (epoch !== profileEpochRef.current) return nextProfile;
      setProfile(nextProfile);
      const latest = readPatronSession();
      if (latest?.user?.email) {
        const nextSession = { ...latest, profile: nextProfile, signedIn: true };
        writePatronSession(nextSession);
        setSession(nextSession);
      }
      if (nextProfile?.hasAvatar) {
        fetchPatronAvatarObjectUrl()
          .then((url) => {
            if (epoch === profileEpochRef.current) replaceAvatarUrl(url);
            else if (url) URL.revokeObjectURL(url);
          })
          .catch(() => {
            if (epoch === profileEpochRef.current) replaceAvatarUrl(null);
          });
      } else {
        replaceAvatarUrl(null);
      }
      return nextProfile;
    } catch (err) {
      if (epoch !== profileEpochRef.current) return null;
      if (isAuthError(err)) clearLocal();
      return null;
    } finally {
      if (epoch === profileEpochRef.current) setLoadingProfile(false);
    }
  }, [clearLocal, replaceAvatarUrl, session?.user?.email]);

  // Restore session from HttpOnly cookie on first load (localStorage alone is not enough).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPatronProfile();
        if (cancelled) return;
        const nextSession = {
          signedIn: true,
          user: data.user,
          profile: data.profile ?? null,
        };
        writePatronSession(nextSession);
        setSession(nextSession);
        setProfile(nextSession.profile);
      } catch {
        if (!cancelled) {
          // Cookie missing/expired — drop any stale UI cache.
          clearLocal();
        }
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clearLocal]);

  useEffect(() => {
    if (bootstrapping || !session?.user?.email) return;
    refreshOrders();
    refreshProfile();
  }, [bootstrapping, session?.user?.email, refreshOrders, refreshProfile]);

  useEffect(
    () => () => {
      if (avatarUrlRef.current) URL.revokeObjectURL(avatarUrlRef.current);
    },
    [],
  );

  const signInWithToken = useCallback(async (token) => {
    const nextSession = await exchangePatronToken(token);
    profileEpochRef.current += 1;
    setSession(nextSession);
    setProfile(nextSession.profile ?? null);
    setBootstrapping(false);
    return nextSession;
  }, []);

  const requestMagicLink = useCallback(async (email) => requestPatronMagicLink(email), []);

  const signOut = useCallback(async () => {
    profileEpochRef.current += 1;
    await signOutPatron();
    setSession(null);
    setOrders([]);
    setProfile(null);
    replaceAvatarUrl(null);
    setError("");
  }, [replaceAvatarUrl]);

  const saveProfile = useCallback(async (next) => {
    const saved = await updatePatronContactProfile(next);
    profileEpochRef.current += 1;
    setLoadingProfile(false);
    applyProfile(saved, setProfile, setSession);
    return saved;
  }, []);

  const uploadAvatar = useCallback(
    async (file) => {
      setUploadingAvatar(true);
      try {
        const saved = await uploadPatronAvatar(file);
        profileEpochRef.current += 1;
        applyProfile(saved, setProfile, setSession);
        await refreshAvatar(true);
        return saved;
      } finally {
        setUploadingAvatar(false);
      }
    },
    [refreshAvatar],
  );

  const removeAvatar = useCallback(async () => {
    setUploadingAvatar(true);
    try {
      const saved = await deletePatronAvatar();
      profileEpochRef.current += 1;
      applyProfile(saved, setProfile, setSession);
      replaceAvatarUrl(null);
      return saved;
    } finally {
      setUploadingAvatar(false);
    }
  }, [replaceAvatarUrl]);

  const verifySession = useCallback(async () => {
    try {
      const data = await fetchPatronProfile();
      const nextSession = {
        signedIn: true,
        user: data.user,
        profile: data.profile ?? null,
      };
      writePatronSession(nextSession);
      setSession(nextSession);
      setProfile(nextSession.profile);
      return data.user;
    } catch {
      clearLocal();
      return null;
    }
  }, [clearLocal]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      avatarUrl,
      orders,
      loadingOrders,
      loadingProfile,
      uploadingAvatar,
      bootstrapping,
      error,
      isSignedIn: Boolean(session?.user?.email),
      refreshOrders,
      refreshProfile,
      refreshAvatar,
      saveProfile,
      uploadAvatar,
      removeAvatar,
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
      avatarUrl,
      orders,
      loadingOrders,
      loadingProfile,
      uploadingAvatar,
      bootstrapping,
      error,
      refreshOrders,
      refreshProfile,
      refreshAvatar,
      saveProfile,
      uploadAvatar,
      removeAvatar,
      requestMagicLink,
      signInWithToken,
      signOut,
      verifySession,
    ],
  );

  return <PatronContext.Provider value={value}>{children}</PatronContext.Provider>;
}
