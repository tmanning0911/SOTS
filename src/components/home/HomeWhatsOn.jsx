import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArtSectionBackground } from '../decor';
import HomeSectionHeader from './HomeSectionHeader';
import EventProgrammeList from '../EventProgrammeList';
import { seedEvents } from '@/lib/contentSeed';
import { images } from '@/content/images';

/** What's on — special events preview on the homepage. */
export default function HomeWhatsOn() {
  const [events, setEvents] = useState(seedEvents);

  useEffect(() => {
    fetch('/data/events.json')
      .then((r) => (r.ok ? r.json() : seedEvents))
      .then((data) =>
        setEvents(
          Array.isArray(data)
            ? data.filter((x) => !x.featured).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            : seedEvents,
        ),
      )
      .catch(() => {});
  }, []);

  const preview = events.slice(0, 4);

  if (preview.length === 0) return null;

  return (
    <section className="section relative bg-white border-b border-navy/10 overflow-x-clip" data-nav-zone="light">
      <ArtSectionBackground src={images.art.townSquareNight} tone="light" position="center" />
      <div className="site-container relative z-[1]">
        <HomeSectionHeader
          eyebrow="What's on"
          title="Special events"
          action={
            <Link to="/events" className="text-link text-link--arrow text-sm shrink-0 self-start sm:self-end">
              View all events
            </Link>
          }
          className="mb-6 md:mb-8"
        />

        <p className="text-body text-sm sm:text-base text-navy/65 max-w-2xl mb-10 md:mb-14 leading-relaxed">
          Receptions, talks, and community nights during the Much Ado run at Pinkney Park.
        </p>

        <EventProgrammeList events={preview} />
      </div>
    </section>
  );
}
