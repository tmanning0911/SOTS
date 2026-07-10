export function TicketPricing({ ticketClasses, priceFrom }) {
  const classes = (ticketClasses ?? []).filter((tc) => !tc.hidden && tc.onSale);

  if (!classes.length && !priceFrom) return null;

  return (
    <section className="sots-ticket-pricing" aria-labelledby="ticket-pricing-heading">
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
              <strong>{ticket.name}</strong>
              <span>
                {ticket.free ? "Free" : ticket.price?.display ?? "See Eventbrite"}
              </span>
            </div>
            {ticket.soldOut ? <span className="sots-ticket-pricing__badge">Sold out</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
