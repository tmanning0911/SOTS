import { useCallback, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SITE } from "../../js/data.js";
import { getCheckoutPerformanceId, getTicketCheckoutPath, getTicketingState, getTicketsUrl } from "../../js/ticketing.js";
import { useTicketing } from "../hooks/useTicketing.js";
import { TicketContext } from "./TicketContext.jsx";

export function useTickets() {
  return useContext(TicketContext);
}

export function TicketProvider({ children }) {
  const navigate = useNavigate();
  const { data, loading, error, refresh } = useTicketing();

  const ticketsUrl = getTicketsUrl(data, SITE.ticketsUrl);
  const ticketingState = useMemo(() => {
    const state = getTicketingState(data);
    return { ...state, ticketsUrl: state.ticketsUrl ?? ticketsUrl };
  }, [data, ticketsUrl]);

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

  return (
    <TicketContext.Provider
      value={{ data, loading, error, refresh, openCheckout, ticketsUrl, ticketingState }}
    >
      {children}
    </TicketContext.Provider>
  );
}
