import { Link } from 'react-router-dom';
import CtaLink from './CtaLink';
import AddToCalendar from './AddToCalendar';

/**
 * Programme-style event row — date column + title, copy, and CTA.
 */
export function EventProgrammeRow({ event, compact = false }) {
  const pad = compact ? 'py-6 sm:py-7' : 'py-7 sm:py-8';

  return (
    <li
      id={event.id}
      className={`programme-event-row scroll-mt-24 sm:scroll-mt-28 ${pad} border-t border-navy/10 first:border-t-0 first:pt-0 min-w-0`}
    >
      <div className="programme-event-row__date">
        <p className="font-display text-base sm:text-lg text-navy/75 leading-snug">{event.date}</p>
        {event.category && (
          <span className="programme-event-category">{event.category}</span>
        )}
      </div>

      <div className="programme-event-row__body min-w-0">
        <h3 className={`font-display text-navy leading-snug mb-2 ${compact ? 'text-xl' : 'text-xl md:text-2xl'}`}>
          <Link
            to={`/events#${event.id}`}
            className="hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
          >
            {event.title}
          </Link>
        </h3>

        {(event.time || event.location) && (
          <p className="text-sm text-navy/50 mb-3 break-words">
            {[event.time, event.location].filter(Boolean).join(' · ')}
          </p>
        )}

        {event.description && (
          <p className="text-body text-sm max-w-prose leading-relaxed">{event.description}</p>
        )}

        {event.priceNote && <p className="text-sm text-navy/45 mt-2">{event.priceNote}</p>}

        {event.ctaUrl ? (
          <div className="programme-event-row__actions">
            <CtaLink href={event.ctaUrl} className="programme-event-row__link">
              {event.ctaLabel || 'Get tickets'}
            </CtaLink>
            <AddToCalendar item={event} />
          </div>
        ) : (
          <div className="programme-event-row__actions">
            <Link to={`/events#${event.id}`} className="programme-event-row__link">
              Details
            </Link>
            <AddToCalendar item={event} />
          </div>
        )}
      </div>
    </li>
  );
}

export default function EventProgrammeList({ events, compact = false, className = '' }) {
  if (!events?.length) return null;

  return (
    <ul className={`list-none p-0 m-0 ${className}`}>
      {events.map((event) => (
        <EventProgrammeRow key={event.id} event={event} compact={compact} />
      ))}
    </ul>
  );
}
