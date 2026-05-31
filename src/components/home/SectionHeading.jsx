import { Link } from 'react-router-dom';

export default function SectionHeading({ label, title, titleId, href, linkLabel = 'View all', className = '' }) {
  return (
    <header className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-12 ${className}`}>
      <div className="max-w-2xl">
        {label && <p className="label mb-2">{label}</p>}
        <h2 id={titleId} className="heading-section text-navy">{title}</h2>
      </div>
      {href && (
        <Link to={href} className="text-link text-sm shrink-0">
          {linkLabel}
        </Link>
      )}
    </header>
  );
}
