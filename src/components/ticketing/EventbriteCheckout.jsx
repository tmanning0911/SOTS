import { useEffect } from "react";
import {
  closeEventbriteModal,
  ensureEventbriteCheckoutWidget,
  isEventbriteModalOpen,
} from "../../../js/eventbrite-widget.js";

export { closeEventbriteModal, isEventbriteModalOpen };

export function EventbriteCheckout({
  eventId,
  triggerElementId,
  onOrderComplete,
  onWidgetModalClose,
  onError,
}) {
  useEffect(() => {
    if (!eventId || !triggerElementId) return undefined;
    let cancelled = false;

    ensureEventbriteCheckoutWidget({
      eventId,
      triggerElementId,
      onOrderComplete,
      onWidgetModalClose,
    }).catch((err) => {
      if (!cancelled) onError?.(err);
    });

    return () => {
      cancelled = true;
    };
  }, [eventId, triggerElementId, onOrderComplete, onWidgetModalClose, onError]);

  return null;
}
