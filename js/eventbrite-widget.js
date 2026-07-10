const WIDGET_SRC = "https://www.eventbrite.com/static/widgets/eb_widgets.js";

const THEME = {
  primary: "#0f2d4d",
  secondary: "#1a5090",
};

let widgetScriptPromise = null;
const initializedEventIds = new Set();

export function loadEventbriteWidgetScript() {
  if (typeof window !== "undefined" && window.EBWidgets) {
    return Promise.resolve();
  }
  if (widgetScriptPromise) return widgetScriptPromise;

  widgetScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${WIDGET_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", reject, { once: true });
      if (window.EBWidgets) resolve();
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

export function isEventbriteModalOpen() {
  return Boolean(document.querySelector('iframe[id^="eventbrite-widget-modal-"]'));
}

export function closeEventbriteModal(eventId) {
  const id = eventId ? String(eventId) : null;
  const iframe =
    (id && document.getElementById(`eventbrite-widget-modal-${id}`)) ||
    document.querySelector('iframe[id^="eventbrite-widget-modal-"]');
  const overlay = document.getElementById("eventbrite-widget-modal-overlay");

  if (iframe?.parentNode) iframe.parentNode.removeChild(iframe);
  if (overlay) {
    overlay.innerHTML = "";
    overlay.style.opacity = "0";
    overlay.style.background = "rgba(0, 0, 0, 0)";
    overlay.style.width = "0";
    overlay.style.height = "0";
  }

  document.body.style.overflow = "";
  document.body.style.position = "";
  document.documentElement.style.overflow = "";
  window.dispatchEvent(new Event("resize"));
}

export function ensureEventbriteCheckoutWidget({
  eventId,
  triggerElementId,
  onOrderComplete,
  onWidgetModalClose,
}) {
  const id = String(eventId);
  if (!id || !triggerElementId) return Promise.resolve();

  return loadEventbriteWidgetScript().then(() => {
    if (!window.EBWidgets) return;
    if (initializedEventIds.has(id)) return;

    window.EBWidgets.createWidget({
      widgetType: "checkout",
      eventId: id,
      modal: true,
      modalTriggerElementId: triggerElementId,
      iframeAutoAdapt: 100,
      themeSettings: THEME,
      onOrderComplete: onOrderComplete ?? (() => {}),
      onWidgetModalClose: () => {
        closeEventbriteModal(id);
        onWidgetModalClose?.();
      },
    });

    initializedEventIds.add(id);
  });
}
