import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MEDIA, SEASON_SHOWS } from "../../js/data.js";
import { BUNDLED_MERCHANDISE, merchandiseProducts } from "../../js/shop.js";
import { getPriceFromLabel, getTicketingState, patronDisplayName } from "../../js/ticketing.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { PerformanceCalendar } from "../components/ticketing/PerformanceCalendar.jsx";
import { ShopMerchTeaser } from "../components/shop/ShopMerchTeaser.jsx";
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
  const dates = FEATURED_SHOW.dates;
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
            Open-air Shakespeare under the stars. Choose a night below to pick quantities and
            checkout.
          </p>
          <p className="tix-page__spotlight-about">
            <Link to={`/productions/${slug}/`}>About the show</Link>
          </p>
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
  const { data, loading, error, refresh } = useTickets();
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
    <InnerPageShell showVisit={false} showNewsletter>
      <article className="tix-page">
        <InnerPageHero title="Tickets" />

        <TicketsQuickBar />

        {thanks ? (
          <div className="tix-page__thanks" role="status">
            <p>
              Thank you — if you completed payment, check your email for a receipt. Bring that
              confirmation to the gate (online purchases are not added to My Tickets yet).
            </p>
            <div className="tix-page__thanks-actions">
              <ArrowButton href="/about/visit/">Plan your visit</ArrowButton>
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
              Pick a night, choose quantities, then checkout once. Questions?{" "}
              <a href="tel:+12039571006">(203) 957-1006</a> · <Link to="/about/faq/">Ticket FAQ</Link>
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
              <p className="tix-page__aside-visit">
                Gates open at 4pm · Box office at 5pm on show days.{" "}
                <Link to="/about/visit/">Plan your visit</Link>
              </p>
            </aside>
          </div>
        </section>

        <ShopMerchTeaser
          className="tix-page__shop-teaser"
          headingId="tix-shop-teaser-heading"
          products={shopMerchandise}
          limit={3}
        />
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
