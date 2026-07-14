import { useEffect, useId, useMemo, useState } from "react";
import { formatCents } from "../../../js/shop.js";
import { maxQtyForTicket } from "../../../js/ticket-cart.js";
import {
  formatPerformanceDate,
  formatPerformanceListDate,
  patronDisplayName,
  sortTicketTypesForDisplay,
  ticketTypeHint,
} from "../../../js/ticketing.js";

function PickerTicketRow({ ticketType, quantity, max, highlight, onChange }) {
  const hint = ticketTypeHint(ticketType);
  const unavailable = max <= 0;
  const lowStock = !unavailable && max <= 5;

  if (unavailable) return null;

  return (
    <article
      className={`sots-co__ticket tix-picker__ticket${highlight ? " is-featured" : ""}${quantity > 0 ? " is-selected" : ""}`}
    >
      <div>
        <div className="sots-co__ticket-head">
          <strong>{patronDisplayName(ticketType.name)}</strong>
          {highlight ? <span className="sots-co__ticket-badge">Most popular</span> : null}
        </div>
        {hint ? <p className="sots-co__ticket-hint">{hint}</p> : null}
        {lowStock ? <p className="sots-co__ticket-scarcity">Only {max} left</p> : null}
        <p className="sots-co__ticket-price">{ticketType.price?.display}</p>
      </div>
      <div className="sots-co__qty" aria-label={`Quantity for ${ticketType.name}`}>
        <button
          type="button"
          className="sots-co__qty-btn"
          onClick={() => onChange(Math.max(0, quantity - 1))}
          disabled={quantity <= 0}
          aria-label={`Decrease ${ticketType.name}`}
        >
          −
        </button>
        <span className="sots-co__qty-value" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          className="sots-co__qty-btn"
          onClick={() => onChange(Math.min(max, quantity + 1))}
          disabled={quantity >= max}
          aria-label={`Increase ${ticketType.name}`}
        >
          +
        </button>
      </div>
    </article>
  );
}

export function TicketPickerSheet({
  open,
  onClose,
  data,
  performanceId,
  onAddToCart,
  onBuyNow,
}) {
  const titleId = useId();
  const [quantities, setQuantities] = useState({});

  const performance = useMemo(
    () => data?.performances?.find((p) => String(p.id) === String(performanceId)) ?? null,
    [data, performanceId],
  );

  const ticketTypes = useMemo(
    () =>
      sortTicketTypesForDisplay(
        (data?.ticketTypes ?? data?.ticketClasses ?? []).filter((t) => t.price?.value > 0),
      ),
    [data],
  );

  const gaTicketId = useMemo(() => {
    const ga =
      ticketTypes.find((t) => t.slug === "general-admission") ??
      ticketTypes.find((t) => /general admission/i.test(t.name ?? "") && !/child|kid|vip/i.test(t.name ?? ""));
    return ga?.id ?? null;
  }, [ticketTypes]);

  useEffect(() => {
    if (!open) return;
    setQuantities({});
  }, [open, performanceId]);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const selectedItems = useMemo(
    () =>
      ticketTypes
        .map((t) => ({ ticketTypeId: t.id, quantity: quantities[t.id] ?? 0 }))
        .filter((item) => item.quantity > 0),
    [ticketTypes, quantities],
  );

  const subtotal = useMemo(
    () =>
      selectedItems.reduce((sum, item) => {
        const tt = ticketTypes.find((t) => t.id === item.ticketTypeId);
        return sum + (tt?.price?.value ?? 0) * item.quantity;
      }, 0),
    [selectedItems, ticketTypes],
  );

  const ticketCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!open || !performance) return null;

  function handleAdd() {
    if (!selectedItems.length) return;
    onAddToCart?.(performance.id, selectedItems);
    onClose();
  }

  function handleBuyNow() {
    if (!selectedItems.length) return;
    onBuyNow?.(performance.id, selectedItems);
    onClose();
  }

  return (
    <div className="tix-picker is-open" role="presentation">
      <button type="button" className="tix-picker__backdrop" onClick={onClose} aria-label="Close ticket picker" />
      <div className="tix-picker__panel" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="tix-picker__head">
          <div>
            <p className="tix-picker__eyebrow">Choose tickets</p>
            <h2 id={titleId}>{formatPerformanceListDate(performance.start) || formatPerformanceDate(performance.start)}</h2>
            <p className="tix-picker__meta">{performance.venue ?? "Shakespeare in Pinkney Park"}</p>
          </div>
          <button type="button" className="tix-picker__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="tix-picker__body">
          <div className="tix-picker__tickets">
            {ticketTypes.map((tt) => (
              <PickerTicketRow
                key={tt.id}
                ticketType={tt}
                quantity={quantities[tt.id] ?? 0}
                max={maxQtyForTicket(performance, tt)}
                highlight={tt.id === gaTicketId}
                onChange={(qty) => setQuantities((prev) => ({ ...prev, [tt.id]: qty }))}
              />
            ))}
          </div>
        </div>

        <div className="tix-picker__foot">
          <div className="tix-picker__total">
            <span>{ticketCount ? `${ticketCount} ticket${ticketCount === 1 ? "" : "s"}` : "Select tickets"}</span>
            <strong>{ticketCount ? formatCents(subtotal) : "—"}</strong>
          </div>
          <div className="tix-picker__actions">
            <button
              type="button"
              className="orpheum-arrow-btn orpheum-arrow-btn--ghost"
              disabled={!selectedItems.length}
              onClick={handleAdd}
            >
              Add to cart
            </button>
            <button
              type="button"
              className="orpheum-arrow-btn orpheum-arrow-btn--gold"
              disabled={!selectedItems.length}
              onClick={handleBuyNow}
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
