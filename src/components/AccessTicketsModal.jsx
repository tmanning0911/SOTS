import { SITE } from "../../js/data.js";

export function AccessTicketsModal({ open, onClose }) {
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
            <a href={SITE.ticketsUrl} target="_blank" rel="noopener">
              <strong>General Admission</strong>
              <span>Purchased via Eventbrite</span>
            </a>
          </li>
          <li>
            <a href={SITE.ticketsUrl} target="_blank" rel="noopener">
              <strong>Reserved Seating</strong>
              <span>Purchased through Eventbrite or box office</span>
            </a>
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
