import ContactForm from './ContactForm';

/** Compact mailing-list signup for footer and sidebars */
export default function NewsletterForm({ className = '' }) {
  return <ContactForm variant="newsletter" showTitle={false} className={className} />;
}
