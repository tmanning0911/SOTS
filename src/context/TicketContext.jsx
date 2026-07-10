import { createContext } from "react";

export const TicketContext = createContext({
  data: null,
  loading: true,
  error: null,
  refresh: async () => {},
  openCheckout: () => {},
  ticketsUrl: "/tickets/",
  ticketingState: { canPurchase: false, statusLabel: "", defaultEventId: null, ticketsUrl: "/tickets/" },
});
