import { Link } from 'react-router-dom';
import Reveal from '../Reveal';
import OptimizedImage from '../OptimizedImage';
import CtaLink from '../CtaLink';
import { site } from '@/content/site';
import { seasonVoice } from '@/content/voice';

/** Poster-style featured production — full-bleed image with overlay typography. */
export default function FeaturedProduction({ production }) {
  if (!production) return null;

  const isExternal = production.ticketUrl?.startsWith('http');
  const lead =
    production.description?.split('\n\n').filter(Boolean)[0] ?? '';

  return (
    <Reveal>
      <article
        data-nav-zone="dark"
        className="relative min-h-[520px] lg:min-h-[580px] flex items-end overflow-hidden bg-twilight group"
      >
        <OptimizedImage
          src={production.image}
          alt={production.title}
          priority
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-smooth group-hover:scale-[1.03] image-shine"
          wrapperClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-twilight via-twilight/60 to-twilight/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-twilight/80 via-transparent to-transparent lg:max-w-[55%]" />

        <div className="relative z-[1] site-container w-full pb-12 md:pb-16 pt-32">
          <div className="max-w-xl">
            <p className="label text-starlight/60 mb-3">
              Main stage · {seasonVoice.runDates}, {seasonVoice.year}
            </p>
            {production.subtitle && (
              <p className="font-display text-xl italic text-gold-light/90 mb-2">{production.subtitle}</p>
            )}
            <h2 className="heading-display text-white mb-4 text-balance">{production.title}</h2>
            {lead && (
              <p className="text-body-lg text-white/70 mb-8 max-w-prose line-clamp-3">{lead}</p>
            )}
            <div className="flex flex-wrap gap-3">
              <CtaLink href={production.ticketUrl} className="btn-primary">
                {production.tag || (isExternal ? 'Book tickets' : 'Learn more')}
              </CtaLink>
              <Link to={`/plays#${production.id}`} className="btn-ghost-light">
                Full details
              </Link>
            </div>
            <p className="text-sm text-white/40 mt-6">
              Gates {seasonVoice.parkOpens} · Box office {seasonVoice.boxOfficeOpens} · Kids&apos; Show{' '}
              {seasonVoice.kidsShowTime} ·{' '}
              <a
                href={site.ticketsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/60"
              >
                Eventbrite
              </a>
            </p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
