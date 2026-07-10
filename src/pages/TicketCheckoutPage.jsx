import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { MEDIA } from "../../js/data.js";
import { PRODUCTION_DETAILS } from "../../js/pages-data.js";
import {
  formatPerformanceDate,
  getPriceFromLabel,
  isPurchasablePerformance,
  TICKETS_PAGE_PATH,
} from "../../js/ticketing.js";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { TicketCheckoutForm } from "../components/ticketing/TicketCheckoutForm.jsx";
import { TicketStatusBadge } from "../components/ticketing/TicketStatusBadge.jsx";
import { useTickets } from "../context/TicketProvider.jsx";

const PRODUCTION_SLUG = "much-ado-about-nothing";

export function TicketCheckoutPage() {
  const { performanceId } = useParams();
  const { data, loading, error, refresh } = useTickets();

  const production = data?.production;
  const performance = data?.performances?.find((p) => p.id === performanceId) ?? null;
  const showDetails = PRODUCTION_DETAILS[production?.slug ?? PRODUCTION_SLUG] ?? PRODUCTION_DETAILS[PRODUCTION_SLUG];
  const showImage = showDetails?.heroImage ?? showDetails?.image ?? MEDIA.muchAdoPoster;
  const showTitle = production?.title ?? data?.featuredTicket?.name ?? showDetails?.title ?? "Tickets";
  const priceLabel = getPriceFromLabel(data);

  useEffect(() => {
    document.title = `Checkout - ${showTitle} - Shakespeare on the Sound`;
  }, [showTitle]);

  if (!loading && data && (!performance || !isPurchasablePerformance(performance))) {
    return <Navigate to={TICKETS_PAGE_PATH} replace />;
  }

  return (
    <InnerPageShell showVisit={false} showNewsletter={false}>
      <article className="orpheum-inner-page sots-checkout-page">
        <header className="sots-checkout-page__hero">
          <div
            className="sots-checkout-page__hero-bg"
            style={{ backgroundImage: `url('${showImage}')` }}
            aria-hidden="true"
          />
          <div className="sots-checkout-page__hero-veil" aria-hidden="true" />
          <div className="sots-checkout-page__hero-inner">
            <Link to={TICKETS_PAGE_PATH} className="sots-checkout-page__back">
              ← All dates
            </Link>
            <p className="orpheum-inner-page__eyebrow">Checkout</p>
            <h1>{showTitle}</h1>
            {performance ? (
              <p className="sots-checkout-page__date">{formatPerformanceDate(performance.start)}</p>
            ) : null}
            {performance?.venue ? (
              <p className="sots-checkout-page__venue">
                {performance.venue}
                {performance.location ? ` · ${performance.location}` : ""}
              </p>
            ) : null}
            {priceLabel ? <p className="sots-checkout-page__price">{priceLabel}</p> : null}
          </div>
        </header>

        <div className="orpheum-inner-page__body">
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
            <div className="sots-checkout-page__layout">
              <aside className="sots-checkout-page__aside" aria-label="Performance details">
                <img src={showImage} alt="" className="sots-checkout-page__poster" loading="lazy" />
                <div className="sots-checkout-page__aside-card">
                  <TicketStatusBadge status={performance} />
                  <p className="sots-checkout-page__aside-date">{formatPerformanceDate(performance.start)}</p>
                  {performance.venue ? <p className="sots-checkout-page__aside-venue">{performance.venue}</p> : null}
                  <Link to={TICKETS_PAGE_PATH} className="sots-checkout-page__change-date">
                    Change date
                  </Link>
                </div>
              </aside>
              <section className="sots-checkout-page__main" aria-labelledby="checkout-heading">
                <h2 id="checkout-heading" className="sots-checkout-page__heading">
                  Your tickets
                </h2>
                <TicketCheckoutForm data={data} performanceId={performanceId} />
              </section>
            </div>
          ) : null}
        </div>
      </article>
    </InnerPageShell>
  );
}
