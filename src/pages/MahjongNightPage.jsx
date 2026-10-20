import { eventMapUrls } from "../../js/event-maps.js";
import { MAHJONG_NIGHT, MAHJONG_NIGHT_PATH } from "../../js/mahjong-night.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { ShareBar } from "../components/ShareBar.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

export function MahjongNightPage() {
  const event = MAHJONG_NIGHT;
  const venueMap = eventMapUrls({
    title: event.title,
    location: event.venueAddress || `${event.venueName}, ${event.venueCity}`,
  });

  usePageMeta(MAHJONG_NIGHT_PATH);

  return (
    <InnerPageShell className="sots-mahjong-page" showSupport>
      <article className="orpheum-inner-page sots-mahjong">
        <InnerPageHero title={event.title} eyebrow="Thank you" intro={event.intro} />

        <div className="orpheum-inner-page__body">
          <section className="sots-event-thanks" aria-labelledby="mahjong-thanks-heading" data-reveal>
            <p className="sots-event-thanks__eyebrow">September 19, 2026</p>
            <h2 id="mahjong-thanks-heading">This afternoon has ended</h2>
            <p>
              Thank you for playing with us at the Mahjong Midsummer Classic. Seats, tables, and
              sponsorships for that day are no longer on sale. Gifts to the year-end campaign are
              still welcome.
            </p>
            <ArrowButton href={event.donateHref}>Give now</ArrowButton>
          </section>

          <section className="sots-mahjong__details" aria-labelledby="mahjong-details-heading" data-reveal>
            <p className="orpheum-eyebrow">The afternoon</p>
            <h2 id="mahjong-details-heading" className="orpheum-underline-heading">
              Event details
            </h2>
            <dl className="orpheum-inner-page__details">
              <div className="orpheum-inner-page__detail">
                <dt>Date</dt>
                <dd>{event.dateLabel}</dd>
              </div>
              <div className="orpheum-inner-page__detail">
                <dt>Time</dt>
                <dd>{event.timeLabel}</dd>
              </div>
              <div className="orpheum-inner-page__detail">
                <dt>Where</dt>
                <dd>
                  {event.venueName}
                  <br />
                  {event.venueCity}
                </dd>
              </div>
            </dl>
            {venueMap?.embedUrl ? (
              <div className="sots-event-venue-map">
                <div className="sots-event-venue-map__frame">
                  <iframe
                    title={`Map for ${event.title}`}
                    src={venueMap.embedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                {venueMap.linkUrl ? (
                  <a className="sots-event-venue-map__link" href={venueMap.linkUrl} target="_blank" rel="noreferrer">
                    Open in Google Maps
                  </a>
                ) : null}
              </div>
            ) : null}
            <ShareBar
              path={MAHJONG_NIGHT_PATH}
              title={event.title}
              label="Share this event"
              text={`${event.title} — ${event.dateLabel} at ${event.venueName}`}
            />
          </section>

          <section className="sots-mahjong__section" aria-labelledby="mahjong-contact-heading" data-reveal>
            <p className="orpheum-eyebrow">Box office</p>
            <h2 id="mahjong-contact-heading" className="orpheum-underline-heading">
              Questions
            </h2>
            <p className="sots-mahjong__lede">
              Call <a href={event.contactPhoneHref}>{event.contactPhone}</a> or email{" "}
              <a href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a>.
            </p>
          </section>
        </div>
      </article>
    </InnerPageShell>
  );
}
