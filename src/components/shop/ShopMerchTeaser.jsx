import { Link } from "react-router-dom";
import { BUNDLED_MERCHANDISE, SHOP_PAGE_PATH } from "../../../js/shop.js";
import { ArrowButton } from "../ArrowButton.jsx";
import { ProductCard } from "./ShopProductCard.jsx";

export function ShopMerchTeaser({
  products = BUNDLED_MERCHANDISE,
  limit = 4,
  className = "",
  headingId = "shop-teaser-heading",
}) {
  const items = (products ?? []).slice(0, limit);
  if (!items.length) return null;

  return (
    <section
      className={`sots-shop-teaser${className ? ` ${className}` : ""}`}
      aria-labelledby={headingId}
    >
      <div className="sots-shop-teaser__head">
        <div>
          <p className="orpheum-eyebrow">Merchandise</p>
          <h2 id={headingId} className="orpheum-underline-heading">
            Souvenirs &amp; keepsakes
          </h2>
          <p className="sots-shop-teaser__lead">
            Choose a quantity or add several items to your cart, then pick up at the park.
          </p>
        </div>
        <ArrowButton href={SHOP_PAGE_PATH}>Browse gift shop</ArrowButton>
      </div>
      <div className="sots-shop-teaser__grid">
        {items.map((product, index) => (
          <ProductCard key={product.id} product={product} priorityImage={index < 4} />
        ))}
      </div>
      <p className="sots-shop-teaser__foot">
        <Link to={SHOP_PAGE_PATH} className="sots-shop-btn sots-shop-btn--outline">
          View all merchandise
        </Link>
      </p>
    </section>
  );
}
