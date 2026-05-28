/**
 * Premium stroke icons for Shakespeare on the Sound.
 * Unified 24×24 viewBox, elegant theatre-adjacent line weight.
 */
export default function Icon({
  children,
  size = 24,
  strokeWidth = 1.35,
  className = '',
  label,
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : 'presentation'}
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconFilled({ children, size = 24, className = '', label, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : 'presentation'}
      {...props}
    >
      {children}
    </svg>
  );
}
