import { createContext, useContext } from "react";
import { INITIAL_SHOP_CATALOG } from "../../js/shop.js";

export const ShopContext = createContext({
  catalog: INITIAL_SHOP_CATALOG,
  loading: false,
  cart: [],
  cartCount: 0,
  cartTotal: 0,
  addToCart: () => {},
  buyNow: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  openCheckout: () => {},
  refreshCatalog: async () => {},
});

export function useShop() {
  return useContext(ShopContext);
}
