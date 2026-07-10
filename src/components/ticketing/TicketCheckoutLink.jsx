import { useTickets } from "../../context/TicketProvider.jsx";
import { isTicketCheckoutUrl } from "../../../js/ticketing.js";

export function TicketCheckoutLink({
  href,
  children,
  className = "",
  eventId,
  onClick,
  external,
}) {
  const { openCheckout, ticketsUrl } = useTickets();
  const isTicket = external !== false && isTicketCheckoutUrl(href, ticketsUrl);

  if (isTicket) {
    return (
      <button
        type="button"
        className={className}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) openCheckout(eventId);
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
