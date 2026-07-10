import { useState } from "react";

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
          <strong className="sots-shop-card__price">{product.price?.display}</strong>
          <button
            type="button"
            className={`orpheum-arrow-btn orpheum-arrow-btn--gold orpheum-arrow-btn--compact sots-shop-card__add${added ? " is-added" : ""}`}
            onClick={handleAdd}
            aria-live="polite"
          >
            {added ? "Added" : "Add to cart"}
          </button>
          <button type="button" className="sots-shop-text-link" onClick={() => onBuyNow(product, selection)}>
            Buy now
          </button>
        </div>
      </div>
    </article>
  );
}
