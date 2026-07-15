import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MEDIA, SEASON_SHOWS } from "../../js/data.js";
import { MAHJONG_NIGHT_PATH } from "../../js/mahjong-night.js";
import {
  enrichEventWithTickets,
  loadTicketData,
  TICKETS_PAGE_PATH,
} from "../../js/ticketing.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";

const FEATURED_SHOW = SEASON_SHOWS.find((s) => s.id === "much-ado") ?? SEASON_SHOWS[0];

const FUNDRAISER_CATEGORIES = new Set(["fundraiser", "gala"]);

function isFundraiser(event) {
  return FUNDRAISER_CATEGORIES.has(String(event?.category || "").toLowerCase());
}

function eventStartMs(event) {
  const start = event?.calendar?.start ?? event?.calendar?.occurrences?.[0]?.start ?? null;
  if (!start) return Number.POSITIVE_INFINITY;
  const ms = Date.parse(start);
  return Number.isFinite(ms) ? ms : Number.POSITIVE_INFINITY;
}

function eventEndMs(event) {
  const end =
    event?.calendar?.end ??
    event?.calendar?.occurrences?.at(-1)?.end ??
    event?.calendar?.occurrences?.at(-1)?.start ??
    event?.calendar?.start ??
    null;
  if (!end) return eventStartMs(event);
  const ms = Date.parse(end);
  return Number.isFinite(ms) ? ms : eventStartMs(event);
}

function sortByStart(a, b) {
  return eventStartMs(a) - eventStartMs(b);
}

function EventCta({ href, label, primary }) {
  if (!href || !label) return null;
  if (primary) return <ArrowButton href={href}>{label}</ArrowButton>;
  if (/^(https?:|mailto:)/i.test(href)) {
    return (
      <a href={href} className="sots-shop-text-link">
        {label}
      </a>
    );
  }
  return (
    <Link to={href} className="sots-shop-text-link">
      {label}
    </Link>
  );
}

function isPrimaryCta(event, label, href) {
  if (/ticket|sponsor|buy|reserve|get involved/i.test(label ?? "")) return true;
  if (href === TICKETS_PAGE_PATH || href === MAHJONG_NIGHT_PATH) return true;
  if (/mahjong-night/i.test(href ?? "")) return true;
  if (isFundraiser(event) && href) return true;
  return false;
}

