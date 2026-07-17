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
import { usePageMeta } from "../hooks/usePageMeta.js";

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
        (203) 957-1006
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
  const seasonEnded = !loading && Boolean(ticketingState && !ticketingState.canPurchase);
  const title = seasonEnded
    ? "Summer season complete"
    : patronDisplayName(production?.title ?? featured?.name ?? FEATURED_SHOW.title);
  const dates = FEATURED_SHOW.dates;
  const venue = featured?.venue ?? "Shakespeare in Pinkney Park";
  const slug = production?.slug ?? PRODUCTION_SLUG;

  return (
    <section className="tix-page__spotlight" aria-labelledby="tix-spotlight-heading" data-reveal>
      <div className="tix-page__spotlight-ticket">
        <div className="tix-page__spotlight-visual">
          <img
            src={seasonEnded ? MEDIA.galaImage : MEDIA.muchAdoPoster}
            alt=""
            loading="eager"
            width={450}
            height={712}
          />
        </div>
        <div className="tix-page__spotlight-copy">
          <p className="tix-page__spotlight-eyebrow">{seasonEnded ? "What's next" : "2026 Main Stage"}</p>
          <h2 id="tix-spotlight-heading">{title}</h2>
          {seasonEnded ? (
            <>
              <p className="tix-page__spotlight-meta">
                <span>Much Ado About Nothing · June 10–28, 2026</span>
                <span>Thank you for a landmark summer in Pinkney Park</span>
              </p>
              <p className="tix-page__spotlight-lead">
                Main Stage tickets are no longer on sale. Join us next for the Mahjong Midsummer
                Classic and our annual gala.
              </p>
              <div className="tix-page__spotlight-about" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <ArrowButton href="/events/mahjong-night/">Mahjong tickets</ArrowButton>
                <ArrowButton href="/events/much-ado-about-something/#tickets" variant="ghost">
                  Gala tickets
                </ArrowButton>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function TicketsTierGuide() {
  const tiers = [
    {
      name: "VIP Reserved",
      detail: "Reserved chair seating near the stage — low-back or high-back options.",
    },
    {
      name: "General Admission",
      detail: "Open lawn seating — bring a blanket or low chair.",
    },
    {
      name: "Child (12 & under)",
      detail: "Same great view from the lawn at a reduced price.",
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
  const thanksCode = String(searchParams.get("code") || "").trim().toUpperCase();
  const [pickerPerformanceId, setPickerPerformanceId] = useState(null);

  const shopMerchandise = useMemo(() => {
    const list = merchandiseProducts(catalog);
    return list.length ? list : BUNDLED_MERCHANDISE;
  }, [catalog]);

  const priceLabel = useMemo(() => {
    if (!data) return null;
    return getPriceFromLabel(data);
  }, [data]);

  const seasonEnded = Boolean(data && !getTicketingState(data).canPurchase);

  usePageMeta("/tickets/");

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
              Thank you — check your email for a branded receipt with your confirmation and QR
              codes. You can also open My Tickets with the same email to view your orders.
              {thanksCode ? (
                <>
                  {" "}
                  Confirmation code: <strong>{thanksCode}</strong>.
                </>
              ) : null}
            </p>
            <div className="tix-page__thanks-actions">
              <ArrowButton href="/my-tickets/">My Tickets</ArrowButton>
              <ArrowButton href="/about/visit/" variant="ghost">
                Plan your visit
              </ArrowButton>
            </div>
          </div>
        ) : null}

        <TicketsSpotlight data={data} loading={loading} priceLabel={priceLabel} />

        <section className="tix-page__book" id="dates" aria-labelledby="tix-dates-heading">
          <div className="tix-page__book-head" data-reveal>
            <div>
              <p className="orpheum-eyebrow">{seasonEnded ? "Coming up" : "Reserve your seats"}</p>
              <h2 id="tix-dates-heading" className="orpheum-underline-heading">
                {seasonEnded ? "Upcoming events" : "Choose a performance"}
              </h2>
            </div>
            <p className="tix-page__book-note">
              {seasonEnded ? (
                <>
                  Main Stage nights have ended. Get tickets for Mahjong or the gala, or{" "}
                  <Link to="/events/">browse all events</Link>. Questions?{" "}
                  <a href="tel:+12039571006">(203) 957-1006</a>
                </>
              ) : (
                <>
                  Pick a night, choose quantities, then checkout once. Questions?{" "}
                  <a href="tel:+12039571006">(203) 957-1006</a> · <Link to="/about/faq/">Ticket FAQ</Link>
                </>
              )}
            </p>
          </div>

          {seasonEnded ? (
            <div className="tix-page__book-grid" data-reveal>
              <div className="tix-page__dates-panel">
                <p>
                  <ArrowButton href="/events/mahjong-night/">Mahjong Midsummer Classic — Sept 19</ArrowButton>
                </p>
                <p style={{ marginTop: "0.75rem" }}>
                  <ArrowButton href="/events/much-ado-about-something/#tickets" variant="ghost">
                    Much Ado About Something Gala — Oct 16
                  </ArrowButton>
                </p>
                <p className="tix-page__book-note" style={{ marginTop: "1.25rem" }}>
                  <Link to="/productions/much-ado-about-nothing/">About this summer&apos;s Much Ado</Link>
                  {" · "}
                  <Link to="/my-tickets/">Look up past ticket orders</Link>
                </p>
              </div>
            </div>
          ) : (
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
          )}
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
