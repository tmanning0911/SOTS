import { Link } from 'react-router-dom';
import { ArtSectionBackground } from '../decor';
import ParkLocationMap from '../ParkLocationMap';
import { site, parkDirectionsUrl } from '@/content/site';
import { seasonVoice } from '@/content/voice';
import { images } from '@/content/images';

export default function HomeOurStory() {
  return (
    <section className="section relative bg-white border-b border-navy/10 overflow-hidden" data-nav-zone="light">
      <ArtSectionBackground src={images.art.horsemenCastle} tone="light" position="left" />
      <div className="site-container relative z-[1]">
        <div className="our-story-grid">
          <div className="our-story-grid__copy">
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
              <a
                href={parkDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Plan your visit
              </a>
            </div>
          </div>
          <ParkLocationMap className="visit-map--feature our-story-grid__map" />
        </div>
      </div>
    </section>
  );
}
