import { useState, useEffect } from 'react';
import { cms } from '@/lib/cms';
import { seedLearning } from '@/lib/contentSeed';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import LearningProgramCard from '../components/LearningProgramCard';
import SectionHeader from '../components/SectionHeader';
import PageSection from '../components/PageSection';
import { useFormModal } from '@/lib/FormModalContext';
import { site } from '@/content/site';
import { Link } from 'react-router-dom';
import { contactPaths } from '@/lib/contactPaths';
import { pageHeroImages, pageArtBackgrounds } from '@/content/images';
import { pageCopy } from '@/content/voice';

export default function Learning() {
  const [programs, setPrograms] = useState(seedLearning);
  const { openForm } = useFormModal();

  useEffect(() => {
    cms.learning
      .list('sort_order')
      .then((data) => setPrograms(data))
      .catch(() => {});
  }, []);

  return (
    <PageLayout>
      <PageHero
        eyebrow="Education"
        title="Learning"
        description={pageCopy.learning.hero}
        image={pageHeroImages.learning}
        artBackground={pageArtBackgrounds.learning}
      />

      <PageSection variant="white" first>
        <SectionHeader
          eyebrow="Programs"
          title="Education & community"
          description="Book a school workshop, sign up for summer camp, or catch the free Kids' Show in the park. Our education team will help you find the right program."
          align="left"
        />
        {programs.length === 0 ? (
          <p className="text-body py-16">
            Program details coming soon.{' '}
            <Link to="/contact?topic=education" className="text-link !inline-flex">
              Contact us
            </Link>{' '}
            to book a school or library visit.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {programs.map((prog) => (
              <LearningProgramCard key={prog.id} program={prog} />
            ))}
          </div>
        )}
      </PageSection>

      <section
        id="education-form"
        data-nav-zone="dark"
        className="py-14 md:py-20 lg:py-24 bg-navy-deep border-b border-white/10"
      >
        <div className="site-container">
          <SectionHeader
            eyebrow="Schools & community"
            title="Bring Shakespeare to your school"
            description={`For pricing, booking, and outreach, contact ${site.outreachDirector} or ${site.educationDirector} through our education inquiry form.`}
            align="left"
            light
            className="!mb-8 !max-w-none"
          />
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={() => openForm('education')}>
              Request a program
            </button>
            <Link to={contactPaths.general} className="btn-ghost-light">
              All contact options
            </Link>
          </div>
          <p className="text-sm text-white/45 mt-6">
            Box office:{' '}
            <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="text-white/70 hover:text-white transition-colors">
              {site.phone}
            </a>
            <span className="text-white/35"> · {site.phoneNote}</span>
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
