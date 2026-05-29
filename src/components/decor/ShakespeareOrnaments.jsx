/** Short gold accent rule — matches hero underline pattern site-wide */
export function OrnamentDivider({ className = '', light = false }) {
  return (
    <div
      className={`h-px w-14 shrink-0 ${light ? 'bg-gold-light/90' : 'bg-gold'} ${className}`}
      aria-hidden
    />
  );
}
