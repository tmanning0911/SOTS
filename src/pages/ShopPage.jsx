import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  formatCents,
  BUNDLED_MERCHANDISE,
  giftCertificateProducts,
  merchandiseCategories,
  merchandiseProducts,
  prefetchShopProductImages,
  shopFeatureGiftCertificatesFirst,
} from "../../js/shop.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
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
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useShop();
  const [category, setCategory] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [params] = useSearchParams();
  const thanks = params.get("thanks") === "1";

  useEffect(() => {
    document.title = "Gift Shop - Shakespeare on the Sound";
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

  const giftCertificatesFirst = shopFeatureGiftCertificatesFirst();

  const giftCertSection = (
    <div id="gift-certificates" key="gift-certificates">
      <ShopGiftCertSpotlight products={giftCertificates} />
    </div>
  );

  const merchandiseSection = (
    <section
      className="sots-shop-page__catalog"
      id="merchandise"
      key="merchandise"
      aria-labelledby="shop-merch-heading"
    >
      <div className="sots-shop-page__catalog-head">
        <div>
          <p className="orpheum-eyebrow">Merchandise</p>
          <h2 id="shop-merch-heading" className="orpheum-underline-heading">
            Souvenirs &amp; keepsakes
          </h2>
        </div>
        <p className="sots-shop-page__catalog-note">
          Choose quantities, mix items in your cart, then checkout once with Square. Pickup at
          Shakespeare in Pinkney Park during performances unless noted.
        </p>
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
                <ProductCard key={product.id} product={product} priorityImage={index < 4} />
              ))}
            </div>
          ) : (
            <p className="sots-shop-page__empty">No products in this category right now. Check back soon!</p>
          )}

          <section className="sots-shop-page__cross-sell" aria-labelledby="shop-tickets-heading">
            <div>
              <p className="orpheum-eyebrow">This summer</p>
              <h2 id="shop-tickets-heading" className="orpheum-underline-heading">
                Going to the show?
              </h2>
              <p>
                Pair your gift with tickets to Much Ado About Nothing under the stars at Shakespeare in
                Pinkney Park.
              </p>
            </div>
            <ArrowButton href="/tickets/">Get tickets</ArrowButton>
          </section>

          <aside className="sots-shop-page__picnic" aria-labelledby="shop-picnic-heading">
            <div>
              <h2 id="shop-picnic-heading">Picnic before the show</h2>
              <p>
                A pre-show picnic is a cherished SOS tradition. See our visit guide for parking,
                accessibility, and local dining favorites in Rowayton.
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
          className="sots-shop-cart-aside--desktop"
        />
      </div>
    </section>
  );

  return (
    <InnerPageShell showVisit showNewsletter>
      <article className="sots-shop-page">
        <InnerPageHero title="Gift Shop" />

        {thanks ? (
          <div className="sots-shop-page__thanks" role="status">
            <p>
              Thank you — your payment was received. Square will email your receipt shortly. Sized items
              list the size on the Square order.
            </p>
            <a href="#merchandise" className="sots-shop-text-link">
              Keep shopping
            </a>
          </div>
        ) : null}

        <nav className="orpheum-page-quick" aria-label="Gift shop shortcuts">
          {giftCertificatesFirst ? (
            <>
              <a href="#gift-certificates" className="orpheum-page-quick__link">
                Gift certificates
              </a>
              <a href="#merchandise" className="orpheum-page-quick__link">
                Merchandise
              </a>
            </>
          ) : (
            <>
              <a href="#merchandise" className="orpheum-page-quick__link">
                Merchandise
              </a>
              <a href="#gift-certificates" className="orpheum-page-quick__link">
                Gift certificates
              </a>
            </>
          )}
          <Link to="/tickets/" className="orpheum-page-quick__link">
            Get tickets
          </Link>
          <Link to="/about/visit/" className="orpheum-page-quick__link">
            Plan your visit
          </Link>
        </nav>

        {giftCertificatesFirst ? (
          <>
            {giftCertSection}
            {merchandiseSection}
          </>
        ) : (
          <>
            {merchandiseSection}
            {giftCertSection}
          </>
        )}
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
        onCheckout={() => setCartOpen(false)}
      />
    </InnerPageShell>
  );
}
