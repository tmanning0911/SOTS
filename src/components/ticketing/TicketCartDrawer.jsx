import { CartDrawer } from "../checkout/CartDrawer.jsx";
import { TicketCartAside } from "./TicketCartAside.jsx";

export function TicketCartDrawer({
  open,
  onClose,
  groups,
  cartCount,
  cartTotal,
  data,
  cartNotice,
  onDismissNotice,
  onUpdate,
  onRemove,
  onCheckout,
  onClearPerformance,
  onClearCart,
  showImage,
}) {
  if (!open && !cartCount) return null;

  return (
    <CartDrawer open={open} onClose={onClose} title="Your tickets">
      <TicketCartAside
        groups={groups}
        cartCount={cartCount}
        cartTotal={cartTotal}
        data={data}
        cartNotice={cartNotice}
        onDismissNotice={onDismissNotice}
        onUpdate={onUpdate}
        onRemove={onRemove}
        onCheckout={(performanceId) => {
          onClose();
          onCheckout(performanceId);
        }}
        onClearPerformance={onClearPerformance}
        onClearCart={onClearCart}
        showImage={showImage}
        className="sots-shop-cart-aside--drawer"
        showTitle={false}
      />
    </CartDrawer>
  );
}
