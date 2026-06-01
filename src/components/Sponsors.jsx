import SponsorLogo from './SponsorLogo';
import { sponsors } from '@/content/site';

export default function Sponsors() {
  const loopedSponsors = [...sponsors, ...sponsors];

  return (
    <section
      id="sponsors"
      className="py-14 md:py-16 bg-white border-t border-navy/10 scroll-mt-24"
      data-nav-zone="light"
      aria-labelledby="sponsors-heading"
    >
      <div className="site-container">
        <p id="sponsors-heading" className="label mb-8 text-center">
          Supported by our community
        </p>
        <div className="sponsors-marquee" role="region" aria-label="Community sponsors">
          <ul className="sponsors-marquee__track list-none p-0 m-0">
            {loopedSponsors.map((sponsor, idx) => {
              const isDuplicate = idx >= sponsors.length;
              return (
                <li
                  key={`${sponsor.name}-${idx}`}
                  className="sponsors-marquee__item flex items-center justify-center min-h-[56px]"
                  aria-hidden={isDuplicate}
                >
                  <SponsorLogo sponsor={sponsor} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
