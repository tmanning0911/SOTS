import { useEffect } from "react";
import { ShopCartAside } from "./ShopCartAside.jsx";

export function ShopCartDrawer({
  open,
  onClose,
  cart,
  cartCount,
  cartTotal,
  onUpdate,
  onRemove,
  onCheckout,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!cartCount) return null;

  return (
    <div className={`sots-shop-drawer${open ? " is-open" : ""}`} aria-hidden={!open}>
      <button type="button" className="sots-shop-drawer__backdrop" onClick={onClose} aria-label="Close cart" />
      <div className="sots-shop-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="shop-cart-drawer-heading">
        <div className="sots-shop-drawer__head">
          <h2 id="shop-cart-drawer-heading">Your cart</h2>
          <button type="button" className="sots-shop-drawer__close" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>
        <ShopCartAside
          cart={cart}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onCheckout={() => {
            onClose();
            onCheckout();
          }}
          className="sots-shop-cart-aside--drawer"
          showTitle={false}
        />
      </div>
    </div>
  );
}
