import { useEffect } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { MEDIA, SEASON_SHOWS } from "../../js/data.js";
import { heroImageForHref } from "../../js/page-heroes.js";
import { HOME_UPCOMING_EVENTS } from "../../js/home-upcoming-events.js";
import {
  getPriceFromLabel,
  getTicketCheckoutPath,
  getTicketingState,
  patronDisplayName,
} from "../../js/ticketing.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { PerformanceCalendar } from "../components/ticketing/PerformanceCalendar.jsx";
import { TicketCheckoutButton } from "../components/ticketing/TicketCheckoutButton.jsx";
import { TicketPricing } from "../components/ticketing/TicketPricing.jsx";
import { TicketStatusBadge } from "../components/ticketing/TicketStatusBadge.jsx";
import { useTickets } from "../context/TicketProvider.jsx";

const PRODUCTION_SLUG = "much-ado-about-nothing";
const FEATURED_SHOW = SEASON_SHOWS.find((s) => s.id === "much-ado") ?? SEASON_SHOWS[0];

function TicketsPageSkeleton() {
  return (
    <div className="tix-page__skeleton" aria-busy="true" aria-label="Loading tickets">
      <div className="sots-checkout-skeleton sots-checkout-skeleton--block" />
      <div className="sots-checkout-skeleton sots-checkout-skeleton--block" />
      <div className="sots-checkout-skeleton sots-checkout-skeleton--block sots-checkout-skeleton--short" />
    </div>
  );
}

function TicketsQuickBar() {
  return (
    <nav className="tix-page__quick" aria-label="Ticket shortcuts">
      <Link to="/my-tickets/" className="tix-page__quick-link">
        My Tickets
      </Link>
      <Link to="/access-your-tickets/" className="tix-page__quick-link">
        Confirmation lookup
      </Link>
      <a href="tel:+12039571006" className="tix-page__quick-link">
        Box office (203) 957-1006
      </a>
      <Link to="/about/visit/" className="tix-page__quick-link">
        Plan your visit
      </Link>
    </nav>
  );
}

