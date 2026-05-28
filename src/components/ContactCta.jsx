import { Link } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import PageSection from './PageSection';

/** Single link to the contact hub — avoids duplicating form cards on About. */
export default function ContactCta() {
  return (
    <PageSection variant="parchment" tight bordered data-nav-zone="light">
      <SectionHeader
        eyebrow="Get in Touch"
        title="Questions? We're Here to Help"
        description="Tickets, education, volunteering, and sponsorship — choose the right form on our contact page. We respond from our team inbox during the season."
        align="center"
        className="!mb-8"
      />
      <div className="text-center">
        <Link to="/contact" className="btn-primary">
          Go to Contact
        </Link>
      </div>
    </PageSection>
  );
}
