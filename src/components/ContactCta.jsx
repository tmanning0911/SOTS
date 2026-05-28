import { Link } from 'react-router-dom';
import { TheatreBackdrop } from './decor';

/** Single link to the contact hub — avoids duplicating form cards on About. */
export default function ContactCta() {
  return (
    <TheatreBackdrop
      as="section"
      variant="parchment"
      className="border-t border-navy/8 page-gutter py-12 sm:py-16"
      data-nav-zone="light"
    >
      <div className="max-w-6xl mx-auto text-center">
        <span className="section-eyebrow mb-3">Get in Touch</span>
        <h2 className="font-display text-navy text-2xl sm:text-3xl font-semibold uppercase mb-4 text-balance">
          Questions? We&apos;re Here to Help
        </h2>
        <p className="font-inter text-navy/70 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
          Tickets, education, volunteering, and sponsorship — choose the right form on our contact page. We
          respond from our team inbox during the season.
        </p>
        <Link to="/contact" className="btn-primary">
          Go to Contact
        </Link>
      </div>
    </TheatreBackdrop>
  );
}
