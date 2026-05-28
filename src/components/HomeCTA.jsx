import { IconLaurel, IconMasks, IconBookOpen } from '@/components/icons';
import Reveal from './Reveal';
import { site } from '@/content/site';

const cards = [
  {
    icon: IconLaurel,
    title: 'Save the Date',
    body: `${site.gala.title} — ${site.gala.date}, ${site.gala.time}. ${site.gala.venue}, ${site.gala.address}.`,
    cta: 'Join the Committee',
    href: `mailto:${site.gala.committeeEmail}?subject=Gala%20Committee`,
  },
  {
    icon: IconMasks,
    title: 'Donate',
    body: 'Support Shakespeare on the Sound! Donate today to ensure future productions and educational programs!',
    cta: 'Donate Today',
    href: site.donateUrl,
    external: true,
    featured: true,
  },
  {
    icon: IconBookOpen,
    title: 'For Kids!',
    body: 'Bring Shakespeare into your classroom and catch Shakespeare for kids in the park!',
    cta: 'Education Programs',
    href: '/learning',
  },
];

export default function HomeCTA() {
  return (
    <section className="bg-cream py-12 sm:py-16 md:py-20 page-gutter border-y border-navy/8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 0.08} className="h-full">
            <a
              href={card.href}
              target={card.external ? '_blank' : undefined}
              rel={card.external ? 'noopener noreferrer' : undefined}
              className={`group flex flex-col h-full p-7 sm:p-8 md:p-9 border transition-all duration-500 ease-smooth card-lift ${
                card.featured
                  ? 'bg-gold border-gold text-navy-deep hover:shadow-glow shadow-soft'
                  : 'bg-white border-navy/10 hover:border-gold/40 shadow-soft'
              }`}
            >
              <card.icon
                className={`mb-5 shrink-0 ${card.featured ? 'text-navy-deep' : 'text-gold'}`}
                size={26}
              />
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
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
