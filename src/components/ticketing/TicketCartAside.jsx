import { Link } from "react-router-dom";
import { MEDIA } from "../../../js/data.js";
import { formatCents } from "../../../js/shop.js";
import {
  maxQtyForTicket,
  ticketCartLineKey,
  ticketCartTotalCents,
} from "../../../js/ticket-cart.js";
import { TICKETS_PAGE_PATH } from "../../../js/ticketing.js";

export function TicketCartAside({
  groups = [],
  cartCount,
  cartTotal,
  data,
  showImage = MEDIA.muchAdoPoster,
  cartNotice = "",
  onDismissNotice,
  onUpdate,
  onRemove,
  onCheckout,
  onClearPerformance,
  onClearCart,
  className = "",
  showTitle = true,
}) {
  const nightCount = groups.length;

  return (
    <aside
      className={`sots-shop-cart-aside tix-cart-aside ${className}`.trim()}
      aria-labelledby={showTitle ? "ticket-cart-heading" : undefined}
    >
      <div className="sots-shop-cart-aside__inner">
        {showTitle ? (
          <h2 id="ticket-cart-heading" className="sots-shop-cart-aside__title">
            Your tickets
            {cartCount ? <span className="sots-shop-cart-aside__count">{cartCount}</span> : null}
          </h2>
        ) : null}

        {cartNotice ? (
          <div className="tix-cart-aside__notice" role="status">
            <p>{cartNotice}</p>
            {onDismissNotice ? (
              <button type="button" className="tix-cart-aside__notice-dismiss" onClick={onDismissNotice} aria-label="Dismiss notice">
                ×
              </button>
            ) : null}
          </div>
        ) : null}

        {!groups.length ? (
          <div className="sots-shop-cart-aside__empty">
            <p>Your ticket cart is empty.</p>
            <p className="sots-shop-cart-aside__empty-hint">
              Pick a date below, choose ticket types, then add them to your cart.
            </p>
            <a href="#dates" className="sots-shop-text-link">
              See dates
            </a>
          </div>
        ) : (
          <>
            <ul className="tix-cart-aside__groups">
              {groups.map((group) => {
                const groupTotal = ticketCartTotalCents(group.lines);
                const groupCount = group.lines.reduce((sum, line) => sum + line.quantity, 0);
                const performance = data?.performances?.find((p) => String(p.id) === group.performanceId);

                return (
                  <li key={group.performanceId} className="tix-cart-aside__group">
                    <div className="tix-cart-aside__group-head">
                      {showImage ? (
                        <img src={showImage} alt="" className="tix-cart-aside__poster" width={48} height={64} loading="lazy" />
                      ) : null}
                      <div>
                        <strong>{group.performanceLabel}</strong>
                        {group.venue ? <span>{group.venue}</span> : null}
                      </div>
                    </div>
                    <ul className="sots-shop-cart-aside__list">
                      {group.lines.map((line) => {
                        const key = ticketCartLineKey(line);
                        const lineTotal = (line.price?.value ?? 0) * line.quantity;
                        const ticketType = (data?.ticketTypes ?? data?.ticketClasses ?? []).find(
                          (t) => String(t.id) === String(line.ticketTypeId),
                        );
                        const max = maxQtyForTicket(performance, ticketType ?? { id: line.ticketTypeId, capacity: 10 });
                        return (
                          <li key={key} className="sots-shop-cart-aside__item">
                            <div className="sots-shop-cart-aside__item-copy">
                              <strong>{line.ticketTypeName}</strong>
                              <span className="sots-shop-cart-aside__unit">{line.price?.display}</span>
                              <div className="sots-shop-cart-aside__qty">
                                <button
                                  type="button"
                                  onClick={() => onUpdate(key, Math.max(1, line.quantity - 1))}
                                  aria-label={`Decrease ${line.ticketTypeName}`}
                                >
                                  −
                                </button>
                                <span aria-live="polite">{line.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => onUpdate(key, Math.min(max, line.quantity + 1))}
                                  disabled={line.quantity >= max}
                                  aria-label={`Increase ${line.ticketTypeName}`}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                type="button"
                                className="sots-shop-text-link sots-shop-cart-aside__remove"
                                onClick={() => onRemove(key)}
                              >
                                Remove
                              </button>
                            </div>
                            <strong className="sots-shop-cart-aside__line-total">{formatCents(lineTotal)}</strong>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="tix-cart-aside__group-foot">
                      <div className="tix-cart-aside__group-meta">
                        <span>
                          {groupCount} ticket{groupCount === 1 ? "" : "s"}
                        </span>
                        {onClearPerformance ? (
                          <button
                            type="button"
                            className="sots-shop-text-link"
                            onClick={() => onClearPerformance(group.performanceId)}
                          >
                            Clear date
                          </button>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className="sots-shop-btn sots-shop-btn--checkout sots-shop-btn--lg tix-cart-aside__checkout-btn"
                        onClick={() => onCheckout(group.performanceId)}
                      >
                        Pay this date · {formatCents(groupTotal)}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {nightCount > 1 ? (
              <p className="tix-cart-aside__multi-note">
                Checkout is one performance at a time. Remaining nights stay in your cart until you pay.
              </p>
            ) : null}

            <div className="sots-shop-cart-aside__total tix-cart-aside__subtotal">
              <span>
                Cart · {cartCount} ticket{cartCount === 1 ? "" : "s"}
                {nightCount > 1 ? ` across ${nightCount} nights` : ""}
              </span>
              <strong>{formatCents(cartTotal)}</strong>
            </div>

            {onClearCart && cartCount ? (
              <button type="button" className="sots-shop-text-link tix-cart-aside__clear" onClick={onClearCart}>
                Clear cart
              </button>
            ) : null}
          </>
        )}

        <p className="sots-shop-cart-aside__help">
          Need help? <Link to="/about/contact/">Contact the box office</Link>
          {" · "}
          <Link to={TICKETS_PAGE_PATH}>All dates</Link>
        </p>
      </div>
    </aside>
  );
}
