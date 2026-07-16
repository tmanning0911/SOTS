import { useState } from "react";
import { useShop } from "../../context/ShopContext.jsx";

function GiftCertRow({ product }) {
  const { addToCart } = useShop();
  const [added, setAdded] = useState(false);

  return (
    <li className="sots-shop-spotlight__row">
      <div className="sots-shop-spotlight__option">
        <div className="sots-shop-spotlight__option-copy">
          <strong>{product.price?.display}</strong>
          <span>{product.description || product.name}</span>
        </div>
        <div className="sots-shop-spotlight__option-actions">
          <button
            type="button"
            className={`sots-shop-btn${added ? " sots-shop-btn--added" : ""}`}
            onClick={() => {
              addToCart(product, { quantity: 1 });
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1600);
            }}
          >
            {added ? "Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </li>
  );
}

export function ShopGiftCertSpotlight({ products }) {
  if (!products?.length) return null;

  return (
    <section className="sots-shop-spotlight" aria-labelledby="shop-gift-cert-heading">
      <div className="sots-shop-spotlight__inner">
        <p className="orpheum-eyebrow">Digital delivery</p>
        <h2 id="shop-gift-cert-heading" className="orpheum-underline-heading">
          Gift certificates
        </h2>
        <p className="sots-shop-spotlight__lead">
          Add any amount to your cart with merchandise. Certificates are emailed after checkout.
        </p>
        <ul className="sots-shop-spotlight__options">
          {products.map((product) => (
            <GiftCertRow key={product.id} product={product} />
          ))}
        </ul>
      </div>
    </section>
  );
}
