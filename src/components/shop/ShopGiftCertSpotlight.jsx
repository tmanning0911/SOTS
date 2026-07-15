import { useState } from "react";
import { MEDIA } from "../../../js/data.js";
import { openPaymentLinkCheckout } from "../../../js/payment-link-checkout.js";
import { QtyStepper, useBuyBusy } from "../checkout/QtyStepper.jsx";
import { useShop } from "../../context/ShopContext.jsx";

function GiftCertRow({ product }) {
  const { addToCart } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { busy, error, runBuy } = useBuyBusy();

  return (
    <li>
      <div className="sots-shop-spotlight__option">
        <div>
          <strong>{product.price?.display}</strong>
          <span>{product.description}</span>
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
            className={`sots-shop-btn sots-shop-btn--block${added ? " sots-shop-btn--added" : ""}`}
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
            className="sots-shop-btn sots-shop-btn--outline sots-shop-btn--block"
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
            {busy ? "Starting…" : "Buy now"}
          </button>
          {error ? <p className="sots-shop-card__error">{error}</p> : null}
        </div>
      </div>
    </li>
  );
}

export function ShopGiftCertSpotlight({ products }) {
  if (!products?.length) return null;

  return (
    <section className="sots-shop-spotlight" aria-labelledby="shop-gift-cert-heading">
      <div className="sots-shop-spotlight__band">
        <div className="sots-shop-spotlight__visual" aria-hidden="true">
          <img src={MEDIA.heroHome} alt="" loading="eager" width={640} height={400} />
        </div>
        <div className="sots-shop-spotlight__copy">
          <p className="orpheum-eyebrow">Digital delivery</p>
          <h2 id="shop-gift-cert-heading" className="orpheum-underline-heading">
            Give the gift of Shakespeare
          </h2>
          <p className="sots-shop-spotlight__lead">
            Choose a quantity, add certificates to your cart with other gifts, or buy now — checkout is
            hosted securely by Square.
          </p>
          <ul className="sots-shop-spotlight__options">
            {products.map((product) => (
              <GiftCertRow key={product.id} product={product} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
