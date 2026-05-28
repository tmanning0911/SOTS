import SectionHeader from './SectionHeader';
import FormCTA from './forms/FormCTA';
import { TheatreBackdrop } from './decor';

export default function ContactSection() {
  return (
    <TheatreBackdrop
      as="section"
      id="contact-form"
      variant="parchment"
      wash="everyone"
      className="border-t border-navy/8 scroll-mt-28"
      data-nav-zone="light"
    >
      <div className="max-w-6xl mx-auto page-gutter py-12 sm:py-16">
        <SectionHeader
          eyebrow="Get in Touch"
          title="We Would Love to Hear From You"
          description="Open a form below — your message goes to our team inbox. We do not publish email addresses on this site."
          align="center"
          className="!mb-10"
        />
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
          <FormCTA variant="contact" buttonLabel="General Inquiry" />
          <FormCTA variant="education" buttonLabel="Education Inquiry" />
        </div>
      </div>
    </TheatreBackdrop>
  );
}
