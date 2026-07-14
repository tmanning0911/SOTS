import { CartDrawer } from "../checkout/CartDrawer.jsx";
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
  if (!open && !cartCount) return null;

  return (
    <CartDrawer open={open} onClose={onClose} title="Your cart">
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
    </CartDrawer>
  );
}
