import { nounCatalog } from './nounCatalog';

/**
 * Renders icons from the local Noun Project theatre set.
 * @see public/icons/noun/ and src/content/nounAttribution.js
 */
export default function NounIcon({
  name,
  size = 24,
  className = '',
  strokeWidth,
  label,
  ...props
}) {
  const icon = nounCatalog[name];
  if (!icon) {
    if (import.meta.env.DEV) {
      console.warn(`NounIcon: missing icon "${name}"`);
    }
    return null;
  }

  const sw = strokeWidth ?? icon.strokeWidth ?? 1.75;
  const isStroke = icon.stroke ?? false;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill={isStroke ? 'none' : 'currentColor'}
      stroke={isStroke ? 'currentColor' : undefined}
      strokeWidth={isStroke ? sw : undefined}
      strokeLinecap={isStroke ? 'round' : undefined}
      strokeLinejoin={isStroke ? 'round' : undefined}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : 'presentation'}
      {...props}
    >
      {icon.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
      {icon.circles?.map(({ cx, cy, r, fill: filled }, i) => (
        <circle
          key={`c-${i}`}
          cx={cx}
          cy={cy}
          r={r}
          fill={filled ? 'currentColor' : isStroke ? 'none' : 'currentColor'}
          stroke={filled ? 'none' : undefined}
        />
      ))}
      {icon.lines?.map(([x1, y1, x2, y2], i) => (
        <line key={`l-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
    </svg>
  );
}

export function NounIconFilled({ name, size = 24, className = '', label, ...props }) {
  return <NounIcon name={name} size={size} className={className} label={label} {...props} />;
}
