import { Link } from 'react-router-dom';
import { IconLaurel, IconMasks, IconBookOpen, IconArrowRight } from '@/components/icons';
import Reveal from './Reveal';
import PageSection from './PageSection';
import SectionHeader from './SectionHeader';
import { OrnamentDivider } from './decor';
import { site } from '@/content/site';

function parseGalaDate(dateStr) {
  const match = dateStr.match(/(\w+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (!match) return { month: '', day: '', year: '' };
  return { month: match[1], day: match[2], year: match[3] };
}

const { month: galaMonth, day: galaDay, year: galaYear } = parseGalaDate(site.gala.date);

const sideCards = [
  {
    icon: IconMasks,
    eyebrow: 'Philanthropy',
    title: 'Support Us',
    body: 'Donate, sponsor, or join the gala committee — every gift fuels productions and education across Fairfield County.',
    cta: 'Ways to Give',
    href: '/support',
  },
  {
    icon: IconBookOpen,
    eyebrow: 'Education',
    title: 'For Kids!',
    body: 'Bring Shakespeare into your classroom and catch free Shakespeare for Kids in the park before evening performances.',
    cta: 'Education Programs',
    href: '/learning',
  },
];

function GalaDetail({ label, children }) {
  return (
    <div>
      <p className="meta-label text-gold-light/90 mb-1.5">{label}</p>
      <div className="font-inter text-white/90 text-sm sm:text-base leading-relaxed">{children}</div>
    </div>
  );
}

function SideCard({ card, index }) {
  const Icon = card.icon;

  return (
    <Reveal delay={0.06 + index * 0.06} className="h-full">
      <Link
        to={card.href}
        className="group flex flex-col h-full content-card p-7 sm:p-8 card-lift hover:border-gold/35 transition-colors duration-300"
      >
        <div className="w-11 h-11 border border-gold/35 flex items-center justify-center mb-5 shrink-0">
          <Icon size={20} className="text-gold" aria-hidden />
        </div>
        <span className="section-eyebrow !text-[9px] mb-2">{card.eyebrow}</span>
        <h3 className="font-display text-navy text-xl sm:text-2xl font-semibold uppercase mb-3 leading-tight">
          {card.title}
        </h3>
        <p className="font-inter text-navy/70 text-sm leading-relaxed mb-6 flex-1">{card.body}</p>
        <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-gold transition-all duration-300 group-hover:gap-3">
          {card.cta}
          <IconArrowRight size={14} aria-hidden />
        </span>
      </Link>
    </Reveal>
  );
}

export default function HomeCTA() {
  const galaBlurb =
    site.gala.description?.split('.')[0]?.trim() ||
    'An evening of cocktails, bites, dancing, and auctions in support of Shakespeare on the Sound.';

  return (
    <PageSection variant="white" bordered data-nav-zone="light">
      <SectionHeader
        eyebrow="Get Involved"
        title="Gala, Gifts & Education"
        description="Three ways to join our community beyond the main stage."
        align="center"
        className="!mb-10 sm:!mb-12"
      />

      <div className="flex flex-col gap-5 sm:gap-6">
        <Reveal>
          <Link
            to="/events#gala-2026"
            className="group grid lg:grid-cols-[1fr_auto] overflow-hidden border border-navy/15 bg-navy-deep card-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            <div className="p-7 sm:p-9 lg:p-10 xl:p-12 relative grain-overlay">
              <div className="relative z-[1]">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="section-eyebrow text-gold-light !mb-0">Save the Date</span>
                  <span className="inline-flex items-center px-2.5 py-1 border border-gold/40 bg-gold/10 font-inter text-[10px] tracking-[0.2em] uppercase font-semibold text-gold-light">
                    Annual Gala
                  </span>
                </div>

                <h3 className="font-display text-white text-2xl sm:text-3xl lg:text-4xl font-semibold uppercase leading-[1.08] mb-5 text-balance max-w-xl">
                  {site.gala.title}
                </h3>

                <OrnamentDivider light className="mb-6 max-w-[12rem]" />

                <div className="grid sm:grid-cols-2 gap-5 sm:gap-8 mb-6 sm:mb-8 max-w-2xl">
                  <GalaDetail label="When">
                    <p>{site.gala.date}</p>
                    <p className="text-white/60 text-sm mt-0.5">{site.gala.time}</p>
                  </GalaDetail>
                  <GalaDetail label="Where">
                    <p>{site.gala.venue}</p>
                    <p className="text-white/60 text-sm mt-0.5">{site.gala.address}</p>
                  </GalaDetail>
                </div>

                <p className="font-inter text-white/55 text-sm leading-relaxed mb-7 max-w-lg hidden md:block">
                  {galaBlurb}
                </p>

                <span className="btn-primary w-full sm:w-auto justify-center group-hover:shadow-glow">
                  Join the Committee
                  <IconArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>

            <div
              className="relative flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-white/10 bg-gradient-to-br from-gold/15 via-navy-light/40 to-navy-deep px-8 py-10 lg:py-0 lg:px-10 xl:px-14 lg:min-w-[11rem] xl:min-w-[13rem]"
              aria-hidden
            >
              <div className="text-center">
                <p className="font-inter text-gold-light/80 text-[10px] tracking-[0.3em] uppercase mb-2">
                  {galaMonth || 'October'}
                </p>
                <p className="font-display text-gold text-6xl sm:text-7xl lg:text-8xl font-semibold leading-none tabular-nums">
                  {galaDay || '16'}
                </p>
                <p className="font-inter text-white/50 text-xs tracking-[0.2em] uppercase mt-3">{galaYear || '2026'}</p>
              </div>
              <IconLaurel className="text-gold/25 mt-6 lg:mt-8" size={48} aria-hidden />
            </div>
          </Link>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
          {sideCards.map((card, i) => (
            <SideCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </PageSection>
  );
}
