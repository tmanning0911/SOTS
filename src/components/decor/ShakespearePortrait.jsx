import { images } from '@/content/images';

const POSITION = {
  left: 'left-0 bottom-0 -translate-x-[10%] translate-y-[6%]',
  right: 'right-0 bottom-0 translate-x-[6%] translate-y-[6%]',
  center: 'left-1/2 bottom-0 -translate-x-1/2 translate-y-[8%]',
};

const SIZE = {
  sm: 'w-[min(240px,44vw)]',
  md: 'w-[min(340px,50vw)]',
  lg: 'w-[min(440px,58vw)]',
  xl: 'w-[min(540px,64vw)]',
};

/**
 * Engraving-style Shakespeare portrait — ambient texture on dark or light sections.
 * Use variant="section" for a large transparent backdrop behind a full content band.
 */
export default function ShakespearePortrait({
  position = 'right',
  tone = 'dark',
  size = 'lg',
  variant = 'accent',
  className = '',
}) {
  if (variant === 'section') {
    return (
      <div
        className={`shakespeare-portrait-section pointer-events-none absolute inset-0 overflow-hidden ${className}`}
        aria-hidden
      >
        <img
          src={images.decor.shakespearePortraitTransparent}
          alt=""
          decoding="async"
          className="shakespeare-portrait-section__art"
        />
        <div className="shakespeare-portrait-section__scrim" />
      </div>
    );
  }

  const blendClass =
    tone === 'dark'
      ? 'opacity-[0.28] mix-blend-screen'
      : 'opacity-[0.07] mix-blend-multiply';

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <img
        src={images.decor.shakespearePortrait}
        alt=""
        decoding="async"
        className={`absolute ${POSITION[position]} ${SIZE[size]} h-auto max-h-[88%] object-contain object-bottom ${blendClass}`}
      />
    </div>
  );
}
