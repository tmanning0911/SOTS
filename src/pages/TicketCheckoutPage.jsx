import { useEffect, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { MEDIA } from "../../js/data.js";
import { PRODUCTION_DETAILS } from "../../js/pages-data.js";
import { disableSmoothScrollForCheckout, restoreSmoothScrollAfterCheckout } from "../polish.js";
import {
  formatPerformanceDate,
  isPurchasablePerformance,
  patronDisplayName,
  TICKETS_PAGE_PATH,
} from "../../js/ticketing.js";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { TicketCheckoutForm } from "../components/ticketing/TicketCheckoutForm.jsx";
import { useTickets } from "../context/TicketProvider.jsx";

const PRODUCTION_SLUG = "much-ado-about-nothing";

function CheckoutSkeleton() {
  return (
    <div className="sots-checkout-page__layout sots-checkout-page__layout--form" aria-busy="true" aria-label="Loading checkout">
      <aside className="sots-checkout-page__summary-pane">
        <div className="sots-checkout-skeleton sots-checkout-skeleton--poster" />
        <div className="sots-checkout-skeleton sots-checkout-skeleton--card" />
      </aside>
      <div className="sots-checkout-page__form-pane">
        <div className="sots-checkout-skeleton sots-checkout-skeleton--line" />
        <div className="sots-checkout-skeleton sots-checkout-skeleton--block" />
        <div className="sots-checkout-skeleton sots-checkout-skeleton--block" />
        <div className="sots-checkout-skeleton sots-checkout-skeleton--block sots-checkout-skeleton--short" />
      </div>
    </div>
  );
}

export function TicketCheckoutPage() {
  const { performanceId } = useParams();
  const { data, loading, error, refresh } = useTickets();

  const production = data?.production;
  const performance = data?.performances?.find((p) => p.id === performanceId) ?? null;
  const showDetails = PRODUCTION_DETAILS[production?.slug ?? PRODUCTION_SLUG] ?? PRODUCTION_DETAILS[PRODUCTION_SLUG];
  const showImage = showDetails?.heroImage ?? showDetails?.image ?? MEDIA.muchAdoPoster;
  const heroImage = showDetails?.heroImage ?? MEDIA.heroHome ?? showImage;
  const showTitle = patronDisplayName(
    production?.title ?? data?.featuredTicket?.name ?? showDetails?.title ?? "Tickets",
  );

  const venueLine = useMemo(() => {
    const parts = [performance?.venue, performance?.location].filter(Boolean);
    return parts.join(" · ") || "Pinkney Park · Rowayton, CT";
  }, [performance]);

  useEffect(() => {
    document.title = `Checkout - ${showTitle} - Shakespeare on the Sound`;
  }, [showTitle]);

  useEffect(() => {
    document.body.classList.add("sots-checkout-active");
    disableSmoothScrollForCheckout();
    return () => {
      document.body.classList.remove("sots-checkout-active");
      restoreSmoothScrollAfterCheckout();
    };
  }, []);

  if (!loading && data && (!performance || !isPurchasablePerformance(performance))) {
    return <Navigate to={TICKETS_PAGE_PATH} replace />;
  }

  return (
    <InnerPageShell showVisit={false} showNewsletter={false}>
      <article className="orpheum-inner-page sots-checkout-page">
        <header className="sots-checkout-page__hero sots-checkout-page__hero--slim">
          <div
            className="sots-checkout-page__hero-bg"
            style={{ backgroundImage: `url('${heroImage}')` }}
            aria-hidden="true"
          />
          <div className="sots-checkout-page__hero-veil" aria-hidden="true" />
          <div className="sots-checkout-page__hero-inner">
            <Link to={TICKETS_PAGE_PATH} className="sots-checkout-page__back">
              ← Back to all dates
            </Link>
            <p className="sots-checkout-page__eyebrow">Secure checkout</p>
            <h1 className="sots-checkout-page__hero-title">{showTitle}</h1>
            {performance ? (
              <p className="sots-checkout-page__hero-meta">
                <span>{formatPerformanceDate(performance.start)}</span>
                <span className="sots-checkout-page__hero-dot" aria-hidden="true">
                  ·
                </span>
                <span>{venueLine}</span>
              </p>
            ) : (
              <p className="sots-checkout-page__hero-meta">Loading your performance…</p>
            )}
          </div>
        </header>

        <div className="orpheum-inner-page__body sots-checkout-page__body">
          {loading ? (
            <CheckoutSkeleton />
          ) : error ? (
            <div className="sots-checkout-page__error-panel">
              <h2>Checkout unavailable</h2>
              <p>We couldn&apos;t load ticket checkout right now. Your card has not been charged.</p>
              <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--gold" onClick={() => refresh()}>
                Try again
              </button>
              <Link to={TICKETS_PAGE_PATH} className="sots-checkout-page__error-link">
                Return to tickets
              </Link>
            </div>
          ) : data && performance ? (
            <TicketCheckoutForm
              data={data}
              performanceId={performanceId}
              showImage={showImage}
              showTitle={showTitle}
              changeDateHref={TICKETS_PAGE_PATH}
            />
          ) : null}
        </div>
      </article>
    </InnerPageShell>
  );
}
