import SectionHeader from './SectionHeader';
import FormCTA from './forms/FormCTA';
import { TheatreBackdrop } from './decor';

export default function HomeContact() {
  return (
    <TheatreBackdrop
      as="section"
      variant="cream-dark"
      className="section-pad border-t border-navy/8"
      data-nav-zone="light"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Get in Touch"
          title="Contact Us"
          description="Questions about tickets, education, or volunteering? Pick the form that fits — we respond as quickly as we can during the season."
          align="center"
          className="!mb-10"
        />
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto">
          <FormCTA
            variant="contact"
            title="Send a Message"
            description="Tickets, volunteering, general questions, and more."
            buttonLabel="Contact Us"
          />
          <FormCTA
            variant="education"
            title="Education Programs"
            description="Book workshops, tours, or summer camps for your school or group."
            buttonLabel="Book a Program"
          />
        </div>
      </div>
    </TheatreBackdrop>
  );
}
