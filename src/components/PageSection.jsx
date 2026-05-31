/**
 * Standard page section — white-first, consistent with homepage rhythm.
 */
const VARIANT_CLASS = {
  white: 'bg-white',
  cream: 'bg-white',
  parchment: 'bg-white',
  navy: 'bg-navy-deep text-white',
};

export default function PageSection({
  variant = 'white',
  children,
  className = '',
  containerClassName = '',
  first = false,
  tight = false,
  bordered = false,
  as: Tag = 'section',
  ...props
}) {
  const padClass = tight
    ? 'py-10 md:py-14'
    : first
      ? 'pt-12 md:pt-16 pb-14 md:pb-20 lg:pb-24'
      : 'py-14 md:py-20 lg:py-24';

  const navZone = variant === 'navy' ? 'dark' : 'light';
  const bgClass = VARIANT_CLASS[variant] || VARIANT_CLASS.white;

  return (
    <Tag
      className={`${bgClass} ${padClass} border-b border-navy/10 ${bordered ? 'border-t border-navy/10' : ''} ${className}`}
      data-nav-zone={navZone}
      {...props}
    >
      <div className={`site-container ${containerClassName}`}>{children}</div>
    </Tag>
  );
}
