import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PRODUCTION_DETAILS } from "../../js/pages-data.js";
import { UPCOMING_EVENTS } from "../../js/data.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { PageSection } from "../components/PageSection.jsx";

export function ProductionPage() {
  const { slug } = useParams();
  const data = PRODUCTION_DETAILS[slug];
  const relatedEvents = UPCOMING_EVENTS.filter((event) => event.href !== `/productions/${slug}/`).slice(0, 4);
  const sections =
    data?.sections ??
    (data?.description
      ? [{ type: "prose", heading: "About the Show", paragraphs: [data.description] }]
      : []);

  useEffect(() => {
    if (data) document.title = `${data.title} - Shakespeare on the Sound`;
  }, [data]);

  if (!data) return <Navigate to="/404" replace />;

  return (
    <InnerPageShell className="orpheum-page-shell--production">
      <article className="orpheum-inner-page orpheum-production-page">
        <header className="orpheum-production-page__hero">
          <div
            className="orpheum-production-page__hero-bg"
            style={{ backgroundImage: `url('${data.heroImage ?? data.image}')` }}
            aria-hidden="true"
          />
          <div className="orpheum-production-page__hero-veil" aria-hidden="true" />
          <div className="orpheum-production-page__hero-inner" data-reveal>
            {data.eyebrow ? <p className="orpheum-inner-page__eyebrow">{data.eyebrow}</p> : null}
            <p className="orpheum-production-page__meta">{data.date}</p>
            <h1>{data.title}.</h1>
            {data.director ? (
              <p className="orpheum-production-page__credit">Directed by {data.director}</p>
            ) : null}
            {data.intro ? <p className="orpheum-inner-page__intro">{data.intro}</p> : null}
            <div className="orpheum-production-page__actions">
              {data.tickets ? (
                <ArrowButton href={data.tickets} target="_blank" rel="noopener">
                  Get Tickets
                </ArrowButton>
              ) : null}
              <ArrowButton href="/about/visit/" variant="ghost">
                Plan Your Visit
              </ArrowButton>
            </div>
          </div>
        </header>

        <div className="orpheum-inner-page__body">
          <div className="orpheum-inner-page__content orpheum-production-page__content" data-reveal>
            <div className="orpheum-production-page__main">
              {sections.map((section, index) => (
                <PageSection key={`${section.heading ?? "section"}-${index}`} section={section} />
              ))}
            </div>

            <aside className="orpheum-production-page__sidebar">
              <h2 className="orpheum-inner-page__section-title">Details.</h2>
              <dl className="orpheum-inner-page__details">
                <div className="orpheum-inner-page__detail">
                  <dt>Venue</dt>
                  <dd>{data.venue}</dd>
                </div>
                <div className="orpheum-inner-page__detail">
                  <dt>Season</dt>
                  <dd>{data.season}</dd>
                </div>
                {data.date ? (
                  <div className="orpheum-inner-page__detail">
                    <dt>Dates</dt>
                    <dd>{data.date}</dd>
                  </div>
                ) : null}
              </dl>
              <p className="orpheum-production-page__back">
                <Link to="/#upcoming-events">Back to Events and Tickets</Link>
              </p>
            </aside>
          </div>

          <section className="orpheum-production-page__related" data-reveal aria-labelledby="related-events-heading">
            <div className="orpheum-production-page__related-head">
              <h2 id="related-events-heading" className="orpheum-inner-page__section-title">
                More Events.
              </h2>
              <ArrowButton href="/productions/past-productions/">View All Events</ArrowButton>
            </div>
            <div className="orpheum-production-page__related-grid">
              {relatedEvents.map((event) => (
                <a key={event.href} className="orpheum-production-page__related-card" href={event.href}>
                  <img src={event.image} alt="" loading="lazy" width={320} height={200} />
                  <div>
                    <strong>{event.title}</strong>
                    <span>{event.dates}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </article>
    </InnerPageShell>
  );
}
