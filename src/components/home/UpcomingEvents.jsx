import { useEffect, useRef, useState } from "react";
import { buildHomeUpcomingEvents } from "../../../js/home-upcoming-events.js";
import { enrichEventWithTickets, enrichPlayWithTickets } from "../../../js/ticketing.js";
import { ArrowButton } from "../ArrowButton.jsx";
import { useTickets } from "../../context/TicketProvider.jsx";
import { TicketStatusBadge } from "../ticketing/TicketStatusBadge.jsx";

function LearnMoreLink({ href }) {
  return (
    <a className="orpheum-events-grid__learn-more" href={href}>
      Learn More
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M9.141 12.914L14.141 7.914L9.141 2.914" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.625 8L1.715 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

function EventCta({ event, compact = false }) {
  const { openCheckout, ticketsUrl } = useTickets();
  const label = event.ctaLabel || "Learn More";
  const href = event.ctaHref || event.href;
  const external = event.ctaExternal;
  const isTicket = external && event.canPurchase !== false && (event.eventbriteId || event.ctaHref?.includes("eventbrite"));

  if (label === "Learn More") {
    return <LearnMoreLink href={href} />;
  }

  if (isTicket && ticketsUrl) {
    return (
      <ArrowButton
        className={compact ? "orpheum-arrow-btn--compact" : ""}
        type="button"
        onClick={() => openCheckout(event.eventbriteId)}
      >
        Tickets
      </ArrowButton>
    );
  }

  return (
    <ArrowButton
      href={href}
      className={compact ? "orpheum-arrow-btn--compact" : ""}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {label}
    </ArrowButton>
  );
}

function EventGridCard({ event }) {
  const isFeature = event.variant === "feature";
  const cardClass = `orpheum-events-grid__card orpheum-events-grid__card--${isFeature ? "feature" : "photo"}`;
  const image = event.featureImage ?? event.image;

  if (isFeature) {
    return (
      <article className={cardClass}>
        <img src={image} alt="" loading="lazy" width={960} height={540} />
        <div className="orpheum-events-grid__feature-cap" aria-hidden="true">
          <span className="orpheum-events-grid__tag">{event.genre}</span>
          <span>{event.dates}</span>
        </div>
        <div className="orpheum-events-grid__overlay">
          <div className="orpheum-events-grid__overlay-copy">
            <h4>{event.title}</h4>
            <p>{event.dates}</p>
          </div>
          <div className="orpheum-events-grid__overlay-actions">
            <EventCta event={event} />
            <LearnMoreLink href={event.href} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={cardClass}>
      <a href={event.href} className="orpheum-events-grid__photo-link" aria-label={`${event.title}, ${event.dates}`}>
        <img src={event.image} alt="" loading="lazy" width={640} height={360} />
      </a>
      <div className="orpheum-events-grid__photo-cap">
        <span className="orpheum-events-grid__tag">{event.genre}</span>
        <strong>{event.title}</strong>
        <span>{event.dates}</span>
        {event.ticketStatus ? <TicketStatusBadge status={event.ticketStatus} /> : null}
        {event.priceLabel ? <span className="orpheum-events-grid__price">{event.priceLabel}</span> : null}
      </div>
      <div className="orpheum-events-grid__photo-actions">
        <EventCta event={event} compact />
        <LearnMoreLink href={event.href} />
      </div>
    </article>
  );
}

function EventScrollCard({ event }) {
  return (
    <article className="orpheum-events-scroll__card">
      <a className="orpheum-events-scroll__media" href={event.href}>
        <img src={event.image} alt="" loading="lazy" width={320} height={180} />
      </a>
      <div className="orpheum-events-scroll__body">
        <p className="orpheum-events-scroll__meta">{event.genre}</p>
        <h4>
          <a href={event.href}>{event.title}</a>
        </h4>
        <p className="orpheum-events-scroll__dates">{event.dates}</p>
        {event.ticketStatus ? <TicketStatusBadge status={event.ticketStatus} /> : null}
        {event.priceLabel ? <p className="orpheum-events-scroll__price">{event.priceLabel}</p> : null}
        <div className="orpheum-events-scroll__actions">
          <EventCta event={event} compact />
          <LearnMoreLink href={event.href} />
        </div>
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
    <div className="orpheum-events-scroll__controls" aria-hidden="false">
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

  const [featured, ...rest] = events;
  const sideA = rest[0];
  const sideB = rest[1];

  return (
    <section className="orpheum-events-grid" id="upcoming-events" aria-labelledby="events-heading">
      <div className="orpheum-events-grid__head" data-reveal>
        <div>
          <p className="orpheum-events-grid__eyebrow">2026 Season</p>
          <h3 id="events-heading">Upcoming Events</h3>
        </div>
        <ArrowButton href="/support/events/">View All Events</ArrowButton>
      </div>

      <div className="orpheum-events-grid__layout orpheum-events-grid__layout--desktop" data-reveal>
        {featured ? <EventGridCard event={featured} /> : null}
        <div className="orpheum-events-grid__stack">
          {sideA ? <EventGridCard event={sideA} /> : null}
          {sideB ? <EventGridCard event={sideB} /> : null}
        </div>
      </div>

      <div className="orpheum-events-scroll-wrap">
        <ScrollControls scrollRef={scrollRef} />
        <div className="orpheum-events-scroll" ref={scrollRef} aria-label="Upcoming events">
          <div className="orpheum-events-scroll__track">
            {events.map((event) => (
              <EventScrollCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
