import { Link } from 'react-router-dom';
import Reveal from '../Reveal';
import OptimizedImage from '../OptimizedImage';
import { images } from '@/content/images';

/** Orpheum 1:1 — Making an impact full-bleed section */
export default function HomeEducationImpact() {
  return (
    <section className="relative overflow-hidden bg-navy-deep" data-nav-zone="dark">
      <OptimizedImage
        src={images.shakespeareHub}
        alt=""
        className="absolute inset-0 w-full h-full object-cover brightness-[0.22]"
        wrapperClassName="absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 bg-navy-deep/80" />

      <div className="relative z-[1] site-container section-pad text-center max-w-3xl mx-auto">
        <Reveal>
          <p className="section-eyebrow text-gold-light mb-4">Making an Impact</p>
          <h2 className="font-display text-white text-3xl sm:text-4xl md:text-[2.75rem] font-semibold leading-[1.08] mb-5 text-balance">
            Setting the Scene for Outdoor Shakespeare
          </h2>
          <p className="font-inter text-white/60 text-sm md:text-base leading-relaxed mb-8">
            Our programs create positive change and foster community by providing a stage for creative
            expression — in schools, libraries, summer camps, and Pinkney Park.
          </p>
          <Link to="/learning" className="orpheum-text-cta orpheum-text-cta-lg text-gold">
            Education and Community
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
