import { Link } from 'react-router-dom';
import { site } from '@/content/site';

/** Orpheum 1:1 — Support Our Mission callout */
export default function HomeSupportMission() {
  return (
    <section className="bg-white section-pad border-y border-navy/10" data-nav-zone="light">
      <div className="site-container text-center max-w-2xl mx-auto">
        <p className="section-eyebrow mb-4">Support Our Mission</p>
        <h2 className="font-display text-navy text-3xl sm:text-4xl font-semibold leading-tight mb-5">
          Help Keep Shakespeare Under the Stars
        </h2>
        <p className="font-inter text-navy/65 text-sm sm:text-base leading-relaxed mb-8">
          {site.donateBlurb}
        </p>
        <Link to="/support" className="orpheum-text-cta orpheum-text-cta-lg">
          Learn More
        </Link>
      </div>
    </section>
  );
}
