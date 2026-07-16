import { useEffect, useId, useMemo, useState } from "react";
import { BUNDLED_MERCHANDISE, formatCents, ticketAddonMerchandise } from "../../../js/shop.js";
import { openPaymentLinkCheckout } from "../../../js/payment-link-checkout.js";
import {
  formatPerformanceDate,
  formatPerformanceListDate,
  patronDisplayName,
  sortTicketTypesForDisplay,
  ticketTypeHint,
} from "../../../js/ticketing.js";
import { useShop } from "../../context/ShopContext.jsx";
import { QtyStepper, useBuyBusy } from "../checkout/QtyStepper.jsx";
import {
  shopItemsFromSelections,
  shopLinesForSummary,
  TicketSouvenirAddon,
} from "./TicketSouvenirAddon.jsx";

function PaymentLinkRow({ ticketType, quantity, onChange, highlight }) {
  const hint = ticketTypeHint(ticketType);

  return (
    <article
      className={`sots-co__ticket tix-picker__ticket${highlight ? " is-featured" : ""}${quantity > 0 ? " is-selected" : ""}`}
    >
      <div>
        <div className="sots-co__ticket-head">
          <strong>{patronDisplayName(ticketType.name)}</strong>
          {highlight ? <span className="sots-co__ticket-badge">Recommended</span> : null}
        </div>
        {hint ? <p className="sots-co__ticket-hint">{hint}</p> : null}
        <p className="sots-co__ticket-price">{ticketType.price?.display}</p>
      </div>
      <QtyStepper
        value={quantity}
        min={0}
        max={10}
        label={`Quantity for ${ticketType.name}`}
        onChange={onChange}
      />
    </article>
  );
}

export function TicketPickerSheet({ open, onClose, data, performanceId }) {
  const titleId = useId();
  const [quantities, setQuantities] = useState({});
  const [shopQuantities, setShopQuantities] = useState({});
  const [shopOptions, setShopOptions] = useState({});
  const [showSouvenirs, setShowSouvenirs] = useState(false);
  const { busy, error, runBuy } = useBuyBusy();
  const { catalog: shopCatalog } = useShop();

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

  const souvenirProducts = useMemo(() => {
    const list = ticketAddonMerchandise(shopCatalog);
    return list.length ? list : ticketAddonMerchandise({ products: BUNDLED_MERCHANDISE });
  }, [shopCatalog]);

  const vipTicketId = useMemo(() => {
    const vip =
      ticketTypes.find((t) => /high\s*back/i.test(t.name ?? "")) ??
      ticketTypes.find((t) => /vip|reserved/i.test(t.name ?? "") || /vip/i.test(t.slug ?? ""));
    return vip?.id ?? null;
  }, [ticketTypes]);

  const selected = useMemo(
    () =>
      ticketTypes
        .map((tt) => ({
          ticketTypeId: tt.id,
          quantity: quantities[tt.id] ?? 0,
          unit: tt.price?.value ?? 0,
        }))
        .filter((row) => row.quantity > 0),
    [ticketTypes, quantities],
  );

  const shopItems = useMemo(
    () => shopItemsFromSelections(souvenirProducts, shopQuantities, shopOptions),
    [souvenirProducts, shopQuantities, shopOptions],
  );

  const shopSummaryLines = useMemo(
    () => shopLinesForSummary(souvenirProducts, shopQuantities, shopOptions),
    [souvenirProducts, shopQuantities, shopOptions],
  );

  const shopCents = shopSummaryLines.reduce((sum, line) => sum + line.cents, 0);
  const ticketCents = selected.reduce((sum, row) => sum + row.unit * row.quantity, 0);
  const totalCents = ticketCents + shopCents;
  const totalQty = selected.reduce((sum, row) => sum + row.quantity, 0);
  const shopQty = shopItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!open) return;
    setQuantities({});
    setShopQuantities({});
    setShopOptions({});
    setShowSouvenirs(false);
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

  if (!open || !performance) return null;

  function setSouvenirQuantity(productId, quantity) {
    setShopQuantities((prev) => {
      const next = { ...prev };
      if (quantity <= 0) delete next[productId];
      else next[productId] = quantity;
      return next;
    });
  }

  function setSouvenirOption(productId, value) {
    setShopOptions((prev) => ({ ...prev, [productId]: value }));
  }

  function handleBuy() {
    if (!selected.length) return;
    runBuy(async () => {
      await openPaymentLinkCheckout({
        kind: "ticket",
        items: selected.map((row) => ({
          performanceId: performance.id,
          ticketTypeId: row.ticketTypeId,
          quantity: row.quantity,
        })),
        shopItems: shopItems.map((item) => {
          const product = souvenirProducts.find((p) => p.id === item.productId);
          return {
            itemId: item.productId,
            sku: product?.sku,
            quantity: item.quantity,
            option: item.option,
          };
        }),
      });
      onClose();
    });
  }

  return (
    <div className="tix-picker is-open" role="presentation">
      <button type="button" className="tix-picker__backdrop" onClick={onClose} aria-label="Close ticket picker" />
      <div className="tix-picker__panel" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="tix-picker__head">
          <div>
            <p className="tix-picker__eyebrow">Buy tickets</p>
            <h2 id={titleId}>
              {formatPerformanceListDate(performance.start) || formatPerformanceDate(performance.start)}
            </h2>
            <p className="tix-picker__meta">{performance.venue ?? "Shakespeare in Pinkney Park"}</p>
          </div>
          <button type="button" className="tix-picker__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="tix-picker__body">
          <p className="tix-picker__note">
            Choose quantities for each ticket type, then checkout for this night.
          </p>
          <div className="tix-picker__tickets">
            {ticketTypes.map((tt) => (
              <PaymentLinkRow
                key={tt.id}
                ticketType={tt}
                quantity={quantities[tt.id] ?? 0}
                highlight={tt.id === vipTicketId}
                onChange={(qty) => setQuantities((prev) => ({ ...prev, [tt.id]: qty }))}
              />
            ))}
          </div>

          {souvenirProducts.length && selected.length ? (
            <div className="tix-picker__addons">
              <button
                type="button"
                className="tix-picker__addon-toggle"
                onClick={() => setShowSouvenirs((v) => !v)}
                aria-expanded={showSouvenirs}
              >
                {showSouvenirs
                  ? "Hide merch"
                  : shopQty
                    ? `Merch add-on (${shopQty})`
                    : "Add merch?"}
              </button>
              {showSouvenirs ? (
                <TicketSouvenirAddon
                  products={souvenirProducts}
                  quantities={shopQuantities}
                  options={shopOptions}
                  onQuantityChange={setSouvenirQuantity}
                  onOptionChange={setSouvenirOption}
                />
              ) : null}
            </div>
          ) : null}

          {error ? <p className="tix-picker__error">{error}</p> : null}
        </div>

        <div className="tix-picker__foot">
          <div className="tix-picker__total">
            <span>
              {totalQty
                ? `${totalQty} ticket${totalQty === 1 ? "" : "s"}${shopQty ? ` + ${shopQty} merch` : ""}`
                : "Select tickets"}
            </span>
            <strong>{totalQty ? formatCents(totalCents) : "—"}</strong>
          </div>
          <button
            type="button"
            className="orpheum-arrow-btn orpheum-arrow-btn--gold tix-picker__checkout"
            disabled={!selected.length || busy}
            onClick={handleBuy}
          >
            <span className="orpheum-arrow-btn__label">{busy ? "Starting…" : "Checkout"}</span>
            <span className="orpheum-arrow-btn__icon" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
