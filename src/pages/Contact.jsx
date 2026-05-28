import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import FormCTA from '../components/forms/FormCTA';
import { site } from '@/content/site';
import { images } from '@/content/images';
import { TheatreBackdrop } from '../components/decor';

export default function Contact() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        description="Tickets, education, volunteering, sponsorship, and general questions — we reply from our team inbox. We do not publish email addresses on this site."
        image={images.parkPerformance}
      />

      <TheatreBackdrop
        variant="parchment"
        className="page-gutter py-12 sm:py-16 md:py-20"
        data-nav-zone="light"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
            <aside className="lg:col-span-1">
              <h2 className="font-display text-navy text-xl font-semibold uppercase mb-4">Reach Us</h2>
              <ul className="space-y-4 font-inter text-sm text-navy/80">
                <li>
                  <span className="block text-navy font-semibold text-xs uppercase tracking-wider mb-1">Phone</span>
                  <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="hover:text-navy">
                    {site.phone}
                  </a>
                  <span className="text-navy/50 text-xs block">{site.phoneNote}</span>
                </li>
                <li>
                  <span className="block text-navy font-semibold text-xs uppercase tracking-wider mb-1">Mailing</span>
                  {site.mailingAddress}
                </li>
                <li>
                  <span className="block text-navy font-semibold text-xs uppercase tracking-wider mb-1">
                    Education
                  </span>
                  {site.educationDirector}
                </li>
                <li>
                  <span className="block text-navy font-semibold text-xs uppercase tracking-wider mb-1">
                    Outreach & tours
                  </span>
                  {site.outreachDirector}
                </li>
              </ul>
              <p className="font-inter text-navy/55 text-xs leading-relaxed mt-8 border-t border-navy/10 pt-6">
                Choose a form to the right. For season updates, use the mailing list strip above the footer.
              </p>
            </aside>

            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5 sm:gap-6">
              <FormCTA variant="contact" buttonLabel="General Inquiry" />
              <FormCTA variant="education" buttonLabel="Education Programs" />
              <FormCTA
                variant="sponsorship"
                buttonLabel="Gala & Sponsorship"
                className="sm:col-span-2 sm:max-w-md"
              />
            </div>
          </div>
        </div>
      </TheatreBackdrop>
    </PageLayout>
  );
}
