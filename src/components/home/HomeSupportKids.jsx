import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import { ArtSectionBackground } from '../decor';
import { site } from '@/content/site';
import { images } from '@/content/images';

/** Donate + for kids — two teasers from the live site homepage. */
export default function HomeSupportKids() {
  return (
    <section className="section relative bg-white border-b border-navy/10 overflow-hidden" data-nav-zone="light">
      <ArtSectionBackground src={images.art.tragedyScene} tone="light" position="center" />
      <div className="site-container relative z-[1]">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12">
          <article className="grid sm:grid-cols-[1fr_1.1fr] gap-6 items-center">
            <OptimizedImage
              src={images.backgrounds.parkAudienceNyt}
              alt="Audience at Shakespeare on the Sound in Pinkney Park"
              className="w-full aspect-[4/3] object-cover"
              wrapperClassName="w-full"
            />
            <div>
              <h2 className="font-display text-2xl text-navy mb-3">Donate</h2>
              <p className="text-body text-sm mb-6">
                Support Shakespeare on the Sound — your gift keeps productions and education programs
                running year-round.
              </p>
              <a
                href={site.donateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link text-sm"
              >
                Donate today
              </a>
            </div>
          </article>

          <article className="grid sm:grid-cols-[1fr_1.1fr] gap-6 items-center">
            <OptimizedImage
              src={images.news.kidsKings}
              alt="Shakespeare for Kids performance"
              className="w-full aspect-[4/3] object-cover"
              wrapperClassName="w-full"
            />
            <div>
              <h2 className="font-display text-2xl text-navy mb-3">For kids</h2>
              <p className="text-body text-sm mb-6">
                Bring Shakespeare into your classroom and catch Shakespeare for Kids in the park — free
                at 6:30pm every show night.
              </p>
              <Link to="/learning" className="text-link text-sm">
                Education programs
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
