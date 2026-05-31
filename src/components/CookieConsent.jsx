import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cookieCategories } from '@/content/cookies';

export default function CookieConsent({
  settingsOpen,
  onOpenSettings,
  onCloseSettings,
  onAcceptAll,
  onDeclineAll,
  onSavePreferences,
}) {
  return (
    <>
      {!settingsOpen && (
        <div className="cookie-consent" role="region" aria-label="Cookie consent">
          <div className="cookie-consent__inner site-container">
            <p className="cookie-consent__text">
              We use cookies to ensure that you have the best experience on our website.{' '}
              <Link to="/cookie-policy" className="cookie-consent__link">
                View our Cookie Policy
              </Link>
              .
            </p>
            <div className="cookie-consent__actions">
              <button type="button" className="btn-outline cookie-consent__btn" onClick={onOpenSettings}>
                Settings
              </button>
              <button type="button" className="btn-outline cookie-consent__btn" onClick={onDeclineAll}>
                Decline All
              </button>
              <button type="button" className="btn-primary cookie-consent__btn" onClick={onAcceptAll}>
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={settingsOpen} onOpenChange={(open) => !open && onCloseSettings()}>
        <DialogContent className="max-w-lg border-navy/10 p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-navy/10 text-left">
            <DialogTitle className="font-display text-2xl text-navy">Cookie settings</DialogTitle>
            <DialogDescription className="text-sm text-navy/65 leading-relaxed">
              This site uses essential cookies only — for example, to remember your cookie choice.
            </DialogDescription>
          </DialogHeader>

          <ul className="px-6 py-5 space-y-5">
            {cookieCategories.map((category) => (
              <li key={category.id} className="flex gap-4 items-start justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-navy text-sm">{category.title}</p>
                  <p className="text-sm text-navy/60 mt-1 leading-relaxed">{category.description}</p>
                </div>
                <span
                  className="cookie-consent__toggle shrink-0 opacity-70 cursor-not-allowed"
                  aria-label={`${category.title} cookies always enabled`}
                >
                  <span aria-hidden className="cookie-consent__toggle-track" data-on="true" />
                </span>
              </li>
            ))}
          </ul>

          <DialogFooter className="px-6 py-4 border-t border-navy/10 bg-cream/40 sm:justify-between gap-3">
            <Link to="/cookie-policy" className="text-link text-sm" onClick={onCloseSettings}>
              Cookie Policy
            </Link>
            <button type="button" className="btn-primary cookie-consent__btn" onClick={onSavePreferences}>
              Save preferences
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
