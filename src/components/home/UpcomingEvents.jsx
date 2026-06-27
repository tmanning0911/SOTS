import { UPCOMING_EVENTS } from "../../../js/data.js";
import { ArrowButton } from "../ArrowButton.jsx";

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

function EventGridCard({ event, variant = "photo" }) {
  const image = event.featureImage ?? event.image;
  const isPhoto = variant === "photo";

  return (
    <article className={`orpheum-events-grid__card orpheum-events-grid__card--${variant}`}>
      <img src={image} alt={event.title} loading="lazy" width={isPhoto ? 640 : 960} height={isPhoto ? 360 : 540} />

      {!isPhoto ? (
        <div className="orpheum-events-grid__feature-cap" aria-hidden="true">
          <span>
            {event.genre} · {event.dates}
          </span>
        </div>
      ) : (
        <div className="orpheum-events-grid__photo-cap">
          <strong>{event.title}</strong>
          <span>{event.dates}</span>
        </div>
      )}

      <div className="orpheum-events-grid__overlay">
        {!isPhoto ? (
          <>
            <div className="orpheum-events-grid__overlay-copy">
              <h4>{event.title}</h4>
              <p>{event.dates}</p>
            </div>

            <div className="orpheum-events-grid__overlay-actions">
              {event.tickets ? (
                <ArrowButton href={event.tickets} target="_blank" rel="noopener noreferrer">
                  Buy Tickets
                </ArrowButton>
              ) : null}
              <LearnMoreLink href={event.href} />
            </div>
          </>
        ) : (
          <div className="orpheum-events-grid__overlay-actions">
            <ArrowButton href={event.href} variant="ghost" className="orpheum-arrow-btn--compact orpheum-events-grid__learn-btn">
              Learn More
            </ArrowButton>
          </div>
        )}
      </div>
    </article>
  );
}

function EventScrollCard({ event }) {
  const image = event.featureImage ?? event.image;

  return (
    <article className="orpheum-events-scroll__card">
      <a className="orpheum-events-scroll__media" href={event.href}>
        <img src={image} alt="" loading="lazy" width={320} height={180} />
      </a>
      <div className="orpheum-events-scroll__body">
        <p className="orpheum-events-scroll__meta">{event.genre}</p>
        <h4>
          <a href={event.href}>{event.title}</a>
        </h4>
        <p className="orpheum-events-scroll__dates">{event.dates}</p>
        <div className="orpheum-events-scroll__actions">
          {event.tickets ? (
            <ArrowButton href={event.tickets} target="_blank" rel="noopener noreferrer" className="orpheum-arrow-btn--compact">
              Buy Tickets
            </ArrowButton>
          ) : null}
          <LearnMoreLink href={event.href} />
        </div>
      </div>
    </article>
  );
}

export function UpcomingEvents() {
  const [featured, sideA, sideB] = UPCOMING_EVENTS;

  return (
    <section className="orpheum-events-grid" id="upcoming-events" aria-labelledby="events-heading">
      <div className="orpheum-events-grid__head" data-reveal>
        <h3 id="events-heading">Upcoming Events</h3>
        <ArrowButton href="/productions/past-productions/">View All Events</ArrowButton>
      </div>

      <div className="orpheum-events-grid__layout orpheum-events-grid__layout--desktop" data-reveal>
        <EventGridCard event={featured} variant="feature" />

        <div className="orpheum-events-grid__stack">
          {sideA ? <EventGridCard event={sideA} /> : null}
          {sideB ? <EventGridCard event={sideB} /> : null}
        </div>
      </div>

      <div className="orpheum-events-scroll" data-reveal aria-label="Scroll upcoming events">
        <div className="orpheum-events-scroll__track">
          {UPCOMING_EVENTS.map((event) => (
            <EventScrollCard key={event.href} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
