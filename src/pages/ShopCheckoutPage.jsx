import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { MEDIA } from "../../js/data.js";
import { SHOP_PAGE_PATH } from "../../js/shop.js";
import { CheckoutProgress, SHOP_CHECKOUT_STEPS } from "../components/ticketing/CheckoutProgress.jsx";
import { ShopCheckoutForm } from "../components/shop/ShopCheckoutForm.jsx";
import { useShop } from "../context/ShopContext.jsx";

function CheckoutSkeleton() {
  return (
    <div className="sots-co__skeleton" aria-busy="true" aria-label="Loading checkout">
      <div className="sots-checkout-skeleton sots-checkout-skeleton--block" />
      <div className="sots-checkout-skeleton sots-checkout-skeleton--block" />
      <div className="sots-checkout-skeleton sots-checkout-skeleton--block sots-checkout-skeleton--short" />
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
    <div className="sots-co">
      <header className="sots-co__header">
        <div className="sots-co__header-inner">
          <Link to={SHOP_PAGE_PATH} className="sots-co__back">
            ← Back to gift shop
          </Link>
          <div className="sots-co__header-row">
            <div className="sots-co__header-copy">
              <p className="sots-co__eyebrow">Secure checkout</p>
              <h1 className="sots-co__title">Gift Shop</h1>
              <p className="sots-co__meta">
                {loading ? "Loading your cart…" : `${itemLabel} · Merchandise & gift certificates`}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="sots-co__progress-wrap">
        <CheckoutProgress current="delivery" steps={SHOP_CHECKOUT_STEPS} />
      </div>

      {loading ? (
        <CheckoutSkeleton />
      ) : (
        <ShopCheckoutForm returnHref={SHOP_PAGE_PATH} cartTotal={cartTotal} featuredImage={heroImage} />
      )}
    </div>
  );
}
