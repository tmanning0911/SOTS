import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { useInView, useMotionValue, useTransform, animate, motion, useReducedMotion } from 'framer-motion';
import { IconMasks, IconLaurel, IconStage } from '@/components/icons';
import { Link } from 'react-router-dom';
import { site } from '@/content/site';
import { contactPaths } from '@/lib/contactPaths';
import { useEffect, useRef } from 'react';
import { pageHeroImages } from '@/content/images';
import { TheatreBackdrop } from '../components/decor';

function AnimatedStat({ stat }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true });
  const match = stat.match(/^(\d+)(.*)$/);
  const numericEnd = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : stat;
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (isInView && !reduceMotion && numericEnd > 0) {
      const controls = animate(count, numericEnd, { duration: 1.6, ease: 'easeOut' });
      return controls.stop;
    }
  }, [isInView, count, numericEnd, reduceMotion]);

  if (reduceMotion || !match) {
    return <span className="tabular-nums">{stat}</span>;
  }

  return (
    <span ref={ref} className="tabular-nums">
      {isInView ? <motion.span>{rounded}</motion.span> : stat}
    </span>
  );
}

const ways = [
  {
    icon: IconMasks,
    title: 'Donate',
    description: site.donateBlurb,
    cta: 'Make a Donation',
    highlight: true,
    href: site.donateUrl,
    external: true,
  },
  {
    icon: IconLaurel,
    title: '2026 Gala',
    description: `Save the Date for our Much Ado About Something gala on ${site.gala.date}, ${site.gala.time} at ${site.gala.venue}, ${site.gala.address}. Cocktails, bites, dancing, and live & silent auctions.`,
    cta: 'Join the Committee',
    highlight: false,
    href: contactPaths.gala,
    external: false,
  },
  {
    icon: IconStage,
    title: 'Corporate Partners',
    description:
      'Partner with Shakespeare on the Sound and align your brand with professional, community Shakespeare in Fairfield County.',
    cta: 'Become a Sponsor',
    highlight: false,
    href: contactPaths.sponsorship,
    external: false,
  },
];

function SupportCard({ way, index }) {
  const className = `group flex flex-col h-full p-7 sm:p-10 card-lift ${
    way.highlight
      ? 'bg-gold text-navy-deep shadow-glow border border-gold-light/30'
      : 'bg-white shadow-soft border border-navy/5'
  }`;

  const inner = (
    <>
      <way.icon className={`mb-5 ${way.highlight ? 'text-navy-deep' : 'text-gold'}`} size={28} />
      <h3
        className={`font-display text-2xl font-semibold uppercase mb-3 ${
          way.highlight ? 'text-navy-deep' : 'text-navy'
        }`}
      >
        {way.title}
      </h3>
      <p
        className={`font-inter text-sm leading-relaxed mb-6 flex-1 ${
          way.highlight ? 'text-navy-deep/85' : 'text-navy/85'
        }`}
      >
        {way.description}
      </p>
      <span
        className={`text-xs tracking-[0.2em] uppercase font-semibold inline-flex items-center gap-2 transition-transform duration-300 group-hover:gap-3 ${
          way.highlight ? 'text-navy-deep' : 'text-gold'
        }`}
      >
        {way.cta} →
      </span>
    </>
  );

  return (
    <Reveal delay={index * 0.08} className="h-full">
      {way.external ? (
        <a href={way.href} target="_blank" rel="noopener noreferrer" className={className}>
          {inner}
        </a>
      ) : (
        <Link to={way.href} className={className}>
          {inner}
        </Link>
      )}
    </Reveal>
  );
}

export default function Support() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Get Involved"
        title="Support Us"
        description="Shakespeare on the Sound is supported by generous individuals and businesses who share our passion for making professional Shakespeare accessible to everyone in Fairfield County."
        image={pageHeroImages.support}
      />

      <TheatreBackdrop variant="white" className="section-pad !pt-12 sm:!pt-16">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="section-eyebrow mb-3">Ways to Give</span>
            <h2 className="font-display text-navy text-2xl sm:text-3xl font-semibold uppercase">Make a Difference</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {ways.map((way, i) => (
              <SupportCard key={way.title} way={way} index={i} />
            ))}
          </div>
        </div>
      </TheatreBackdrop>

      <section className="bg-navy-deep py-14 sm:py-20 page-gutter grain-overlay" data-nav-zone="dark">
        <div className="max-w-6xl mx-auto relative z-[1]">
          <h2 className="font-display text-white text-2xl sm:text-3xl font-semibold uppercase text-center mb-8 sm:mb-12">
            Your Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { stat: '16+', label: 'Summer Performances' },
              { stat: '115K', label: 'Raised Each Year' },
              { stat: '6+', label: 'Sponsor Partners' },
              { stat: '8+', label: 'Education Programs' },
            ].map((item) => (
              <div key={item.label} className="border border-white/10 py-6 px-4">
                <p className="font-display text-gold text-3xl sm:text-4xl md:text-5xl font-semibold mb-2">
                  <AnimatedStat stat={item.stat} />
                </p>
                <p className="font-inter text-white/75 text-[10px] sm:text-xs tracking-widest uppercase">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TheatreBackdrop variant="cream" className="page-gutter pb-14 sm:pb-20 pt-10 text-center">
        <Link to="/#sponsors" className="link-gold inline-flex items-center gap-2">
          View our {new Date().getFullYear()} partner logos →
        </Link>
      </TheatreBackdrop>
    </PageLayout>
  );
}
