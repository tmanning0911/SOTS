import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MEDIA, SEASON_SHOWS } from "../../js/data.js";
import { eventMapUrls } from "../../js/event-maps.js";
import { GALA_PATH } from "../../js/gala-event.js";
import { MAHJONG_NIGHT_PATH } from "../../js/mahjong-night.js";
import { enrichEventWithTickets, loadTicketData, TICKETS_PAGE_PATH } from "../../js/ticketing.js";
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
  if (/sponsor/i.test(label)) {
    return (
      <ArrowButton href={href} variant="ghost">
        {label}
      </ArrowButton>
    );
  }
  if (/^(https?:|mailto:)/i.test(href)) {
    return (
      <a href={href} className="sots-events-page__text-link">
        {label}
      </a>
    );
  }
  return (
    <Link to={href} className="sots-events-page__text-link">
      {label}
    </Link>
  );
}

function isPrimaryCta(event, label, href) {
  if (/ticket|sponsor|buy|reserve|get involved/i.test(label ?? "")) return true;
  if (href === TICKETS_PAGE_PATH || href === MAHJONG_NIGHT_PATH || href === GALA_PATH) return true;
  if (/mahjong-night|much-ado-about-something/i.test(href ?? "")) return true;
  if (isFundraiser(event) && href) return true;
  return false;
}

function EventVenueMap({ event }) {
  const map = eventMapUrls(event);
  if (!map?.embedUrl) return null;

  return (
    <div className="sots-events-page__card-map">
      <p className="sots-events-page__card-map-label">Location</p>
      <div className="sots-events-page__card-map-frame">
        <iframe
          title={`Map for ${event.title}`}
          src={map.embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      {map.linkUrl ? (
        <a className="sots-events-page__card-map-link" href={map.linkUrl} target="_blank" rel="noreferrer">
          Open in Google Maps
        </a>
      ) : null}
    </div>
  );
}

function EventCard({ event, past = false, featured = false }) {
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
  const showMedia = featured && Boolean(event.image);
  const hasMap = Boolean(eventMapUrls(event)?.embedUrl);

  return (
    <article
      className={[
        "sots-events-page__card",
        featured ? "sots-events-page__card--feature" : "",
        past ? "sots-events-page__card--past" : "",
        hasMap ? "sots-events-page__card--map" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      id={event.id}
    >
      {showMedia ? (
        <div className="sots-events-page__card-media" aria-hidden="true">
          <img src={event.image} alt="" width={640} height={960} loading="lazy" />
        </div>
      ) : null}

      <div className="sots-events-page__card-body">
        <div className="sots-events-page__card-copy">
          {event.category ? <p className="sots-events-page__card-cat">{event.category}</p> : null}
          <h3>{event.title}</h3>
          {meta.length ? (
            <ul className="sots-events-page__card-meta">
              {meta.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : null}
          {event.description ? <p className="sots-events-page__card-desc">{event.description}</p> : null}
          {event.priceNote && !past ? (
            <p className="sots-events-page__card-price">{event.priceNote}</p>
          ) : null}
        </div>

        {showPrimary || showSecondary ? (
          <div className="sots-events-page__card-actions">
            {showPrimary ? <EventCta href={href} label={label} primary={primary} /> : null}
            {showSecondary ? (
              <EventCta href={secondaryHref} label={secondaryLabel} primary={false} />
            ) : null}
          </div>
        ) : null}
      </div>

      <EventVenueMap event={event} />
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
      className={`sots-events-page__section${past ? " sots-events-page__section--past" : ""}`}
      id={id}
      aria-labelledby={`${id}-heading`}
    >
      <div className="sots-events-page__inner">
        <div className="sots-events-page__section-head">
          <p className="orpheum-eyebrow">{eyebrow}</p>
          <h2 id={`${id}-heading`} className="orpheum-underline-heading">
            {heading}
          </h2>
          {note ? <p className="sots-events-page__section-note">{note}</p> : null}
        </div>

        {loading ? (
          <p className="sots-events-page__loading">Loading events…</p>
        ) : events.length ? (
          <div className={`sots-events-page__stack${past ? " sots-events-page__stack--past" : ""}`}>
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                past={past}
                featured={featureFirst && Boolean(event.image)}
              />
            ))}
          </div>
        ) : (
          empty || null
        )}
      </div>
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

    return {
      fundraisers: upcoming.filter(isFundraiser),
      seasonSpecials: upcoming.filter((event) => !isFundraiser(event)),
      earlier: past,
    };
  }, [events]);

  return (
    <InnerPageShell showVisit={false} showNewsletter showSupport>
      <article className="sots-events-page">
        <InnerPageHero title="Events" compact />

        <nav className="orpheum-page-quick sots-events-page__quick" aria-label="Events shortcuts">
          <a href="#fundraisers" className="orpheum-page-quick__link">
            Fundraisers
          </a>
          <Link to={MAHJONG_NIGHT_PATH} className="orpheum-page-quick__link">
            Mahjong night
          </Link>
          <a href="#earlier" className="orpheum-page-quick__link">
            Past events
          </a>
          <Link to="/support/donate/" className="orpheum-page-quick__link">
            Donate
          </Link>
        </nav>

        <EventListSection
          id="fundraisers"
          eyebrow="Coming up"
          heading="Fundraisers & galas"
          note="Benefit nights supporting productions, education, and Year-End Giving."
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
            eyebrow="More dates"
            heading="Season specials"
            note="Receptions, talks, and community nights."
            events={seasonSpecials}
            loading={loading}
          />
        ) : null}

        <section className="sots-events-page__season-note" id="tickets" aria-labelledby="season-complete-heading">
          <div className="sots-events-page__inner sots-events-page__season-note-inner">
            <div className="sots-events-page__season-note-copy">
              <p className="orpheum-eyebrow">2026 Main Stage</p>
              <h2 id="season-complete-heading">{FEATURED_SHOW?.title ?? "Much Ado About Nothing"}</h2>
              <p>
                {FEATURED_SHOW?.dates ?? "June 10–28, 2026"} · season complete. Thank you for a
                landmark summer in Pinkney Park.
              </p>
              <div className="sots-events-page__season-note-actions">
                <ArrowButton href="/productions/much-ado-about-nothing/" className="orpheum-arrow-btn--compact">
                  About the show
                </ArrowButton>
                <Link to="/support/donate/" className="sots-events-page__text-link">
                  Support what’s next
                </Link>
              </div>
            </div>
            <div className="sots-events-page__season-note-media" aria-hidden="true">
              <img src={MEDIA.muchAdoPoster} alt="" width={240} height={380} loading="lazy" />
            </div>
          </div>
        </section>

        {earlier.length ? (
          <EventListSection
            id="earlier"
            eyebrow="This season"
            heading="Earlier events"
            events={earlier}
            loading={false}
            past
          />
        ) : null}

        <section className="sots-events-page__footer-cta" aria-labelledby="support-heading">
          <div className="sots-events-page__inner">
            <p className="orpheum-eyebrow">Keep the work going</p>
            <h2 id="support-heading" className="orpheum-underline-heading">
              Support the Sound
            </h2>
            <p className="sots-events-page__section-note">
              Donations and sponsorships make outdoor Shakespeare possible for Fairfield County.
            </p>
            <div className="sots-events-page__footer-actions">
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
