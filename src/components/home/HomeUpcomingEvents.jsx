import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../Reveal';
import OptimizedImage from '../OptimizedImage';
import CtaLink from '../CtaLink';
import { cms } from '@/lib/cms';
import { seedPlays, seedEvents } from '@/lib/contentSeed';
import { site } from '@/content/site';

function FeaturedEvent({ item }) {
  const ticketHref = item.ticketUrl || site.ticketsUrl;
  const detailHref = item.dates ? `/plays#${item.id}` : `/events#${item.id}`;

  return (
    <Reveal>
      <article className="orpheum-featured-event group">
        <Link
          to={detailHref}
          className="orpheum-featured-event-media block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <OptimizedImage
            src={item.image}
            alt=""
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            wrapperClassName="absolute inset-0 w-full h-full"
          />
          {item.category && <span className="orpheum-event-tag">{item.category}</span>}
        </Link>
        <div className="orpheum-featured-event-body">
          <h3 className="orpheum-event-title orpheum-event-title-lg">
            <Link to={detailHref} className="hover:text-gold transition-colors">
              {item.title}
            </Link>
          </h3>
          <p className="orpheum-event-date">{item.dates || item.date}</p>
          <div className="orpheum-event-actions">
            <CtaLink href={ticketHref} className="orpheum-text-cta">
              Buy Tickets
            </CtaLink>
            <Link to={detailHref} className="orpheum-text-cta">
              Learn More
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function EventCard({ item }) {
  const ticketHref = item.ticketUrl || item.ctaUrl;
  const detailHref = item.dates ? `/plays#${item.id}` : `/events#${item.id}`;
  const isExternal = ticketHref?.startsWith('http');
  const category = item.category || item.status || 'Event';

  return (
    <Reveal className="h-full">
      <article className="orpheum-event-card group h-full flex flex-col">
        <Link
          to={detailHref}
          className="orpheum-event-card-media block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <OptimizedImage
            src={item.image}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            wrapperClassName="absolute inset-0 w-full h-full"
          />
          <span className="orpheum-event-tag">{category}</span>
        </Link>
        <div className="orpheum-event-card-body flex flex-col flex-1">
          <h3 className="orpheum-event-title">
            <Link to={detailHref} className="hover:text-gold transition-colors">
              {item.title}
            </Link>
          </h3>
          <p className="orpheum-event-date">{item.dates || item.date}</p>
          <div className="orpheum-event-actions mt-auto pt-3">
            {ticketHref &&
              (isExternal ? (
                <CtaLink href={ticketHref} className="orpheum-text-cta">
                  {item.tag || item.ctaLabel || 'Buy Tickets'}
                </CtaLink>
              ) : (
                <Link to={ticketHref} className="orpheum-text-cta">
                  {item.tag || item.ctaLabel || 'Learn More'}
                </Link>
              ))}
            <Link to={detailHref} className="orpheum-text-cta">
              Learn More
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/** Orpheum 1:1 — featured production + upcoming events grid */
export default function HomeUpcomingEvents() {
  const [plays, setPlays] = useState(seedPlays);
  const [events, setEvents] = useState(seedEvents);

  useEffect(() => {
    Promise.all([
      cms.plays.list('sort_order').catch(() => seedPlays),
      fetch('/data/events.json')
        .then((r) => r.json())
        .catch(() => seedEvents),
    ]).then(([p, e]) => {
      setPlays(p.filter((x) => x.status !== 'Archived'));
      setEvents(Array.isArray(e) ? e.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) : seedEvents);
    });
  }, []);

  const featured = plays.find((p) => p.featured) || plays[0];
  const morePlays = plays.filter((p) => p.id !== featured?.id);
  const seasonEvents = events.filter((e) => !e.featured);
  const gridItems = [...morePlays, ...seasonEvents].slice(0, 11);

  return (
    <section className="bg-white section-pad" data-nav-zone="light">
      <div className="site-container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <h2 className="font-display text-navy text-3xl sm:text-4xl font-semibold uppercase tracking-wide">
            Upcoming Events
          </h2>
          <Link to="/events" className="orpheum-text-cta orpheum-text-cta-lg shrink-0">
            View All Events
          </Link>
        </div>

        {featured && (
          <div className="mb-10 sm:mb-12">
            <FeaturedEvent item={{ ...featured, category: 'Main Stage · Pinkney Park' }} />
          </div>
        )}

        {gridItems.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8 sm:gap-y-10">
            {gridItems.map((item) => (
              <EventCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
