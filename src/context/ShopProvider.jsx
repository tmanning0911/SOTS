import { useCallback, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  cartItemCount,
  cartTotalCents,
  INITIAL_SHOP_CATALOG,
  loadShopCatalog,
  remapCartLines,
  prefetchShopProductImages,
  SHOP_PAGE_PATH,
} from "../../js/shop.js";
import { ShopContext } from "./ShopContext.jsx";

const CART_KEY = "sots-shop-cart";

function readStoredCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const cart = raw ? JSON.parse(raw) : [];
    return remapCartLines(cart, INITIAL_SHOP_CATALOG);
  } catch {
    return [];
  }
}

export function ShopProvider({ children }) {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState(INITIAL_SHOP_CATALOG);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(() => readStoredCart());

  useEffect(() => {
    prefetchShopProductImages();
    let cancelled = false;
    loadShopCatalog()
      .then((data) => {
        if (cancelled || !data?.products?.length) return;
        setCatalog(data);
        setCart((prev) => remapCartLines(prev, data));
        prefetchShopProductImages(data);
      })
      .catch(() => {
        /* bundled catalog already shown */
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

  const refreshCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loadShopCatalog({ fresh: true });
      if (data) {
        setCatalog(data);
        setCart((prev) => remapCartLines(prev, data));
      }
    } finally {
      setLoading(false);
    }
  }, []);

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
          sku: product.sku,
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

  const buyNow = useCallback(
    (product, { quantity = 1, option } = {}) => {
      flushSync(() => {
        addToCart(product, { quantity, option });
      });
      navigate(SHOP_PAGE_PATH);
    },
    [addToCart, navigate],
  );

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
    navigate(SHOP_PAGE_PATH);
  }, [navigate]);

  const value = useMemo(
    () => ({
      catalog,
      loading,
      cart,
      cartCount: cartItemCount(cart),
      cartTotal: cartTotalCents(cart),
      addToCart,
      buyNow,
      updateQuantity,
      removeFromCart,
      clearCart,
      openCheckout,
      refreshCatalog,
    }),
    [
      catalog,
      loading,
      cart,
      addToCart,
      buyNow,
      updateQuantity,
      removeFromCart,
      clearCart,
      openCheckout,
      refreshCatalog,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
