import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { heroImageForHref } from "../../js/page-heroes.js";
import { formatCents } from "../../js/shop.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { ProductCard, ShopCartPanel } from "../components/shop/ShopProductCard.jsx";
import { useShop } from "../context/ShopContext.jsx";

export function ShopPage() {
  const {
    catalog,
    loading,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    openCheckout,
  } = useShop();
  const [category, setCategory] = useState("all");

  useEffect(() => {
    document.title = "Gift Shop - Shakespeare on the Sound";
  }, []);

  const products = useMemo(() => {
    const list = catalog?.products ?? [];
    if (category === "all") return list;
    return list.filter((p) => p.category === category);
  }, [catalog, category]);

  const categories = useMemo(() => {
    const cats = catalog?.categories ?? [];
    return [{ id: "all", label: "All" }, ...cats];
  }, [catalog]);

  return (
    <InnerPageShell showVisit showNewsletter>
      <article className="orpheum-inner-page sots-shop-page">
        <InnerPageHero
          className="sots-shop-page__hero"
          eyebrow="Support SOS"
          title="Gift Shop"
          intro="Merchandise, playbills, and gift certificates — plus our favorite Rowayton spots for a pre-show picnic or dinner."
          image={heroImageForHref("/shop/")}
          actions={
            <>
              <ArrowButton href="/tickets/">Get Tickets</ArrowButton>
              <ArrowButton href="/support/donate/" variant="ghost">
                Donate
              </ArrowButton>
            </>
          }
        />

        <div className="orpheum-inner-page__body">
          <div className="sots-shop-page__layout" data-reveal>
            <div className="sots-shop-page__main">
              {catalog?.fulfillment ? (
                <div className="sots-shop-page__fulfillment">
                  <p>{catalog.fulfillment.pickup}</p>
                  <p>{catalog.fulfillment.giftCertificates}</p>
                </div>
              ) : null}

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

              {loading ? (
                <p className="sots-ticketing-loading">Loading gift shop…</p>
              ) : products.length ? (
                <div className="sots-shop-page__grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} onAdd={addToCart} />
                  ))}
                </div>
              ) : (
                <p>No products in this category right now. Check back soon!</p>
              )}

              {catalog?.shopAndDine?.length ? (
                <section className="sots-shop-page__dine" aria-labelledby="shop-dine-heading">
                  <h2 id="shop-dine-heading">Shop &amp; Dine</h2>
                  <p className="sots-shop-page__dine-lead">
                    Picnicking before the show is a cherished SOS tradition. These local partners are favorites
                    for pre-show meals and picnic baskets.
                  </p>
                  <ul className="sots-shop-page__dine-list">
                    {catalog.shopAndDine.map((partner) => (
                      <li key={partner.id}>
                        <a
                          href={partner.href}
                          className="sots-shop-page__dine-card"
                          {...(partner.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          <strong>{partner.name}</strong>
                          <span>{partner.location}</span>
                          <p>{partner.description}</p>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            <aside className="sots-shop-page__cart" aria-labelledby="shop-cart-heading">
              <div className="sots-shop-page__cart-inner">
                <h2 id="shop-cart-heading">
                  Your cart {cartCount ? <span className="sots-shop-page__cart-count">{cartCount}</span> : null}
                </h2>
                <ShopCartPanel
                  cart={cart}
                  cartTotal={cartTotal}
                  onUpdate={updateQuantity}
                  onRemove={removeFromCart}
                  onCheckout={openCheckout}
                />
                {cartTotal > 0 ? (
                  <p className="sots-shop-page__cart-note">Subtotal {formatCents(cartTotal)} · taxes at checkout</p>
                ) : null}
                <p className="sots-checkout__hint">
                  Questions? <Link to="/about/contact/">Contact the box office</Link>.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </InnerPageShell>
  );
}
