import Reveal from './Reveal';
import SponsorLogo from './SponsorLogo';
import SectionHeader from './SectionHeader';
import { sponsors } from '@/content/site';
import StaAffiliation from './StaAffiliation';
import { Link } from 'react-router-dom';
import PageSection from './PageSection';

export default function Sponsors() {
  return (
    <PageSection
      id="sponsors"
      variant="white"
      bordered
      className="scroll-mt-24"
      data-nav-zone="light"
      aria-labelledby="sponsors-heading"
    >
      <SectionHeader
        eyebrow="Community"
        title="Made Possible By"
        titleId="sponsors-heading"
        description="Generous partners who help keep Shakespeare accessible under the stars."
        align="center"
        className="!mb-10 sm:!mb-12"
      />

      <Reveal delay={0.05}>
        <ul className="grid grid-cols-2 md:grid-cols-3 list-none p-0 m-0 gap-px bg-navy/10 border border-navy/8 shadow-soft">
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

      <Reveal delay={0.1} className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-navy/8">
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
    </PageSection>
  );
}
