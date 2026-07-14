import { MEDIA } from "../../../js/data.js";

export function ShopGiftCertSpotlight({ products, onAdd, onBuyNow }) {
  if (!products?.length) return null;

  return (
    <section className="sots-shop-spotlight" aria-labelledby="shop-gift-cert-heading">
      <div className="sots-shop-spotlight__band">
        <div className="sots-shop-spotlight__visual" aria-hidden="true">
          <img src={MEDIA.heroHome} alt="" loading="eager" width={640} height={400} />
        </div>
        <div className="sots-shop-spotlight__copy">
          <p className="sots-shop-spotlight__eyebrow">Digital delivery</p>
          <h2 id="shop-gift-cert-heading">Give the gift of Shakespeare</h2>
          <p className="sots-shop-spotlight__lead">
            Gift certificates are emailed within one business day and can be used toward any Shakespeare on
            the Sound performance.
          </p>
          <ul className="sots-shop-spotlight__options">
            {products.map((product) => (
              <li key={product.id}>
                <div className="sots-shop-spotlight__option">
                  <div>
                    <strong>{product.price?.display}</strong>
                    <span>{product.description}</span>
                  </div>
                  <div className="sots-shop-spotlight__option-actions">
                    <button type="button" className="sots-shop-btn sots-shop-btn--block" onClick={() => onAdd(product)}>
                      Add to cart
                    </button>
                    <button type="button" className="sots-shop-btn sots-shop-btn--outline sots-shop-btn--block" onClick={() => onBuyNow(product)}>
                      Buy now
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
