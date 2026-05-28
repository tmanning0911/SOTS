import { Link } from 'react-router-dom';
import { visitInfo } from '@/content/site';
import PageSection from './PageSection';
import { OrnamentDivider } from './decor';

/** Short visit prompt — full directions & FAQs live on About. */
export default function VisitTeaser() {
  return (
    <PageSection variant="cream-dark" tight bordered data-nav-zone="light">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-8">
        <div className="max-w-xl">
          <p className="section-eyebrow mb-2">Plan Your Visit</p>
          <p className="section-title !text-xl sm:!text-2xl md:!text-3xl mb-3">{visitInfo.park}</p>
          <OrnamentDivider className="mb-4" />
          <p className="body-text !text-sm">
            Summer performances at 177 Rowayton Avenue — parking, picnics, kids&apos; show, and box office details
            on our visit page.
          </p>
        </div>
        <Link to="/about#visit" className="btn-outline shrink-0 w-full sm:w-auto text-center">
          Directions &amp; FAQs
        </Link>
      </div>
    </PageSection>
  );
}
