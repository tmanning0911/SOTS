import { useState, useEffect } from 'react';
import { content } from '@/api/content';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import LoadingSpinner from '../components/LoadingSpinner';
import LearningProgramCard from '../components/LearningProgramCard';
import SectionHeader from '../components/SectionHeader';
import { site } from '@/content/site';
import { Link } from 'react-router-dom';
import { contactPaths } from '@/lib/contactPaths';
import NewsletterForm from '../components/forms/NewsletterForm';
import { pageHeroImages, images } from '@/content/images';
import ContactForm from '../components/forms/ContactForm';
import { TheatreBackdrop } from '../components/decor';

export default function Learning() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    content.entities.LearningProgram.list('sort_order').then((data) => {
      setPrograms(data);
      setLoading(false);
    });
  }, []);

  return (
    <PageLayout>
      <PageHero
        eyebrow="Education"
        title="Learning"
        description={site.educationBlurb}
        image={pageHeroImages.learning}
      />

      <TheatreBackdrop
        variant="cream"
        wash="kids"
        ornaments="minimal"
        className="page-gutter py-12 sm:py-16 md:py-20"
      >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Programs"
          title="Education Offerings"
          description="Workshops, tours, summer camps, and in-park programming for schools and communities across Fairfield County."
          align="center"
          className="!mb-10 sm:!mb-12"
        />
        {loading ? (
          <LoadingSpinner label="Loading programs" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {programs.map((prog, i) => (
              <LearningProgramCard key={prog.id} program={prog} index={i} />
            ))}
          </div>
        )}
      </div>
      </TheatreBackdrop>

      <section
        data-nav-zone="dark"
        className="relative py-16 sm:py-24 page-gutter overflow-hidden grain-overlay"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(220 48% 11% / 0.92), hsl(220 48% 11% / 0.85)), url(${images.backgrounds.education})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-6xl mx-auto text-center relative z-[1]">
          <span className="section-eyebrow text-gold-light mb-4">Schools & Community</span>
          <h2 className="font-display text-white text-2xl sm:text-3xl md:text-4xl font-semibold uppercase mb-4 text-balance">
            Bring Shakespeare to Your School
          </h2>
          <p className="font-inter text-white/60 text-sm max-w-lg mx-auto mb-6 px-2">
            For pricing, booking, and outreach, reach {site.outreachDirector} or {site.educationDirector} through
            our contact forms — we do not publish staff email addresses.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <Link to={contactPaths.educationForm} className="btn-primary">
              Request a Program
            </Link>
            <Link to={contactPaths.education} className="btn-secondary">
              Education Contact Form
            </Link>
          </div>
          <p className="font-inter text-white/45 text-sm">
            Box office:{' '}
            <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="text-gold hover:text-white transition-colors">
              {site.phone}
            </a>
            <span className="text-white/35"> · {site.phoneNote}</span>
          </p>
        </div>
      </section>

      <TheatreBackdrop
        as="section"
        id="education-form"
        variant="parchment"
        wash="education"
        ornaments="full"
        className="border-t border-navy/8 page-gutter py-14 sm:py-20 scroll-mt-28"
        data-nav-zone="light"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <ContactForm variant="education" />
          <div>
            <h3 className="font-display text-navy text-xl font-semibold uppercase mb-3">Stay Updated</h3>
            <p className="font-inter text-navy/70 text-sm mb-5 leading-relaxed">
              Season news and education announcements — join the mailing list.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </TheatreBackdrop>
    </PageLayout>
  );
}
