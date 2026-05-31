import { useState, useEffect } from 'react';
import SectionHeading from './SectionHeading';
import ShowCard from '../ShowCard';
import FeaturedProduction from './FeaturedProduction';
import { cms } from '@/lib/cms';
import { seedPlays, seedEvents } from '@/lib/contentSeed';

export default function HomeUpcomingEvents() {
  const [plays, setPlays] = useState(seedPlays);
  const [events, setEvents] = useState(seedEvents);

  useEffect(() => {
    Promise.all([
      cms.plays.list('sort_order').catch(() => seedPlays),
      fetch('/data/events.json')
        .then((r) => (r.ok ? r.json() : seedEvents))
        .catch(() => seedEvents),
    ]).then(([p, e]) => {
      setPlays(p.filter((x) => x.status !== 'Archived'));
      setEvents(Array.isArray(e) ? e.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) : seedEvents);
    });
  }, []);

  const featured = plays.find((p) => p.featured) || plays[0];
  const seasonEvents = events.filter((e) => !e.featured).slice(0, 3);

  return (
    <>
      {featured && <FeaturedProduction production={featured} />}

      {seasonEvents.length > 0 && (
        <section className="section bg-white site-container" data-nav-zone="light">
          <SectionHeading label="Also this summer" title="Special events" href="/events" linkLabel="All events" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {seasonEvents.map((item) => (
              <ShowCard key={item.id} item={item} showTicket={Boolean(item.ctaUrl)} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
