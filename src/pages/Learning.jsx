import { useState, useEffect } from 'react';
import { content } from '@/api/content';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import { motion } from 'framer-motion';
import { LearningIcon, IconArrowRight } from '@/components/icons';
import CtaLink from '../components/CtaLink';
import LoadingSpinner from '../components/LoadingSpinner';
import { site } from '@/content/site';
import { pageHeroImages, images } from '@/content/images';

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

      <div className="max-w-6xl mx-auto page-gutter py-12 sm:py-16 md:py-20">
        {loading ? (
          <LoadingSpinner label="Loading programs" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog, i) => (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="bg-white p-6 sm:p-8 group shadow-soft card-lift border border-navy/5 h-full flex flex-col"
              >
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center mb-5 group-hover:border-gold transition-colors">
                  <LearningIcon name={prog.icon} className="text-gold" size={24} />
                </div>
                <h3 className="font-display text-navy text-xl font-semibold uppercase mb-3">{prog.title}</h3>
                <p className="font-inter text-navy/80 text-sm leading-relaxed mb-6 flex-1">{prog.description}</p>
                <CtaLink
                  href={prog.ctaLink}
                  className="link-gold !text-gold inline-flex items-center gap-2 mt-auto"
                >
                  {prog.ctaText}
                  <IconArrowRight size={14} />
                </CtaLink>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <section
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
            For pricing, booking, and outreach, contact {site.outreachDirector} or {site.educationDirector}.
          </p>
          <p className="font-inter text-white/50 text-sm mb-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 break-all px-4">
            <a href={`mailto:${site.outreachEmail}`} className="hover:text-gold transition-colors">
              {site.outreachEmail}
            </a>
            <span className="hidden sm:inline text-white/30">·</span>
            <a href={`mailto:${site.educationEmail}`} className="hover:text-gold transition-colors">
              {site.educationEmail}
            </a>
          </p>
          <p className="font-inter text-white/45 text-sm mb-8">{site.phone}</p>
          <a href={`mailto:${site.educationEmail}`} className="btn-primary">
            Contact Our Education Team
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
