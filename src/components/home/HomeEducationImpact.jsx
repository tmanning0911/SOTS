import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import { ArtSectionBackground } from '../decor';
import { site } from '@/content/site';
import { images } from '@/content/images';

export default function HomeEducationImpact() {
  return (
    <section className="section relative bg-navy-deep text-white overflow-hidden" data-nav-zone="dark">
      <ArtSectionBackground src={images.art.cathedralCrowd} tone="dark" position="center" />
      <div className="site-container relative z-[1]">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <figure className="order-2 lg:order-1">
            <OptimizedImage
              src={images.news.kidsKings}
              alt="Shakespeare for Kids performance"
              className="w-full object-cover aspect-[4/3]"
              wrapperClassName="w-full"
            />
          </figure>
          <div className="order-1 lg:order-2">
            <p className="label text-white/45 mb-2">Education</p>
            <h2 className="heading-section text-white mb-5 text-balance">
              Workshops, tours, and summer camps
            </h2>
            <p className="text-body-lg text-white/70 max-w-prose mb-8">
              Education is at the cornerstone of Shakespeare on the Sound. We provide workshops,
              touring shows, and summer camps across Fairfield County.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/learning" className="btn-primary">
                Programs
              </Link>
              <a href={site.donateUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost-light">
                Donate
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
