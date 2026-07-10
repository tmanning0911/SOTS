import { useEffect } from "react";

const WIDGET_SRC = "https://www.eventbrite.com/static/widgets/eb_widgets.js";

let widgetScriptPromise = null;

function loadWidgetScript() {
  if (typeof window !== "undefined" && window.EBWidgets) {
    return Promise.resolve();
  }
  if (widgetScriptPromise) return widgetScriptPromise;

  widgetScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${WIDGET_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });

  return widgetScriptPromise;
}

const THEME = {
  primary: "#0f2d4d",
  secondary: "#1a5090",
};

export function EventbriteCheckout({
  eventId,
  modal = true,
  triggerElementId,
  iframeContainerId,
  onOrderComplete,
  onError,
}) {
  useEffect(() => {
    if (!eventId) return undefined;
    let cancelled = false;

    loadWidgetScript()
      .then(() => {
        if (cancelled || !window.EBWidgets) return;
        window.EBWidgets.createWidget({
          widgetType: "checkout",
          eventId: String(eventId),
          modal,
          modalTriggerElementId: triggerElementId,
          iframeContainerId,
          iframeAutoAdapt: 100,
          themeSettings: THEME,
          onOrderComplete: onOrderComplete ?? (() => {}),
        });
      })
      .catch((err) => {
        if (!cancelled) onError?.(err);
      });

    return () => {
      cancelled = true;
    };
  }, [eventId, modal, triggerElementId, iframeContainerId, onOrderComplete, onError]);

  return null;
}
