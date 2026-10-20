import { eventMapUrls } from "../../js/event-maps.js";
import { GALA_EVENT, GALA_PATH } from "../../js/gala-event.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { ShareBar } from "../components/ShareBar.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

export function GalaPage() {
  const event = GALA_EVENT;
  const venueMap = eventMapUrls({
    title: event.title,
    location: event.venueAddress || `${event.venueName}, ${event.venueCity}`,
  });

  usePageMeta(GALA_PATH);

  return (
    <InnerPageShell className="sots-mahjong-page" showSupport>
      <article className="orpheum-inner-page sots-mahjong">
        <InnerPageHero
          title={event.title}
          eyebrow="Thank you"
          intro={event.intro}
          image={event.image}
          imagePosition="center 18%"
        />

        <div className="orpheum-inner-page__body">
          <section className="sots-event-thanks" aria-labelledby="gala-thanks-heading" data-reveal>
            <p className="sots-event-thanks__eyebrow">October 16, 2026</p>
            <h2 id="gala-thanks-heading">This gala has ended</h2>
            <p>
              Thank you for celebrating with us at The House Up on the Hill. Cocktails, dancing, and
              the auctions are over, and tickets are no longer on sale. Your generosity carries the
              next season in Pinkney Park.
            </p>
            <ArrowButton href={event.donateHref}>Give now</ArrowButton>
          </section>

          <section className="sots-mahjong__details" aria-labelledby="gala-details-heading" data-reveal>
            <p className="orpheum-eyebrow">The evening</p>
            <h2 id="gala-details-heading" className="orpheum-underline-heading">
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
              path={GALA_PATH}
              title={event.title}
              label="Share this event"
              text={`${event.title} — ${event.dateLabel} at ${event.venueName}`}
            />
          </section>

          <section className="sots-mahjong__section" aria-labelledby="gala-contact-heading" data-reveal>
            <p className="orpheum-eyebrow">Box office</p>
            <h2 id="gala-contact-heading" className="orpheum-underline-heading">
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
