import { useState } from "react";
import { formatCents } from "../../../js/shop.js";

export function ProductCard({ product, onAdd, onBuyNow }) {
  const [option, setOption] = useState(product.options?.[0]?.values?.[0] ?? "");
  const [added, setAdded] = useState(false);
  const hasOptions = Boolean(product.options?.length);

  const selection = { option: hasOptions ? option : undefined };

  const handleAdd = () => {
    onAdd(product, selection);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(product, selection);
      return;
    }
    handleAdd();
  };

  return (
    <article className="sots-shop-card">
      <div className="sots-shop-card__media">
        {product.image ? (
          <img src={product.image} alt="" loading="lazy" width={400} height={400} />
        ) : (
          <div className="sots-shop-card__placeholder" aria-hidden="true" />
        )}
        {product.digital ? <span className="sots-shop-card__badge">Digital</span> : null}
      </div>
      <div className="sots-shop-card__body">
        <p className="sots-shop-card__category">{product.categoryLabel}</p>
        <h3>{product.name}</h3>
        {product.description ? <p className="sots-shop-card__desc">{product.description}</p> : null}
        {hasOptions ? (
          <label className="sots-shop-card__option">
            {product.options[0].name}
            <select value={option} onChange={(e) => setOption(e.target.value)}>
              {product.options[0].values.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <div className="sots-shop-card__footer">
          <strong>{product.price?.display}</strong>
          <div className="sots-shop-card__actions">
            <button
              type="button"
              className={`orpheum-arrow-btn orpheum-arrow-btn--gold orpheum-arrow-btn--compact sots-shop-card__add${added ? " is-added" : ""}`}
              onClick={handleAdd}
              aria-live="polite"
            >
              {added ? "Added" : "Add to cart"}
            </button>
            <button
              type="button"
              className="sots-shop-card__buy-now"
              onClick={handleBuyNow}
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ShopCartPanel({ cart, cartTotal, onUpdate, onRemove, onCheckout }) {
  if (!cart.length) {
    return <p className="sots-shop-cart__empty">Your cart is empty.</p>;
  }

  return (
    <div className="sots-shop-cart">
      <ul className="sots-shop-cart__list">
        {cart.map((line) => {
          const key = `${line.id}:${line.option ?? ""}`;
          return (
            <li key={key} className="sots-shop-cart__item">
              <div>
                <strong>{line.name}</strong>
                {line.option ? <span className="sots-shop-cart__option">{line.option}</span> : null}
                <span>{line.price?.display}</span>
              </div>
              <div className="sots-shop-cart__qty">
                <button type="button" onClick={() => onUpdate(key, Math.max(1, line.quantity - 1))}>
                  −
                </button>
                <span>{line.quantity}</span>
                <button type="button" onClick={() => onUpdate(key, Math.min(10, line.quantity + 1))}>
                  +
                </button>
              </div>
              <button type="button" className="sots-shop-cart__remove" onClick={() => onRemove(key)}>
                Remove
              </button>
            </li>
          );
        })}
      </ul>
      <p className="sots-shop-cart__total">
        Subtotal: <strong>{formatCents(cartTotal)}</strong>
      </p>
      <button type="button" className="orpheum-arrow-btn orpheum-arrow-btn--gold" onClick={onCheckout}>
        Checkout
      </button>
    </div>
  );
}
