import { normalizeStatusLabel, ticketStatusLabel } from "../../../js/ticketing.js";

const TONE = {
  "On Sale": "on-sale",
  Ended: "ended",
  "Coming Soon": "soon",
  Cancelled: "ended",
  Unavailable: "ended",
};

const HIDDEN_MARKETING_LABELS = new Set(["Unavailable", "Ended", "Cancelled"]);

export function TicketStatusBadge({ status, className = "", marketingOnly = false }) {
  if (!status) return null;
  const label =
    typeof status === "string"
      ? normalizeStatusLabel(status) || status
      : ticketStatusLabel(status);
  if (!label) return null;
  if (marketingOnly && HIDDEN_MARKETING_LABELS.has(label)) return null;
  const tone = TONE[label] ?? "default";
  return (
    <span className={`sots-ticket-badge sots-ticket-badge--${tone} ${className}`.trim()}>
      {label}
    </span>
  );
}
