import { ArrowButton } from "../ArrowButton.jsx";
import { useTickets } from "../../context/TicketProvider.jsx";
import { TICKETS_CTA_LABEL, TICKETS_PAGE_PATH } from "../../../js/ticketing.js";

export function TicketCheckoutButton({
  label = TICKETS_CTA_LABEL,
  className = "",
  variant = "gold",
  eventId,
  checkout = false,
  onClick,
  disabled,
  children,
}) {
  const { loading, openCheckout } = useTickets();
  const openModal = checkout || Boolean(eventId);

  if (!openModal) {
    return (
      <ArrowButton
        href={TICKETS_PAGE_PATH}
        variant={variant}
        className={className}
        onClick={onClick}
        disabled={disabled}
        aria-busy={loading || undefined}
      >
        {loading ? "Loading…" : (children ?? label)}
      </ArrowButton>
    );
  }

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
