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
      className={`scroll-mt-24 sm:scroll-mt-28 grid sm:grid-cols-[minmax(0,9.5rem)_1fr] lg:grid-cols-[minmax(0,10.5rem)_1fr] gap-x-6 sm:gap-x-8 gap-y-2 sm:gap-y-3 ${pad} border-t border-navy/10 first:border-t-0 first:pt-0 min-w-0`}
    >
      <div className="sm:pt-0.5 min-w-0">
        <p className="font-display text-[0.95rem] sm:text-base md:text-lg text-navy/75 leading-snug">{event.date}</p>
        {event.category && (
          <span className="programme-event-category">{event.category}</span>
        )}
      </div>

      <div className="min-w-0">
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
          <div className="mt-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
            <CtaLink href={event.ctaUrl} className="text-link text-sm">
              {event.ctaLabel || 'Get tickets'}
            </CtaLink>
            <AddToCalendar item={event} />
          </div>
        ) : (
          <div className="mt-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
            <Link to={`/events#${event.id}`} className="text-link text-sm">
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
