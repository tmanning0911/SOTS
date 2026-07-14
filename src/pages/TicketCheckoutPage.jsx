import { useEffect, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { MEDIA } from "../../js/data.js";
import { PRODUCTION_DETAILS } from "../../js/pages-data.js";
import {
  formatPerformanceDate,
  isPurchasablePerformance,
  patronDisplayName,
  TICKETS_PAGE_PATH,
} from "../../js/ticketing.js";
import { TicketCheckoutForm } from "../components/ticketing/TicketCheckoutForm.jsx";
import { useTickets } from "../context/TicketProvider.jsx";

const PRODUCTION_SLUG = "much-ado-about-nothing";

function CheckoutSkeleton() {
  return (
    <div className="sots-co__skeleton" aria-busy="true" aria-label="Loading checkout">
      <div className="sots-checkout-skeleton sots-checkout-skeleton--block" />
      <div className="sots-checkout-skeleton sots-checkout-skeleton--block" />
      <div className="sots-checkout-skeleton sots-checkout-skeleton--block sots-checkout-skeleton--short" />
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

  if (!loading && data && (!performance || !isPurchasablePerformance(performance))) {
    return <Navigate to={TICKETS_PAGE_PATH} replace />;
  }

  return (
    <div className="sots-co">
      <header className="sots-co__header">
        <div className="sots-co__header-inner">
          <Link to={TICKETS_PAGE_PATH} className="sots-co__back">
            ← Back to all dates
          </Link>
          <div className="sots-co__header-row">
            <div className="sots-co__header-copy">
              <p className="sots-co__eyebrow">Secure checkout</p>
              <h1 className="sots-co__title">{showTitle}</h1>
              {performance ? (
                <p className="sots-co__meta">
                  {formatPerformanceDate(performance.start)}
                  <br />
                  {venueLine}
                </p>
              ) : (
                <p className="sots-co__meta">Loading your performance…</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <CheckoutSkeleton />
      ) : error ? (
        <div className="sots-co__body">
          <div className="sots-co__alert">
            <h2 style={{ margin: "0 0 0.35rem", fontSize: "1.05rem" }}>Checkout unavailable</h2>
            <p style={{ margin: 0 }}>
              {error?.message || "We couldn't load ticket checkout right now. Your card has not been charged."}
            </p>
          </div>
          <p style={{ marginTop: "1rem" }}>
            <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--gold" onClick={() => refresh()}>
              Try again
            </button>
            {" · "}
            <Link to={TICKETS_PAGE_PATH}>Return to tickets</Link>
          </p>
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
  );
}
