import { Link } from 'react-router-dom';
import { visitInfo } from '@/content/site';
import { TheatreBackdrop } from './decor';

/** Short visit prompt — full directions & FAQs live on About. */
export default function VisitTeaser() {
  return (
    <TheatreBackdrop
      as="section"
      variant="cream-dark"
      className="border-t border-navy/8 page-gutter py-10 sm:py-12"
      data-nav-zone="light"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="max-w-xl">
          <p className="section-eyebrow mb-2">Plan Your Visit</p>
          <p className="font-display text-navy text-xl sm:text-2xl font-semibold uppercase mb-2">
            {visitInfo.park}
          </p>
          <p className="font-inter text-navy/70 text-sm leading-relaxed">
            Summer performances at 177 Rowayton Avenue — parking, picnics, kids&apos; show, and box office details
            on our visit page.
          </p>
        </div>
        <Link to="/about#visit" className="btn-outline shrink-0 w-full sm:w-auto text-center">
          Directions &amp; FAQs
        </Link>
      </div>
    </TheatreBackdrop>
  );
}
