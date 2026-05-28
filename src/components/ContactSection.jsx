import ContactForm from './forms/ContactForm';
import { TheatreBackdrop } from './decor';

export default function ContactSection() {
  return (
    <TheatreBackdrop
      as="section"
      id="contact-form"
      variant="parchment"
      wash="everyone"
      ornaments="minimal"
      className="border-t border-navy/8 scroll-mt-28"
      data-nav-zone="light"
    >
      <div className="max-w-6xl mx-auto page-gutter py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <ContactForm variant="contact" />
          <ContactForm variant="education" />
        </div>
      </div>
    </TheatreBackdrop>
  );
}
