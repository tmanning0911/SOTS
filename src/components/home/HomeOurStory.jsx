import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import { ShakespeareWatermark } from '../decor';
import { site } from '@/content/site';
import { seasonVoice } from '@/content/voice';

export default function HomeOurStory() {
  return (
    <section className="section relative bg-white border-b border-navy/10 overflow-hidden" data-nav-zone="light">
      <ShakespeareWatermark variant="quill" tone="light" position="left" />
      <div className="site-container relative z-[1]">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="label mb-2">About us</p>
            <h2 className="heading-section mb-5 text-balance">
              {seasonVoice.number} seasons under the stars
            </h2>
            <p className="text-body max-w-prose mb-5">{site.mission}</p>
            <p className="text-body text-navy/60 max-w-prose mb-8">
              {seasonVoice.number} seasons on the Five Mile River — bring a blanket, pack a picnic, gates open at{' '}
              {seasonVoice.parkOpens}.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/about" className="text-link">
                Our story
              </Link>
              <Link to="/about#visit" className="text-link">
                Plan your visit
              </Link>
            </div>
          </div>
          <figure>
            <OptimizedImage
              src="/images/park-performance.jpg"
              alt="Audience at Shakespeare on the Sound in Pinkney Park"
              className="w-full object-cover aspect-[4/3]"
              wrapperClassName="w-full"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
