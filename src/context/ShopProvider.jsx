import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  cartItemCount,
  cartTotalCents,
  getShopCheckoutPath,
  loadShopCatalog,
} from "../../js/shop.js";
import { ShopContext } from "./ShopContext.jsx";

const CART_KEY = "sots-shop-cart";

function readStoredCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function ShopProvider({ children }) {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => readStoredCart());

  useEffect(() => {
    let cancelled = false;
    loadShopCatalog()
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* private mode */
    }
  }, [cart]);

  const addToCart = useCallback((product, { quantity = 1, option } = {}) => {
    setCart((prev) => {
      const key = `${product.id}:${option ?? ""}`;
      const existing = prev.find((line) => `${line.id}:${line.option ?? ""}` === key);
      if (existing) {
        return prev.map((line) =>
          `${line.id}:${line.option ?? ""}` === key
            ? { ...line, quantity: Math.min(10, line.quantity + quantity) }
            : line,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          digital: product.digital,
          option,
          quantity: Math.min(10, quantity),
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((lineKey, quantity) => {
    setCart((prev) =>
      prev
        .map((line) => {
          const key = `${line.id}:${line.option ?? ""}`;
          if (key !== lineKey) return line;
          return { ...line, quantity };
        })
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((lineKey) => {
    setCart((prev) => prev.filter((line) => `${line.id}:${line.option ?? ""}` !== lineKey));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const openCheckout = useCallback(() => {
    navigate(getShopCheckoutPath());
  }, [navigate]);

  const value = useMemo(
    () => ({
      catalog,
      loading,
      cart,
      cartCount: cartItemCount(cart),
      cartTotal: cartTotalCents(cart),
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      openCheckout,
    }),
    [catalog, loading, cart, addToCart, updateQuantity, removeFromCart, clearCart, openCheckout],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
