import { Navigate } from "react-router-dom";
import { SHOP_PAGE_PATH } from "../../js/shop.js";

/** On-site shop checkout is retired — Buy uses Square Payment Links from /shop/. */
export function ShopCheckoutPage() {
  return <Navigate to={SHOP_PAGE_PATH} replace />;
}
