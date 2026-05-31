import OptimizedImage from '../OptimizedImage';

/**
 * Production artwork as ambient section texture — visible but never foreground content.
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
      ? 'opacity-[0.32] mix-blend-soft-light'
      : 'opacity-[0.16] mix-blend-multiply saturate-[0.9]';

  return (
    <>
      <OptimizedImage
        src={src}
        alt=""
        aria-hidden
        decorative
        className={`absolute inset-0 w-full h-full object-cover scale-110 ${objectPosition} ${toneClass} ${className}`}
        wrapperClassName="absolute inset-0 w-full h-full pointer-events-none select-none"
      />
      <div
        className={`pointer-events-none absolute inset-0 ${
          tone === 'dark'
            ? 'bg-gradient-to-r from-navy-deep/70 via-navy-deep/20 to-navy-deep/70'
            : 'bg-gradient-to-r from-white via-white/40 to-white'
        }`}
        aria-hidden
      />
    </>
  );
}
