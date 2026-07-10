import { MEDIA, SEASON_PROMO, SEASON_SHOWS } from "../../../js/data.js";
import { useTickets } from "../../context/TicketProvider.jsx";
import { TicketCheckoutButton } from "../ticketing/TicketCheckoutButton.jsx";
import { TicketStatusBadge } from "../ticketing/TicketStatusBadge.jsx";

export function SeasonPromo() {
  const { ticketingState, loading } = useTickets();
  const featuredShow =
    SEASON_SHOWS.find((show) => show.id === SEASON_PROMO.showId) ?? SEASON_SHOWS[0];

  return (
    <section className="orpheum-season-promo" aria-labelledby="season-promo-heading">
      <div className="orpheum-season-promo__ticket" data-reveal>
        <div className="orpheum-season-promo__visual">
          <div
            className="orpheum-season-promo__visual-bg"
            style={{ backgroundImage: `url(${MEDIA.heroHome})` }}
          />
          <div className="orpheum-season-promo__visual-veil" aria-hidden="true" />
        </div>

        <div className="orpheum-season-promo__copy">
          <p className="orpheum-season-promo__eyebrow">{SEASON_PROMO.eyebrow}</p>
          <h2 id="season-promo-heading">{SEASON_PROMO.heading}</h2>
          <p className="orpheum-season-promo__show-meta">
            <strong>{featuredShow.title}</strong>
            <span>{featuredShow.dates}</span>
          </p>
          {!loading && ticketingState.statusLabel ? (
            <TicketStatusBadge status={ticketingState.statusLabel} className="orpheum-season-promo__badge" />
          ) : null}
          <TicketCheckoutButton className="orpheum-season-promo__cta-btn" />
        </div>
      </div>
    </section>
  );
}
