import { patronDisplayName, sortTicketTypesForDisplay } from "../../../js/ticketing.js";

export function TicketPricing({ ticketClasses, priceFrom }) {
  const classes = sortTicketTypesForDisplay(
    (ticketClasses ?? []).filter((tc) => !tc.hidden && tc.onSale),
  );
  if (!classes.length && !priceFrom) return null;

  return (
    <section className="sots-ticket-pricing" id="ticket-pricing" aria-labelledby="ticket-pricing-heading">
      <h2 id="ticket-pricing-heading" className="sots-ticket-pricing__title">
        Ticket Options
      </h2>
      {priceFrom?.display ? (
        <p className="sots-ticket-pricing__from">From {priceFrom.display}</p>
      ) : null}
      <ul className="sots-ticket-pricing__list">
        {classes.map((ticket) => (
          <li key={ticket.id} className="sots-ticket-pricing__item">
            <div className="sots-ticket-pricing__row">
              <strong>{patronDisplayName(ticket.name)}</strong>
              <span>
                {ticket.free ? "Accessible" : ticket.price?.display ?? "Price TBA"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
