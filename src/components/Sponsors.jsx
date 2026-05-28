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
      variant="cream"
      wash="audience"
      ornaments="minimal"
      className="section-pad border-t border-navy/5"
      data-nav-zone="light"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Community"
          title="Made Possible By"
          description="Generous partners who help keep Shakespeare accessible under the stars."
          align="center"
        />
        <ul className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8 sm:gap-x-8 sm:gap-y-10 md:gap-x-12 md:gap-y-12 max-w-4xl mx-auto mb-10 sm:mb-12 list-none p-0 m-0">
          {sponsors.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.04} as="li" className="flex items-center justify-center">
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-full max-w-[200px] sm:max-w-[220px] mx-auto items-center justify-center min-h-[56px] rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                  aria-label={s.name}
                >
                  {s.logo ? (
                    <OptimizedImage
                      src={s.logo}
                      alt={s.name}
                      className="max-h-14 md:max-h-16 w-full object-contain opacity-90 grayscale-[15%] transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                      wrapperClassName="w-full bg-transparent"
                    />
                  ) : (
                    <span className="font-display text-navy/80 text-lg font-medium text-center group-hover:text-gold transition-colors">
                      {s.name}
                    </span>
                  )}
                </a>
              ) : (
                <span className="font-display text-navy/80 text-lg font-medium text-center">
                  {s.name}
                </span>
              )}
            </Reveal>
          ))}
        </ul>
        <Reveal className="text-center">
          <StaAffiliation theme="light" className="mb-8" />
          <Link to="/support" className="link-gold inline-block">
            Become a Sponsor
          </Link>
        </Reveal>
      </div>
    </TheatreBackdrop>
  );
}
