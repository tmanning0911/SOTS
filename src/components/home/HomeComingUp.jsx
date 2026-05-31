import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import { ArtSectionBackground } from '../decor';
import { site } from '@/content/site';
import { images } from '@/content/images';
import { seedEvents } from '@/lib/contentSeed';
import AddToCalendar from '../AddToCalendar';

const galaEvent = seedEvents.find((e) => e.id === 'gala-2026');

/** Gala save-the-date — synced from shakespeareonthesound.org homepage. */
export default function HomeComingUp() {
  return (
    <section className="section relative bg-white border-b border-navy/10 overflow-hidden" data-nav-zone="light">
      <ArtSectionBackground src={images.art.masqueArches} tone="light" position="right" />
      <div className="site-container relative z-[1]">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <OptimizedImage
            src={images.news.galaPromo}
            alt=""
            className="w-full aspect-[16/10] object-contain bg-cream/50 p-4"
            wrapperClassName="w-full border border-navy/10"
          />
          <div>
            <p className="label mb-2">Coming up next</p>
            <h2 className="heading-section mb-3">{site.gala.title}</h2>
            <p className="font-display text-lg text-navy/75 mb-1">
              {site.gala.date} · {site.gala.time}
            </p>
            <p className="text-sm text-navy/50 mb-5">
              {site.gala.venue} · {site.gala.address}
            </p>
            <p className="text-body max-w-prose mb-8">{site.gala.description}</p>
            <div className="flex flex-wrap gap-3 btn-stack-mobile sm:flex-row mb-6">
              <Link to="/events#gala-2026" className="btn-primary">
                Gala details
              </Link>
              <Link to="/contact?topic=sponsorship" className="btn-outline">
                Join the committee
              </Link>
            </div>
            {galaEvent && <AddToCalendar item={galaEvent} />}
          </div>
        </div>
      </div>
    </section>
  );
}
