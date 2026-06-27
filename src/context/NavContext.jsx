import { createContext, useCallback, useContext, useMemo, useState } from "react";

const NavContext = createContext(null);

export function NavProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const value = useMemo(
    () => ({ menuOpen, openMenu, closeMenu }),
    [menuOpen, openMenu, closeMenu]
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used within NavProvider");
  return ctx;
}
