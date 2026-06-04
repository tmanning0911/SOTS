import { site } from '@/content/site';
import { images } from '@/content/images';
import { contactPaths } from '@/lib/contactPaths';
import { seedEvents } from '@/lib/contentSeed';
import { Link } from 'react-router-dom';
import AddToCalendar from '../AddToCalendar';

const galaEvent = seedEvents.find((e) => e.id === 'gala-2026');

/** Gala save-the-date — synced from shakespeareonthesound.org homepage. */
export default function HomeComingUp() {
  return (
    <section className="section relative bg-white border-b border-navy/10 overflow-hidden" data-nav-zone="light">
      <div className="site-container relative z-[1]">
        <div className="coming-up-feature">
          <div className="coming-up-feature__media">
            <div className="coming-up-feature__media-deco" aria-hidden="true">
              <span className="coming-up-feature__shape" />
              <span className="coming-up-feature__glow" />
              <span className="coming-up-feature__accent" />
            </div>
            <div className="coming-up-feature__photo-wrap">
              <img
                src={images.news.galaPromo}
                alt={`${site.gala.title} — annual fundraiser`}
                loading="lazy"
                decoding="async"
                className="coming-up-feature__photo"
              />
            </div>
            <svg
              className="coming-up-feature__brushstroke brushstroke-svg"
              viewBox="0 0 262.66 50.88"
              strokeWidth="2"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M1,49.88C12.83,33.6,25.27,17.44,45.71,7.73,54.13,3.67,65.36.43,74.23,1.08c5.98.45,9.63,2.74,9.4,6.78-.93,6.71-6.51,11.82-10.4,17.12-4.2,5.15-15.37,18.92-2.96,17.41,18.35-3.44,34.01-21.1,51.58-28.07,7.12-3.04,14.45-4.75,16.8-3.12,5.07,4.64-14.32,19.05-2.82,24.65,8.76,3.52,19.48,1.5,28.61-.15,20.84-4.28,41.86-13.17,73.84-12.03,7.7.24,15.59.95,23.38,1.66" />
            </svg>
          </div>

          <div className="coming-up-feature__copy">
            <p className="coming-up-feature__eyebrow">Coming up next</p>
            <h2 className="coming-up-feature__title text-balance">{site.gala.title}</h2>
            <span className="coming-up-feature__rule" aria-hidden="true" />
            <p className="coming-up-feature__meta">
              {site.gala.date} · {site.gala.time}
            </p>
            <p className="coming-up-feature__venue">
              {site.gala.venue} · {site.gala.address}
            </p>
            <p className="coming-up-feature__body">{site.gala.description}</p>
            <div className="flex flex-wrap gap-3 btn-stack-mobile sm:flex-row">
              <Link to="/events#gala-2026" className="btn-primary">
                Gala details
              </Link>
              <Link to={contactPaths.gala} className="btn-outline">
                Join the committee
              </Link>
            </div>
            {galaEvent && (
              <div className="coming-up-feature__calendar">
                <AddToCalendar item={galaEvent} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
