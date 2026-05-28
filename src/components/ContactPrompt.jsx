import SectionHeader from './SectionHeader';
import FormCTA from './forms/FormCTA';
import { TheatreBackdrop } from './decor';

/** Shared contact form prompts (used on About and similar inner pages). */
export default function ContactPrompt() {
  return (
    <TheatreBackdrop
      as="section"
      id="contact-form"
      variant="parchment"
      className="border-t border-navy/8 scroll-mt-28 page-gutter py-12 sm:py-16"
      data-nav-zone="light"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Get in Touch"
          title="We Would Love to Hear From You"
          description="Open a form below — your message goes to our team inbox. We do not publish email addresses on this site."
          align="center"
          className="!mb-10"
        />
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto">
          <FormCTA variant="contact" buttonLabel="General Inquiry" />
          <FormCTA variant="education" buttonLabel="Education Inquiry" />
        </div>
      </div>
    </TheatreBackdrop>
  );
}
