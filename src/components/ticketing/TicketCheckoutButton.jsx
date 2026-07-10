import { ArrowButton } from "../ArrowButton.jsx";
import { useTickets } from "../../context/TicketProvider.jsx";
import { TICKETS_CTA_LABEL } from "../../../js/ticketing.js";

export function TicketCheckoutButton({
  label = TICKETS_CTA_LABEL,
  className = "",
  variant = "gold",
  eventId,
  onClick,
  disabled,
  children,
}) {
  const { loading, openCheckout } = useTickets();

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    openCheckout(eventId);
  };

  return (
    <ArrowButton
      type="button"
      variant={variant}
      className={className}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? "Loading…" : (children ?? label)}
    </ArrowButton>
  );
}
