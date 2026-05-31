import { Link } from 'react-router-dom';
import Reveal from '../Reveal';
import OptimizedImage from '../OptimizedImage';

export default function HomeEducationTeaser() {
  return (
    <section className="relative overflow-hidden" data-nav-zone="light">
      <OptimizedImage
        src="/images/news/shakespeare-for-kids.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        wrapperClassName="absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/92 to-cream/75" aria-hidden />
      <div className="absolute inset-0 bg-section-pattern opacity-40 pointer-events-none" aria-hidden />

      <div className="relative z-[1] page-container py-14 sm:py-16 text-center">
        <Reveal>
          <p className="home-section-eyebrow mb-4">Education & Community</p>
          <p className="font-display text-navy text-2xl sm:text-3xl font-semibold max-w-2xl mx-auto mb-6 leading-snug text-balance">
            Explore our Education and Community programs and opportunities.
          </p>
          <Link to="/learning" className="btn-navy inline-flex min-w-[220px]">
            Learn More
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
