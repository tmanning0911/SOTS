import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  formatCents,
  BUNDLED_MERCHANDISE,
  giftCertificateProducts,
  merchandiseCategories,
  merchandiseProducts,
  prefetchShopProductImages,
} from "../../js/shop.js";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { ShopCartDrawer } from "../components/shop/ShopCartDrawer.jsx";
import { ShopGiftCertSpotlight } from "../components/shop/ShopGiftCertSpotlight.jsx";
import { ProductCard } from "../components/shop/ShopProductCard.jsx";
import { useShop } from "../context/ShopContext.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

export function ShopPage() {
  const {
    catalog,
    cart,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useShop();
  const [category, setCategory] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [params] = useSearchParams();
  const thanks = params.get("thanks") === "1";

  usePageMeta("/shop/");

  useEffect(() => {
    prefetchShopProductImages(catalog);
  }, [catalog]);

  useEffect(() => {
    if (thanks) clearCart();
  }, [thanks, clearCart]);

  const giftCertificates = useMemo(() => giftCertificateProducts(catalog), [catalog]);

  const merchandise = useMemo(() => {
    const list = merchandiseProducts(catalog);
    const source = list.length ? list : BUNDLED_MERCHANDISE;
    if (category === "all") return source;
    return source.filter((product) => product.category === category);
  }, [catalog, category]);

  const categories = useMemo(() => {
    const derived = merchandiseCategories(catalog);
    return derived.length > 1 ? derived : merchandiseCategories();
  }, [catalog]);

  return (
    <InnerPageShell showVisit={false} showNewsletter>
      <article className="sots-shop-page">
        <InnerPageHero title="Gift Shop" />

        <nav className="orpheum-page-quick" aria-label="Gift shop shortcuts">
          <a href="#merchandise" className="orpheum-page-quick__link">
            Merchandise
          </a>
          <a href="#gift-certificates" className="orpheum-page-quick__link">
            Gift certificates
          </a>
          <Link to="/tickets/" className="orpheum-page-quick__link">
            Get tickets
          </Link>
        </nav>

        {thanks ? (
          <div className="sots-shop-page__thanks" role="status">
            <p>
              Thank you — if you completed payment, check your email for a receipt. Sized items list
              the size on the order.
            </p>
            <a href="#merchandise" className="sots-shop-text-link">
              Keep shopping
            </a>
          </div>
        ) : null}

        <section
          className="sots-shop-page__catalog"
          id="merchandise"
          aria-labelledby="shop-merch-heading"
        >
          <div className="sots-shop-page__catalog-head">
            <div>
              <p className="orpheum-eyebrow">Merchandise</p>
              <h2 id="shop-merch-heading" className="orpheum-underline-heading">
                Take home the season
              </h2>
            </div>
            <p className="sots-shop-page__catalog-note">
              Mix items in one cart. Pickup at Pinkney Park during performances unless noted.
            </p>
          </div>

          <div className="sots-shop-page__main sots-shop-page__main--full">
            <div className="sots-shop-page__filters" role="group" aria-label="Product categories">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={category === cat.id}
                  className={`sots-shop-page__filter${category === cat.id ? " is-active" : ""}`}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {merchandise.length ? (
              <div className="sots-shop-page__grid">
                {merchandise.map((product, index) => (
                  <ProductCard key={product.id} product={product} priorityImage={index < 4} />
                ))}
              </div>
            ) : (
              <p className="sots-shop-page__empty">
                No products in this category right now. Check back soon!
              </p>
            )}
          </div>
        </section>

        <div id="gift-certificates">
          <ShopGiftCertSpotlight products={giftCertificates} />
        </div>
      </article>

      {cartCount > 0 ? (
        <button
          type="button"
          className="sots-shop-page__cart-bar"
          onClick={() => setCartOpen(true)}
          aria-label={`Open cart, ${cartCount} items`}
        >
          <span className="sots-shop-page__cart-bar-count">{cartCount}</span>
          <span className="sots-shop-page__cart-bar-copy">
            <strong>View cart</strong>
            <span>{formatCents(cartTotal)}</span>
          </span>
          <span className="sots-shop-page__cart-bar-cta">Checkout</span>
        </button>
      ) : null}

      <ShopCartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onUpdate={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={() => setCartOpen(false)}
      />
    </InnerPageShell>
  );
}
