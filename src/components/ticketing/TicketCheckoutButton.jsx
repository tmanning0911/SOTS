import { ArrowButton } from "../ArrowButton.jsx";
import { TICKETS_CTA_LABEL, TICKETS_PAGE_PATH } from "../../../js/ticketing.js";

export function TicketCheckoutButton({
  label = TICKETS_CTA_LABEL,
  className = "",
  variant = "gold",
  eventId,
  onClick,
  disabled,
  children,
}) {
  const href = eventId
    ? `${TICKETS_PAGE_PATH}?perf=${encodeURIComponent(String(eventId))}#dates`
    : `${TICKETS_PAGE_PATH}#dates`;

  return (
    <ArrowButton
      href={href}
      variant={variant}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children ?? label}
    </ArrowButton>
  );
}
