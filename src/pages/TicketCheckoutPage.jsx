import { Navigate, useParams } from "react-router-dom";
import { getTicketCheckoutPath, TICKETS_PAGE_PATH } from "../../js/ticketing.js";

/** On-site ticket checkout is retired — Buy uses Square Payment Links from /tickets/. */
export function TicketCheckoutPage() {
  const { performanceId } = useParams();
  const to = performanceId ? getTicketCheckoutPath(performanceId) : TICKETS_PAGE_PATH;
  return <Navigate to={to} replace />;
}
