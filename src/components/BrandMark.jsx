/**
 * Collage-style white wordmark for dark chrome.
 * Avoids inverting the yellow/blue lockup (which reads as a white box).
 * Parent link should provide the accessible name via aria-label.
 */
export function BrandMark({ className = "", compact = false }) {
  return (
    <span
      className={`cdc-brand${compact ? " cdc-brand--compact" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <span className="cdc-brand__primary">Shakespeare</span>
      <span className="cdc-brand__secondary">on the Sound</span>
    </span>
  );
}
