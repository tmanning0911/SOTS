import { useEffect, useRef, useState } from "react";
import { buildHomeUpcomingEvents } from "../../../js/home-upcoming-events.js";
import { enrichEventWithTickets, enrichPlayWithTickets, TICKETS_PAGE_PATH } from "../../../js/ticketing.js";
import { ArrowButton } from "../ArrowButton.jsx";
import { useTickets } from "../../context/TicketProvider.jsx";
import { TicketStatusBadge } from "../ticketing/TicketStatusBadge.jsx";

function LearnMoreLink({ href, label }) {
  return (
    <a className="orpheum-events-grid__learn-more" href={href}>
      {label}
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M9.141 12.914L14.141 7.914L9.141 2.914" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.625 8L1.715 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

function eventDetailsLabel(event) {
  const title = String(event?.title || "event").trim();
  if (/mahjong/i.test(title)) return "Mahjong Night details";
  if (/gala|much ado about something/i.test(title)) return "Gala details";
  if (/kids|shakespeare for kids/i.test(title)) return "Kids show details";
  if (/much ado/i.test(title)) return "Much Ado details";
  return `${title} details`;
}

function EventCta({ event, compact = false }) {
  const label = event.ctaLabel || eventDetailsLabel(event);
  const href = event.ctaHref || event.href;
  const isTicket =
    /ticket/i.test(String(event.ctaLabel || label)) &&
    (href === TICKETS_PAGE_PATH || href?.startsWith("/tickets") || Boolean(event.eventbriteId));

  if (isTicket) {
    const ticketsHref = event.eventbriteId
      ? `${TICKETS_PAGE_PATH}?performance=${encodeURIComponent(event.eventbriteId)}`
      : TICKETS_PAGE_PATH;
    return (
      <ArrowButton href={ticketsHref} className={compact ? "orpheum-arrow-btn--compact" : ""}>
        Tickets
      </ArrowButton>
    );
  }

  if (event.ctaLabel && !/^learn more$/i.test(String(event.ctaLabel).trim())) {
    return (
      <ArrowButton href={href} className={compact ? "orpheum-arrow-btn--compact" : ""}>
        {label}
      </ArrowButton>
    );
  }

  return <LearnMoreLink href={href} label={eventDetailsLabel(event)} />;
}

function EventCard({ event }) {
  const image = event.image ?? event.featureImage;
  const href = event.ctaHref || event.href;
  const hasTicketCta =
    /ticket/i.test(String(event.ctaLabel || "")) &&
    (href === TICKETS_PAGE_PATH || href?.startsWith("/tickets") || Boolean(event.eventbriteId));

  return (
    <article className="orpheum-events-grid__card orpheum-events-grid__card--photo">
      <a href={event.href} className="orpheum-events-grid__photo-link" aria-label={`${event.title}, ${event.dates}`}>
        <img src={image} alt="" loading="lazy" width={640} height={853} />
      </a>
      <div className="orpheum-events-grid__photo-cap">
        <span className="orpheum-events-grid__tag">{event.genre}</span>
        <strong>{event.title}</strong>
        <span>{event.dates}</span>
        {event.ticketStatus ? <TicketStatusBadge status={event.ticketStatus} marketingOnly /> : null}
        {event.priceLabel ? <span className="orpheum-events-grid__price">{event.priceLabel}</span> : null}
      </div>
      <div className="orpheum-events-grid__photo-actions">
        <EventCta event={event} compact />
        {hasTicketCta ? <LearnMoreLink href={event.href} label={eventDetailsLabel(event)} /> : null}
      </div>
    </article>
  );
}

function ScrollControls({ scrollRef }) {
  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="orpheum-events-scroll__controls">
      <button type="button" className="orpheum-events-scroll__btn" onClick={() => scrollBy(-1)} aria-label="Scroll previous events">
        ‹
      </button>
      <button type="button" className="orpheum-events-scroll__btn" onClick={() => scrollBy(1)} aria-label="Scroll next events">
        ›
      </button>
    </div>
  );
}

export function UpcomingEvents() {
  const { data: eventbrite, loading } = useTickets();
  const [events, setEvents] = useState(() => buildHomeUpcomingEvents());
  const scrollRef = useRef(null);

  useEffect(() => {
    if (loading) return;
    Promise.all([
      fetch("/data/plays.json").then((r) => (r.ok ? r.json() : [])),
      fetch("/data/events.json").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([plays, seasonEvents]) => {
        if (!Array.isArray(plays) || !plays.length) return;
        const enrichedPlays = eventbrite
          ? plays.map((play) => enrichPlayWithTickets(play, eventbrite))
          : plays;
        const enrichedEvents = eventbrite
          ? (Array.isArray(seasonEvents) ? seasonEvents : []).map((event) =>
              enrichEventWithTickets(event, eventbrite),
            )
          : Array.isArray(seasonEvents)
            ? seasonEvents
            : [];
        const built = buildHomeUpcomingEvents(enrichedPlays, enrichedEvents);
        setEvents(
          built.map((item) => {
            const play = enrichedPlays.find((p) => item.id === p.id);
            const seasonEvent = enrichedEvents.find((e) => item.id === e.id);
            return {
              ...item,
              ticketStatus: seasonEvent?.ticketStatus ?? play?.status,
              priceLabel: play?.priceLabel,
              eventbriteId: seasonEvent?.eventbriteId ?? play?.eventbriteId,
              canPurchase: seasonEvent?.canPurchase ?? play?.canPurchase,
            };
          }),
        );
      })
      .catch(() => {});
  }, [eventbrite, loading]);

  return (
    <section className="orpheum-events-grid" id="upcoming-events" aria-labelledby="events-heading">
      <div className="orpheum-events-grid__head" data-reveal>
        <div className="orpheum-events-grid__head-copy">
          <p className="orpheum-events-grid__eyebrow">2026 Season</p>
          <h2 id="events-heading">Upcoming Events</h2>
        </div>
        <div className="orpheum-events-grid__head-actions">
          {events.length ? <ScrollControls scrollRef={scrollRef} /> : null}
          <ArrowButton href="/events/">View All Events</ArrowButton>
        </div>
      </div>

      {events.length ? (
        <div
          className="orpheum-events-grid__rail"
          ref={scrollRef}
          data-reveal
          aria-label="Upcoming events"
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="orpheum-events-grid__empty" data-reveal>
          <p className="orpheum-events-grid__empty-kicker">Calendar</p>
          <h3>Nothing is on sale right now</h3>
          <p>
            The 2026 Main Stage, Mahjong Midsummer Classic, and Much Ado About Something gala have
            ended. New dates will appear here when they open.
          </p>
          <ArrowButton href="/support/donate/">Give now</ArrowButton>
        </div>
      )}
    </section>
  );
}
