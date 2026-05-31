import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';
import AddToCalendar from './AddToCalendar';
import CtaLink from './CtaLink';
import {
  formatProgrammeDate,
  parseEventLocation,
  getCategoryAccent,
  formatTicketTime,
} from '@/lib/programmeDate';
import { getCalendarOccurrences } from '@/lib/calendar';
import { images } from '@/content/images';

const CATEGORY_IMAGES = {
  reception: images.art.masqueArches,
  talk: images.backgrounds.cast,
  community: images.learning.inThePark,
  performance: images.parkPerformance,
  fundraiser: images.news.gala,
  default: images.news.production,
};

function CalendarIconStatic() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <path
        d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function getEventImage(event) {
  if (event.image) return event.image;
  return CATEGORY_IMAGES[getCategoryAccent(event.category)] || CATEGORY_IMAGES.default;
}

function isEventbriteAddon(event) {
  return Boolean(event.priceNote && event.ctaUrl?.includes('eventbrite.com'));
}

/** Ticket-style event card for the special-events programme. */
export function EventTicketCard({ event }) {
  const parts = formatProgrammeDate(event.date);
  const { venue, city } = parseEventLocation(event.location);
  const image = getEventImage(event);
  const dateLine = parts.monthFull && parts.day ? `${parts.monthFull} ${parts.day}` : event.date;
  const timeLabel = formatTicketTime(event.time);
  const hasCalendar = getCalendarOccurrences(event).length > 0;
  const ticketAction = Boolean(event.ctaUrl);

  return (
    <li id={event.id} className="event-ticket-stack scroll-mt-24 sm:scroll-mt-28 min-w-0">
      <div className="event-ticket-stack__layer event-ticket-stack__layer--2" aria-hidden />
      <div className="event-ticket-stack__layer event-ticket-stack__layer--1" aria-hidden />

      <article className="event-ticket">
        <div className="event-ticket__tab">
          <span className="event-ticket__tab-label">Event Calendar</span>
        </div>

        <div className="event-ticket__hero">
          <div className="event-ticket__copy">
            <h3 className="event-ticket__title">
              {ticketAction ? (
                event.title
              ) : (
                <Link to={`/events#${event.id}`} className="event-ticket__title-link">
                  {event.title}
                </Link>
              )}
            </h3>
            {event.category && (
              <p className="event-ticket__subtitle">{event.category.toUpperCase()}</p>
            )}
            {event.priceNote && <p className="event-ticket__price">{event.priceNote}</p>}
            {ticketAction ? (
              <>
                <CtaLink href={event.ctaUrl} className="btn-primary event-ticket__cta">
                  {event.ctaLabel || 'Get tickets'}
                </CtaLink>
                {isEventbriteAddon(event) && (
                  <p className="event-ticket__cta-hint">Add when booking on Eventbrite</p>
                )}
              </>
            ) : (
              <Link to={`/events#${event.id}`} className="btn-outline event-ticket__cta">
                Details
              </Link>
            )}
          </div>

          <div className="event-ticket__media">
            <div className="event-ticket__image-wrap">
              <OptimizedImage
                src={image}
                alt=""
                decorative
                className="event-ticket__image"
                wrapperClassName="event-ticket__image-inner"
              />
            </div>
            {event.location && (
              <div className="event-ticket__location">
                <PinIcon />
                <div className="event-ticket__location-text">
                  <span className="event-ticket__location-venue">{venue}</span>
                  {city && <span className="event-ticket__location-city">{city}</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="event-ticket__rip" aria-hidden>
          <span className="event-ticket__notch event-ticket__notch--left" />
          <span className="event-ticket__perforation" />
          <span className="event-ticket__notch event-ticket__notch--right" />
        </div>

        <div className="event-ticket__details">
          <div className="event-ticket__detail event-ticket__detail--date">
            {hasCalendar ? (
              <AddToCalendar item={event} variant="ticket-date" />
            ) : (
              <>
                <CalendarIconStatic />
                <div className="event-ticket__detail-text">
                  <span className="event-ticket__detail-primary">{dateLine}</span>
                  {parts.weekdayFull && (
                    <span className="event-ticket__detail-secondary">{parts.weekdayFull}</span>
                  )}
                </div>
              </>
            )}
            {event.timeNote && (
              <span className="event-ticket__session">{event.timeNote}</span>
            )}
            {timeLabel && <span className="event-ticket__time-pill">{timeLabel}</span>}
          </div>
        </div>
      </article>
    </li>
  );
}

export default function EventProgrammeList({ events, className = '' }) {
  if (!events?.length) return null;

  return (
    <ul className={`event-ticket-list list-none p-0 m-0 ${className}`}>
      {events.map((event) => (
        <EventTicketCard key={event.id} event={event} />
      ))}
    </ul>
  );
}
