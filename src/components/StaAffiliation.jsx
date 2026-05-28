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
 * Shakespeare Theatre Association member badge — matches shakespeareonthesound.org footer.
 */
export default function StaAffiliation({ theme = 'light', className = '' }) {
  const text = textStyles[theme] || textStyles.light;
  const muted = textStyles.muted[theme] || textStyles.muted.light;

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
          className="h-[72px] sm:h-[88px] w-auto object-contain"
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
