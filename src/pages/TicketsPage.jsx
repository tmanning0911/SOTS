import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MEDIA } from "../../js/data.js";
import { getPriceFromLabel } from "../../js/ticketing.js";
import { HOME_UPCOMING_EVENTS } from "../../js/home-upcoming-events.js";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { PerformancePicker } from "../components/ticketing/PerformancePicker.jsx";
import { TicketPricing } from "../components/ticketing/TicketPricing.jsx";
import { TicketStatusBadge } from "../components/ticketing/TicketStatusBadge.jsx";
import { useTickets } from "../context/TicketProvider.jsx";

const PRODUCTION_SLUG = "much-ado-about-nothing";

const HOW_IT_WORKS = [
  { step: "1", title: "Pick a date", text: "Choose your performance below." },
  { step: "2", title: "Pay and go", text: "Checkout takes about a minute. Tickets arrive by email and in My Tickets." },
];

export function TicketsPage() {
  const { data, loading, error, refresh, openCheckout, ticketingState } = useTickets();
  const [searchParams] = useSearchParams();
  const production = data?.production;
  const featured = data?.featuredTicket;
  const priceLabel = getPriceFromLabel(data);
  const relatedEvents = HOME_UPCOMING_EVENTS.filter(
    (event) => event.href !== `/productions/${PRODUCTION_SLUG}/`,
  ).slice(0, 4);

  useEffect(() => {
    document.title = "Tickets - Shakespeare on the Sound";
  }, []);

  useEffect(() => {
    const performanceId = searchParams.get("performance");
    if (!performanceId || loading || !data) return;
    openCheckout(performanceId);
  }, [searchParams, loading, data, openCheckout]);

  return (
    <InnerPageShell showVisit showNewsletter>
      <article className="orpheum-inner-page sots-tickets-page">
        <header className="orpheum-inner-page__hero sots-tickets-page__hero">
          <div
            className="sots-tickets-page__hero-bg"
            style={{ backgroundImage: `url('${MEDIA.heroHome}')` }}
            aria-hidden="true"
          />
          <div className="sots-tickets-page__hero-veil" aria-hidden="true" />
          <div className="orpheum-inner-page__hero-inner sots-tickets-page__hero-inner" data-reveal>
            <p className="orpheum-inner-page__eyebrow">2026 Season</p>
            <h1>Tickets</h1>
            <p className="orpheum-inner-page__intro">
              Choose a performance below. Checkout is on this site — pick tickets, pay, and you&apos;re done.
            </p>
            {!loading && ticketingState.statusLabel ? (
              <div className="sots-tickets-page__meta">
                <TicketStatusBadge status={ticketingState.statusLabel} />
                {priceLabel ? <span className="sots-tickets-page__price-from">{priceLabel}</span> : null}
              </div>
            ) : null}
            <p className="sots-tickets-page__owned-hint">
              Already purchased?{" "}
              <Link to="/my-tickets/">My Tickets</Link>
              {" · "}
              <Link to="/access-your-tickets/">Look up with a confirmation code</Link>
            </p>
          </div>
        </header>

        <div className="orpheum-inner-page__body">
          <section className="sots-tickets-page__how" aria-label="How ticketing works" data-reveal>
            <ol className="sots-tickets-page__how-list">
              {HOW_IT_WORKS.map((item) => (
                <li key={item.step}>
                  <span className="sots-tickets-page__how-step">{item.step}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="sots-tickets-page__layout" data-reveal>
            <div className="sots-tickets-page__main">
              {loading ? (
                <div className="sots-ticketing-loading">
                  <p>Loading performances and availability…</p>
                </div>
              ) : error ? (
                <div className="sots-ticketing-loading">
                  <p>Ticket availability is temporarily unavailable.</p>
                  <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--gold" onClick={() => refresh()}>
                    Try again
                  </button>
                </div>
              ) : data ? (
                <>
                  <section className="sots-tickets-page__show" aria-labelledby="tickets-show-heading">
                    <div className="sots-tickets-page__show-head">
                      <div>
                        <h2 id="tickets-show-heading" className="sots-tickets-page__show-title">
                          {production?.title ?? featured?.name ?? "Current Production"}
                        </h2>
                        {featured?.venue ? (
                          <p className="sots-tickets-page__show-venue">
                            {featured.venue}
                            {featured.location ? ` · ${featured.location}` : ""}
                          </p>
                        ) : null}
                      </div>
                      <Link
                        className="sots-tickets-page__show-link"
                        to={`/productions/${production?.slug ?? PRODUCTION_SLUG}/`}
                      >
                        About the show
                      </Link>
                    </div>

                    <PerformancePicker data={data} allPerformances confirmBeforeCheckout />
                  </section>

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
                <TicketPricing ticketClasses={data.ticketClasses ?? data.ticketTypes} priceFrom={data.priceFrom} />
              ) : null}
              <div className="sots-tickets-page__help">
                <h2 className="sots-tickets-page__help-title">Box Office</h2>
                <p>
                  Prefer to buy by phone? Call{" "}
                  <a href="tel:+12039571006">(203) 957-1006</a> noon–5pm during the run.
                </p>
                <p>
                  <Link to="/my-tickets/">My Tickets</Link>
                  {" · "}
                  <Link to="/about/contact/">Contact us</Link>
                  {" · "}
                  <Link to="/about/visit/">Plan your visit</Link>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </InnerPageShell>
  );
}
