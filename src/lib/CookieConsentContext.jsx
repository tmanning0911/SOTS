import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CookieConsent from '@/components/CookieConsent';
import { hasConsentDecision, readConsent, writeConsent } from '@/lib/cookieConsent';

const CookieConsentContext = createContext(null);

export function CookieConsentProvider({ children }) {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) {
      setVisible(false);
      return;
    }

    setVisible(!readConsent());
  }, [isAdmin, pathname]);

  useEffect(() => {
    const openSettings = () => {
      setSettingsOpen(true);
      setVisible(true);
    };

    window.addEventListener('sots:open-cookie-settings', openSettings);
    return () => window.removeEventListener('sots:open-cookie-settings', openSettings);
  }, []);

  const accept = useCallback(() => {
    writeConsent();
    setSettingsOpen(false);
    setVisible(false);
  }, []);

  const openSettings = useCallback(() => {
    setSettingsOpen(true);
    setVisible(true);
  }, []);

  const value = useMemo(
    () => ({
      hasDecision: hasConsentDecision(),
      openSettings,
    }),
    [openSettings],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {!isAdmin && visible && (
        <CookieConsent
          settingsOpen={settingsOpen}
          onOpenSettings={() => setSettingsOpen(true)}
          onCloseSettings={() => {
            if (hasConsentDecision()) {
              setSettingsOpen(false);
              setVisible(false);
            } else {
              setSettingsOpen(false);
            }
          }}
          onAcceptAll={accept}
          onDeclineAll={accept}
          onSavePreferences={accept}
        />
      )}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return ctx;
}
