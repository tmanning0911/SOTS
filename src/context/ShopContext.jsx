import { createContext, useContext } from "react";

export const ShopContext = createContext({
  catalog: null,
  loading: true,
  cart: [],
  cartCount: 0,
  cartTotal: 0,
  addToCart: () => {},
  buyNow: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  openCheckout: () => {},
});

export function useShop() {
  return useContext(ShopContext);
}
