import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import OptimizedImage from './OptimizedImage';
import AddToCalendar from './AddToCalendar';
import CtaLink from './CtaLink';
import { formatProgrammeDate, parseEventLocation, formatTicketTime } from '@/lib/programmeDate';
import { getCalendarOccurrences } from '@/lib/calendar';
import { images } from '@/content/images';
import { parkDirectionsUrl, visitInfo } from '@/content/site';

const ease = [0.22, 1, 0.36, 1];

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

function getLocationDirectionsUrl(location) {
  if (!location) return null;
  if (location.toLowerCase().includes('pinkney park')) {
    return parkDirectionsUrl(location);
  }
  return null;
}

function getEventImage(event) {
  if (event.image) return event.image;
  return images.eventTicket;
}

/** Ticket-style event card for the special-events programme. */
export function EventTicketCard({ event, index = 0 }) {
  const reduceMotion = useReducedMotion();
  const parts = formatProgrammeDate(event.date);
  const { venue, city } = parseEventLocation(event.location);
  const image = getEventImage(event);
  const dateLine = parts.monthFull && parts.day ? `${parts.monthFull} ${parts.day}` : event.date;
  const timeLabel = formatTicketTime(event.time);
  const hasCalendar = getCalendarOccurrences(event).length > 0;
  const locationDirectionsUrl = getLocationDirectionsUrl(event.location);
  const stagger = index * 0.11;

  const card = (
    <>
      <div className="event-ticket-stack__layer event-ticket-stack__layer--2" aria-hidden />
      <div className="event-ticket-stack__layer event-ticket-stack__layer--1" aria-hidden />

      <article className="event-ticket">
        <span className="event-ticket__tab">Event Calendar</span>

        <div className="event-ticket__hero">
          <div className="event-ticket__copy">
            <h3 className="event-ticket__title">
              <Link to={`/events#${event.id}`} className="event-ticket__title-link">
                {event.title}
              </Link>
            </h3>
            {event.category && (
              <p className="event-ticket__subtitle">{event.category.toUpperCase()}</p>
            )}
            {event.description && (
              <p className="event-ticket__description">{event.description}</p>
            )}
            {event.priceNote && (
              <p className="event-ticket__price-note">{event.priceNote}</p>
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
          </div>
        </div>

        <div className="event-ticket__rip" aria-hidden>
          <span className="event-ticket__notch event-ticket__notch--left" />
          <span className="event-ticket__perforation" />
          <span className="event-ticket__notch event-ticket__notch--right" />
        </div>

        <div className="event-ticket__details">
          <div className="event-ticket__actions">
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
            </div>

            {event.ctaUrl ? (
              <CtaLink href={event.ctaUrl} className="btn-primary event-ticket__cta">
                {event.ctaLabel || 'Get tickets'}
              </CtaLink>
            ) : (
              <Link to={`/events#${event.id}`} className="btn-outline event-ticket__cta">
                Details
              </Link>
            )}
          </div>

          {(timeLabel || event.location) && (
            <div className="event-ticket__meta">
              {timeLabel && <span className="event-ticket__time-pill">{timeLabel}</span>}
              {event.location && (
                <div className="event-ticket__location">
                  <PinIcon />
                  {locationDirectionsUrl ? (
                    <a
                      href={locationDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="event-ticket__location-link"
                      aria-label={`Directions to ${visitInfo.park}, Rowayton, CT`}
                    >
                      <span className="event-ticket__location-text">
                        <span className="event-ticket__location-venue">{venue}</span>
                        {city && <span className="event-ticket__location-city">{city}</span>}
                      </span>
                    </a>
                  ) : (
                    <span className="event-ticket__location-text">
                      <span className="event-ticket__location-venue">{venue}</span>
                      {city && <span className="event-ticket__location-city">{city}</span>}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </article>
    </>
  );

  if (reduceMotion) {
    return (
      <li id={event.id} className="event-ticket-stack scroll-mt-24 sm:scroll-mt-28 min-w-0">
        {card}
      </li>
    );
  }

  return (
    <motion.li
      id={event.id}
      className="event-ticket-stack scroll-mt-24 sm:scroll-mt-28 min-w-0"
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.72, delay: stagger, ease }}
    >
      {card}
    </motion.li>
  );
}

export default function EventProgrammeList({ events, className = '' }) {
  if (!events?.length) return null;

  return (
    <ul className={`event-ticket-list list-none p-0 m-0 ${className}`}>
      {events.map((event, index) => (
        <EventTicketCard key={event.id} event={event} index={index} />
      ))}
    </ul>
  );
}
