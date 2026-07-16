import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { eventMapUrls } from "../../js/event-maps.js";
import { formatGalaCents, formatGalaPrice, GALA_EVENT, GALA_PATH } from "../../js/gala-event.js";
import { openPaymentLinkCheckout } from "../../js/payment-link-checkout.js";
import { EventCheckoutPanel } from "../components/checkout/EventCheckoutPanel.jsx";
import { QtyStepper, useBuyBusy } from "../components/checkout/QtyStepper.jsx";
import { EventSponsorSection } from "../components/EventSponsorSection.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { ShareBar } from "../components/ShareBar.jsx";

function OfferRow({ item, quantity, onQty }) {
  return (
    <li className={`sots-mahjong__offer${quantity > 0 ? " is-selected" : ""}`}>
      <div className="sots-mahjong__offer-copy">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
      <div className="sots-mahjong__offer-action">
        <p className="sots-mahjong__offer-price">{formatGalaPrice(item.price)}</p>
        <QtyStepper
          value={quantity}
          min={0}
          max={10}
          label={`Quantity for ${item.name}`}
          onChange={onQty}
        />
      </div>
    </li>
  );
}

export function GalaPage() {
  const event = GALA_EVENT;
  const venueMap = eventMapUrls({
    title: event.title,
    location: event.venueAddress || `${event.venueName}, ${event.venueCity}`,
  });
  const [params] = useSearchParams();
  const thanks = params.get("thanks") === "1";
  const [qty, setQty] = useState(() => Object.fromEntries(event.tickets.map((t) => [t.id, 0])));
  const [note, setNote] = useState("");
  const { busy, error, runBuy } = useBuyBusy();

  const selected = event.tickets
    .map((item) => ({ item, quantity: qty[item.id] ?? 0 }))
    .filter((row) => row.quantity > 0);
  const totalQty = selected.reduce((sum, row) => sum + row.quantity, 0);
  const totalCents = selected.reduce((sum, row) => sum + row.item.price * 100 * row.quantity, 0);
  const lines = selected.map(({ item, quantity }) => ({
    id: item.id,
    name: item.name,
    quantity,
    priceLabel: formatGalaPrice(item.price * quantity),
  }));

  useEffect(() => {
    document.title = `${event.title} - Shakespeare on the Sound`;
  }, [event.title]);

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(t);
  }, []);

  function checkout() {
    if (!selected.length) return;
    runBuy(async () => {
      await openPaymentLinkCheckout({
        kind: "gala",
        items: selected.map(({ item, quantity }) => ({ itemId: item.id, quantity })),
        buyer: {
          note: note.trim(),
        },
      });
    });
  }

  return (
    <InnerPageShell className="sots-mahjong-page" showSupport>
      <article
        className={`orpheum-inner-page sots-mahjong${totalQty > 0 ? " sots-mahjong--checkout-open" : ""}`}
      >
        <InnerPageHero
          title={event.title}
          eyebrow={event.eyebrow}
          intro={event.intro}
          image={event.image}
          imagePosition="center 18%"
        />

        <div className="orpheum-inner-page__body">
          {thanks ? (
            <p className="sots-mahjong__thanks" role="status" data-reveal>
              Thank you — if you completed payment, check your email for a receipt. Save that receipt
              for check-in at the gala.
            </p>
          ) : null}

          {error && totalQty === 0 ? (
            <p className="sots-mahjong__error" role="alert">
              {error}
            </p>
          ) : null}

          <section className="sots-mahjong__details" aria-labelledby="gala-details-heading" data-reveal>
            <p className="orpheum-eyebrow">When &amp; where</p>
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

          <section id="tickets" className="sots-mahjong__section" aria-labelledby="gala-tickets-heading" data-reveal>
            <p className="orpheum-eyebrow">Admission</p>
            <h2 id="gala-tickets-heading" className="orpheum-underline-heading">
              Tickets
            </h2>
            <ul className="sots-mahjong__offers">
              {event.tickets.map((item) => (
                <OfferRow
                  key={item.id}
                  item={item}
                  quantity={qty[item.id] ?? 0}
                  onQty={(n) => setQty((prev) => ({ ...prev, [item.id]: n }))}
                />
              ))}
            </ul>
          </section>

          <div data-reveal>
            <EventSponsorSection
              eventId="gala-2026"
              sectionId="sponsorship"
              eventTitle={event.title}
              returnPath={`${GALA_PATH}?thanks=1`}
              heading="Sponsorships"
              eyebrow="Partner with us"
              lede=""
            />
          </div>

          <section className="sots-mahjong__section sots-mahjong__cta-band" data-reveal>
            <p className="sots-mahjong__donate">
              Love to party? <a href={event.committeeHref}>Join the gala committee</a>
            </p>
          </section>

          <section className="sots-mahjong__section" aria-labelledby="gala-faq-heading" data-reveal>
            <p className="orpheum-eyebrow">Good to know</p>
            <h2 id="gala-faq-heading" className="orpheum-underline-heading">
              Quick questions
            </h2>
            <div className="sots-mahjong__faqs">
              {event.faqs.map((faq) => (
                <div key={faq.q} className="sots-mahjong__faq">
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </div>
              ))}
              <div className="sots-mahjong__faq">
                <h3>Questions?</h3>
                <p>
                  Call <a href={event.contactPhoneHref}>{event.contactPhone}</a> or email{" "}
                  <a href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a>.
                </p>
              </div>
            </div>
          </section>
        </div>

        {totalQty > 0 ? (
          <EventCheckoutPanel
            sticky
            lines={lines}
            totalQty={totalQty}
            totalLabel={formatGalaCents(totalCents)}
            busy={busy}
            error={error}
            note={note}
            onNote={setNote}
            notePlaceholder="Table mates, accessibility needs, dietary notes…"
            onCheckout={checkout}
          />
        ) : null}
      </article>
    </InnerPageShell>
  );
}
