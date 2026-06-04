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
    <section className="section relative bg-white border-b border-navy/10" data-nav-zone="light">
      <div className="site-container">
        <div className="coming-up-feature">
          <div className="coming-up-feature__media">
            <img
              src={images.news.galaPromo}
              alt={`${site.gala.title} — annual fundraiser`}
              loading="lazy"
              decoding="async"
              className="coming-up-feature__photo"
            />
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
