import { TheatreBackdrop } from './decor';

/**
 * Standard page section — consistent padding, container width, and backdrop variant.
 */
export default function PageSection({
  variant = 'cream',
  children,
  className = '',
  containerClassName = '',
  first = false,
  tight = false,
  bordered = false,
  as: Tag = 'section',
  ...props
}) {
  const padClass = tight ? 'section-block-tight' : first ? 'section-block-first' : 'section-block';

  return (
    <TheatreBackdrop
      as={Tag}
      variant={variant}
      className={`${padClass} ${bordered ? 'border-y border-navy/8' : ''} ${className}`}
      {...props}
    >
      <div className={`page-container ${containerClassName}`}>{children}</div>
    </TheatreBackdrop>
  );
}
