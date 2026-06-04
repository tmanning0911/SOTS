import { Link } from 'react-router-dom';
import Reveal from '../Reveal';
import OptimizedImage from '../OptimizedImage';
import PageSection from '../PageSection';
import { site } from '@/content/site';
import { images } from '@/content/images';

/** Orpheum 1:1 — Our Story split section */
export default function HomeOurStory() {
  return (
    <PageSection variant="parchment" bordered data-nav-zone="light">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <Reveal>
          <p className="section-eyebrow mb-4">Our Story</p>
          <h2 className="font-display text-navy text-3xl sm:text-4xl md:text-[2.75rem] font-semibold leading-[1.08] mb-6 text-balance">
            Enriching Fairfield County Through Performing Arts
          </h2>
          <p className="body-text mb-8">{site.mission}</p>
          <Link to="/about" className="orpheum-text-cta orpheum-text-cta-lg">
            Our Story
          </Link>
        </Reveal>
        <Reveal delay={0.08} className="relative">
          <OptimizedImage
            src={images.parkPerformance}
            alt="Audience at Shakespeare on the Sound in Pinkney Park"
            className="w-full object-cover aspect-[4/3]"
            wrapperClassName="w-full"
          />
        </Reveal>
      </div>
    </PageSection>
  );
}
