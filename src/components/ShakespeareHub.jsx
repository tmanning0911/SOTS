import { IconBookOpen, IconMasks, IconStage, IconArrowRight } from '@/components/icons';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { OrnamentDivider } from './decor';
import OptimizedImage from './OptimizedImage';
import { site } from '@/content/site';
const features = [
  { Icon: IconBookOpen, label: 'In Schools', desc: 'Workshops for grades K–12 across Fairfield County' },
  { Icon: IconStage, label: 'Summer Camps', desc: 'The Globe Company for ages 8–15' },
  { Icon: IconMasks, label: 'Teacher Resources', desc: 'Professional development and in-park programming' },
];

export default function ShakespeareHub() {
  return (
    <section className="bg-navy-deep overflow-hidden grain-overlay relative accent-top-dark" data-nav-zone="dark">
      <div className="grid lg:grid-cols-2 min-h-0 lg:min-h-[480px] relative z-[1]">
        <Reveal className="flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 order-2 lg:order-1 relative">
          <span className="section-eyebrow text-gold-light mb-4 sm:mb-5">Education</span>
          <h2 className="font-display text-white text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-[1.05] mb-4 sm:mb-5 text-balance">
            Shakespeare for Everyone
          </h2>
          <OrnamentDivider light className="mb-5 sm:mb-6" />
          <p className="font-inter text-white/60 text-sm md:text-base leading-relaxed mb-8 sm:mb-10 max-w-md">
            {site.educationBlurb}
          </p>
          <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
            {features.map(({ Icon, label, desc }, i) => (
              <Reveal key={label} delay={0.08 + i * 0.05} y={12}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 border border-gold/40 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-inter text-white text-xs font-semibold uppercase tracking-widest mb-0.5">
                      {label}
                    </p>
                    <p className="font-inter text-white/50 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Link to="/learning" className="btn-primary w-full sm:w-fit group justify-center">
            More About Education
            <IconArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="relative overflow-hidden min-h-[240px] sm:min-h-[320px] lg:min-h-full order-1 lg:order-2">
          <OptimizedImage
            src="/images/shakespeare-hub.png"
            alt="Education programs"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.45]"
            wrapperClassName="absolute inset-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-navy-deep/30 to-navy-deep/70 lg:bg-gradient-to-l" />
          <div className="absolute top-6 right-4 sm:top-8 sm:right-8 border border-white/15 bg-white/5 backdrop-blur-md px-5 py-4 text-center">
            <p className="font-display text-white text-2xl sm:text-3xl font-semibold">K–12</p>
            <p className="font-inter text-white/55 text-[10px] tracking-[0.2em] uppercase mt-1">& Community</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
