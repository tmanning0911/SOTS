import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { IconHeart, IconStar, IconBuilding, IconGift } from '@/components/icons';
import Sponsors from '../components/Sponsors';
import { sponsors } from '@/content/site';
import { useEffect, useRef } from 'react';

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
    description: 'Your charitable contributions help defray the cost of our year-round productions, our 16 summer performances in Pinkney Park, Rowayton, and our year-round education programs. Each year we must raise at least $115,000 from supporters like you.',
    cta: 'Make a Donation',
    highlight: true,
    href: 'https://www.paypal.com/donate/?hosted_button_id=5FTZQ4CXESHXY',
  },
  {
    icon: IconStar,
    title: '2026 Gala',
    description: 'Save the Date for our Much Ado About Something gala on Friday, October 16, 2026, 6–10pm at The House Up on the Hill, 26 Seir Hill Rd., Norwalk, CT. Cocktails, bites, dancing, and live & silent auctions.',
    cta: 'Join the Committee',
    highlight: false,
    href: 'mailto:contactus@shakespeareonthesound.org',
  },
  {
    icon: IconBuilding,
    title: 'Corporate Partners',
    description: `Partner with Shakespeare on the Sound and align your brand with professional, community Shakespeare. Our ${new Date().getFullYear()} sponsors include ${sponsors.map((s) => s.name).join(', ')}.`,
    cta: 'Become a Sponsor',
    highlight: false,
    href: 'mailto:contactus@shakespeareonthesound.org',
  },
  {
    icon: IconGift,
    title: 'Education Fund',
    description: 'In order to provide educational programming to those who do not have access to Shakespeare or theatre education, we rely on your generosity. Your tax-deductible gift of any amount is greatly appreciated.',
    cta: 'Support Education',
    highlight: false,
    href: 'https://www.paypal.com/donate/?hosted_button_id=5FTZQ4CXESHXY',
  },
];

export default function Support() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <PageHero
        eyebrow="Get Involved"
        title="Support Us"
        description="Shakespeare on the Sound is supported by generous individuals and businesses who share our passion for making professional Shakespeare accessible to everyone in Fairfield County."
        image="/images/park-performance.jpg"
      />

      {/* Ways to Support */}
      <div className="max-w-6xl mx-auto page-gutter py-12 sm:py-16">
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
          {ways.map((way, i) => (
            <motion.div
              key={way.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-7 sm:p-10 ${way.highlight ? 'bg-gold text-navy-deep' : 'bg-white'}`}
            >
              <way.icon className={`mb-5 ${way.highlight ? 'text-white' : 'text-gold'}`} size={28} />
              <h3 className={`font-playfair text-2xl font-bold uppercase mb-3 ${way.highlight ? 'text-white' : 'text-navy'}`}>{way.title}</h3>
              <p className={`font-inter text-sm leading-relaxed mb-6 ${way.highlight ? 'text-white/90' : 'text-navy/90'}`}>{way.description}</p>
              <a
                href={way.href}
                target={way.href.startsWith('http') ? '_blank' : undefined}
                rel={way.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`text-xs tracking-[0.2em] uppercase font-medium border-b pb-0.5 hover:opacity-70 transition-opacity ${way.highlight ? 'text-white border-white' : 'text-gold border-gold'}`}
              >
                {way.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Impact Stats */}
      <div className="bg-navy py-14 sm:py-20 page-gutter">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-white text-2xl sm:text-3xl font-bold uppercase text-center mb-8 sm:mb-12">Your Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { stat: '16+', label: 'Summer Performances' },
              { stat: '115K', label: 'Raised Each Year' },
              { stat: '6+', label: 'Sponsor Partners' },
              { stat: '8+', label: 'Education Programs' },
            ].map(item => (
              <div key={item.label}>
                <p className="font-playfair text-rust text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                  <AnimatedStat stat={item.stat} />
                </p>
                <p className="font-inter text-white/80 text-xs tracking-widest uppercase">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Sponsors />
      <Footer />
    </div>
  );
}