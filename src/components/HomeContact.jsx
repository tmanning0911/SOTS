import SectionHeader from './SectionHeader';
import ContactForm from './forms/ContactForm';
import NewsletterForm from './forms/NewsletterForm';
import { TheatreBackdrop } from './decor';

export default function HomeContact() {
  return (
    <TheatreBackdrop
      as="section"
      variant="cream-dark"
      wash="stage"
      ornaments="minimal"
      className="section-pad border-t border-navy/8"
      data-nav-zone="light"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Get in Touch"
          title="Contact Us"
          description="Questions about tickets, education, or volunteering? Send a message — we respond as quickly as possible during the season."
          align="center"
          className="!mb-10"
        />
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          <div>
            <h3 className="font-display text-navy text-lg font-semibold uppercase mb-4">Send a Message</h3>
            <ContactForm variant="contact" showTitle={false} />
          </div>
          <div id="home-newsletter">
            <h3 className="font-display text-navy text-lg font-semibold uppercase mb-4">Join the List</h3>
            <p className="font-inter text-navy/70 text-sm mb-5 leading-relaxed">
              Season announcements, education news, and ticket reminders — no spam.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </TheatreBackdrop>
  );
}
