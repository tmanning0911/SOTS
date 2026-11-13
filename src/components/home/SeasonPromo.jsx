import { SEASON_PROMO, HOME_SHOW_CARDS } from "../../../js/data.js";
import { TicketCheckoutLink } from "../ticketing/TicketCheckoutLink.jsx";

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ShowCard({ card }) {
  const dateLabel = `${card.month} ${card.day}`;
  return (
    <article className="cdc-show-card">
      <div className="cdc-show-card__date">
        <span className="visually-hidden">{dateLabel}</span>
        <span className="cdc-show-card__month" aria-hidden="true">
          {card.month}
        </span>
        <span className="cdc-show-card__day" aria-hidden="true">
          {card.day}
        </span>
      </div>
      <div className="cdc-show-card__body">
        <h3 className="cdc-show-card__title">
          <a href={card.href}>
            {card.title}
            <span className="visually-hidden"> — {dateLabel}</span>
          </a>
        </h3>
        <img className="cdc-show-card__thumb" src={card.image} alt="" loading="lazy" width={180} height={101} />
        <div className="cdc-show-card__meta">
          <span>
            <PinIcon />
            {card.venue}
          </span>
          <span>
            <ClockIcon />
            {card.time}
          </span>
        </div>
        <TicketCheckoutLink href={card.ticketsHref || card.href} className="cdc-btn">
          {card.ctaLabel || "Get Tickets"}
        </TicketCheckoutLink>
      </div>
    </article>
  );
}

export function SeasonPromo() {
  const body = SEASON_PROMO.body || "";
  const emphasis = SEASON_PROMO.emphasis;
  let rendered = body;
  if (emphasis && body.includes(emphasis)) {
    const parts = body.split(emphasis);
    rendered = (
      <>
        {parts[0]}
        <em>{emphasis}</em>
        {parts[1]}
      </>
    );
  }

  return (
    <section className="cdc-season" aria-labelledby="cdc-season-heading">
      <div className="cdc-season__feature">
        <div className="cdc-season__feature-media" aria-hidden="true">
          <img src={SEASON_PROMO.image} alt="" loading="lazy" />
        </div>
        <div className="cdc-season__feature-veil" aria-hidden="true" />
        <div className="cdc-season__feature-copy">
          <h2 id="cdc-season-heading" className="cdc-season__title">
            {SEASON_PROMO.title || SEASON_PROMO.heading}
          </h2>
          <p className="cdc-season__label">{SEASON_PROMO.seasonLabel || SEASON_PROMO.eyebrow}</p>
          <p className="cdc-season__body">{rendered}</p>
          <a className="cdc-btn" href={SEASON_PROMO.ctaHref}>
            {SEASON_PROMO.ctaLabel}
          </a>
        </div>
      </div>

      <aside className="cdc-season__sidebar" aria-label="Upcoming performances">
        <div className="cdc-season__sidebar-inner">
          <h2 className="cdc-season__sidebar-title">Experience Shakespeare on the Sound</h2>
          <div className="cdc-season__cards">
            {HOME_SHOW_CARDS.map((card) => (
              <ShowCard key={card.id} card={card} />
            ))}
          </div>
        </div>
        <a className="cdc-season__all" href="/events/">
          See All Show Dates
        </a>
      </aside>
    </section>
  );
}
