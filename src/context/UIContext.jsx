import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [accessTicketsOpen, setAccessTicketsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openAccessTickets = useCallback(() => setAccessTicketsOpen(true), []);
  const closeAccessTickets = useCallback(() => setAccessTicketsOpen(false), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo(
    () => ({
      accessTicketsOpen,
      openAccessTickets,
      closeAccessTickets,
      searchOpen,
      openSearch,
      closeSearch,
    }),
    [accessTicketsOpen, openAccessTickets, closeAccessTickets, searchOpen, openSearch, closeSearch]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
