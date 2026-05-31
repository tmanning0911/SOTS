import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import CtaLink from '../components/CtaLink';
import SectionHeader from '../components/SectionHeader';
import ContactCta from '../components/ContactCta';
import PageSection from '../components/PageSection';
import EventProgrammeList from '../components/EventProgrammeList';
import ProgrammeEventsBand from '../components/ProgrammeEventsBand';
import { seedEvents } from '@/lib/contentSeed';
import { pageHeroImages, pageArtBackgrounds } from '@/content/images';
import { site } from '@/content/site';
import { seasonVoice } from '@/content/voice';

export default function Events() {
  const [events, setEvents] = useState(seedEvents);

  useEffect(() => {
    fetch('/data/events.json')
      .then((r) => (r.ok ? r.json() : seedEvents))
      .then((data) => setEvents(data.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))))
      .catch(() => {});
  }, []);

  const featured = events.filter((e) => e.featured);
  const seasonEvents = events.filter((e) => !e.featured);

  return (
    <PageLayout>
      <PageHero
        eyebrow="2026 season"
        title="Special events"
        description="Gala fundraisers, opening night receptions, community nights, and more — beyond the main stage."
        image={pageHeroImages.events}
        artBackground={pageArtBackgrounds.events}
      />

      {featured.length > 0 && (
        <PageSection variant="white" first>
          <SectionHeader
            eyebrow="Save the date"
            title="Annual gala"
            description={`${site.gala.title} supports year-round productions and education across Fairfield County.`}
            align="left"
          />
          <ProgrammeEventsBand showHeader={false}>
            <EventProgrammeList events={featured} />
          </ProgrammeEventsBand>
        </PageSection>
      )}

      <PageSection variant="white" first={featured.length === 0}>
        <SectionHeader
          eyebrow="Summer 2026"
          title="Season highlights"
          description="Special evenings during our Much Ado About Nothing run at Pinkney Park."
          align="left"
        />
        {seasonEvents.length === 0 ? (
          <p className="text-body py-16">
            Event details coming soon.{' '}
            <Link to="/plays" className="text-link !inline-flex">
              View productions
            </Link>{' '}
            for the latest schedule.
          </p>
        ) : (
          <ProgrammeEventsBand showHeader={false}>
            <EventProgrammeList events={seasonEvents} />
          </ProgrammeEventsBand>
        )}

        <div className="mt-14 pt-10 border-t border-navy/10 text-center">
          <p className="text-body text-sm mb-6 max-w-prose mx-auto">
            Gates open at {seasonVoice.parkOpens} on show days; box office opens at {seasonVoice.boxOfficeOpens}.
          </p>
          <div className="btn-stack-mobile sm:flex-row sm:justify-center">
            <CtaLink href={site.ticketsUrl} className="btn-primary">
              Get main stage tickets
            </CtaLink>
            <Link to="/plays" className="btn-outline">
              View all productions
            </Link>
          </div>
        </div>
      </PageSection>

      <ContactCta />
    </PageLayout>
  );
}
