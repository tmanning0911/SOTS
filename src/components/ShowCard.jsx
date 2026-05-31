import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';
import AddToCalendar from './AddToCalendar';
import { site } from '@/content/site';

/**
 * Shared show / event card — editorial grid layout for featured, list-style for standard.
 */
export default function ShowCard({
  item,
  featured = false,
  detailHref: detailHrefProp,
  ticketHref: ticketHrefProp,
  ticketLabel,
  detailLabel = 'Details',
  readLabel = 'Read article',
  showTicket = true,
  showDetail = true,
  showExcerpt = false,
  className = '',
}) {
  const detailHref =
    detailHrefProp ?? (item.dates ? `/plays#${item.id}` : `/events#${item.id}`);
  const ticketHref = ticketHrefProp ?? (item.ticketUrl || item.ctaUrl || site.ticketsUrl);
  const isExternal = ticketHref?.startsWith('http');
  const isNews = detailHref.startsWith('/news/');
  const imageLabel = item.title ? `View ${item.title}` : undefined;

  if (featured) {
    return (
      <article
        id={item.id || undefined}
        className={`grid lg:grid-cols-2 gap-10 lg:gap-14 scroll-mt-28 ${item.id ? '' : ''} ${className}`}
      >
        <Link
          to={detailHref}
          aria-label={imageLabel}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
        >
          <OptimizedImage
            src={item.image}
            alt={item.title || ''}
            className="w-full aspect-[4/3] object-cover"
            wrapperClassName="w-full"
          />
        </Link>
        <div className="flex flex-col justify-center">
          {item.category && <p className="label mb-2">{item.category}</p>}
          <h3 className="heading-section mb-2">
            <Link
              to={detailHref}
              className="hover:text-gold transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {item.title}
            </Link>
          </h3>
          {(item.dates || item.date) && <p className="show-card-meta mb-4">{item.dates || item.date}</p>}
          {item.subtitle && (
            <p className="font-display text-lg italic text-navy/70 mb-4">{item.subtitle}</p>
          )}
          {item.description && !item.subtitle && (
            <p className="text-body mb-8 line-clamp-4 max-w-prose">{item.description}</p>
          )}
          {showExcerpt && item.excerpt && (
            <p className="text-body mb-8 line-clamp-4">{item.excerpt}</p>
          )}
          <div className="show-card-actions mt-auto">
            {showTicket && ticketHref && (
              isExternal ? (
                <a href={ticketHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  {ticketLabel || item.ctaLabel || 'Book tickets'}
                </a>
              ) : (
                <Link to={ticketHref || detailHref} className="btn-primary">
                  {ticketLabel || item.ctaLabel || 'Learn more'}
                </Link>
              )
            )}
            {showDetail && (
              <Link to={detailHref} className="btn-outline">
                {isNews ? readLabel : detailLabel}
              </Link>
            )}
          </div>
          <AddToCalendar item={item} className="mt-6" />
        </div>
      </article>
    );
  }

  return (
    <article
      id={item.id || undefined}
      className={`scroll-mt-28 ${className}`}
    >
      <Link
        to={detailHref}
        aria-label={imageLabel}
        className="block mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
      >
        <OptimizedImage
          src={item.image}
          alt={item.title || ''}
          className="w-full aspect-[3/2] object-cover"
          wrapperClassName="w-full"
        />
      </Link>
      <h3 className="show-card-title">
        <Link
          to={detailHref}
          className="hover:text-gold transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {item.title}
        </Link>
      </h3>
      {(item.dates || item.date) && <p className="show-card-meta mt-1">{item.dates || item.date}</p>}
      {showExcerpt && item.excerpt && (
        <p className="text-body text-sm mt-3 mb-4 line-clamp-3">{item.excerpt}</p>
      )}
      <div className="show-card-actions mt-4">
        {showTicket && ticketHref && (
          isExternal ? (
            <a href={ticketHref} target="_blank" rel="noopener noreferrer" className="text-link text-sm">
              {ticketLabel || item.ctaLabel || 'Tickets'}
            </a>
          ) : (
            <Link to={ticketHref || detailHref} className="text-link text-sm">
              {ticketLabel || item.ctaLabel || 'Learn more'}
            </Link>
          )
        )}
        {showDetail && (
          <Link to={detailHref} className="text-link text-sm">
            {isNews ? readLabel : detailLabel}
          </Link>
        )}
      </div>
      <AddToCalendar item={item} className="mt-4" />
    </article>
  );
}
