import { Link } from 'react-router-dom';
import { ArtSectionBackground } from './decor';
import { images } from '@/content/images';

/** Cream band — visual break before the special-events programme list. */
export default function ProgrammeEventsBand({
  eyebrow = 'Beyond the main stage',
  title = 'Special events',
  href,
  linkLabel = 'View all',
  art = images.art.masqueArches,
  showHeader = true,
  children,
  className = '',
}) {
  return (
    <div className={`programme-events-band ${className}`}>
      {art && (
        <div className="programme-events-band__art" aria-hidden>
          <ArtSectionBackground src={art} tone="light" position="left" />
        </div>
      )}
      <div className="relative z-[1]">
        {showHeader && (
          <header className="programme-events-band__header">
            <div>
              {eyebrow && <p className="label mb-2">{eyebrow}</p>}
              <h3 className="heading-section text-navy">{title}</h3>
            </div>
            {href && (
              <Link to={href} className="text-link text-sm shrink-0">
                {linkLabel}
              </Link>
            )}
          </header>
        )}
        {children}
      </div>
    </div>
  );
}
