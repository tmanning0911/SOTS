import Reveal from './Reveal';

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
      <div
        className={`mt-6 h-px w-14 bg-gold/80 ${align === 'center' ? 'mx-auto' : ''} ${align === 'right' ? 'ml-auto' : ''}`}
        aria-hidden
      />
    </Reveal>
  );
}
