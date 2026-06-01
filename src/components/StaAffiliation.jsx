import OptimizedImage from './OptimizedImage';
import { site } from '@/content/site';

const textStyles = {
  light: 'text-navy/80',
  dark: 'text-white/80',
  muted: {
    light: 'text-navy/65',
    dark: 'text-white/65',
  },
};

/**
 * Shakespeare Theatre Association member badge.
 */
export default function StaAffiliation({
  theme = 'light',
  align = 'center',
  compact = false,
  className = '',
}) {
  const text = textStyles[theme] || textStyles.light;
  const muted = textStyles.muted[theme] || textStyles.muted.light;
  const isLeft = align === 'left';

  const logoClass = compact
    ? 'h-10 sm:h-11 w-auto object-contain'
    : isLeft
      ? 'h-14 sm:h-16 w-auto object-contain'
      : 'h-[84px] sm:h-[98px] w-auto object-contain';

  if (isLeft) {
    return (
      <div className={`flex flex-row gap-3 sm:gap-4 items-start text-left w-fit max-w-md ${className}`}>
        <a
          href={site.staUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          aria-label="Shakespeare Theatre Association — opens in new tab"
        >
          <OptimizedImage
            src={site.staLogo}
            alt="Shakespeare Theatre Association logo"
            width={123}
            height={108}
            className={logoClass}
            wrapperClassName="bg-transparent"
          />
        </a>
        <p
          className={`font-inter leading-relaxed pt-0.5 ${compact ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'} ${text}`}
        >
          <span className="block font-medium">{site.name}</span>
          <span className={`block mt-0.5 ${muted}`}>is a proud member of the</span>
          <a
            href={site.staUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-medium mt-0.5 text-gold hover:underline"
          >
            Shakespeare Theatre Association
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <a
        href={site.staUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-4 block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        aria-label="Shakespeare Theatre Association — opens in new tab"
      >
        <OptimizedImage
          src={site.staLogo}
          alt="Shakespeare Theatre Association logo"
          width={123}
          height={108}
          className={logoClass}
          wrapperClassName="bg-transparent"
        />
      </a>
      <p className={`font-inter text-sm leading-relaxed max-w-xs ${text}`}>
        <span className="block font-medium">{site.name}</span>
        <span className={`block text-xs sm:text-sm mt-0.5 ${muted}`}>is a proud member of the</span>
        <a
          href={site.staUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block font-medium mt-0.5 text-gold hover:underline"
        >
          Shakespeare Theatre Association
        </a>
      </p>
    </div>
  );
}
