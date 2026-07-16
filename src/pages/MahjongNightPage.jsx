import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { formatMahjongCents, formatMahjongPrice, MAHJONG_NIGHT, MAHJONG_NIGHT_PATH } from "../../js/mahjong-night.js";
import { eventMapUrls } from "../../js/event-maps.js";
import { openPaymentLinkCheckout } from "../../js/payment-link-checkout.js";
import { EventCheckoutPanel } from "../components/checkout/EventCheckoutPanel.jsx";
import { QtyStepper, useBuyBusy } from "../components/checkout/QtyStepper.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { ShareBar } from "../components/ShareBar.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

function OfferRow({ item, quantity, onQty }) {
  const max = item.limited ? 4 : 10;

  return (
    <li className={`sots-mahjong__offer${quantity > 0 ? " is-selected" : ""}`}>
      <div className="sots-mahjong__offer-copy">
        {item.limited ? <p className="sots-mahjong__offer-badge">Limited</p> : null}
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
      <div className="sots-mahjong__offer-action">
        <p className="sots-mahjong__offer-price">{formatMahjongPrice(item.price)}</p>
        <QtyStepper
          value={quantity}
          min={0}
          max={max}
          label={`Quantity for ${item.name}`}
          onChange={onQty}
        />
      </div>
    </li>
  );
}

export function MahjongNightPage() {
  const event = MAHJONG_NIGHT;
  const venueMap = eventMapUrls({
    title: event.title,
    location: event.venueAddress || `${event.venueName}, ${event.venueCity}`,
  });
  const [params] = useSearchParams();
  const thanks = params.get("thanks") === "1";
  const [qty, setQty] = useState({});
  const [businessName, setBusinessName] = useState("");
  const [note, setNote] = useState("");
  const { busy, error, setError, runBuy } = useBuyBusy();

  const allItems = [...event.tickets, ...event.sponsors];
  const selected = allItems
    .map((item) => ({ item, quantity: qty[item.id] ?? 0 }))
    .filter((row) => row.quantity > 0);
  const totalQty = selected.reduce((sum, row) => sum + row.quantity, 0);
  const totalCents = selected.reduce(
    (sum, row) => sum + Math.round(row.item.price * 100) * row.quantity,
    0,
  );
  const hasSponsor = selected.some((row) => event.sponsors.some((s) => s.id === row.item.id));
  const lines = selected.map(({ item, quantity }) => ({
    id: item.id,
    name: item.name,
    quantity,
    priceLabel: formatMahjongPrice(item.price * quantity),
  }));

  usePageMeta(MAHJONG_NIGHT_PATH);

  useEffect(() => {
    if (thanks) {
      setQty({});
      setBusinessName("");
      setNote("");
    }
  }, [thanks]);

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
    if (hasSponsor && !businessName.trim()) {
      setError("Enter a business or organization name before payment.");
      document.getElementById("mahjong-business-field")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      document.querySelector("#mahjong-business-field input")?.focus?.();
      return;
    }
    runBuy(async () => {
      await openPaymentLinkCheckout({
        kind: "mahjong",
        items: selected.map(({ item, quantity }) => ({ itemId: item.id, quantity })),
        buyer: {
          businessName: businessName.trim(),
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
        <InnerPageHero title={event.title} />

        <div className="orpheum-inner-page__body">
          {thanks ? (
            <p className="sots-mahjong__thanks" role="status" data-reveal>
              Thank you — if you completed payment, check your email for a receipt. Save that receipt
              for check-in at the event.
            </p>
          ) : null}

          {error && totalQty === 0 ? (
            <p className="sots-mahjong__error" role="alert">
              {error}
            </p>
          ) : null}

          <section className="sots-mahjong__details" aria-labelledby="mahjong-details-heading" data-reveal>
            <p className="orpheum-eyebrow">When &amp; where</p>
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

          <section id="tickets" className="sots-mahjong__section" aria-labelledby="mahjong-tickets-heading" data-reveal>
            <p className="orpheum-eyebrow">Seats</p>
            <h2 id="mahjong-tickets-heading" className="orpheum-underline-heading">
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

          <section
            id="sponsorship"
            className="sots-mahjong__section sots-mahjong__section--band"
            aria-labelledby="mahjong-sponsors-heading"
            data-reveal
          >
            <p className="orpheum-eyebrow">Support the campaign</p>
            <h2 id="mahjong-sponsors-heading" className="orpheum-underline-heading">
              Sponsorships
            </h2>
            <ul className="sots-mahjong__offers">
              {event.sponsors.map((item) => (
                <OfferRow
                  key={item.id}
                  item={item}
                  quantity={qty[item.id] ?? 0}
                  onQty={(n) => setQty((prev) => ({ ...prev, [item.id]: n }))}
                />
              ))}
            </ul>
          </section>

          <section className="sots-mahjong__section" aria-labelledby="mahjong-faq-heading" data-reveal>
            <p className="orpheum-eyebrow">Good to know</p>
            <h2 id="mahjong-faq-heading" className="orpheum-underline-heading">
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
            totalLabel={formatMahjongCents(totalCents)}
            busy={busy}
            error={error}
            requireBusiness={hasSponsor}
            businessName={businessName}
            onBusinessName={(value) => {
              setBusinessName(value);
              if (error) setError("");
            }}
            businessFieldId="mahjong-business-field"
            note={note}
            onNote={setNote}
            notePlaceholder={
              hasSponsor
                ? "How to list your name, contact person, seating notes…"
                : "Table mates, accessibility needs, dietary notes…"
            }
            onCheckout={checkout}
          />
        ) : null}
      </article>
    </InnerPageShell>
  );
}
