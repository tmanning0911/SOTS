import { useEffect } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { MEDIA } from "../../js/data.js";
import { heroImageForHref } from "../../js/page-heroes.js";
import { getPriceFromLabel, getTicketCheckoutPath } from "../../js/ticketing.js";
import { HOME_UPCOMING_EVENTS } from "../../js/home-upcoming-events.js";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { PerformanceCalendar } from "../components/ticketing/PerformanceCalendar.jsx";
import { TicketPricing } from "../components/ticketing/TicketPricing.jsx";
import { TicketStatusBadge } from "../components/ticketing/TicketStatusBadge.jsx";
import { useTickets } from "../context/TicketProvider.jsx";

const PRODUCTION_SLUG = "much-ado-about-nothing";

function TicketsPageSkeleton() {
  return (
    <div className="sots-tickets-page__skeleton" aria-busy="true" aria-label="Loading tickets">
      <div className="sots-checkout-skeleton sots-checkout-skeleton--block" />
      <div className="sots-checkout-skeleton sots-checkout-skeleton--block" />
      <div className="sots-checkout-skeleton sots-checkout-skeleton--block sots-checkout-skeleton--short" />
    </div>
  );
}

export function TicketsPage() {
  const { data, loading, error, refresh, ticketingState } = useTickets();
  const [searchParams] = useSearchParams();
  const priceLabel = getPriceFromLabel(data);
  const relatedEvents = HOME_UPCOMING_EVENTS.filter(
    (event) => event.href !== `/productions/${PRODUCTION_SLUG}/`,
  ).slice(0, 4);

  useEffect(() => {
    document.title = "Tickets - Shakespeare on the Sound";
  }, []);

  const performanceId = searchParams.get("performance");
  if (performanceId && !loading && data) {
    return <Navigate to={getTicketCheckoutPath(performanceId)} replace />;
  }

  return (
    <InnerPageShell showVisit showNewsletter>
      <article className="orpheum-inner-page sots-tickets-page">
        <InnerPageHero
          className="sots-tickets-page__hero"
          compact
          eyebrow="2026 Season"
          title="Tickets"
          intro="General admission supports the show and includes open lawn seating. VIP adds a reserved chair. Tuesday performances are pay-what-you-wish at the door."
          introClassName="sots-tickets-page__intro"
          image={heroImageForHref("/tickets/")}
          afterTitle={
            !loading && ticketingState.statusLabel ? (
              <div className="sots-tickets-page__meta">
                <TicketStatusBadge status={ticketingState.statusLabel} />
                {priceLabel ? <span className="sots-tickets-page__price-from">{priceLabel}</span> : null}
              </div>
            ) : null
          }
          belowIntro={
            <>
              <p className="sots-tickets-page__owned-hint">
                Already purchased?{" "}
                <Link to="/my-tickets/">My Tickets</Link>
                {" · "}
                <Link to="/access-your-tickets/">Look up with a confirmation code</Link>
              </p>
              <p className="sots-tickets-page__hero-phone">
                Questions? Call{" "}
                <a href="tel:+12039571006">(203) 957-1006</a> noon–5pm during the run.
              </p>
            </>
          }
        />

        <div className="orpheum-inner-page__body">
          <section className="sots-tickets-page__how" aria-labelledby="tickets-how-heading">
            <h2 id="tickets-how-heading" className="sots-tickets-page__how-title">
              How it works
            </h2>
            <ol className="sots-tickets-page__how-list">
              <li>
                <span className="sots-tickets-page__how-step">1</span>
                <div>
                  <strong>Pick a date</strong>
                  <p>Choose an upcoming performance at Pinkney Park.</p>
                </div>
              </li>
              <li>
                <span className="sots-tickets-page__how-step">2</span>
                <div>
                  <strong>Select tickets & pay</strong>
                  <p>General admission, kids, or VIP — checkout takes about two minutes.</p>
                </div>
              </li>
              <li>
                <span className="sots-tickets-page__how-step">3</span>
                <div>
                  <strong>Show your QR at the gate</strong>
                  <p>Tickets email instantly and save in My Tickets on your phone.</p>
                </div>
              </li>
            </ol>
          </section>

          <div className="sots-tickets-page__layout sots-tickets-page__layout--calendar" data-reveal>
            <div className="sots-tickets-page__main">
              {loading ? (
                <TicketsPageSkeleton />
              ) : error ? (
                <div className="sots-ticketing-loading">
                  <p>Ticket availability is temporarily unavailable.</p>
                  <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--gold" onClick={() => refresh()}>
                    Try again
                  </button>
                </div>
              ) : data ? (
                <>
                  <PerformanceCalendar data={data} allPerformances image={MEDIA.muchAdoPoster} />

                  {relatedEvents.length ? (
                    <section className="sots-tickets-page__more" aria-labelledby="tickets-more-heading">
                      <h2 id="tickets-more-heading" className="sots-tickets-page__more-title">
                        More This Season
                      </h2>
                      <ul className="sots-tickets-page__more-list">
                        {relatedEvents.map((event) => (
                          <li key={event.id}>
                            <a href={event.href} className="sots-tickets-page__more-card">
                              <img src={event.image} alt="" loading="lazy" width={320} height={180} />
                              <div>
                                <strong>{event.title}</strong>
                                <span>{event.dates}</span>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                </>
              ) : null}
            </div>

            <aside className="sots-tickets-page__sidebar">
              {data ? (
                <TicketPricing ticketClasses={data.ticketTypes ?? data.ticketClasses} priceFrom={data.priceFrom} />
              ) : null}
              <div className="sots-tickets-page__help">
                <h2 className="sots-tickets-page__help-title">Box Office</h2>
                <p>
                  Prefer to buy by phone? Call{" "}
                  <a href="tel:+12039571006">(203) 957-1006</a> noon–5pm during the run.
                </p>
                <p>
                  <Link to="/about/visit/">Plan your visit</Link>
                  {" · "}
                  <Link to="/about/faq/">Ticket FAQ</Link>
                  {" · "}
                  <Link to="/about/contact/">Contact us</Link>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </InnerPageShell>
  );
}
