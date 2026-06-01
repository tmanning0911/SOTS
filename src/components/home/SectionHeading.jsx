import { Link } from 'react-router-dom';

export default function SectionHeading({ label, title, titleId, href, linkLabel = 'View all', className = '' }) {
  return (
    <header className={`section-heading flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 md:mb-12 ${className}`}>
      <div className="max-w-2xl min-w-0">
        {label && <p className="label mb-2">{label}</p>}
        <h2 id={titleId} className="heading-section text-navy text-balance">{title}</h2>
      </div>
      {href && (
        <Link
          to={href}
          className="text-link text-link--arrow text-sm w-full sm:w-auto shrink-0 min-h-[44px] inline-flex items-center justify-center sm:justify-start"
        >
          {linkLabel}
        </Link>
      )}
    </header>
  );
}
