import { images } from '@/content/images';

const WASH_IMAGES = {
  stage: images.backgrounds.theatre,
  audience: images.backgrounds.audience,
  cast: images.backgrounds.cast,
  education: images.backgrounds.education,
  history: images.backgrounds.history,
  kids: images.backgrounds.kids,
  spotlight: images.backgrounds.spotlight,
  hero: images.heroMuchAdo,
  hub: images.shakespeareHub,
  everyone: images.shakespeareForEveryone,
  park: images.parkPerformance,
};

/**
 * Layered Shakespeare-themed section background: photo wash, parchment texture, corner scrolls, icon watermarks.
 */
export default function TheatreBackdrop({
  variant = 'cream',
  wash,
  image,
  ornaments = 'none',
  grain = false,
  className = '',
  innerClassName = '',
  children,
  as: Tag = 'div',
  ...props
}) {
  const washKey = typeof wash === 'string' ? wash : variant;
  const washUrl =
    image ||
    (wash === false
      ? null
      : wash === true || (wash !== false && WASH_IMAGES[washKey])
        ? WASH_IMAGES[washKey]
        : null);

  const isDark = variant === 'navy' || variant === 'stage' || variant === 'cast' || variant === 'spotlight';

  const baseClass =
    variant === 'parchment'
      ? 'bg-parchment'
      : variant === 'navy'
        ? 'bg-navy-deep'
        : variant === 'cream-dark'
          ? 'bg-cream-dark'
          : 'bg-cream';

  return (
    <Tag className={`relative overflow-hidden ${baseClass} ${grain ? 'grain-overlay' : ''} ${className}`} {...props}>
      {washUrl && (
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden
          style={{
            backgroundImage: `linear-gradient(${
              isDark
                ? 'hsl(220 48% 11% / 0.88), hsl(220 48% 11% / 0.94)'
                : 'hsl(42 35% 96% / 0.82), hsl(42 35% 96% / 0.92)'
            }), url(${washUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {variant === 'parchment' && (
        <div className="absolute inset-0 bg-parchment-texture pointer-events-none" aria-hidden />
      )}

      <div className={`relative z-[1] ${innerClassName}`}>{children}</div>
    </Tag>
  );
}
