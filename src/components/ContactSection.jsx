import { site } from '@/content/site';

export default function ContactSection() {
  return (
    <section id="contact-form" className="bg-cream border-t border-navy/8 scroll-mt-28">
      <div className="max-w-6xl mx-auto page-gutter py-12 sm:py-16">
        <span className="section-eyebrow mb-3">Contact Us</span>
        <h2 className="font-display text-navy text-2xl sm:text-3xl font-semibold uppercase mb-4">Get in Touch</h2>
        <p className="font-inter text-navy/70 text-sm max-w-xl mb-8 leading-relaxed">
          Need tickets, education booking, or general questions? Email us — we respond as quickly as possible during the
          season.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <a href={`mailto:${site.email}`} className="btn-navy">
            Email {site.email}
          </a>
          <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="btn-primary">
            Call {site.phone}
          </a>
          <a href={site.ticketsUrl} target="_blank" rel="noopener noreferrer" className="btn-navy">
            Get Tickets
          </a>
        </div>
        <p className="font-inter text-navy/50 text-xs mt-6">
          Education questions: {site.educationDirector} —{' '}
          <a href={`mailto:${site.educationEmail}`} className="text-gold hover:underline">
            {site.educationEmail}
          </a>
        </p>
      </div>
    </section>
  );
}
