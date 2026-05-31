import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import { site } from '@/content/site';
import { images } from '@/content/images';

/** Gala save-the-date — synced from shakespeareonthesound.org homepage. */
export default function HomeComingUp() {
  return (
    <section className="section bg-white border-b border-navy/10" data-nav-zone="light">
      <div className="site-container">
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
            <div className="flex flex-wrap gap-3">
              <Link to="/events#gala-2026" className="btn-primary">
                Gala details
              </Link>
              <Link to="/contact?topic=sponsorship" className="btn-outline">
                Join the committee
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
