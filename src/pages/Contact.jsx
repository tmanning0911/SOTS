import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import FormCTA from '../components/forms/FormCTA';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import { site } from '@/content/site';
import { pageHeroImages } from '@/content/images';

export default function Contact() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        description="Tickets, education, volunteering, sponsorship, and general questions — we reply from our team inbox. We do not publish email addresses on this site."
        image={pageHeroImages.contact}
      />

      <PageSection variant="parchment" first>
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
          <aside className="lg:col-span-1">
            <SectionHeader
              eyebrow="Reach Us"
              title="Contact Info"
              align="left"
              className="!mb-6 !max-w-none"
            />
            <ul className="space-y-4 font-inter text-sm text-navy/80">
              <li>
                <span className="meta-label block mb-1">Phone</span>
                <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="hover:text-navy">
                  {site.phone}
                </a>
                <span className="text-navy/50 text-xs block">{site.phoneNote}</span>
              </li>
              <li>
                <span className="meta-label block mb-1">Mailing</span>
                {site.mailingAddress}
              </li>
              <li>
                <span className="meta-label block mb-1">Education</span>
                {site.educationDirector}
              </li>
              <li>
                <span className="meta-label block mb-1">Outreach & tours</span>
                {site.outreachDirector}
              </li>
            </ul>
            <p className="font-inter text-navy/55 text-xs leading-relaxed mt-8 border-t border-navy/8 pt-6">
              Pick a form on the right, or subscribe via the mailing list card below. The subscribe strip also
              appears above the footer on every page.
            </p>
          </aside>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5 sm:gap-6">
            <FormCTA variant="contact" buttonLabel="General Inquiry" />
            <FormCTA variant="education" buttonLabel="Education Programs" />
            <FormCTA variant="sponsorship" buttonLabel="Gala & Sponsorship" />
            <FormCTA variant="newsletter" buttonLabel="Subscribe" />
          </div>
        </div>
      </PageSection>
    </PageLayout>
  );
}
