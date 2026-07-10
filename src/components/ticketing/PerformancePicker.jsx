import { useId, useMemo, useState } from "react";
import {
  formatPerformanceDate,
  getTicketingState,
  isPurchasablePerformance,
  purchasablePerformances,
  seriesPerformances,
  ticketStatusLabel,
} from "../../../js/ticketing.js";
import { useTickets } from "../../context/TicketProvider.jsx";
import { TicketCheckoutButton } from "./TicketCheckoutButton.jsx";
import { TicketStatusBadge } from "./TicketStatusBadge.jsx";

function PerformanceButton({ performance, selectedId, onSelect, instantCheckout, onBuy }) {
  const soldOut = performance.isSoldOut || performance.ticketsAvailable === false;
  const isSelected = selectedId === performance.id;
  const status = ticketStatusLabel(performance);
  const canBuy = isPurchasablePerformance(performance);

  return (
    <li className="sots-performance-picker__item">
      <button
        type="button"
        className={`sots-performance-picker__btn${isSelected ? " is-selected" : ""}${soldOut ? " is-sold-out" : ""}`}
        onClick={() => {
          onSelect?.(performance);
          if (canBuy && instantCheckout) onBuy(performance.id);
        }}
        disabled={!canBuy}
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

export function PerformancePicker({
  data,
  selectedId: controlledSelectedId,
  onSelect,
  limit = 12,
  allPerformances = false,
  confirmBeforeCheckout = false,
}) {
  const listId = useId();
  const barId = useId();
  const { openCheckout } = useTickets();
  const [internalSelectedId, setInternalSelectedId] = useState(null);
  const selectedId = controlledSelectedId ?? internalSelectedId;

  const performances = useMemo(() => {
    const list = allPerformances ? seriesPerformances(data) : purchasablePerformances(data, limit);
    return allPerformances ? list : list;
  }, [allPerformances, data, limit]);

  const state = useMemo(() => getTicketingState(data), [data]);
  const selectedPerformance = performances.find((p) => p.id === selectedId) ?? null;
  const useConfirmBar = confirmBeforeCheckout || allPerformances;

  function handleSelect(performance) {
    if (controlledSelectedId === undefined) {
      setInternalSelectedId(performance.id);
    }
    onSelect?.(performance);
  }

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
          {allPerformances ? "All Performances" : "Choose a Performance"}
        </h2>
        <p className="sots-performance-picker__lead">
          {useConfirmBar
            ? "Tap a date below, then continue to checkout. Payment stays right here on our site."
            : "Select a date to buy tickets. Checkout opens right here on our site."}
        </p>
      </div>
      {performances.length ? (
        <>
          <ul className="sots-performance-picker__grid">
            {performances.map((performance) => (
              <PerformanceButton
                key={performance.id}
                performance={performance}
                selectedId={selectedId}
                onSelect={handleSelect}
                instantCheckout={!useConfirmBar}
                onBuy={(id) => openCheckout(id)}
              />
            ))}
          </ul>

          {useConfirmBar && selectedPerformance && isPurchasablePerformance(selectedPerformance) ? (
            <div className="sots-performance-picker__continue" aria-labelledby={barId}>
              <div className="sots-performance-picker__continue-copy">
                <p id={barId} className="sots-performance-picker__continue-label">
                  Selected performance
                </p>
                <p className="sots-performance-picker__continue-date">
                  {formatPerformanceDate(selectedPerformance.start)}
                </p>
              </div>
              <button
                type="button"
                className="orpheum-arrow-btn orpheum-arrow-btn--gold"
                onClick={() => openCheckout(selectedPerformance.id)}
              >
                Continue to checkout
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <TicketCheckoutButton />
      )}
    </section>
  );
}
