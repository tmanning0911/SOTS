import { Link } from "react-router-dom";
import { isTicketCheckoutUrl, getTicketCheckoutPath, TICKETS_PAGE_PATH } from "../../../js/ticketing.js";

export function TicketCheckoutLink({
  href,
  children,
  className = "",
  eventId,
  onClick,
  external,
}) {
  const isTicket = isTicketCheckoutUrl(href, TICKETS_PAGE_PATH);

  if (isTicket) {
    const to = eventId ? getTicketCheckoutPath(eventId) : TICKETS_PAGE_PATH;
    return (
      <Link to={to} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
