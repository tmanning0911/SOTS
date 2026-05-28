import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SeoOverrideContext = createContext(null);

export function SeoOverrideProvider({ children }) {
  const [override, setOverride] = useState(null);
  const value = useMemo(() => ({ override, setOverride }), [override]);
  return <SeoOverrideContext.Provider value={value}>{children}</SeoOverrideContext.Provider>;
}

/** Per-page SEO overrides (e.g. dynamic news article titles). Cleared on unmount. */
export function useSeoOverride(meta) {
  const ctx = useContext(SeoOverrideContext);
  const setOverride = ctx?.setOverride;

  useEffect(() => {
    if (!setOverride) return undefined;
    if (meta) setOverride(meta);
    return () => setOverride(null);
  }, [meta, setOverride]);
}

export function useSeoOverrideValue() {
  return useContext(SeoOverrideContext)?.override ?? null;
}
