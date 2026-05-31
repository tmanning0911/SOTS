import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import FormCTA from '../components/forms/FormCTA';
import PageSection from '../components/PageSection';
import { site } from '@/content/site';
import { pageHeroImages } from '@/content/images';
import { pageCopy } from '@/content/voice';

export default function Contact() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description={pageCopy.contact.hero}
        image={pageHeroImages.contact}
      />

      <PageSection variant="white" first>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <aside className="lg:col-span-4">
            <p className="label mb-2">Reach us</p>
            <h2 className="heading-section mb-6">Box office & staff</h2>
            <dl className="space-y-5 text-sm text-navy/80">
              <div>
                <dt className="meta-label mb-1">Phone</dt>
                <dd>
                  <a
                    href={`tel:${site.phone.replace(/\D/g, '')}`}
                    className="font-display text-xl text-navy hover:text-gold transition-colors"
                  >
                    {site.phone}
                  </a>
                  <p className="text-navy/50 text-xs mt-1">{site.phoneNote}</p>
                </dd>
              </div>
              <div>
                <dt className="meta-label mb-1">Mailing</dt>
                <dd>{site.mailingAddress}</dd>
              </div>
              <div>
                <dt className="meta-label mb-1">Education</dt>
                <dd>{site.educationDirector}</dd>
              </div>
              <div>
                <dt className="meta-label mb-1">Outreach & tours</dt>
                <dd>{site.outreachDirector}</dd>
              </div>
            </dl>
            <p className="text-body text-sm mt-8 pt-6 border-t border-navy/10 max-w-prose">
              {pageCopy.contact.cta}
            </p>
          </aside>

          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-5 sm:gap-6">
            <FormCTA variant="contact" buttonLabel="General inquiry" />
            <FormCTA variant="education" buttonLabel="Education programs" />
            <FormCTA variant="sponsorship" buttonLabel="Gala & sponsorship" />
            <FormCTA variant="newsletter" buttonLabel="Join mailing list" />
          </div>
        </div>
      </PageSection>
    </PageLayout>
  );
}
