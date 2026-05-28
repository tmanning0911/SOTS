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
  const layout = isLeft ? 'items-start text-left' : 'items-center text-center';
  const logoClass = compact ? 'h-9 sm:h-10 w-auto object-contain' : 'h-[72px] sm:h-[88px] w-auto object-contain';
  const horizontal = compact && isLeft;

  return (
    <div
      className={`flex ${horizontal ? 'flex-row gap-3 sm:gap-4 items-center' : 'flex-col'} ${layout} ${className}`}
    >
      <a
        href={site.staUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${horizontal ? 'mb-0 shrink-0' : 'mb-4'} block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold`}
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
        className={`font-inter leading-relaxed ${compact ? 'text-[11px] sm:text-xs' : 'text-sm'} ${horizontal ? 'max-w-[14rem] sm:max-w-xs' : 'max-w-xs'} ${text}`}
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
