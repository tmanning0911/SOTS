import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { MEDIA, SEASON_SHOWS } from "../../js/data.js";
import { heroImageForHref } from "../../js/page-heroes.js";
import { HOME_UPCOMING_EVENTS } from "../../js/home-upcoming-events.js";
import { formatCents, BUNDLED_MERCHANDISE, merchandiseProducts } from "../../js/shop.js";
import { consumeOpenTicketCartFlag } from "../../js/ticket-cart.js";
import {
  getPriceFromLabel,
  getTicketCheckoutPath,
  getTicketingState,
  patronDisplayName,
} from "../../js/ticketing.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { PerformanceCalendar } from "../components/ticketing/PerformanceCalendar.jsx";
import { ShopMerchTeaser } from "../components/shop/ShopMerchTeaser.jsx";
import { TicketCartAside } from "../components/ticketing/TicketCartAside.jsx";
import { TicketCartDrawer } from "../components/ticketing/TicketCartDrawer.jsx";
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
  const {
    data,
    loading,
    error,
    refresh,
    ticketingState,
    cartCount,
    cartTotal,
    cartGroups,
    cartNotice,
    dismissCartNotice,
    cartDrawerOpen,
    openCartDrawer,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    openCartCheckout,
    addToCart: addTicketsToCart,
    buyNow: buyTicketsNow,
    clearCart,
    clearPerformance,
  } = useTickets();
  const { catalog, addToCart, buyNow } = useShop();
  const [searchParams] = useSearchParams();
  const [pickerPerformanceId, setPickerPerformanceId] = useState(null);
  const priceLabel = getPriceFromLabel(data);
  const relatedEvents = HOME_UPCOMING_EVENTS.filter(
    (event) => event.href !== `/productions/${PRODUCTION_SLUG}/`,
  ).slice(0, 6);
  const heroImage = heroImageForHref("/tickets/");
  const shopMerchandise = useMemo(() => {
    const list = merchandiseProducts(catalog);
    return list.length ? list : BUNDLED_MERCHANDISE;
  }, [catalog]);

  useEffect(() => {
    document.title = "Tickets - Shakespeare on the Sound";
  }, []);

  useEffect(() => {
    if (consumeOpenTicketCartFlag() || searchParams.get("cart") === "1") {
      openCartDrawer();
    }
  }, [searchParams, openCartDrawer]);

  const performanceId = searchParams.get("performance");
  if (performanceId && !loading && data) {
    return <Navigate to={getTicketCheckoutPath(performanceId)} replace />;
  }

  return (
    <InnerPageShell showVisit={false} showNewsletter={false}>
      <article className="tix-page">
        <header className="tix-page__hero">
          <div
            className="tix-page__hero-bg"
            style={{ backgroundImage: `url('${heroImage}')` }}
            aria-hidden="true"
          />
          <div className="tix-page__hero-veil" aria-hidden="true" />
          <div className="tix-page__hero-inner" data-reveal>
            <p className="tix-page__hero-eyebrow">Shakespeare in Pinkney Park · Summer 2026</p>
            <h1>Tickets &amp; Dates</h1>
            <p className="tix-page__hero-lead">
              Choose a date, add tickets to your cart, then checkout securely—one performance at a time.
            </p>
            {!loading && ticketingState.statusLabel ? (
              <div className="tix-page__hero-meta">
                <TicketStatusBadge status={ticketingState.statusLabel} marketingOnly />
                {priceLabel ? <span>{priceLabel}</span> : null}
              </div>
            ) : null}
            <div className="tix-page__hero-actions">
              <ArrowButton href="#dates">See dates</ArrowButton>
              <ArrowButton href={`/productions/${PRODUCTION_SLUG}/`} variant="light">
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
              Select a date to choose ticket types and add them to your cart. Checkout is one night at a
              time. Questions?{" "}
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
              <TicketCartAside
                groups={cartGroups}
                cartCount={cartCount}
                cartTotal={cartTotal}
                data={data}
                cartNotice={cartNotice}
                onDismissNotice={dismissCartNotice}
                onUpdate={updateQuantity}
                onRemove={removeFromCart}
                onCheckout={openCartCheckout}
                onClearPerformance={clearPerformance}
                onClearCart={clearCart}
                showImage={MEDIA.muchAdoPoster}
                className="tix-cart-aside--desktop"
              />
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
          onAdd={addToCart}
          onBuyNow={buyNow}
        />

        {relatedEvents.length ? (
          <section className="tix-page__more" aria-labelledby="tix-more-heading" data-reveal>
            <div className="tix-page__more-head">
              <div>
                <p className="tix-page__section-eyebrow">This season</p>
                <h2 id="tix-more-heading">More events</h2>
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
                  <path
                    d="M9 13h.01M12 13h.01M15 13h.01M9 16h.01M12 16h.01"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
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
                  <path
                    d="M7 15h3.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div>
                <strong>Build your cart</strong>
                <p>Choose ticket types, add more nights if you like, then pay one show at a time.</p>
              </div>
            </li>
            <li>
              <span className="tix-page__steps-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect
                    x="4.5"
                    y="4.5"
                    width="6.5"
                    height="6.5"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <rect
                    x="13"
                    y="4.5"
                    width="6.5"
                    height="6.5"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <rect
                    x="4.5"
                    y="13"
                    width="6.5"
                    height="6.5"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M13 13h2.25v2.25H13V13Zm4.25 0H19.5v2.25h-2.25V13ZM13 17.25h2.25V19.5H13v-2.25Zm2.25 0H17.5V19.5h1.75v-2.25"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <strong>Show your QR</strong>
                <p>Your tickets are emailed to you, and you can always find them in My Tickets.</p>
              </div>
            </li>
          </ol>
        </section>
      </article>

      {cartCount > 0 ? (
        <button
          type="button"
          className="sots-shop-page__cart-fab tix-page__cart-fab"
          onClick={openCartDrawer}
          aria-label={`Open ticket cart, ${cartCount} tickets`}
        >
          <span className="sots-shop-page__cart-fab-count">{cartCount}</span>
          <span className="sots-shop-page__cart-fab-copy">
            <strong>View cart</strong>
            <span>{formatCents(cartTotal)}</span>
          </span>
        </button>
      ) : null}

      <TicketCartDrawer
        open={cartDrawerOpen}
        onClose={closeCartDrawer}
        groups={cartGroups}
        cartCount={cartCount}
        cartTotal={cartTotal}
        data={data}
        cartNotice={cartNotice}
        onDismissNotice={dismissCartNotice}
        onUpdate={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={openCartCheckout}
        onClearPerformance={clearPerformance}
        onClearCart={clearCart}
        showImage={MEDIA.muchAdoPoster}
      />

      <TicketPickerSheet
        open={Boolean(pickerPerformanceId)}
        onClose={() => setPickerPerformanceId(null)}
        data={data}
        performanceId={pickerPerformanceId}
        onAddToCart={addTicketsToCart}
        onBuyNow={buyTicketsNow}
      />
    </InnerPageShell>
  );
}
