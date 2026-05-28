import { IconStage, IconCurtain, IconTent } from '@/components/icons';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import OptimizedImage from './OptimizedImage';
import SectionHeader from './SectionHeader';
import { visitInfo, site } from '@/content/site';

export default function VisitPark() {
  return (
    <section className="section-pad bg-cream">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <SectionHeader
            eyebrow="Plan Your Visit"
            title={visitInfo.park}
            description={visitInfo.directions}
            align="left"
            className="mb-8 !max-w-none"
          />
          <ul className="space-y-5 mb-8">
            <Reveal delay={0.1}>
              <li className="flex gap-4">
                <IconStage size={20} className="text-gold flex-shrink-0 mt-0.5" />
                <span className="font-inter text-navy text-sm md:text-base">
                  {visitInfo.park}, {visitInfo.address}
                </span>
              </li>
            </Reveal>
            <Reveal delay={0.15}>
              <li className="flex gap-4">
                <IconCurtain size={20} className="text-gold flex-shrink-0 mt-0.5" />
                <span className="font-inter text-navy text-sm md:text-base">
                  {site.phoneNote}: {site.phone}
                </span>
              </li>
            </Reveal>
            <Reveal delay={0.2}>
              <li className="flex gap-4">
                <IconTent size={20} className="text-gold flex-shrink-0 mt-0.5" />
                <span className="font-inter text-navy/80 text-sm leading-relaxed">{visitInfo.educationTent}</span>
              </li>
            </Reveal>
          </ul>
          <Link to="/about#visit" className="link-gold">
            Visiting & FAQs
          </Link>
        </div>
        <Reveal delay={0.1} className="relative aspect-[4/3] overflow-hidden shadow-card image-shine">
          <OptimizedImage
            src="/images/park-performance.jpg"
            alt="Outdoor theatre at Pinkney Park"
            className="w-full h-full object-cover"
            wrapperClassName="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="font-display text-white text-2xl font-semibold uppercase">Performing Arts</p>
            <p className="font-inter text-white/75 text-xs mt-1 tracking-wide">at {site.name}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
