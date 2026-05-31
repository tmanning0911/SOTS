import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CookieConsent from '@/components/CookieConsent';
import {
  defaultPreferences,
  hasConsentDecision,
  readConsent,
  writeConsent,
} from '@/lib/cookieConsent';

const CookieConsentContext = createContext(null);

export function CookieConsentProvider({ children }) {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState(defaultPreferences);

  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) {
      setVisible(false);
      return;
    }

    const stored = readConsent();
    if (stored) {
      setPreferences({ essential: true, analytics: stored.analytics });
      setVisible(false);
      return;
    }

    setVisible(true);
  }, [isAdmin, pathname]);

  useEffect(() => {
    const openSettings = () => {
      const stored = readConsent();
      if (stored) {
        setPreferences({ essential: true, analytics: stored.analytics });
      }
      setSettingsOpen(true);
      setVisible(true);
    };

    window.addEventListener('sots:open-cookie-settings', openSettings);
    return () => window.removeEventListener('sots:open-cookie-settings', openSettings);
  }, []);

  const persist = useCallback((next) => {
    const prefs = { essential: true, analytics: Boolean(next.analytics) };
    writeConsent(prefs);
    setPreferences(prefs);
    setSettingsOpen(false);
    setVisible(false);
  }, []);

  const acceptAll = useCallback(() => {
    persist({ essential: true, analytics: true });
  }, [persist]);

  const declineAll = useCallback(() => {
    persist({ essential: true, analytics: false });
  }, [persist]);

  const savePreferences = useCallback(() => {
    persist(preferences);
  }, [persist, preferences]);

  const openSettings = useCallback(() => {
    const stored = readConsent();
    if (stored) {
      setPreferences({ essential: true, analytics: stored.analytics });
    }
    setSettingsOpen(true);
    setVisible(true);
  }, []);

  const value = useMemo(
    () => ({
      hasDecision: hasConsentDecision(),
      preferences,
      openSettings,
    }),
    [openSettings, preferences],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {!isAdmin && visible && (
        <CookieConsent
          settingsOpen={settingsOpen}
          preferences={preferences}
          onOpenSettings={() => setSettingsOpen(true)}
          onCloseSettings={() => {
            if (hasConsentDecision()) {
              setSettingsOpen(false);
              setVisible(false);
            } else {
              setSettingsOpen(false);
            }
          }}
          onPreferenceChange={setPreferences}
          onAcceptAll={acceptAll}
          onDeclineAll={declineAll}
          onSavePreferences={savePreferences}
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
