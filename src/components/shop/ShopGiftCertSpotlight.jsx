import { useState } from "react";
import { openPaymentLinkCheckout } from "../../../js/payment-link-checkout.js";
import { QtyStepper, useBuyBusy } from "../checkout/QtyStepper.jsx";
import { useShop } from "../../context/ShopContext.jsx";

function GiftCertRow({ product }) {
  const { addToCart } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { busy, error, runBuy } = useBuyBusy();

  return (
    <li className="sots-shop-spotlight__row">
      <div className="sots-shop-spotlight__option">
        <div className="sots-shop-spotlight__option-copy">
          <strong>{product.price?.display}</strong>
          <span>{product.description || product.name}</span>
        </div>
        <div className="sots-shop-spotlight__option-actions">
          <QtyStepper
            value={quantity}
            min={1}
            max={10}
            label={`Quantity for ${product.name}`}
            onChange={setQuantity}
          />
          <button
            type="button"
            className={`sots-shop-btn${added ? " sots-shop-btn--added" : ""}`}
            onClick={() => {
              addToCart(product, { quantity });
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1600);
            }}
          >
            {added ? "Added" : "Add to cart"}
          </button>
          <button
            type="button"
            className="sots-shop-text-link"
            disabled={busy}
            onClick={() =>
              runBuy(() =>
                openPaymentLinkCheckout({
                  kind: "shop",
                  items: [{ itemId: product.id, sku: product.sku, quantity }],
                }),
              )
            }
          >
            {busy ? "Starting…" : quantity > 1 ? `Buy ${quantity} now` : "Buy now"}
          </button>
          {error ? (
            <p className="sots-shop-card__error" role="alert">
              {error}
            </p>
          ) : null}
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
          Add certificates to your cart with other gifts, or buy now — checkout is hosted securely by
          Square.
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
