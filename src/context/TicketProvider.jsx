import { useCallback, useContext, useMemo, useState } from "react";
import { SITE } from "../../js/data.js";
import { getCheckoutPerformanceId, getTicketingState, getTicketsUrl } from "../../js/ticketing.js";
import { useTicketing } from "../hooks/useTicketing.js";
import { CheckoutModal } from "../components/ticketing/CheckoutModal.jsx";
import { TicketContext } from "./TicketContext.jsx";
import { pauseSmoothScroll, resumeSmoothScroll } from "../polish.js";

export function useTickets() {
  return useContext(TicketContext);
}

export function TicketProvider({ children }) {
  const { data, loading, error, refresh } = useTicketing();
  const [checkoutPerformanceId, setCheckoutPerformanceId] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const ticketsUrl = getTicketsUrl(data, SITE.ticketsUrl);
  const ticketingState = useMemo(() => {
    const state = getTicketingState(data);
    return { ...state, ticketsUrl: state.ticketsUrl ?? ticketsUrl };
  }, [data, ticketsUrl]);

  const handleClose = useCallback(() => {
    setCheckoutOpen(false);
    setCheckoutPerformanceId(null);
    resumeSmoothScroll();
  }, []);

  const openCheckout = useCallback(
    (performanceId) => {
      const id = getCheckoutPerformanceId(data, performanceId ?? ticketingState.defaultEventId);
      if (!id) return;
      setCheckoutPerformanceId(String(id));
      setCheckoutOpen(true);
      pauseSmoothScroll();
    },
    [data, ticketingState.defaultEventId],
  );

  return (
    <TicketContext.Provider
      value={{ data, loading, error, refresh, openCheckout, ticketsUrl, ticketingState }}
    >
      {children}
      <CheckoutModal
        open={checkoutOpen}
        onClose={handleClose}
        data={data}
        performanceId={checkoutPerformanceId}
      />
    </TicketContext.Provider>
  );
}
