const BADGES = {
  'Now On': 'bg-gold text-navy-deep border-gold',
  'On Sale': 'bg-gold text-navy-deep border-gold',
  Free: 'border-gold/45 text-navy bg-gold/10',
  'Coming Soon': 'border-navy/20 text-navy bg-transparent',
};

const DARK_BADGES = {
  'Now On': 'bg-gold text-navy-deep border-gold',
  'On Sale': 'bg-gold text-navy-deep border-gold',
  Free: 'border-white/40 text-white bg-white/10',
  'Coming Soon': 'border-white/30 text-white bg-transparent',
};

export default function ProductionStatusBadge({ status, dark = false, className = '' }) {
  if (!status || status === 'Archived') return null;

  const styles = dark ? DARK_BADGES : BADGES;
  const classNameStyles = styles[status] || (dark ? DARK_BADGES['Coming Soon'] : BADGES['Coming Soon']);

  return (
    <span
      className={`inline-block text-[10px] tracking-[0.2em] uppercase font-semibold px-3 py-1 w-fit border ${classNameStyles} ${className}`}
    >
      {status}
    </span>
  );
}
