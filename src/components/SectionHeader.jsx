export default function SectionHeader({
  eyebrow,
  title,
  titleId,
  description,
  align = 'center',
  light = false,
  className = '',
}) {
  const alignClass =
    align === 'left' ? 'text-left mr-auto' : align === 'right' ? 'text-right ml-auto' : 'text-center mx-auto';

  return (
    <header className={`max-w-2xl mb-10 md:mb-12 ${alignClass} ${className}`}>
      {eyebrow && (
        <p className={`label mb-2 ${light ? 'text-white/45' : ''}`}>{eyebrow}</p>
      )}
      <h2
        id={titleId}
        className={`heading-section text-balance ${light ? 'text-white' : 'text-navy'} ${description ? 'mb-4' : ''}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-body mt-4 max-w-prose ${align === 'center' ? 'mx-auto' : ''} ${
            light ? 'text-white/65' : ''
          }`}
        >
          {description}
        </p>
      )}
    </header>
  );
}
