import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { MEDIA } from "../../js/data.js";
import { PRODUCTION_DETAILS } from "../../js/pages-data.js";
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

export function TicketCheckoutPage() {
  const { performanceId } = useParams();
  const { data, loading, error, refresh } = useTickets();

  const production = data?.production;
  const performance = data?.performances?.find((p) => p.id === performanceId) ?? null;
  const showDetails = PRODUCTION_DETAILS[production?.slug ?? PRODUCTION_SLUG] ?? PRODUCTION_DETAILS[PRODUCTION_SLUG];
  const showImage = showDetails?.heroImage ?? showDetails?.image ?? MEDIA.muchAdoPoster;
  const showTitle = patronDisplayName(production?.title ?? data?.featuredTicket?.name ?? showDetails?.title ?? "Tickets");

  useEffect(() => {
    document.title = `Checkout - ${showTitle} - Shakespeare on the Sound`;
  }, [showTitle]);

  if (!loading && data && (!performance || !isPurchasablePerformance(performance))) {
    return <Navigate to={TICKETS_PAGE_PATH} replace />;
  }

  return (
    <InnerPageShell showVisit={false} showNewsletter={false}>
      <article className="orpheum-inner-page sots-checkout-page">
        <div className="sots-checkout-page__top">
          <nav className="sots-checkout-page__breadcrumb" aria-label="Breadcrumb">
            <Link to={TICKETS_PAGE_PATH}>Tickets</Link>
            <span aria-hidden="true">/</span>
            {performance ? (
              <span>{formatPerformanceDate(performance.start, { weekday: "short" })}</span>
            ) : (
              <span>Checkout</span>
            )}
          </nav>
          <h1 className="sots-checkout-page__title">{showTitle}</h1>
          {performance ? (
            <p className="sots-checkout-page__subtitle">{formatPerformanceDate(performance.start)}</p>
          ) : null}
        </div>

        <div className="orpheum-inner-page__body sots-checkout-page__body">
          {loading ? (
            <div className="sots-ticketing-loading">
              <p>Loading checkout…</p>
            </div>
          ) : error ? (
            <div className="sots-ticketing-loading">
              <p>Checkout is temporarily unavailable.</p>
              <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--gold" onClick={() => refresh()}>
                Try again
              </button>
            </div>
          ) : data && performance ? (
            <TicketCheckoutForm
              data={data}
              performanceId={performanceId}
              showImage={showImage}
              changeDateHref={TICKETS_PAGE_PATH}
            />
          ) : null}
        </div>
      </article>
    </InnerPageShell>
  );
}
