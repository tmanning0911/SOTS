import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { heroImageForHref } from "../../js/page-heroes.js";
import {
  formatCents,
  BUNDLED_MERCHANDISE,
  giftCertificateProducts,
  merchandiseCategories,
  merchandiseProducts,
  prefetchShopProductImages,
} from "../../js/shop.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { ShopCartAside } from "../components/shop/ShopCartAside.jsx";
import { ShopCartDrawer } from "../components/shop/ShopCartDrawer.jsx";
import { ShopGiftCertSpotlight } from "../components/shop/ShopGiftCertSpotlight.jsx";
import { ProductCard } from "../components/shop/ShopProductCard.jsx";
import { useShop } from "../context/ShopContext.jsx";

export function ShopPage() {
  const {
    catalog,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    buyNow,
    updateQuantity,
    removeFromCart,
    openCheckout,
  } = useShop();
  const [category, setCategory] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    document.title = "Gift Shop - Shakespeare on the Sound";
    prefetchShopProductImages(catalog);
  }, [catalog]);

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

  const heroImage = heroImageForHref("/shop/");

  return (
    <InnerPageShell showVisit showNewsletter>
      <article className="sots-shop-page">
        <header className="sots-shop-page__hero">
          <div className="sots-shop-page__hero-bg" style={{ backgroundImage: `url('${heroImage}')` }} aria-hidden="true" />
          <div className="sots-shop-page__hero-veil" aria-hidden="true" />
          <div className="sots-shop-page__hero-inner" data-reveal>
            <p className="sots-shop-page__hero-eyebrow">Support SOS</p>
            <h1>Gift Shop</h1>
            <p className="sots-shop-page__hero-lead">
              Take home a piece of Shakespeare in Pinkney Park — merchandise, playbills, and gift certificates that support
              free Shakespeare in Fairfield County.
            </p>
          </div>
        </header>

        <nav className="sots-shop-page__quick" aria-label="Gift shop shortcuts">
          <a href="#gift-certificates" className="sots-shop-page__quick-link">
            Gift certificates
          </a>
          <a href="#merchandise" className="sots-shop-page__quick-link">
            Merchandise
          </a>
          <Link to="/tickets/" className="sots-shop-page__quick-link">
            Get tickets
          </Link>
          <Link to="/about/visit/" className="sots-shop-page__quick-link">
            Plan your visit
          </Link>
        </nav>

        <div id="gift-certificates">
          <ShopGiftCertSpotlight products={giftCertificates} onAdd={addToCart} onBuyNow={buyNow} />
        </div>

        <section className="sots-shop-page__catalog" id="merchandise" aria-labelledby="shop-merch-heading">
          <div className="sots-shop-page__catalog-head">
            <div>
              <p className="sots-shop-page__section-eyebrow">Merchandise</p>
              <h2 id="shop-merch-heading">Souvenirs &amp; keepsakes</h2>
            </div>
            {catalog?.fulfillment ? (
              <p className="sots-shop-page__catalog-note">{catalog.fulfillment.pickup}</p>
            ) : null}
          </div>

          <div className="sots-shop-page__layout sots-shop-page__layout--instant">
            <div className="sots-shop-page__main">
              <div className="sots-shop-page__filters" role="tablist" aria-label="Product categories">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={category === cat.id}
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
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAdd={addToCart}
                      onBuyNow={buyNow}
                      priorityImage={index < 4}
                    />
                  ))}
                </div>
              ) : (
                <p className="sots-shop-page__empty">No products in this category right now. Check back soon!</p>
              )}

              <section className="sots-shop-page__cross-sell" aria-labelledby="shop-tickets-heading">
                <div>
                  <p className="sots-shop-page__section-eyebrow">This summer</p>
                  <h2 id="shop-tickets-heading">Going to the show?</h2>
                  <p>Pair your gift with tickets to Much Ado About Nothing under the stars at Shakespeare in Pinkney Park.</p>
                </div>
                <ArrowButton href="/tickets/">Get tickets</ArrowButton>
              </section>

              <aside className="sots-shop-page__picnic" aria-labelledby="shop-picnic-heading">
                <div>
                  <h2 id="shop-picnic-heading">Picnic before the show</h2>
                  <p>
                    A pre-show picnic is a cherished SOS tradition. See our visit guide for parking, accessibility,
                    and local dining favorites in Rowayton.
                  </p>
                </div>
                <ArrowButton href="/about/visit/" variant="light">
                  Plan your visit
                </ArrowButton>
              </aside>
            </div>

            <ShopCartAside
              cart={cart}
              cartCount={cartCount}
              cartTotal={cartTotal}
              onUpdate={updateQuantity}
              onRemove={removeFromCart}
              onCheckout={openCheckout}
              className="sots-shop-cart-aside--desktop"
            />
          </div>
        </section>
      </article>

      {cartCount > 0 ? (
        <button
          type="button"
          className="sots-shop-page__cart-fab"
          onClick={() => setCartOpen(true)}
          aria-label={`Open cart, ${cartCount} items`}
        >
          <span className="sots-shop-page__cart-fab-count">{cartCount}</span>
          <span className="sots-shop-page__cart-fab-copy">
            <strong>View cart</strong>
            <span>{formatCents(cartTotal)}</span>
          </span>
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
        onCheckout={openCheckout}
      />
    </InnerPageShell>
  );
}
