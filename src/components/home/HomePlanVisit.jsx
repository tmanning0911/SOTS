import { Link } from 'react-router-dom';
import { site } from '@/content/site';
import PageSection from '../PageSection';
import SectionHeader from '../SectionHeader';

const quickLinks = [
  {
    title: 'Directions & Parking',
    description: 'Pinkney Park, Witch Lane lot, Rowayton station',
    href: '/about#visit',
  },
  {
    title: 'Before You Go',
    description: 'FAQ, picnics, weather, and what to bring',
    href: '/about#faq',
  },
  {
    title: 'Box Office',
    description: `${site.phone} · ${site.phoneNote}`,
    href: `tel:${site.phone.replace(/\D/g, '')}`,
    external: true,
  },
  {
    title: '2026 Season',
    description: 'Tickets, pricing, and performance schedule',
    href: '/plays',
  },
];

export default function HomePlanVisit() {
  return (
    <PageSection variant="white" bordered data-nav-zone="light">
      <SectionHeader
        eyebrow="Plan Your Visit"
        title="Everything Before Showtime"
        description="Park opens at 4 on performance days. Here’s what you need before you spread out the blanket."
        align="center"
        className="!mb-10 sm:!mb-12"
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {quickLinks.map((link) => {
          const className =
            'group flex flex-col h-full p-6 sm:p-7 border border-navy/10 bg-cream/50 hover:border-gold/40 hover:bg-white transition-colors duration-300 card-lift';
          const inner = (
            <>
              <h3 className="font-display text-navy text-lg sm:text-xl font-semibold uppercase mb-2 group-hover:text-gold transition-colors">
                {link.title}
              </h3>
              <p className="font-inter text-navy/65 text-sm leading-relaxed flex-1">{link.description}</p>
              <span className="inline-block mt-4 font-inter text-gold text-xs tracking-[0.15em] uppercase font-semibold">
                Learn More →
              </span>
            </>
          );

          if (link.external) {
            return (
              <a key={link.title} href={link.href} className={className}>
                {inner}
              </a>
            );
          }
          return (
            <Link key={link.title} to={link.href} className={className}>
              {inner}
            </Link>
          );
        })}
      </div>
    </PageSection>
  );
}
