import { useState } from "react";
import { useShop } from "../../context/ShopContext.jsx";

export function ProductCard({ product, priorityImage = false }) {
  const { addToCart } = useShop();
  const [added, setAdded] = useState(false);
  const hasOptions = Boolean(product.options?.length);
  const [option, setOption] = useState(product.options?.[0]?.values?.[0] ?? "");
  const canBuy = Boolean(product.id || product.sku);

  function handleAdd() {
    addToCart(product, { quantity: 1, option: hasOptions ? option : undefined });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article className="sots-shop-card">
      <div className="sots-shop-card__media">
        {product.image ? (
          <img
            src={product.image}
            alt={`${product.name} product photo`}
            loading={priorityImage ? "eager" : "lazy"}
            fetchPriority={priorityImage ? "high" : undefined}
            width={400}
            height={400}
          />
        ) : (
          <div className="sots-shop-card__placeholder" aria-hidden="true" />
        )}
        {product.digital ? <span className="sots-shop-card__badge">Digital</span> : null}
      </div>
      <div className="sots-shop-card__body">
        {product.categoryLabel ? (
          <p className="sots-shop-card__category">{product.categoryLabel}</p>
        ) : null}
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
          {canBuy ? (
            <button
              type="button"
              className={`sots-shop-btn sots-shop-btn--block${added ? " sots-shop-btn--added" : ""}`}
              onClick={handleAdd}
            >
              {added ? "Added" : "Add to cart"}
            </button>
          ) : (
            <span className="sots-shop-btn sots-shop-btn--block sots-shop-btn--disabled" aria-disabled="true">
              Coming soon
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
