import { IconHeart, IconGraduation, IconSparkle } from '@/components/icons';
import Reveal from './Reveal';
import { site } from '@/content/site';

const cards = [
  {
    icon: IconSparkle,
    title: 'Save the Date',
    body: `${site.gala.title} — ${site.gala.date}, ${site.gala.time}. ${site.gala.venue}, ${site.gala.address}.`,
    cta: 'Join the Committee',
    href: `mailto:${site.gala.committeeEmail}?subject=Gala%20Committee`,
  },
  {
    icon: IconHeart,
    title: 'Donate',
    body: 'Support Shakespeare on the Sound! Donate today to ensure future productions and educational programs!',
    cta: 'Donate Today',
    href: site.donateUrl,
    external: true,
    featured: true,
  },
  {
    icon: IconGraduation,
    title: 'For Kids!',
    body: 'Bring Shakespeare into your classroom and catch Shakespeare for kids in the park!',
    cta: 'Education Programs',
    href: '/learning',
  },
];

export default function HomeCTA() {
  return (
    <section className="bg-navy-deep py-14 sm:py-16 md:py-20 page-gutter grain-overlay border-y border-white/5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 relative z-[1]">
        {cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 0.08}>
            <a
              href={card.href}
              target={card.external ? '_blank' : undefined}
              rel={card.external ? 'noopener noreferrer' : undefined}
              className={`group block h-full p-8 md:p-9 border transition-all duration-500 ease-smooth card-lift ${
                card.featured
                  ? 'bg-gold/95 border-gold text-navy-deep hover:shadow-glow'
                  : 'bg-white/[0.04] border-white/10 hover:border-gold/40 hover:bg-white/[0.07]'
              }`}
            >
              <card.icon
                className={`mb-5 ${card.featured ? 'text-navy-deep' : 'text-gold'}`}
                size={26}
              />
              <h3
                className={`font-display text-xl md:text-2xl font-semibold uppercase mb-3 ${
                  card.featured ? 'text-navy-deep' : 'text-white'
                }`}
              >
                {card.title}
              </h3>
              <p
                className={`font-inter text-sm leading-relaxed mb-6 ${
                  card.featured ? 'text-navy-deep/80' : 'text-white/60'
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
