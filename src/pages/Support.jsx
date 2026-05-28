import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { IconHeart, IconStar, IconBuilding, IconGift } from '@/components/icons';
import Sponsors from '../components/Sponsors';
import TicketBanner from '../components/TicketBanner';
import { sponsors, site } from '@/content/site';
import { useEffect, useRef } from 'react';
import { pageHeroImages } from '@/content/images';

function AnimatedStat({ stat }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const match = stat.match(/^(\d+)(.*)$/);
  const numericEnd = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : stat;
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, numericEnd, { duration: 1.6, ease: 'easeOut' });
      return controls.stop;
    }
  }, [isInView, count, numericEnd]);

  return (
    <span ref={ref} className="tabular-nums">
      {isInView ? <motion.span>{rounded}</motion.span> : stat}
    </span>
  );
}

const ways = [
  {
    icon: IconHeart,
    title: 'Donate',
    description: site.donateBlurb,
    cta: 'Make a Donation',
    highlight: true,
    href: site.donateUrl,
  },
  {
    icon: IconStar,
    title: '2026 Gala',
    description: `Save the Date for our Much Ado About Something gala on ${site.gala.date}, ${site.gala.time} at ${site.gala.venue}, ${site.gala.address}. Cocktails, bites, dancing, and live & silent auctions.`,
    cta: 'Join the Committee',
    highlight: false,
    href: `mailto:${site.gala.committeeEmail}`,
  },
  {
    icon: IconBuilding,
    title: 'Corporate Partners',
    description: `Partner with Shakespeare on the Sound and align your brand with professional, community Shakespeare. Our ${new Date().getFullYear()} sponsors include ${sponsors.map((s) => s.name).join(', ')}.`,
    cta: 'Become a Sponsor',
    highlight: false,
    href: `mailto:${site.email}`,
  },
  {
    icon: IconGift,
    title: 'Education Fund',
    description:
      'In order to provide educational programming to those who do not have access to Shakespeare or theatre education, we rely on your generosity. Your tax-deductible gift of any amount is greatly appreciated.',
    cta: 'Support Education',
    highlight: false,
    href: site.donateUrl,
  },
];

export default function Support() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Get Involved"
        title="Support Us"
        description="Shakespeare on the Sound is supported by generous individuals and businesses who share our passion for making professional Shakespeare accessible to everyone in Fairfield County."
        image={pageHeroImages.support}
      />

      <div className="max-w-6xl mx-auto page-gutter py-12 sm:py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="section-eyebrow mb-3">Ways to Give</span>
          <h2 className="font-display text-navy text-2xl sm:text-3xl font-semibold uppercase">Make a Difference</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
          {ways.map((way, i) => (
            <motion.div
              key={way.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`p-7 sm:p-10 h-full flex flex-col card-lift ${
                way.highlight
                  ? 'bg-gold text-navy-deep shadow-glow border border-gold-light/30'
                  : 'bg-white shadow-soft border border-navy/5'
              }`}
            >
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
              <a
                href={way.href}
                target={way.href.startsWith('http') ? '_blank' : undefined}
                rel={way.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`text-xs tracking-[0.2em] uppercase font-semibold border-b pb-0.5 hover:opacity-70 transition-opacity w-fit ${
                  way.highlight ? 'text-navy-deep border-navy-deep' : 'text-gold border-gold'
                }`}
              >
                {way.cta} →
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-navy py-14 sm:py-20 page-gutter grain-overlay">
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
      </div>

      <Sponsors />
      <TicketBanner />
    </PageLayout>
  );
}
