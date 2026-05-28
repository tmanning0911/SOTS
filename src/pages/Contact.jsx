import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import ContactForm from '../components/forms/ContactForm';
import NewsletterForm from '../components/forms/NewsletterForm';
import { site } from '@/content/site';
import { images } from '@/content/images';
import { TheatreBackdrop } from '../components/decor';
import { contactPaths } from '@/lib/contactPaths';
import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        description="General inquiries, tickets, education booking, and sponsorship — we respond by email without publishing addresses on the site."
        image={images.parkPerformance}
      />

      <TheatreBackdrop
        variant="parchment"
        wash="park"
        ornaments="minimal"
        className="page-gutter py-12 sm:py-16 md:py-20"
        data-nav-zone="light"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
            <aside className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="font-display text-navy text-xl font-semibold uppercase mb-4">Reach Us</h2>
                <ul className="space-y-4 font-inter text-sm text-navy/80">
                  <li>
                    <span className="block text-navy font-semibold text-xs uppercase tracking-wider mb-1">
                      General & tickets
                    </span>
                    <Link to={contactPaths.general} className="text-gold hover:underline">
                      Contact form →
                    </Link>
                  </li>
                  <li>
                    <span className="block text-navy font-semibold text-xs uppercase tracking-wider mb-1">
                      Education
                    </span>
                    {site.educationDirector}
                    <br />
                    <Link to={contactPaths.education} className="text-gold hover:underline">
                      Education inquiry form →
                    </Link>
                  </li>
                  <li>
                    <span className="block text-navy font-semibold text-xs uppercase tracking-wider mb-1">
                      Outreach & tours
                    </span>
                    {site.outreachDirector}
                    <br />
                    <Link to={contactPaths.education} className="text-gold hover:underline">
                      Book a program →
                    </Link>
                  </li>
                  <li>
                    <span className="block text-navy font-semibold text-xs uppercase tracking-wider mb-1">
                      Phone
                    </span>
                    <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="hover:text-navy">
                      {site.phone}
                    </a>
                    <span className="text-navy/50 text-xs block">{site.phoneNote}</span>
                  </li>
                  <li>
                    <span className="block text-navy font-semibold text-xs uppercase tracking-wider mb-1">
                      Mailing
                    </span>
                    {site.mailingAddress}
                  </li>
                </ul>
              </div>

              <div className="border-t border-navy/10 pt-8">
                <h3 className="font-display text-navy text-lg font-semibold uppercase mb-4">Mailing List</h3>
                <NewsletterForm />
              </div>
            </aside>

            <div className="lg:col-span-2 space-y-12">
              <ContactForm variant="contact" showTitle={false} />
              <ContactForm variant="education" />
            </div>
          </div>
        </div>
      </TheatreBackdrop>
    </PageLayout>
  );
}
