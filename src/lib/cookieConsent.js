export const CONSENT_STORAGE_KEY = 'sots-cookie-consent';
export const CONSENT_VERSION = 2;

export const defaultPreferences = {
  essential: true,
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
      decidedAt: parsed.decidedAt || null,
    };
  } catch {
    return null;
  }
}

export function writeConsent() {
  if (typeof window === 'undefined') return;

  const preferences = { essential: true };

  window.localStorage.setItem(
    CONSENT_STORAGE_KEY,
    JSON.stringify({
      version: CONSENT_VERSION,
      essential: true,
      decidedAt: new Date().toISOString(),
    }),
  );

  window.dispatchEvent(new CustomEvent('sots:cookie-consent', { detail: preferences }));
}

export function hasConsentDecision() {
  return readConsent() !== null;
}
