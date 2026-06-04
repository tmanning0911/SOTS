import Reveal from './Reveal';
import SponsorLogo from './SponsorLogo';
import { sponsors } from '@/content/site';
import { Link } from 'react-router-dom';

/** Orpheum 1:1 — institutional partners logo grid */
export default function Sponsors() {
  return (
    <section
      id="sponsors"
      className="bg-white section-pad border-t border-navy/10 scroll-mt-24"
      data-nav-zone="light"
      aria-labelledby="sponsors-heading"
    >
      <div className="site-container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <h2
            id="sponsors-heading"
            className="font-display text-navy text-3xl sm:text-4xl font-semibold uppercase tracking-wide"
          >
            Our Institutional Partners
          </h2>
          <Link to="/support" className="orpheum-text-cta orpheum-text-cta-lg shrink-0">
            View All Partners
          </Link>
        </div>

        <Reveal delay={0.05}>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 list-none p-0 m-0 gap-4 sm:gap-6">
            {sponsors.map((sponsor) => (
              <li
                key={sponsor.name}
                className="flex items-center justify-center bg-white border border-navy/8 px-4 py-6 sm:py-8 min-h-[88px]"
              >
                <SponsorLogo sponsor={sponsor} />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
