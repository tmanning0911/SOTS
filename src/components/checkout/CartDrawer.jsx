import { useEffect, useId, useRef } from "react";

/**
 * Accessible bottom-sheet cart drawer shared by shop + tickets.
 */
export function CartDrawer({
  open,
  onClose,
  title = "Your cart",
  children,
  className = "",
}) {
  const titleId = useId();
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = () =>
      panel
        ? [
            ...panel.querySelectorAll(
              'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          ]
        : [];

    const first = focusables()[0];
    (first ?? panel)?.focus?.();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const items = focusables();
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div
      className={`sots-shop-drawer${open ? " is-open" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden={!open}
    >
      <button type="button" className="sots-shop-drawer__backdrop" onClick={onClose} aria-label="Close cart" tabIndex={open ? 0 : -1} />
      <div
        ref={panelRef}
        className="sots-shop-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="sots-shop-drawer__head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="sots-shop-drawer__close" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
