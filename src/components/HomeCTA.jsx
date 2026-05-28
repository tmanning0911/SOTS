import { Link } from 'react-router-dom';
import { IconLaurel, IconMasks, IconBookOpen } from '@/components/icons';
import Reveal from './Reveal';
import { TheatreBackdrop } from './decor';
import { site } from '@/content/site';
import { contactPaths } from '@/lib/contactPaths';

const supportPath = '/support';

const cards = [
  {
    icon: IconLaurel,
    title: 'Save the Date',
    body: `${site.gala.title} — ${site.gala.date}, ${site.gala.time}. ${site.gala.venue}, ${site.gala.address}.`,
    cta: 'Join the Committee',
    href: contactPaths.gala,
    external: false,
  },
  {
    icon: IconMasks,
    title: 'Support Us',
    body: 'Donate, sponsor, or join the gala committee — every gift helps productions and education in Fairfield County.',
    cta: 'Ways to Give',
    href: supportPath,
    external: false,
    featured: true,
  },
  {
    icon: IconBookOpen,
    title: 'For Kids!',
    body: 'Bring Shakespeare into your classroom and catch Shakespeare for kids in the park!',
    cta: 'Education Programs',
    href: '/learning',
    external: false,
  },
];

function CtaCard({ card, index }) {
  const className = `group flex flex-col h-full p-7 sm:p-8 md:p-9 border transition-all duration-500 ease-smooth card-lift ${
    card.featured
      ? 'bg-gold border-gold text-navy-deep hover:shadow-glow shadow-soft'
      : 'bg-white border-navy/10 hover:border-gold/40 shadow-soft'
  }`;

  const inner = (
    <>
      <card.icon className={`mb-5 shrink-0 ${card.featured ? 'text-navy-deep' : 'text-gold'}`} size={26} />
      <h3
        className={`font-display text-xl md:text-2xl font-semibold uppercase mb-3 ${
          card.featured ? 'text-navy-deep' : 'text-navy'
        }`}
      >
        {card.title}
      </h3>
      <p
        className={`font-inter text-sm leading-relaxed mb-6 flex-1 ${
          card.featured ? 'text-navy-deep/80' : 'text-navy/70'
        }`}
      >
        {card.body}
      </p>
      <span
        className={`text-xs tracking-[0.2em] uppercase font-semibold inline-flex items-center gap-2 transition-transform duration-300 group-hover:gap-3 ${
          card.featured ? 'text-navy-deep' : 'text-gold'
        }`}
      >
        {card.cta} →
      </span>
    </>
  );

  return (
    <Reveal delay={index * 0.08} className="h-full">
      {card.external ? (
        <a href={card.href} target="_blank" rel="noopener noreferrer" className={className}>
          {inner}
        </a>
      ) : (
        <Link to={card.href} className={className}>
          {inner}
        </Link>
      )}
    </Reveal>
  );
}

export default function HomeCTA() {
  return (
    <TheatreBackdrop
      as="section"
      variant="white"
      className="py-12 sm:py-16 md:py-20 page-gutter border-y border-navy/8"
      data-nav-zone="light"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {cards.map((card, i) => (
          <CtaCard key={card.title} card={card} index={i} />
        ))}
      </div>
    </TheatreBackdrop>
  );
}