function EventRow({ event, past = false, featured = false }) {
  const meta = [event.date, event.time, event.location].filter(Boolean);
  const href = event.ctaUrl || null;
  const label = event.ctaLabel || (href ? "Learn more" : null);
  const secondaryHref = event.secondaryCtaUrl || null;
  const secondaryLabel = event.secondaryCtaLabel || null;
  const primary = isPrimaryCta(event, label, href);
  const hidePastTickets =
    past &&
    (/ticket/i.test(label ?? "") || href === TICKETS_PAGE_PATH) &&
    !isFundraiser(event);
  const showPrimary = href && label && !hidePastTickets;
  const showSecondary = secondaryHref && secondaryLabel && !past;

  return (
    <article
      className={`sots-events-page__row${featured ? " sots-events-page__row--feature" : ""}`}
      id={event.id}
    >
      {featured && event.image ? (
        <div className="sots-events-page__row-media" aria-hidden="true">
          <img src={event.image} alt="" width={480} height={320} loading="lazy" />
        </div>
      ) : null}
      <div className="sots-events-page__row-main">
        <div className="sots-events-page__row-copy">
          {event.category ? <p className="sots-events-page__row-cat">{event.category}</p> : null}
          <h3>{event.title}</h3>
          {meta.length ? (
            <ul className="sots-events-page__row-meta">
              {meta.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : null}
          {event.description ? <p className="sots-events-page__row-desc">{event.description}</p> : null}
          {event.priceNote && !past ? (
            <p className="sots-events-page__row-price">{event.priceNote}</p>
          ) : null}
        </div>
        {showPrimary || showSecondary ? (
          <div className="sots-events-page__row-actions">
            {showPrimary ? <EventCta href={href} label={label} primary={primary} /> : null}
            {showSecondary ? (
              <EventCta href={secondaryHref} label={secondaryLabel} primary={false} />
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function EventListSection({
  id,
  eyebrow,
  heading,
  note,
  events,
  loading,
  past = false,
  empty,
  featureFirst = false,
}) {
  return (
    <section
      className={`sots-events-page__list-section${past ? " sots-events-page__list-section--past" : ""}`}
      id={id}
      aria-labelledby={`${id}-heading`}
    >
      <div className="sots-events-page__list-head">
        <p className="orpheum-eyebrow">{eyebrow}</p>
        <h2 id={`${id}-heading`} className="orpheum-underline-heading">
          {heading}
        </h2>
        {note ? <p className="sots-events-page__list-note">{note}</p> : null}
      </div>

      {loading ? (
        <p className="sots-events-page__loading">Loading events…</p>
      ) : events.length ? (
        <div className="sots-events-page__list">
          {events.map((event, index) => (
            <EventRow
              key={event.id}
              event={event}
              past={past}
              featured={featureFirst && index === 0 && Boolean(event.image)}
            />
          ))}
        </div>
      ) : (
        empty || null
      )}
    </section>
  );
}

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Events - Shakespeare on the Sound";
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [rawEvents, catalog] = await Promise.all([
          fetch("/data/events.json").then((r) => (r.ok ? r.json() : [])),
          loadTicketData().catch(() => null),
        ]);
        if (cancelled) return;
        const list = Array.isArray(rawEvents) ? rawEvents : [];
        setEvents(list.map((event) => (catalog ? enrichEventWithTickets(event, catalog) : event)));
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const { fundraisers, seasonSpecials, earlier } = useMemo(() => {
    const now = Date.now();
    const sorted = [...events].sort(sortByStart);
    const upcoming = sorted.filter((event) => eventEndMs(event) >= now - 12 * 60 * 60 * 1000);
    const past = sorted.filter((event) => eventEndMs(event) < now - 12 * 60 * 60 * 1000).reverse();

    const fundraisersList = upcoming.filter(isFundraiser);
    // Keep fundraisers visible even if the calendar date already passed this season
    const pastFundraisers = past.filter(isFundraiser);
    const allFundraisers = [...fundraisersList, ...pastFundraisers.filter((e) => !fundraisersList.some((u) => u.id === e.id))];

    return {
      fundraisers: allFundraisers.length ? allFundraisers : fundraisersList,
      seasonSpecials: upcoming.filter((event) => !isFundraiser(event)),
      earlier: past.filter((event) => !isFundraiser(event)),
    };
  }, [events]);

  return (
    <InnerPageShell showVisit={false} showNewsletter showSupport>
      <article className="sots-events-page">
        <InnerPageHero title="Events" />

        <nav className="orpheum-page-quick" aria-label="Events shortcuts">
          <a href="#tickets" className="orpheum-page-quick__link">
            Main stage tickets
          </a>
          <a href="#fundraisers" className="orpheum-page-quick__link">
            Fundraisers
          </a>
          <Link to={MAHJONG_NIGHT_PATH} className="orpheum-page-quick__link">
            Mahjong night
          </Link>
          <Link to={TICKETS_PAGE_PATH} className="orpheum-page-quick__link">
            Buy tickets
          </Link>
        </nav>

        <section className="sots-events-page__tickets" id="tickets" aria-labelledby="events-tickets-heading">
          <div className="sots-events-page__tickets-inner">
            <div className="sots-events-page__tickets-copy">
              <p className="orpheum-eyebrow">2026 Main Stage</p>
              <h2 id="events-tickets-heading" className="orpheum-underline-heading">
                {FEATURED_SHOW?.title ?? "Much Ado About Nothing"}
              </h2>
              <p className="sots-events-page__tickets-meta">
                {FEATURED_SHOW?.dates ?? "June 10–28, 2026"} · Shakespeare in Pinkney Park
              </p>
              <p className="sots-events-page__tickets-lead">
                Choose a performance night, pick quantities, and checkout. Fundraisers and park
                specials are listed below.
              </p>
              <div className="sots-events-page__tickets-actions">
                <ArrowButton href={TICKETS_PAGE_PATH}>Get tickets</ArrowButton>
                <ArrowButton href="/productions/much-ado-about-nothing/" variant="ghost">
                  About the show
                </ArrowButton>
              </div>
            </div>
            <div className="sots-events-page__tickets-visual" aria-hidden="true">
              <img src={MEDIA.muchAdoPoster} alt="" width={360} height={569} loading="lazy" />
            </div>
          </div>
        </section>

        <EventListSection
          id="fundraisers"
          eyebrow="Join & Give"
          heading="Fundraisers & galas"
          note="Benefit nights that support the season, education programs, and Year-End Giving. Buy tickets or get involved where open."
          events={fundraisers}
          loading={loading}
          featureFirst
          empty={
            <p className="sots-events-page__empty">
              Fundraiser dates will post here as they open.{" "}
              <Link to="/support/donate/">Donate anytime</Link>.
            </p>
          }
        />

        {seasonSpecials.length || loading ? (
          <EventListSection
            id="season"
            eyebrow="In the park"
            heading="Season specials"
            note="Receptions, talks, and community nights tied to Main Stage performances."
            events={seasonSpecials}
            loading={loading}
          />
        ) : null}

        {earlier.length ? (
          <EventListSection
            id="past"
            eyebrow="This season"
            heading="Earlier events"
            events={earlier}
            loading={false}
            past
          />
        ) : null}

        <section className="sots-events-page__past-fund" aria-labelledby="past-fundraisers-heading">
          <div className="sots-events-page__list-head">
            <p className="orpheum-eyebrow">Community</p>
            <h2 id="past-fundraisers-heading" className="orpheum-underline-heading">
              Past fundraisers
            </h2>
            <p className="sots-events-page__list-note">
              ShakesBeer and earlier galas helped fund productions and education outreach across
              Fairfield County. Watch this page for the next celebration.
            </p>
            <div className="sots-events-page__tickets-actions">
              <ArrowButton href="/support/donate/">Donate</ArrowButton>
              <ArrowButton href="/support/program-ads-sponsorships/" variant="ghost">
                Sponsorships
              </ArrowButton>
            </div>
          </div>
        </section>
      </article>
    </InnerPageShell>
  );
}