function TicketsSpotlight({ data, loading, priceLabel }) {
  const ticketingState = data ? getTicketingState(data) : null;
  const production = data?.production;
  const featured = data?.featuredTicket;
  const title = patronDisplayName(production?.title ?? featured?.name ?? FEATURED_SHOW.title);
  const dates = featured?.start
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "America/New_York",
      }).format(new Date(featured.start.slice(0, 10) + "T12:00:00"))
    : FEATURED_SHOW.dates;
  const venue = featured?.venue ?? "Pinkney Park";
  const slug = production?.slug ?? PRODUCTION_SLUG;

  return (
    <section className="tix-page__spotlight" aria-labelledby="tix-spotlight-heading" data-reveal>
      <div className="tix-page__spotlight-ticket">
        <div className="tix-page__spotlight-visual">
          <img src={MEDIA.muchAdoPoster} alt="" loading="eager" width={450} height={712} />
        </div>
        <div className="tix-page__spotlight-copy">
          <p className="tix-page__spotlight-eyebrow">2026 Main Stage</p>
          <h2 id="tix-spotlight-heading">{title}</h2>
          <p className="tix-page__spotlight-meta">
            <span>{dates}</span>
            <span>{venue} · Rowayton, CT</span>
          </p>
          {!loading && ticketingState?.statusLabel ? (
            <TicketStatusBadge status={ticketingState.statusLabel} className="tix-page__spotlight-badge" />
          ) : null}
          {priceLabel ? <p className="tix-page__spotlight-price">{priceLabel}</p> : null}
          <p className="tix-page__spotlight-lead">
            Open-air Shakespeare under the stars. General admission includes lawn seating; VIP adds a
            reserved chair. Tuesday nights are pay-what-you-wish at the door.
          </p>
          <div className="tix-page__spotlight-actions">
            <TicketCheckoutButton className="tix-page__spotlight-cta" />
            <ArrowButton href={`/productions/${slug}/`} variant="ghost">
              About the show
            </ArrowButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function TicketsTierGuide() {
  const tiers = [
    {
      name: "General Admission",
      detail: "Open lawn seating — bring a blanket or low chair.",
    },
    {
      name: "Child (12 & under)",
      detail: "Same great view from the lawn at a reduced price.",
    },
    {
      name: "VIP Reserved",
      detail: "Low-back chair in a reserved section near the stage.",
    },
  ];

  return (
    <div className="tix-page__tiers" aria-labelledby="tix-tiers-heading">
      <h3 id="tix-tiers-heading" className="tix-page__tiers-title">
        Ticket types
      </h3>
      <ul className="tix-page__tiers-list">
        {tiers.map((tier) => (
          <li key={tier.name}>
            <strong>{tier.name}</strong>
            <p>{tier.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TicketsPage() {
  const { data, loading, error, refresh, ticketingState } = useTickets();
  const [searchParams] = useSearchParams();
  const priceLabel = getPriceFromLabel(data);
  const relatedEvents = HOME_UPCOMING_EVENTS.filter(
    (event) => event.href !== `/productions/${PRODUCTION_SLUG}/`,
  ).slice(0, 6);
  const heroImage = heroImageForHref("/tickets/");

  useEffect(() => {
    document.title = "Tickets - Shakespeare on the Sound";
  }, []);

  const performanceId = searchParams.get("performance");
  if (performanceId && !loading && data) {
    return <Navigate to={getTicketCheckoutPath(performanceId)} replace />;
  }

  return (
    <InnerPageShell showVisit={false} showNewsletter>
      <article className="tix-page">
        <header className="tix-page__hero">
          <div
            className="tix-page__hero-bg"
            style={{ backgroundImage: `url('${heroImage}')` }}
            aria-hidden="true"
          />
          <div className="tix-page__hero-veil" aria-hidden="true" />
          <div className="tix-page__hero-inner" data-reveal>
            <p className="tix-page__hero-eyebrow">Pinkney Park · Summer 2026</p>
            <h1>Tickets &amp; Dates</h1>
            <p className="tix-page__hero-lead">
              Choose a performance, checkout in minutes, and show your QR code at the gate.
            </p>
            {!loading && ticketingState.statusLabel ? (
              <div className="tix-page__hero-meta">
                <TicketStatusBadge status={ticketingState.statusLabel} />
                {priceLabel ? <span>{priceLabel}</span> : null}
              </div>
            ) : null}
            <div className="tix-page__hero-actions">
              <a href="#dates" className="orpheum-arrow-btn orpheum-arrow-btn--gold">
                See dates
              </a>
              <ArrowButton href={`/productions/${PRODUCTION_SLUG}/`} variant="ghost">
                About Much Ado
              </ArrowButton>
            </div>
          </div>
        </header>

        <TicketsQuickBar />

        <TicketsSpotlight data={data} loading={loading} priceLabel={priceLabel} />

        <section className="tix-page__book" id="dates" aria-labelledby="tix-dates-heading">
          <div className="tix-page__book-head" data-reveal>
            <div>
              <p className="tix-page__section-eyebrow">Reserve your seats</p>
              <h2 id="tix-dates-heading">Choose a performance</h2>
            </div>
            <p className="tix-page__book-note">
              Questions?{" "}
              <a href="tel:+12039571006">(203) 957-1006</a> ·{" "}
              <Link to="/about/faq/">Ticket FAQ</Link>
            </p>
          </div>

          <div className="tix-page__book-grid" data-reveal>
            <div className="tix-page__dates-panel">
              {loading ? (
                <TicketsPageSkeleton />
              ) : error ? (
                <div className="tix-page__error">
                  <p>Ticket availability is temporarily unavailable.</p>
                  <button
                    type="button"
                    className="orpheum-arrow-btn orpheum-arrow-btn--gold"
                    onClick={() => refresh()}
                  >
                    Try again
                  </button>
                </div>
              ) : data ? (
                <PerformanceCalendar
                  data={data}
                  allPerformances
                  hideShowHeader
                  className="tix-page__calendar"
                  image={MEDIA.muchAdoPoster}
                />
              ) : null}
            </div>

            <aside className="tix-page__aside">
              {data ? (
                <TicketPricing
                  ticketClasses={data.ticketTypes ?? data.ticketClasses}
                  priceFrom={data.priceFrom}
                />
              ) : null}
              <TicketsTierGuide />
              <div className="tix-page__help-card">
                <h3>Before you arrive</h3>
                <p>
                  Gates open one hour before showtime. Picnics welcome — see our{" "}
                  <Link to="/about/visit/">visit guide</Link> for parking and accessibility.
                </p>
                <ArrowButton href="/about/visit/">Plan your visit</ArrowButton>
              </div>
            </aside>
          </div>
        </section>

        {relatedEvents.length ? (
          <section className="tix-page__more" aria-labelledby="tix-more-heading" data-reveal>
            <div className="tix-page__more-head">
              <div>
                <p className="tix-page__section-eyebrow">This season</p>
                <h2 id="tix-more-heading">More events</h2>
              </div>
              <ArrowButton href="/support/events/">View all</ArrowButton>
            </div>
            <ul className="tix-page__more-grid">
              {relatedEvents.map((event) => (
                <li key={event.id}>
                  <a href={event.href} className="tix-page__more-card">
                    <img src={event.image} alt="" loading="lazy" width={400} height={260} />
                    <div className="tix-page__more-card-copy">
                      <span className="tix-page__more-card-tag">{event.genre ?? "Event"}</span>
                      <strong>{event.title}</strong>
                      <span>{event.dates}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="tix-page__steps" aria-labelledby="tix-steps-heading" data-reveal>
          <h2 id="tix-steps-heading" className="visually-hidden">
            How ticketing works
          </h2>
          <ol className="tix-page__steps-list">
            <li>
              <span className="tix-page__steps-num">1</span>
              <div>
                <strong>Pick a date</strong>
                <p>Select an upcoming performance at Pinkney Park.</p>
              </div>
            </li>
            <li>
              <span className="tix-page__steps-num">2</span>
              <div>
                <strong>Checkout online</strong>
                <p>Pay securely with card — about two minutes start to finish.</p>
              </div>
            </li>
            <li>
              <span className="tix-page__steps-num">3</span>
              <div>
                <strong>Show your QR</strong>
                <p>Tickets email instantly and live in My Tickets on your phone.</p>
              </div>
            </li>
          </ol>
        </section>
      </article>
    </InnerPageShell>
  );
}
