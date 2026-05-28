/**
 * Soft solid section backgrounds — no photo washes.
 */
const VARIANT_CLASS = {
  cream: 'bg-cream',
  'cream-dark': 'bg-cream-dark',
  parchment: 'bg-parchment',
  white: 'bg-white',
  navy: 'bg-navy-deep text-white',
  gold: 'bg-gold/10',
};

export default function TheatreBackdrop({
  variant = 'cream',
  className = '',
  innerClassName = '',
  children,
  as: Tag = 'div',
  ...props
}) {
  const baseClass = VARIANT_CLASS[variant] || VARIANT_CLASS.cream;

  return (
    <Tag className={`relative overflow-hidden ${baseClass} ${className}`} {...props}>
      <div className={`relative z-[1] ${innerClassName}`}>{children}</div>
    </Tag>
  );
}
