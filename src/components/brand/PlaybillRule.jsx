/** Playbill-style rule — centre ornament */
export default function PlaybillRule({ light = false, className = '' }) {
  return (
    <div className={`playbill-rule ${light ? 'playbill-rule--light' : ''} ${className}`} aria-hidden>
      <span className="playbill-rule__line" />
      <span className="playbill-rule__ornament">✦</span>
      <span className="playbill-rule__line" />
    </div>
  );
}
