import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import FormCTA from '../components/forms/FormCTA';
import { site } from '@/content/site';
import { images } from '@/content/images';
import { TheatreBackdrop } from '../components/decor';

function topicToVariant(topic) {
  if (topic === 'education') return 'education';
  if (topic === 'sponsorship') return 'sponsorship';
  if (topic) return 'contact';
  return null;
}

export default function Contact() {
  const [searchParams, setSearchParams] = useSearchParams();
  const topic = searchParams.get('topic');
  const variantFromUrl = useMemo(() => topicToVariant(topic), [topic]);
  const [openVariant, setOpenVariant] = useState(null);

  useEffect(() => {
    if (variantFromUrl) setOpenVariant(variantFromUrl);
  }, [variantFromUrl]);

  const clearUrlTopic = () => {
    if (topic) {
      const next = new URLSearchParams(searchParams);
      next.delete('topic');
      setSearchParams(next, { replace: true });
    }
  };

  const handleDialogChange = (variant) => (open) => {
    if (open) setOpenVariant(variant);
    else {
      setOpenVariant(null);
      if (variantFromUrl === variant) clearUrlTopic();
    }
  };

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
        className="page-gutter py-12 sm:py-16 md:py-20"
        data-nav-zone="light"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
            <aside className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="font-display text-navy text-xl font-semibold uppercase mb-4">Reach Us</h2>
                <ul className="space-y-4 font-inter text-sm text-navy/80">
                  <li>
                    <span className="block text-navy font-semibold text-xs uppercase tracking-wider mb-1">
                      General & tickets
                    </span>
                    <button
                      type="button"
                      className="text-gold hover:underline text-left"
                      onClick={() => setOpenVariant('contact')}
                    >
                      Open contact form →
                    </button>
                  </li>
                  <li>
                    <span className="block text-navy font-semibold text-xs uppercase tracking-wider mb-1">
                      Education
                    </span>
                    {site.educationDirector}
                    <br />
                    <button
                      type="button"
                      className="text-gold hover:underline text-left"
                      onClick={() => setOpenVariant('education')}
                    >
                      Education inquiry form →
                    </button>
                  </li>
                  <li>
                    <span className="block text-navy font-semibold text-xs uppercase tracking-wider mb-1">
                      Outreach & tours
                    </span>
                    {site.outreachDirector}
                    <br />
                    <button
                      type="button"
                      className="text-gold hover:underline text-left"
                      onClick={() => setOpenVariant('education')}
                    >
                      Book a program →
                    </button>
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
            </aside>

            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5 sm:gap-6">
              <FormCTA
                variant="contact"
                buttonLabel="General Inquiry"
                open={openVariant === 'contact'}
                onOpenChange={handleDialogChange('contact')}
              />
              <FormCTA
                variant="education"
                buttonLabel="Education Programs"
                open={openVariant === 'education'}
                onOpenChange={handleDialogChange('education')}
              />
              <FormCTA
                variant="sponsorship"
                buttonLabel="Sponsorship & Gala"
                open={openVariant === 'sponsorship'}
                onOpenChange={handleDialogChange('sponsorship')}
              />
              <FormCTA
                variant="newsletter"
                buttonLabel="Join Mailing List"
                featured
                open={openVariant === 'newsletter'}
                onOpenChange={handleDialogChange('newsletter')}
              />
            </div>
          </div>
        </div>
      </TheatreBackdrop>
    </PageLayout>
  );
}
