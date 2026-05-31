import { Link } from 'react-router-dom';
import { OrnamentDivider } from './decor';

/** Branded cream band — special-events ticket cards. */
export default function ProgrammeEventsBand({
  eyebrow = 'Beyond the main stage',
  title = 'Special events',
  intro,
  href,
  linkLabel = 'View all',
  footerHref,
  footerLabel = 'View full programme',
  showHeader = true,
  children,
  className = '',
}) {
  return (
    <div className={`programme-events-band ${className}`}>
      <div className="programme-events-band__texture" aria-hidden />
      <div className="programme-events-band__inner">
        {showHeader && (
          <header className="programme-events-band__header">
            <div className="max-w-2xl">
              {eyebrow && (
                <div className="flex items-center gap-3 mb-3">
                  <OrnamentDivider />
                  <p className="label mb-0">{eyebrow}</p>
                </div>
              )}
              <h3 className="heading-section text-navy">{title}</h3>
              {intro && (
                <p className="text-body text-sm sm:text-base text-navy/65 mt-3 leading-relaxed">
                  {intro}
                </p>
              )}
            </div>
            {href && (
              <Link to={href} className="text-link text-link--arrow text-sm shrink-0 self-start sm:self-end">
                {linkLabel}
              </Link>
            )}
          </header>
        )}

        {children}

        {footerHref && (
          <footer className="programme-events-band__footer">
            <Link to={footerHref} className="text-link text-link--arrow text-sm font-semibold">
              {footerLabel}
            </Link>
          </footer>
        )}
      </div>
    </div>
  );
}
