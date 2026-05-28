import Reveal from './Reveal';
import SponsorLogo from './SponsorLogo';
import { sponsors } from '@/content/site';
import StaAffiliation from './StaAffiliation';
import { Link } from 'react-router-dom';

export default function Sponsors() {
  return (
    <section
      className="bg-white border-t border-b border-navy/10 py-14 sm:py-16 md:py-20 page-gutter"
      data-nav-zone="light"
      aria-labelledby="sponsors-heading"
    >
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="section-eyebrow mb-3">Community</span>
          <h2
            id="sponsors-heading"
            className="font-display text-navy text-2xl sm:text-3xl md:text-4xl font-semibold uppercase mb-4 text-balance"
          >
            Made Possible By
          </h2>
          <p className="font-inter text-navy/60 text-sm sm:text-base leading-relaxed">
            Generous partners who help keep Shakespeare accessible under the stars.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <ul className="grid grid-cols-2 md:grid-cols-3 list-none p-0 m-0 gap-px bg-navy/10 border border-navy/10 shadow-soft">
            {sponsors.map((sponsor) => (
              <li
                key={sponsor.name}
                className="flex items-center justify-center bg-white px-5 py-8 sm:px-8 sm:py-10 min-h-[96px] sm:min-h-[108px]"
              >
                <SponsorLogo sponsor={sponsor} />
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-navy/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <StaAffiliation theme="light" align="left" compact />
            <div className="lg:text-right shrink-0">
              <p className="font-inter text-navy/55 text-xs mb-3 max-w-xs lg:ml-auto">
                Partner with our 30th season — program ads, corporate sponsorship, and gala support.
              </p>
              <Link to="/support" className="btn-navy inline-flex">
                Become a Sponsor
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
