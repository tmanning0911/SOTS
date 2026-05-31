import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';
import CtaLink from './CtaLink';
import AddToCalendar from './AddToCalendar';

/** Editorial production layout — photography-led, minimal chrome. */
export default function ProductionFeature({ production, index = 0 }) {
  const flipLayout = index % 2 === 1;
  const isExternalTicket = production.ticketUrl?.startsWith('http');

  return (
    <article
      id={production.id}
      className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start scroll-mt-28 border-b border-navy/10 pb-14 last:border-0 last:pb-0"
    >
      <div className={flipLayout ? 'lg:order-2' : ''}>
        <OptimizedImage
          src={production.image}
          alt={production.title}
          className="w-full aspect-[4/3] object-cover"
          wrapperClassName="w-full"
        />
      </div>

      <div className={`flex flex-col ${flipLayout ? 'lg:order-1' : ''}`}>
        {production.featured ? (
          <p className="label mb-2">Main stage · {production.status}</p>
        ) : (
          production.status &&
          production.status !== 'Archived' && <p className="label mb-2">{production.status}</p>
        )}
        {production.subtitle && <p className="font-display text-lg italic text-navy/70 mb-2">{production.subtitle}</p>}
        <h2 className="heading-section mb-3">{production.title}</h2>
        <p className="show-card-meta mb-1">{production.dates}</p>
        <p className="show-card-meta mb-6">{production.location}</p>

        <div className="text-body space-y-4 max-w-prose mb-6">
          {(production.description || '')
            .split('\n\n')
            .filter(Boolean)
            .map((para, pi) => (
              <p key={`${production.id}-p-${pi}`}>{para}</p>
            ))}
        </div>

        {production.ticketDetails?.length > 0 && (
          <ul className="mb-6 space-y-1.5 border-l border-navy/15 pl-4 text-sm text-navy/70">
            {production.ticketDetails.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}

        {production.specialEvents?.length > 0 && (
          <div className="mb-6">
            <p className="label mb-2">Special events</p>
            <ul className="space-y-1 text-sm text-navy/70 mb-3">
              {production.specialEvents.map((ev) => (
                <li key={ev}>{ev}</li>
              ))}
            </ul>
            <Link to="/events" className="text-link text-sm">
              All special events
            </Link>
          </div>
        )}

        {production.creativeTeam?.length > 0 && (
          <p className="text-xs text-navy/45 leading-relaxed mb-8">
            {production.creativeTeam.join(' · ')}
          </p>
        )}

        <div className="btn-stack-mobile mt-auto">
          <CtaLink
            href={production.ticketUrl}
            className={isExternalTicket ? 'btn-primary' : 'btn-outline'}
          >
            {production.tag || (isExternalTicket ? 'Get tickets' : 'Learn more')}
          </CtaLink>
        </div>
        <AddToCalendar item={production} className="mt-6" />
      </div>
    </article>
  );
}
