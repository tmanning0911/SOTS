import { Link } from "react-router-dom";
import { OrderLookupPanel } from "../components/ticketing/OrderLookupPanel.jsx";

export function AccessTicketsModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="orpheum-modal" role="dialog" aria-modal="true" aria-labelledby="access-tickets-title">
      <button type="button" className="orpheum-modal__backdrop" aria-label="Close" onClick={onClose} />
      <div className="orpheum-modal__panel orpheum-modal__panel--wide">
        <button type="button" className="orpheum-modal__close" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        <h2 id="access-tickets-title">Look Up an Order</h2>
        <p className="sots-checkout__hint">
          Have a few orders? <Link to="/my-tickets/" onClick={onClose}>Open My Tickets</Link> instead.
        </p>

        <OrderLookupPanel />

        <ul className="orpheum-modal__options">
          <li>
            <Link
              to="/tickets/"
              className="sots-ticket-checkout-link sots-ticket-checkout-link--modal"
              onClick={onClose}
            >
              <strong>Buy Tickets</strong>
              <span>General admission and reserved seating — checkout on this site</span>
            </Link>
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
