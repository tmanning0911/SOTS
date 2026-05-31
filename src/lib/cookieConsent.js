export const CONSENT_STORAGE_KEY = 'sots-cookie-consent';
export const CONSENT_VERSION = 1;

export const defaultPreferences = {
  essential: true,
  analytics: false,
};

export function readConsent() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed?.version !== CONSENT_VERSION) return null;

    return {
      essential: true,
      analytics: Boolean(parsed.analytics),
      decidedAt: parsed.decidedAt || null,
    };
  } catch {
    return null;
  }
}

export function writeConsent(preferences) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(
    CONSENT_STORAGE_KEY,
    JSON.stringify({
      version: CONSENT_VERSION,
      essential: true,
      analytics: Boolean(preferences.analytics),
      decidedAt: new Date().toISOString(),
    }),
  );

  window.dispatchEvent(new CustomEvent('sots:cookie-consent', { detail: preferences }));
}

export function hasConsentDecision() {
  return readConsent() !== null;
}
