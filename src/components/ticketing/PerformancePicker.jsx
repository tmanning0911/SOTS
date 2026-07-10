import { useId, useMemo } from "react";
import {
  formatPerformanceDate,
  getTicketingState,
  purchasablePerformances,
  ticketStatusLabel,
} from "../../../js/ticketing.js";
import { useTickets } from "../../context/TicketProvider.jsx";
import { TicketCheckoutButton } from "./TicketCheckoutButton.jsx";
import { TicketStatusBadge } from "./TicketStatusBadge.jsx";

function PerformanceButton({ performance, selectedId, onSelect, onBuy }) {
  const soldOut = performance.isSoldOut || performance.ticketsAvailable === false;
  const isSelected = selectedId === performance.id;
  const status = ticketStatusLabel(performance);

  return (
    <li className="sots-performance-picker__item">
      <button
        type="button"
        className={`sots-performance-picker__btn${isSelected ? " is-selected" : ""}${soldOut ? " is-sold-out" : ""}`}
        onClick={() => {
          onSelect?.(performance);
          onBuy(performance.id);
        }}
        disabled={soldOut}
        aria-pressed={isSelected}
      >
        <span className="sots-performance-picker__date">{formatPerformanceDate(performance.start)}</span>
        <span className="sots-performance-picker__status">{status}</span>
        {performance.minPrice?.display ? (
          <span className="sots-performance-picker__price">From {performance.minPrice.display}</span>
        ) : null}
      </button>
    </li>
  );
}

export function PerformancePicker({ data, selectedId, onSelect, limit = 12 }) {
  const listId = useId();
  const { openCheckout } = useTickets();
  const performances = useMemo(() => purchasablePerformances(data, limit), [data, limit]);
  const state = useMemo(() => getTicketingState(data), [data]);

  if (!data?.featuredTicket) return null;

  if (!state.canPurchase) {
    return (
      <section className="sots-performance-picker sots-performance-picker--ended" aria-labelledby={listId}>
        <div className="sots-performance-picker__head">
          <h2 id={listId} className="sots-performance-picker__title">
            Tickets
          </h2>
          <TicketStatusBadge status={state.statusLabel} />
          <p className="sots-performance-picker__lead">
            {state.isEnded
              ? "This production has ended. Thank you for supporting Shakespeare on the Sound."
              : "Tickets are not currently available for this production."}
          </p>
        </div>
        <TicketCheckoutButton />
      </section>
    );
  }

  return (
    <section className="sots-performance-picker" aria-labelledby={listId}>
      <div className="sots-performance-picker__head">
        <h2 id={listId} className="sots-performance-picker__title">
          Choose a Performance
        </h2>
        <p className="sots-performance-picker__lead">
          Select a date to buy tickets. Checkout opens right here on our site.
        </p>
      </div>
      {performances.length ? (
        <ul className="sots-performance-picker__grid">
          {performances.map((performance) => (
            <PerformanceButton
              key={performance.id}
              performance={performance}
              selectedId={selectedId}
              onSelect={onSelect}
              onBuy={(id) => openCheckout(id)}
            />
          ))}
        </ul>
      ) : (
        <TicketCheckoutButton />
      )}
    </section>
  );
}
