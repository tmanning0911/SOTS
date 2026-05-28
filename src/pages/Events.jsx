import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import CtaLink from '../components/CtaLink';
import OptimizedImage from '../components/OptimizedImage';
import SectionHeader from '../components/SectionHeader';
import ContactCta from '../components/ContactCta';
import { TheatreBackdrop } from '../components/decor';
import { seedEvents } from '@/lib/contentSeed';
import { pageHeroImages } from '@/content/images';
import { site } from '@/content/site';
import { Link } from 'react-router-dom';

function EventMeta({ event }) {
  return (
    <dl className="space-y-2 font-inter text-sm text-navy/75">
      <div>
        <dt className="sr-only">Date</dt>
        <dd>{event.date}</dd>
      </div>
      {event.time && (
        <div>
          <dt className="sr-only">Time</dt>
          <dd>{event.time}</dd>
        </div>
      )}
      {event.location && (
        <div>
          <dt className="sr-only">Location</dt>
          <dd>{event.location}</dd>
        </div>
      )}
      {event.priceNote && (
        <div>
          <dt className="sr-only">Price</dt>
          <dd className="text-gold font-semibold">{event.priceNote}</dd>
        </div>
      )}
    </dl>
  );
}

function FeaturedEvent({ event }) {
  return (
    <Reveal>
      <article
        id={event.id}
        className="grid lg:grid-cols-2 gap-0 bg-white border border-navy/8 shadow-soft overflow-hidden scroll-mt-28"
      >
        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[22rem]">
          <OptimizedImage
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
            wrapperClassName="absolute inset-0"
          />
        </div>
        <div className="p-7 sm:p-10 flex flex-col justify-center">
          <span className="section-eyebrow mb-3">{event.category}</span>
          <h2 className="font-display text-navy text-2xl sm:text-3xl font-semibold uppercase mb-4">
            {event.title}
          </h2>
          <EventMeta event={event} />
          <p className="font-inter text-navy/80 text-sm leading-relaxed mt-5 mb-8">{event.description}</p>
          {event.ctaLabel && event.ctaUrl && (
            <CtaLink href={event.ctaUrl} className="btn-primary w-full sm:w-auto">
              {event.ctaLabel}
            </CtaLink>
          )}
        </div>
      </article>
    </Reveal>
  );
}

function EventCard({ event, index }) {
  return (
    <Reveal key={event.id} delay={index * 0.05} className="h-full">
      <article id={event.id} className="flex flex-col h-full bg-white border border-navy/8 p-6 sm:p-7 shadow-soft scroll-mt-28">
        <span className="section-eyebrow !text-[9px] mb-2">{event.category}</span>
        <h3 className="font-display text-navy text-lg font-semibold uppercase leading-tight mb-3">
          {event.title}
        </h3>
        <EventMeta event={event} />
        <p className="font-inter text-navy/75 text-sm leading-relaxed mt-4 mb-6 flex-1">{event.description}</p>
        {event.ctaLabel && event.ctaUrl && (
          <CtaLink href={event.ctaUrl} className="link-gold inline-flex items-center gap-2 mt-auto">
            {event.ctaLabel}
          </CtaLink>
        )}
      </article>
    </Reveal>
  );
}

export default function Events() {
  const [events, setEvents] = useState(seedEvents);

  useEffect(() => {
    fetch('/data/events.json')
      .then((r) => r.json())
      .then((data) => setEvents(data.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))))
      .catch(() => {});
  }, []);

  const featured = events.filter((e) => e.featured);
  const seasonEvents = events.filter((e) => !e.featured);

  return (
    <PageLayout>
      <PageHero
        eyebrow="2026 Season"
        title="Special Events"
        description="Gala fundraisers, opening night receptions, community nights, and more — beyond the main stage."
        image={pageHeroImages.events}
      />

      {featured.length > 0 && (
        <TheatreBackdrop variant="cream" className="section-pad !pt-12 sm:!pt-16">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              eyebrow="Save the Date"
              title="Annual Gala"
              description={`${site.gala.title} supports year-round productions and education across Fairfield County.`}
              align="left"
              className="!mb-8 sm:!mb-10"
            />
            {featured.map((event) => (
              <FeaturedEvent key={event.id} event={event} />
            ))}
          </div>
        </TheatreBackdrop>
      )}

      <TheatreBackdrop variant="white" className="section-pad">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Summer 2026"
            title="Season Highlights"
            description="Special evenings during our Much Ado About Nothing run at Pinkney Park."
            align="center"
            className="!mb-10 sm:!mb-12"
          />
          {seasonEvents.length === 0 ? (
            <p className="text-center font-inter text-navy/60 py-16">
              Event details coming soon.{' '}
              <Link to="/plays" className="text-gold hover:underline">
                View productions
              </Link>{' '}
              for the latest schedule.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
              {seasonEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          )}
          <Reveal className="text-center mt-12 sm:mt-14">
            <p className="font-inter text-navy/60 text-sm mb-5">
              Main stage tickets required for receptions unless noted. Park opens at 5pm on show days.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <CtaLink href={site.ticketsUrl} className="btn-primary w-full sm:w-auto px-8">
                Get Main Stage Tickets
              </CtaLink>
              <Link to="/plays" className="btn-outline w-full sm:w-auto px-8">
                View All Productions
              </Link>
            </div>
          </Reveal>
        </div>
      </TheatreBackdrop>

      <ContactCta />
    </PageLayout>
  );
}
