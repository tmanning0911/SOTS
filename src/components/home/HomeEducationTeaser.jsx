import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import { images } from '@/content/images';

/** Orpheum 1:1 — education programs teaser band */
export default function HomeEducationTeaser() {
  return (
    <section className="relative overflow-hidden bg-white border-y border-navy/10" data-nav-zone="light">
      <OptimizedImage
        src={images.news.kids}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-[0.1]"
        wrapperClassName="absolute inset-0 w-full h-full"
      />
      <div className="relative z-[1] site-container py-10 sm:py-12 text-center">
        <p className="font-inter text-navy/70 text-sm sm:text-base max-w-2xl mx-auto mb-4">
          Explore our Education and Community programs and opportunities.
        </p>
        <Link to="/learning" className="orpheum-text-cta orpheum-text-cta-lg text-navy">
          Education & Community
        </Link>
      </div>
    </section>
  );
}
