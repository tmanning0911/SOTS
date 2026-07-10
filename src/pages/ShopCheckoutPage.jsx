import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { SHOP_PAGE_PATH } from "../../js/shop.js";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { ShopCheckoutForm } from "../components/shop/ShopCheckoutForm.jsx";
import { useShop } from "../context/ShopContext.jsx";

export function ShopCheckoutPage() {
  const { cart, loading } = useShop();

  useEffect(() => {
    document.title = "Checkout - Gift Shop - Shakespeare on the Sound";
  }, []);

  if (!loading && !cart.length) {
    return <Navigate to={SHOP_PAGE_PATH} replace />;
  }

  return (
    <InnerPageShell showVisit={false} showNewsletter={false}>
      <article className="orpheum-inner-page sots-checkout-page sots-checkout-page--shop">
        <div className="sots-checkout-page__top">
          <nav className="sots-checkout-page__breadcrumb" aria-label="Breadcrumb">
            <Link to={SHOP_PAGE_PATH}>Gift Shop</Link>
            <span aria-hidden="true">/</span>
            <span>Checkout</span>
          </nav>
          <h1 className="sots-checkout-page__title">Checkout</h1>
        </div>

        <div className="orpheum-inner-page__body sots-checkout-page__body">
          {loading ? (
            <div className="sots-ticketing-loading">
              <p>Loading…</p>
            </div>
          ) : (
            <ShopCheckoutForm returnHref={SHOP_PAGE_PATH} />
          )}
        </div>
      </article>
    </InnerPageShell>
  );
}
