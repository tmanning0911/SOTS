import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { MEDIA } from "../../js/data.js";
import { SHOP_PAGE_PATH } from "../../js/shop.js";
import { CheckoutProgress, SHOP_CHECKOUT_STEPS } from "../components/ticketing/CheckoutProgress.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { ShopCheckoutForm } from "../components/shop/ShopCheckoutForm.jsx";
import { useShop } from "../context/ShopContext.jsx";

function CheckoutSkeleton() {
  return (
    <div className="sots-checkout-page__layout sots-checkout-page__layout--form" aria-busy="true" aria-label="Loading checkout">
      <aside className="sots-checkout-page__summary-pane">
        <div className="sots-checkout-skeleton sots-checkout-skeleton--card" />
      </aside>
      <div className="sots-checkout-page__form-pane">
        <div className="sots-checkout-skeleton sots-checkout-skeleton--line" />
        <div className="sots-checkout-skeleton sots-checkout-skeleton--block" />
        <div className="sots-checkout-skeleton sots-checkout-skeleton--block" />
        <div className="sots-checkout-skeleton sots-checkout-skeleton--block sots-checkout-skeleton--short" />
      </div>
    </div>
  );
}

export function ShopCheckoutPage() {
  const { cart, loading, cartCount, cartTotal } = useShop();

  useEffect(() => {
    document.title = "Checkout - Gift Shop - Shakespeare on the Sound";
  }, []);

  if (!loading && !cart.length) {
    return <Navigate to={SHOP_PAGE_PATH} replace />;
  }

  const heroImage = cart.find((line) => line.image)?.image ?? MEDIA.muchAdoPoster;
  const itemLabel = cartCount === 1 ? "1 item" : `${cartCount} items`;

  return (
    <InnerPageShell showVisit={false} showNewsletter={false}>
      <article className="orpheum-inner-page sots-checkout-page sots-checkout-page--shop">
        <header className="sots-checkout-page__hero sots-checkout-page__hero--slim">
          <div
            className="sots-checkout-page__hero-bg"
            style={{ backgroundImage: `url('${heroImage}')` }}
            aria-hidden="true"
          />
          <div className="sots-checkout-page__hero-veil" aria-hidden="true" />
          <div className="sots-checkout-page__hero-inner">
            <Link to={SHOP_PAGE_PATH} className="sots-checkout-page__back">
              ← Back to gift shop
            </Link>
            <p className="sots-checkout-page__eyebrow">Secure checkout</p>
            <h1 className="sots-checkout-page__hero-title">Gift Shop Checkout</h1>
            <p className="sots-checkout-page__hero-meta">
              {loading ? "Loading your cart…" : `${itemLabel} · Merchandise & gift certificates`}
            </p>
          </div>
        </header>

        <div className="sots-checkout-page__progress-wrap">
          <CheckoutProgress current="delivery" steps={SHOP_CHECKOUT_STEPS} />
        </div>

        <div className="orpheum-inner-page__body sots-checkout-page__body">
          {loading ? (
            <CheckoutSkeleton />
          ) : (
            <ShopCheckoutForm returnHref={SHOP_PAGE_PATH} cartTotal={cartTotal} />
          )}
        </div>
      </article>
    </InnerPageShell>
  );
}
