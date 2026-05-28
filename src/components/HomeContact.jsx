import { site } from '@/content/site';
import SectionHeader from './SectionHeader';

export default function HomeContact() {
  return (
    <section className="section-pad bg-cream-dark border-t border-navy/8" data-nav-zone="light">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Get in Touch"
          title="Contact Us"
          description="Questions about tickets, education, or volunteering? We'd love to hear from you."
          align="center"
        />
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 max-w-lg mx-auto">
          <a href={`mailto:${site.email}`} className="btn-navy w-full sm:w-auto justify-center">
            Email Us
          </a>
          <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="btn-primary w-full sm:w-auto justify-center">
            {site.phone}
          </a>
        </div>
        <p className="font-inter text-navy/50 text-xs text-center mt-6 max-w-md mx-auto leading-relaxed">
          {site.mailingAddress} · Education: {site.educationDirector} —{' '}
          <a href={`mailto:${site.educationEmail}`} className="text-gold hover:underline">
            {site.educationEmail}
          </a>
        </p>
      </div>
    </section>
  );
}
