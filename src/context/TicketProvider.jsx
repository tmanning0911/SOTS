import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { SITE } from "../../js/data.js";
import { getDefaultCheckoutEventId, getTicketingState, getTicketsUrl } from "../../js/ticketing.js";
import { useEventbrite } from "../hooks/useEventbrite.js";
import { EventbriteCheckout } from "../components/ticketing/EventbriteCheckout.jsx";

const GLOBAL_TRIGGER_ID = "sots-global-ticket-trigger";

const TicketContext = createContext({
  data: null,
  loading: true,
  error: null,
  refresh: async () => {},
  openCheckout: () => {},
  ticketsUrl: SITE.ticketsUrl,
  ticketingState: { canPurchase: false, statusLabel: "", defaultEventId: null, ticketsUrl: SITE.ticketsUrl },
});

export function useTickets() {
  return useContext(TicketContext);
}

export function TicketProvider({ children }) {
  const { data, loading, error, refresh } = useEventbrite();
  const [checkoutEventId, setCheckoutEventId] = useState(null);
  const [widgetEpoch, setWidgetEpoch] = useState(0);

  const ticketsUrl = getTicketsUrl(data, SITE.ticketsUrl);
  const ticketingState = useMemo(() => {
    const state = getTicketingState(data);
    return { ...state, ticketsUrl: state.ticketsUrl ?? ticketsUrl };
  }, [data, ticketsUrl]);

  const openCheckout = useCallback(
    (eventId) => {
      const id = eventId ?? ticketingState.defaultEventId;
      if (!id) {
        if (ticketsUrl) window.open(ticketsUrl, "_blank", "noopener,noreferrer");
        return;
      }
      setCheckoutEventId(String(id));
      setWidgetEpoch((n) => n + 1);
      requestAnimationFrame(() => {
        document.getElementById(GLOBAL_TRIGGER_ID)?.click();
      });
    },
    [ticketingState.defaultEventId, ticketsUrl],
  );

  const handleCheckoutError = useCallback(() => {
    if (ticketsUrl) window.open(ticketsUrl, "_blank", "noopener,noreferrer");
  }, [ticketsUrl]);

  const activeEventId = checkoutEventId ?? ticketingState.defaultEventId;

  return (
    <TicketContext.Provider
      value={{ data, loading, error, refresh, openCheckout, ticketsUrl, ticketingState }}
    >
      {children}
      {activeEventId ? (
        <>
          <button
            type="button"
            id={GLOBAL_TRIGGER_ID}
            hidden
            aria-hidden="true"
            tabIndex={-1}
          />
          <EventbriteCheckout
            key={`${activeEventId}-${widgetEpoch}`}
            eventId={activeEventId}
            modal
            triggerElementId={GLOBAL_TRIGGER_ID}
            onError={handleCheckoutError}
          />
        </>
      ) : null}
    </TicketContext.Provider>
  );
}
