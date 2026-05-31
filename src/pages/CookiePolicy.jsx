import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import { pageHeroImages } from '@/content/images';
import { cookiePolicySections } from '@/content/cookies';
import { useCookieConsent } from '@/lib/CookieConsentContext';

export default function CookiePolicy() {
  const { openSettings } = useCookieConsent();

  return (
    <PageLayout>
      <PageHero
        eyebrow="Legal"
        title="Cookie Policy"
        description="How Shakespeare on the Sound uses cookies and how you can manage your preferences."
        image={pageHeroImages.about}
      />

      <PageSection variant="white" first>
        <div className="max-w-3xl">
          <p className="text-body-lg text-navy/80 mb-8 leading-relaxed">
            We use cookies to ensure that you have the best experience on our website. You can review
            categories and update your choices below.
          </p>
          <button type="button" className="btn-outline mb-10" onClick={openSettings}>
            Cookie settings
          </button>

          <div className="space-y-8">
            {cookiePolicySections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-2xl text-navy mb-3">{section.title}</h2>
                <p className="text-body text-navy/80 leading-relaxed">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </PageSection>
    </PageLayout>
  );
}
