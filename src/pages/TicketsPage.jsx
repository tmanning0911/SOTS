import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MEDIA, SEASON_SHOWS } from "../../js/data.js";
import { HOME_UPCOMING_EVENTS } from "../../js/home-upcoming-events.js";
import { BUNDLED_MERCHANDISE, merchandiseProducts } from "../../js/shop.js";
import { getPriceFromLabel, getTicketingState, patronDisplayName } from "../../js/ticketing.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { PerformanceCalendar } from "../components/ticketing/PerformanceCalendar.jsx";
import { ShopMerchTeaser } from "../components/shop/ShopMerchTeaser.jsx";
import { TicketCheckoutButton } from "../components/ticketing/TicketCheckoutButton.jsx";
import { TicketPickerSheet } from "../components/ticketing/TicketPickerSheet.jsx";
import { TicketPricing } from "../components/ticketing/TicketPricing.jsx";
import { TicketStatusBadge } from "../components/ticketing/TicketStatusBadge.jsx";
import { useTickets } from "../context/TicketProvider.jsx";
import { useShop } from "../context/ShopContext.jsx";

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
    <nav className="orpheum-page-quick" aria-label="Ticket shortcuts">
      <Link to="/my-tickets/" className="orpheum-page-quick__link">
        My Tickets
      </Link>
      <Link to="/access-your-tickets/" className="orpheum-page-quick__link">
        Confirmation lookup
      </Link>
      <a href="tel:+12039571006" className="orpheum-page-quick__link">
        Box office (203) 957-1006
      </a>
      <Link to="/about/visit/" className="orpheum-page-quick__link">
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
  const venue = featured?.venue ?? "Shakespeare in Pinkney Park";
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
            <TicketStatusBadge status={ticketingState.statusLabel} className="tix-page__spotlight-badge" marketingOnly />
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
  const { catalog } = useShop();
  const [searchParams] = useSearchParams();
  const thanks = searchParams.get("thanks") === "1";
  const [pickerPerformanceId, setPickerPerformanceId] = useState(null);

  const shopMerchandise = useMemo(() => {
    const list = merchandiseProducts(catalog);
    return list.length ? list : BUNDLED_MERCHANDISE;
  }, [catalog]);

  const priceLabel = useMemo(() => {
    if (!data) return null;
    return getPriceFromLabel(data);
  }, [data]);

  const relatedEvents = useMemo(
    () => HOME_UPCOMING_EVENTS.filter((event) => !/much.?ado/i.test(event.title ?? "")).slice(0, 3),
    [],
  );

  useEffect(() => {
    document.title = "Tickets & Dates - Shakespeare on the Sound";
  }, []);

  useEffect(() => {
    const perf = searchParams.get("perf");
    if (perf && data?.performances?.some((p) => String(p.id) === String(perf))) {
      setPickerPerformanceId(perf);
    }
  }, [searchParams, data]);

  return (
    <InnerPageShell showVisit showNewsletter>
      <article className="tix-page">
        <InnerPageHero title="Tickets" />

        <TicketsQuickBar />

        {thanks ? (
          <div className="tix-page__thanks" role="status">
            <p>
              Thank you — your payment was received. Square will email your receipt; bring that
              confirmation to the gate (online Square purchases are not added to My Tickets yet).
            </p>
            <div className="tix-page__thanks-actions">
              <ArrowButton href="/access-your-tickets/" variant="light">
                Confirmation lookup
              </ArrowButton>
              <ArrowButton href="#dates" variant="ghost">
                Buy another night
              </ArrowButton>
            </div>
          </div>
        ) : null}

        <TicketsSpotlight data={data} loading={loading} priceLabel={priceLabel} />

        <section className="tix-page__book" id="dates" aria-labelledby="tix-dates-heading">
          <div className="tix-page__book-head" data-reveal>
            <div>
              <p className="orpheum-eyebrow">Reserve your seats</p>
              <h2 id="tix-dates-heading" className="orpheum-underline-heading">
                Choose a performance
              </h2>
            </div>
            <p className="tix-page__book-note">
              Select a date, choose quantities in the ticket sheet, then checkout once with Square.
              Questions? <a href="tel:+12039571006">(203) 957-1006</a> ·{" "}
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
                  <ArrowButton type="button" onClick={() => refresh()}>
                    Try again
                  </ArrowButton>
                </div>
              ) : data ? (
                <PerformanceCalendar
                  data={data}
                  allPerformances
                  hideShowHeader
                  className="tix-page__calendar"
                  image={MEDIA.muchAdoPoster}
                  onSelectPerformance={setPickerPerformanceId}
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
                  Gates open at 4pm; box office at 5pm on show days. Picnics welcome — see our{" "}
                  <Link to="/about/visit/">visit guide</Link> for parking and accessibility.
                </p>
                <ArrowButton href="/about/visit/" variant="light">
                  Plan your visit
                </ArrowButton>
              </div>
            </aside>
          </div>
        </section>

        <ShopMerchTeaser
          className="tix-page__shop-teaser"
          headingId="tix-shop-teaser-heading"
          products={shopMerchandise}
        />

        {relatedEvents.length ? (
          <section className="tix-page__more" aria-labelledby="tix-more-heading" data-reveal>
            <div className="tix-page__more-head">
              <div>
                <p className="orpheum-eyebrow">This season</p>
                <h2 id="tix-more-heading" className="orpheum-underline-heading">
                  More events
                </h2>
              </div>
              <ArrowButton href="/#upcoming-events">View all events</ArrowButton>
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
              <span className="tix-page__steps-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 4v2.5M17 4v2.5M5 9.5h14M6.5 7h11A1.5 1.5 0 0 1 19 8.5v10A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5v-10A1.5 1.5 0 0 1 6.5 7Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <strong>Pick a date</strong>
                <p>Choose a performance at Shakespeare in Pinkney Park from the calendar above.</p>
              </div>
            </li>
            <li>
              <span className="tix-page__steps-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3.5"
                    y="6.5"
                    width="17"
                    height="11"
                    rx="1.75"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path d="M3.5 10.5h17" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
              <div>
                <strong>Choose quantities</strong>
                <p>Pick how many of each ticket type you need, then Checkout with Square for that night.</p>
              </div>
            </li>
            <li>
              <span className="tix-page__steps-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 12.5 9 17.5 20 6.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <strong>Bring your Square receipt</strong>
                <p>
                  Square emails your confirmation—show it at the gate. Online Square purchases are not
                  listed in My Tickets yet.
                </p>
              </div>
            </li>
          </ol>
        </section>
      </article>

      <TicketPickerSheet
        open={Boolean(pickerPerformanceId)}
        onClose={() => setPickerPerformanceId(null)}
        data={data}
        performanceId={pickerPerformanceId}
      />
    </InnerPageShell>
  );
}
