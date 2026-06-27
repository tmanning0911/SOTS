import { VENUE_DUO } from "../../../js/data.js";

function VenueTicketLabel({ venue }) {
  if (venue.layout === "boxed") {
    return (
      <div className="orpheum-venue-duo__label orpheum-venue-duo__label--boxed">
        <span className="orpheum-venue-duo__name-box">{venue.name}</span>
        <span className="orpheum-venue-duo__tagline">{venue.label}</span>
      </div>
    );
  }

  return (
    <div className="orpheum-venue-duo__label orpheum-venue-duo__label--stack">
      <strong>{venue.name}</strong>
      <span className="orpheum-venue-duo__tagline orpheum-venue-duo__tagline--lined">{venue.label}</span>
    </div>
  );
}

export function VenueDuo() {
  return (
    <div className="orpheum-venue-duo" aria-label="Our venues and programs">
      <div className="orpheum-venue-duo__shell">
        <div className="orpheum-venue-duo__grid">
          {VENUE_DUO.map((venue) => (
            <a
              key={venue.name}
              className={`orpheum-venue-duo__ticket orpheum-scalloped orpheum-venue-duo__ticket--${venue.tone}`}
              href={venue.href}
            >
              <div className="orpheum-venue-duo__ticket-bg" aria-hidden="true">
                <img src={venue.image} alt="" loading="lazy" width={900} height={500} />
              </div>
              <VenueTicketLabel venue={venue} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
