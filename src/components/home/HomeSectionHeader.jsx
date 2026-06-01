import Reveal from '../Reveal';

/** Consistent homepage section title — eyebrow, display heading, optional rule */
export default function HomeSectionHeader({
  eyebrow,
  title,
  titleId,
  action,
  light = false,
  align = 'left',
  className = '',
}) {
  const alignClass =
    align === 'center'
      ? 'text-center items-center'
      : align === 'right'
        ? 'text-right items-end ml-auto'
        : 'text-left items-start';

  return (
    <Reveal className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 ${className}`}>
      <div className={`flex flex-col ${alignClass}`}>
        {eyebrow && (
          <span className={`home-section-eyebrow mb-3 ${light ? 'text-gold-light' : ''}`}>{eyebrow}</span>
        )}
        <h2 id={titleId} className={`home-section-title ${light ? 'text-white' : 'text-navy'}`}>
          {title}
        </h2>
        <span className={`home-section-rule mt-4 ${light ? 'home-section-rule-light' : ''}`} aria-hidden />
      </div>
      {action && <div className="shrink-0 w-full sm:w-auto pt-1 sm:pt-0">{action}</div>}
    </Reveal>
  );
}
