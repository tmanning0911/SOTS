import { Link } from "react-router-dom";
import { formatCents } from "../../../js/shop.js";

export function ShopCartAside({
  cart,
  cartCount,
  cartTotal,
  onUpdate,
  onRemove,
  onCheckout,
  className = "",
  showTitle = true,
}) {
  return (
    <aside className={`sots-shop-cart-aside ${className}`.trim()} aria-labelledby={showTitle ? "shop-cart-heading" : undefined}>
      <div className="sots-shop-cart-aside__inner">
        {showTitle ? (
          <h2 id="shop-cart-heading" className="sots-shop-cart-aside__title">
            Your cart
            {cartCount ? <span className="sots-shop-cart-aside__count">{cartCount}</span> : null}
          </h2>
        ) : null}

        {!cart.length ? (
          <div className="sots-shop-cart-aside__empty">
            <p>Your cart is empty.</p>
            <p className="sots-shop-cart-aside__empty-hint">
              Add merchandise or a gift certificate to checkout in minutes.
            </p>
          </div>
        ) : (
          <>
            <ul className="sots-shop-cart-aside__list">
              {cart.map((line) => {
                const key = `${line.id}:${line.option ?? ""}`;
                const lineTotal = (line.price?.value ?? 0) * line.quantity;
                return (
                  <li key={key} className="sots-shop-cart-aside__item">
                    <div className="sots-shop-cart-aside__thumb">
                      {line.image ? (
                        <img src={line.image} alt="" loading="lazy" width={56} height={56} />
                      ) : (
                        <span aria-hidden="true" />
                      )}
                    </div>
                    <div className="sots-shop-cart-aside__item-copy">
                      <strong>{line.name}</strong>
                      {line.option ? <span className="sots-shop-cart-aside__option">{line.option}</span> : null}
                      <span className="sots-shop-cart-aside__unit">{line.price?.display}</span>
                      <div className="sots-shop-cart-aside__qty">
                        <button type="button" onClick={() => onUpdate(key, Math.max(1, line.quantity - 1))} aria-label="Decrease quantity">
                          −
                        </button>
                        <span>{line.quantity}</span>
                        <button type="button" onClick={() => onUpdate(key, Math.min(10, line.quantity + 1))} aria-label="Increase quantity">
                          +
                        </button>
                      </div>
                      <button type="button" className="sots-shop-text-link sots-shop-cart-aside__remove" onClick={() => onRemove(key)}>
                        Remove
                      </button>
                    </div>
                    <strong className="sots-shop-cart-aside__line-total">{formatCents(lineTotal)}</strong>
                  </li>
                );
              })}
            </ul>
            <div className="sots-shop-cart-aside__total">
              <span>Subtotal</span>
              <strong>{formatCents(cartTotal)}</strong>
            </div>
            <p className="sots-shop-cart-aside__note">Taxes calculated at checkout</p>
            <button
              type="button"
              className="sots-shop-btn sots-shop-btn--checkout sots-shop-btn--lg sots-shop-btn--block sots-shop-cart-aside__checkout"
              onClick={onCheckout}
            >
              Proceed to checkout
            </button>
          </>
        )}

        <p className="sots-shop-cart-aside__help">
          Questions? <Link to="/about/contact/">Contact the box office</Link>.
        </p>
      </div>
    </aside>
  );
}
