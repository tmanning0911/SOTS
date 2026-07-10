import { createPortal } from "react-dom";
import { closeEventbriteModal } from "../../../js/eventbrite-widget.js";

export function EventbriteModalClose({ open, eventId, onClose }) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <button
      type="button"
      className="sots-eb-modal-close"
      aria-label="Close ticket checkout"
      onClick={() => {
        closeEventbriteModal(eventId);
        onClose?.();
      }}
    >
      <span aria-hidden="true">&times;</span>
    </button>,
    document.body,
  );
}
