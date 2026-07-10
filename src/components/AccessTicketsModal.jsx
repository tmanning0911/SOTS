import { useTickets } from "../context/TicketProvider.jsx";

const ORDER_LOOKUP = "https://www.eventbrite.com/signin/signup?referrer=%2Fmytickets";

export function AccessTicketsModal({ open, onClose }) {
  const { openCheckout } = useTickets();

  if (!open) return null;

  return (
    <div className="orpheum-modal" role="dialog" aria-modal="true" aria-labelledby="access-tickets-title">
      <button type="button" className="orpheum-modal__backdrop" aria-label="Close" onClick={onClose} />
      <div className="orpheum-modal__panel">
        <button type="button" className="orpheum-modal__close" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        <h2 id="access-tickets-title">Access Your Tickets</h2>
        <p>Mobile tickets make entry to events quick and easy.</p>
        <ul className="orpheum-modal__options">
          <li>
            <a href={ORDER_LOOKUP} target="_blank" rel="noopener noreferrer">
              <strong>View My Tickets</strong>
              <span>Log in to Eventbrite to access mobile tickets</span>
            </a>
          </li>
          <li>
            <button
              type="button"
              className="sots-ticket-checkout-link sots-ticket-checkout-link--modal"
              onClick={() => {
                onClose();
                openCheckout();
              }}
            >
              <strong>Buy Tickets</strong>
              <span>General admission and reserved seating — checkout on this site</span>
            </button>
          </li>
          <li>
            <a href="/about/contact/">
              <strong>Box Office</strong>
              <span>Purchased by phone or in person</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
