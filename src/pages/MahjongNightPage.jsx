import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { formatMahjongCents, formatMahjongPrice, MAHJONG_NIGHT } from "../../js/mahjong-night.js";
import { openPaymentLinkCheckout } from "../../js/payment-link-checkout.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { QtyStepper, useBuyBusy } from "../components/checkout/QtyStepper.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";

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
  const [params] = useSearchParams();
  const thanks = params.get("thanks") === "1";
  const [qty, setQty] = useState({});
  const { busy, error, runBuy } = useBuyBusy();

  const allItems = [...event.tickets, ...event.sponsors];
  const selected = allItems
    .map((item) => ({ item, quantity: qty[item.id] ?? 0 }))
    .filter((row) => row.quantity > 0);
  const totalQty = selected.reduce((sum, row) => sum + row.quantity, 0);
  const totalCents = selected.reduce(
    (sum, row) => sum + Math.round(row.item.price * 100) * row.quantity,
    0,
  );

  useEffect(() => {
    document.title = `${event.title} - Shakespeare on the Sound`;
  }, [event.title]);

  useEffect(() => {
    if (thanks) setQty({});
  }, [thanks]);

  function checkout() {
    if (!selected.length) return;
    runBuy(async () => {
      await openPaymentLinkCheckout({
        kind: "mahjong",
        items: selected.map(({ item, quantity }) => ({ itemId: item.id, quantity })),
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
          </section>

          <section id="tickets" className="sots-mahjong__section" aria-labelledby="mahjong-tickets-heading" data-reveal>
            <p className="orpheum-eyebrow">Seats</p>
            <h2 id="mahjong-tickets-heading" className="orpheum-underline-heading">
              Tickets
            </h2>
            <p className="sots-mahjong__lede">
              Choose quantities for any combination of seats, then checkout once.
            </p>
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
            <p className="sots-mahjong__lede">
              Add sponsorships to the same order if you like — recognition and seats included at higher
              tiers.
            </p>
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
            <p className="sots-mahjong__fineprint">
              Ticket purchases and sponsorships support Shakespeare on the Sound, subject to how
              checkout is processed (including any applicable fees).
            </p>
          </section>

          <section className="sots-mahjong__section sots-mahjong__cta-band" data-reveal>
            <p className="sots-mahjong__donate">
              Can&apos;t attend?{" "}
              <Link to={event.donateHref}>Donate online</Link> and note “Mahjong Midsummer Classic”
              in the comments if you’d like.
            </p>
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
          <div className="sots-mahjong__sticky-checkout" role="region" aria-label="Checkout">
            <p className="sots-mahjong__checkout-total">
              {totalQty} item{totalQty === 1 ? "" : "s"} · {formatMahjongCents(totalCents)}
            </p>
            <ArrowButton type="button" onClick={checkout} disabled={busy}>
              {busy ? "Starting…" : "Checkout"}
            </ArrowButton>
            {error ? (
              <p className="sots-mahjong__error sots-mahjong__error--sticky" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        ) : null}
      </article>
    </InnerPageShell>
  );
}
