import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import CtaLink from '../CtaLink';
import EventProgrammeList from '../EventProgrammeList';
import AddToCalendar from '../AddToCalendar';
import { cms } from '@/lib/cms';
import { seedPlays, seedEvents } from '@/lib/contentSeed';
import { site } from '@/content/site';

/** What's on — list-first, like Royal Exchange / NT programme pages. */
export default function HomeWhatsOn() {
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
      setEvents(
        Array.isArray(e)
          ? e.filter((x) => !x.featured).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          : seedEvents,
      );
    });
  }, []);

  const mainStage = plays.find((p) => p.featured) || plays[0];
  const preview = events.slice(0, 5);

  return (
    <section className="section bg-white border-b border-navy/10" data-nav-zone="light">
      <div className="site-container">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 md:mb-16">
          <div>
            <p className="label mb-2">What&apos;s on</p>
            <h2 className="heading-section">This summer</h2>
          </div>
          <Link to="/events" className="text-link text-sm shrink-0">
            All events
          </Link>
        </header>

        {mainStage && (
          <article className="grid lg:grid-cols-2 gap-10 lg:gap-14 mb-14 pb-14 border-b border-navy/10">
            <OptimizedImage
              src={mainStage.image}
              alt={mainStage.title}
              className="w-full aspect-[4/3] object-cover"
              wrapperClassName="w-full"
            />
            <div className="flex flex-col justify-center">
              <p className="label mb-2">Main stage</p>
              <h3 className="heading-section mb-2">{mainStage.title}</h3>
              <p className="text-body text-navy/55 mb-4">{mainStage.dates}</p>
              {mainStage.subtitle && (
                <p className="font-display text-lg italic text-navy/70 mb-4">{mainStage.subtitle}</p>
              )}
              {mainStage.description && (
                <p className="text-body mb-8 line-clamp-4">
                  {mainStage.description.split('\n\n')[0]}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-auto">
                <CtaLink href={mainStage.ticketUrl || site.ticketsUrl} className="btn-primary">
                  Book tickets
                </CtaLink>
                <Link to={`/plays#${mainStage.id}`} className="btn-outline">
                  Details
                </Link>
              </div>
              <AddToCalendar item={mainStage} className="mt-6" />
            </div>
          </article>
        )}

        {preview.length > 0 && (
          <div>
            <h3 className="heading-section text-navy mb-2 md:mb-4">Special events</h3>
            <EventProgrammeList events={preview} compact />
          </div>
        )}
      </div>
    </section>
  );
}
