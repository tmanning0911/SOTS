import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { SITE } from "../../js/data.js";
import {
  buildTicketCartLine,
  cartLinesEqual,
  flagOpenTicketCart,
  groupCartByPerformance,
  linesForPerformance,
  maxQtyForTicket,
  primaryCheckoutPerformanceId,
  readStoredTicketCart,
  remapTicketCartLines,
  ticketCartItemCount,
  ticketCartLineKey,
  ticketCartTotalCents,
  writeStoredTicketCart,
} from "../../js/ticket-cart.js";
import {
  getCheckoutPerformanceId,
  getTicketCheckoutPath,
  getTicketingState,
  getTicketsUrl,
  sortTicketTypesForDisplay,
} from "../../js/ticketing.js";
import { useTicketing } from "../hooks/useTicketing.js";
import { TicketContext } from "./TicketContext.jsx";

export function useTickets() {
  return useContext(TicketContext);
}

export function TicketProvider({ children }) {
  const navigate = useNavigate();
  const { data, loading, error, refresh } = useTicketing();
  const [cart, setCart] = useState(() => readStoredTicketCart());
  const [cartNotice, setCartNotice] = useState("");
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const ticketsUrl = getTicketsUrl(data, SITE.ticketsUrl);
  const ticketingState = useMemo(() => {
    const state = getTicketingState(data);
    return { ...state, ticketsUrl: state.ticketsUrl ?? ticketsUrl };
  }, [data, ticketsUrl]);

  useEffect(() => {
    if (!data?.performances?.length) return;
    setCart((prev) => {
      const { cart: next, notices } = remapTicketCartLines(prev, data);
      if (notices.length) {
        setCartNotice(notices[0]);
      }
      return cartLinesEqual(prev, next) ? prev : next;
    });
  }, [data]);

  useEffect(() => {
    writeStoredTicketCart(cart);
  }, [cart]);

  useEffect(() => {
    if (!cartNotice) return undefined;
    const timer = window.setTimeout(() => setCartNotice(""), 6000);
    return () => window.clearTimeout(timer);
  }, [cartNotice]);

  const dismissCartNotice = useCallback(() => setCartNotice(""), []);

  const openCartDrawer = useCallback(() => setCartDrawerOpen(true), []);
  const closeCartDrawer = useCallback(() => setCartDrawerOpen(false), []);

  const addToCart = useCallback(
    (performanceId, items = [], { openDrawer = true } = {}) => {
      if (!data || !performanceId || !items.length) return;
      const performance = data.performances?.find((p) => String(p.id) === String(performanceId));
      if (!performance) return;
      const ticketTypes = sortTicketTypesForDisplay(data.ticketTypes ?? data.ticketClasses ?? []);
      const typeById = new Map(ticketTypes.map((t) => [String(t.id), t]));

      setCart((prev) => {
        let next = [...prev];
        for (const item of items) {
          const ticketType = typeById.get(String(item.ticketTypeId));
          if (!ticketType || !(item.quantity > 0)) continue;
          const max = maxQtyForTicket(performance, ticketType);
          const line = buildTicketCartLine({
            performance,
            ticketType,
            quantity: Math.min(item.quantity, max),
          });
          if (!line) continue;
          const key = ticketCartLineKey(line);
          const existing = next.find((row) => ticketCartLineKey(row) === key);
          if (existing) {
            next = next.map((row) =>
              ticketCartLineKey(row) === key
                ? {
                    ...line,
                    quantity: Math.min(max, existing.quantity + line.quantity),
                  }
                : row,
            );
          } else {
            next = [...next, line];
          }
        }
        return next;
      });

      if (openDrawer) {
        setCartDrawerOpen(true);
        setCartNotice("Tickets added to your cart.");
      }
    },
    [data],
  );

  const buyNow = useCallback(
    (performanceId, items = []) => {
      flushSync(() => {
        addToCart(performanceId, items, { openDrawer: false });
      });
      navigate(getTicketCheckoutPath(performanceId));
    },
    [addToCart, navigate],
  );

  /** Replace all lines for one performance with the given quantities (intentional sync only). */
  const setPerformanceQuantities = useCallback(
    (performanceId, quantities = {}) => {
      if (!data || !performanceId) return;
      const performance = data.performances?.find((p) => String(p.id) === String(performanceId));
      if (!performance) return;
      const ticketTypes = sortTicketTypesForDisplay(data.ticketTypes ?? data.ticketClasses ?? []);

      setCart((prev) => {
        const others = prev.filter((line) => line.performanceId !== String(performanceId));
        const nextLines = [];
        for (const ticketType of ticketTypes) {
          const quantity = quantities[ticketType.id] ?? quantities[String(ticketType.id)] ?? 0;
          if (quantity <= 0) continue;
          const line = buildTicketCartLine({
            performance,
            ticketType,
            quantity,
          });
          if (line) nextLines.push(line);
        }
        const next = [...others, ...nextLines];
        return cartLinesEqual(prev, next) ? prev : next;
      });
    },
    [data],
  );

  const updateQuantity = useCallback(
    (lineKey, quantity) => {
      setCart((prev) => {
        const next = prev
          .map((line) => {
            if (ticketCartLineKey(line) !== lineKey) return line;
            const performance = data?.performances?.find((p) => String(p.id) === line.performanceId);
            const ticketType = (data?.ticketTypes ?? data?.ticketClasses ?? []).find(
              (t) => String(t.id) === String(line.ticketTypeId),
            );
            const max = maxQtyForTicket(performance, ticketType ?? { id: line.ticketTypeId, capacity: 10 });
            const qty = Math.min(max, Math.max(0, quantity));
            return { ...line, quantity: qty };
          })
          .filter((line) => line.quantity > 0);
        return cartLinesEqual(prev, next) ? prev : next;
      });
    },
    [data],
  );

  const removeFromCart = useCallback((lineKey) => {
    setCart((prev) => prev.filter((line) => ticketCartLineKey(line) !== lineKey));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const clearPerformance = useCallback((performanceId) => {
    if (!performanceId) return;
    setCart((prev) => prev.filter((line) => line.performanceId !== String(performanceId)));
  }, []);

  const openCheckout = useCallback(
    (performanceId) => {
      const id = getCheckoutPerformanceId(data, performanceId ?? ticketingState.defaultEventId);
      if (!id) {
        navigate(ticketsUrl);
        return;
      }
      navigate(getTicketCheckoutPath(id));
    },
    [data, ticketingState.defaultEventId, navigate, ticketsUrl],
  );

  const openCartCheckout = useCallback(
    (performanceId) => {
      const id =
        performanceId ||
        primaryCheckoutPerformanceId(cart) ||
        getCheckoutPerformanceId(data, ticketingState.defaultEventId);
      if (!id) {
        navigate(ticketsUrl);
        return;
      }
      setCartDrawerOpen(false);
      navigate(getTicketCheckoutPath(id));
    },
    [cart, data, ticketingState.defaultEventId, navigate, ticketsUrl],
  );

  const saveAndBrowse = useCallback(
    (performanceId, quantities) => {
      setPerformanceQuantities(performanceId, quantities);
      flagOpenTicketCart();
      navigate(ticketsUrl);
    },
    [navigate, setPerformanceQuantities, ticketsUrl],
  );

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
      refresh,
      openCheckout,
      openCartCheckout,
      ticketsUrl,
      ticketingState,
      cart,
      cartCount: ticketCartItemCount(cart),
      cartTotal: ticketCartTotalCents(cart),
      cartGroups: groupCartByPerformance(cart),
      cartNotice,
      dismissCartNotice,
      cartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
      addToCart,
      buyNow,
      setPerformanceQuantities,
      updateQuantity,
      removeFromCart,
      clearCart,
      clearPerformance,
      saveAndBrowse,
      linesForPerformance: (performanceId) => linesForPerformance(cart, performanceId),
    }),
    [
      data,
      loading,
      error,
      refresh,
      openCheckout,
      openCartCheckout,
      ticketsUrl,
      ticketingState,
      cart,
      cartNotice,
      dismissCartNotice,
      cartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
      addToCart,
      buyNow,
      setPerformanceQuantities,
      updateQuantity,
      removeFromCart,
      clearCart,
      clearPerformance,
      saveAndBrowse,
    ],
  );

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
}
