import OptimizedImage from '../OptimizedImage';

/**
 * Production artwork as ambient section texture — low opacity, never foreground content.
 */
export default function ArtSectionBackground({
  src,
  tone = 'light',
  position = 'right',
  className = '',
}) {
  const objectPosition =
    position === 'left' ? 'object-left' : position === 'center' ? 'object-center' : 'object-right';

  const toneClass =
    tone === 'dark'
      ? 'opacity-[0.16] mix-blend-luminosity'
      : 'opacity-[0.055] mix-blend-multiply saturate-[0.85]';

  return (
    <OptimizedImage
      src={src}
      alt=""
      aria-hidden
      className={`absolute inset-0 w-full h-full object-cover ${objectPosition} ${toneClass} ${className}`}
      wrapperClassName="absolute inset-0 w-full h-full pointer-events-none select-none"
    />
  );
}
