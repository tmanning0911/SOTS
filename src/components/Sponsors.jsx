import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import OptimizedImage from './OptimizedImage';
import { sponsors } from '@/content/site';
import StaAffiliation from './StaAffiliation';
import { TheatreBackdrop } from './decor';
import { Link } from 'react-router-dom';

export default function Sponsors() {
  return (
    <TheatreBackdrop
      as="section"
      variant="white"
      className="py-10 sm:py-12 md:py-14 page-gutter border-t border-b border-navy/8"
      data-nav-zone="light"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Community"
          title="Made Possible By"
          description="Generous partners who help keep Shakespeare accessible under the stars."
          align="left"
          className="!mb-6 sm:!mb-8 !max-w-xl"
        />

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-5 gap-y-6 sm:gap-x-6 sm:gap-y-7 mb-8 sm:mb-10 list-none p-0 m-0 justify-items-start">
          {sponsors.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.04} as="li" className="flex items-center justify-start w-full">
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-full max-w-[140px] items-center justify-start min-h-[44px] rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                  aria-label={s.name}
                >
                  {s.logo ? (
                    <OptimizedImage
                      src={s.logo}
                      alt={s.name}
                      className="max-h-10 sm:max-h-11 w-full object-contain object-left opacity-90 grayscale-[15%] transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                      wrapperClassName="w-full bg-transparent"
                    />
                  ) : (
                    <span className="font-display text-navy/80 text-sm font-medium text-left group-hover:text-gold transition-colors">
                      {s.name}
                    </span>
                  )}
                </a>
              ) : (
                <span className="font-display text-navy/80 text-sm font-medium text-left">{s.name}</span>
              )}
            </Reveal>
          ))}
        </ul>

        <Reveal className="flex flex-col items-start gap-4 sm:gap-5">
          <StaAffiliation theme="light" align="left" compact />
          <Link to="/support" className="link-gold text-xs sm:text-sm">
            Become a Sponsor
          </Link>
        </Reveal>
      </div>
    </TheatreBackdrop>
  );
}
