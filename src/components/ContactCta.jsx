import { Link } from 'react-router-dom';
import PageSection from './PageSection';
import { pageCopy } from '@/content/voice';

export default function ContactCta() {
  return (
    <PageSection variant="white" tight bordered data-nav-zone="light">
      <div className="max-w-2xl">
        <p className="label mb-2">Contact</p>
        <h2 className="heading-section mb-4">Talk to the box office</h2>
        <p className="text-body mb-8 max-w-prose">{pageCopy.contact.cta}</p>
        <Link to="/contact" className="btn-primary">
          Contact us
        </Link>
      </div>
    </PageSection>
  );
}
