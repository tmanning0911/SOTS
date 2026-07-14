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
  updatePatronContactProfile,
  writePatronSession,
} from "../../js/patron-auth.js";
import { PatronContext } from "./PatronContext.jsx";

function applyProfile(saved, setProfile, setSession) {
  setProfile(saved);
  const current = readPatronSession();
  if (current?.token) {
    const nextSession = { ...current, profile: saved };
    writePatronSession(nextSession);
    setSession(nextSession);
  }
}

export function PatronProvider({ children }) {
  const [session, setSession] = useState(() => readPatronSession());
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(() => readPatronSession()?.profile ?? null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  /** Bumps when a newer profile write wins so older GET responses cannot stomp it. */
  const profileEpochRef = useRef(0);
  const avatarUrlRef = useRef(null);

  const replaceAvatarUrl = useCallback((nextUrl) => {
    if (avatarUrlRef.current) URL.revokeObjectURL(avatarUrlRef.current);
    avatarUrlRef.current = nextUrl;
    setAvatarUrl(nextUrl);
  }, []);

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
        replaceAvatarUrl(null);
      }
      setError(err.message || "Could not load your tickets");
      setOrders([]);
      return [];
    } finally {
      setLoadingOrders(false);
    }
  }, [replaceAvatarUrl]);

  const refreshAvatar = useCallback(
    async (hasAvatar = profile?.hasAvatar) => {
      const current = readPatronSession();
      if (!current?.token || !hasAvatar) {
        replaceAvatarUrl(null);
        return null;
      }
      try {
        const url = await fetchPatronAvatarObjectUrl(current.token);
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
    const current = readPatronSession();
    if (!current?.token) {
      setProfile(null);
      replaceAvatarUrl(null);
      return null;
    }
    const epoch = profileEpochRef.current;
    setLoadingProfile(true);
    try {
      const nextProfile = await fetchPatronContactProfile(current.token);
      // A save (or newer refresh) completed while this request was in flight — ignore stale GET.
      if (epoch !== profileEpochRef.current) return nextProfile;
      setProfile(nextProfile);
      const latest = readPatronSession();
      if (!latest?.token) return nextProfile;
      const nextSession = { ...latest, profile: nextProfile };
      writePatronSession(nextSession);
      setSession(nextSession);
      if (nextProfile?.hasAvatar) {
        fetchPatronAvatarObjectUrl(latest.token)
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
      if (String(err.message).toLowerCase().includes("expired") || String(err.message).includes("Sign in")) {
        clearPatronSession();
        setSession(null);
        setProfile(null);
        replaceAvatarUrl(null);
      }
      return null;
    } finally {
      if (epoch === profileEpochRef.current) setLoadingProfile(false);
    }
  }, [replaceAvatarUrl]);

  useEffect(() => {
    if (!session?.token) return;
    refreshOrders();
    refreshProfile();
  }, [session?.token, refreshOrders, refreshProfile]);

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
    return nextSession;
  }, []);

  const requestMagicLink = useCallback(async (email) => requestPatronMagicLink(email), []);

  const signOut = useCallback(() => {
    profileEpochRef.current += 1;
    clearPatronSession();
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
      replaceAvatarUrl(null);
      return null;
    }
  }, [replaceAvatarUrl]);

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
      error,
      isSignedIn: Boolean(session?.token),
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
