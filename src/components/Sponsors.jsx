import SponsorLogo from './SponsorLogo';
import { sponsors } from '@/content/site';

export default function Sponsors() {
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
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10 list-none p-0 m-0">
          {sponsors.map((sponsor) => (
            <li key={sponsor.name} className="flex items-center justify-center min-h-[56px]">
              <SponsorLogo sponsor={sponsor} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
