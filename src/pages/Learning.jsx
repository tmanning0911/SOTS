import { useState, useEffect } from 'react';
import { content } from '@/api/content';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import { motion } from 'framer-motion';
import { LearningIcon } from '@/components/icons';
import CtaLink from '../components/CtaLink';
import { site } from '@/content/site';

export default function Learning() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    content.entities.LearningProgram.list('sort_order').then(data => {
      setPrograms(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <PageHero
        eyebrow="Education"
        title="Learning"
        description={site.educationBlurb}
        image="/images/news/shakespeare-for-kids.jpg"
      />

      <div className="max-w-6xl mx-auto page-gutter py-12 sm:py-16">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog, i) => {
              return (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white p-6 sm:p-8 md:p-10 group shadow-soft card-lift border border-navy/5 h-full flex flex-col"
                >
                  <LearningIcon name={prog.icon} className="text-gold mb-5" size={28} />
                  <h3 className="font-playfair text-navy text-xl font-bold uppercase mb-3">{prog.title}</h3>
                  <p className="font-inter text-navy/90 text-sm leading-relaxed mb-6">{prog.description}</p>
                  <CtaLink href={prog.ctaLink} className="link-gold !text-gold inline-block">
                    {prog.ctaText}
                  </CtaLink>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-navy py-14 sm:py-20 page-gutter">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-playfair text-white text-2xl sm:text-3xl md:text-4xl font-bold uppercase mb-4 text-balance">Bring Shakespeare to Your School</h2>
          <p className="font-inter text-white/60 text-sm max-w-md mx-auto mb-4 px-2">
            For information on pricing, booking and more, contact {site.outreachDirector} or {site.educationDirector}.
          </p>
          <p className="font-inter text-white/50 text-sm mb-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-0 break-all px-4">
            <a href={`mailto:${site.outreachEmail}`} className="hover:text-white transition-colors">{site.outreachEmail}</a>
            <span className="hidden sm:inline"> · </span>
            <a href={`mailto:${site.educationEmail}`} className="hover:text-white transition-colors">{site.educationEmail}</a>
          </p>
          <p className="font-inter text-white/50 text-sm mb-8">(203) 957-1006</p>
          <a href={`mailto:${site.educationEmail}`} className="btn-primary">
            Contact Our Education Team
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}