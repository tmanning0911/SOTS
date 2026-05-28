import Reveal from './Reveal';
import { OrnamentDivider } from './decor';

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
  className = '',
}) {
  const alignClass =
    align === 'left' ? 'text-left mr-auto' : align === 'right' ? 'text-right ml-auto' : 'text-center mx-auto';

  return (
    <Reveal className={`max-w-3xl mb-8 sm:mb-10 md:mb-12 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className={`section-eyebrow mb-3 ${light ? 'text-gold-light' : ''}`}>{eyebrow}</span>
      )}
      <h2
        className={`section-title text-balance ${light ? 'text-white' : 'text-navy'} ${description ? 'mb-4' : ''}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`font-inter text-sm md:text-base leading-relaxed max-w-xl ${align === 'center' ? 'mx-auto' : ''} ${
            light ? 'text-white/65' : 'text-navy/65'
          }`}
        >
          {description}
        </p>
      )}
      <div className={`mt-6 ${align === 'center' ? '' : align === 'right' ? 'flex justify-end' : ''}`}>
        <OrnamentDivider light={light} className={align === 'left' ? '!mx-0' : align === 'right' ? '!ml-auto !mr-0' : ''} />
      </div>
    </Reveal>
  );
}
