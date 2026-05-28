import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import Sponsors from '../components/Sponsors';
import TicketBanner from '../components/TicketBanner';
import ContactSection from '../components/ContactSection';
import ContactChannelLink from '../components/ContactChannelLink';
import { Link } from 'react-router-dom';
import StaAffiliation from '../components/StaAffiliation';
import { TheatreBackdrop } from '../components/decor';
import OptimizedImage from '../components/OptimizedImage';
import { motion } from 'framer-motion';
import { site, visitInfo } from '@/content/site';
import { images } from '@/content/images';

export default function About() {
  const [faqs, setFaqs] = useState([]);
  const [team, setTeam] = useState([]);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/data/faqs.json').then((r) => r.json()),
      fetch('/data/team.json').then((r) => r.json()),
      fetch('/data/milestones.json').then((r) => r.json()),
    ]).then(([f, t, m]) => {
      setFaqs(f);
      setTeam(t);
      setMilestones(m);
    });
  }, []);

  return (
    <PageLayout>
      <div
        data-nav-zone="dark"
        className="relative h-[48vh] min-h-[320px] sm:h-[55vh] md:h-[60vh] max-h-[560px] overflow-hidden bg-navy-deep grain-overlay"
      >
        <OptimizedImage
          src={images.aboutBanner}
          alt=""
          priority
          className="w-full h-full object-cover brightness-[0.4]"
          wrapperClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/60 to-navy-deep/20" />
        <div className="absolute inset-0 flex items-end px-4 sm:px-6 md:px-16 pb-10 sm:pb-16">
          <motion.div
            className="max-w-6xl mx-auto w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-eyebrow mb-4">Rowayton, Connecticut</span>
            <h1 className="font-display text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold uppercase leading-[1.02] text-balance">
              About Us
            </h1>
            <p className="font-inter text-white/70 text-sm md:text-base mt-4 max-w-xl">{site.tagline}</p>
            <div className="mt-6 h-px w-14 bg-gold" aria-hidden />
          </motion.div>
        </div>
      </div>

      <TheatreBackdrop variant="parchment" className="page-gutter py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-16 items-start">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section-eyebrow mb-4">Mission & History</span>
            <h2 className="font-display text-navy text-3xl font-semibold uppercase mb-6">{site.name}</h2>
            <p className="font-inter text-navy/85 text-sm md:text-base leading-relaxed mb-4">{site.mission}</p>
            <p className="font-inter text-navy/85 text-sm md:text-base leading-relaxed mb-4">{site.missionEducation}</p>
            <div className="mb-8 py-8 border-y border-navy/10">
              <StaAffiliation theme="light" align="left" compact />
            </div>
            <div id="reach-us" className="border-t border-navy/10 pt-6 space-y-3 scroll-mt-28">
              <p className="font-inter text-navy/70 text-sm">
                <span className="font-semibold text-navy">Mailing:</span> {site.mailingAddress}
              </p>
              <p className="font-inter text-navy/70 text-sm">
                <span className="font-semibold text-navy">Park:</span> {site.parkAddress}
              </p>
              <p className="font-inter text-navy/70 text-sm">
                <span className="font-semibold text-navy">Office:</span> {site.officeAddress}
              </p>
              <p className="font-inter text-navy/70 text-sm">
                <span className="font-semibold text-navy">Email:</span>{' '}
                <Link to="/contact" className="text-gold hover:underline">
                  Contact form
                </Link>
              </p>
              <p className="font-inter text-navy/70 text-sm">
                <span className="font-semibold text-navy">Phone:</span> {site.phone} ({site.phoneNote})
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative image-shine"
          >
            <OptimizedImage
              src={images.shakespeareForEveryone}
              alt="Shakespeare on the Sound performance"
              className="w-full object-cover aspect-[4/5] sm:aspect-[3/4]"
              wrapperClassName="w-full shadow-soft border border-navy/5"
            />
          </motion.div>
        </div>
      </TheatreBackdrop>

      <div className="bg-navy/5 py-12 sm:py-14 page-gutter border-y border-navy/8">
        <div className="max-w-3xl mx-auto">
          <span className="section-eyebrow mb-3">Equality & Inclusivity</span>
          <h2 className="font-display text-navy text-2xl font-semibold uppercase mb-4">Diversity Statement</h2>
          <p className="font-inter text-navy/80 text-sm leading-relaxed">{site.diversityStatement}</p>
        </div>
      </div>

      <div id="visit" className="bg-white py-12 sm:py-16 page-gutter border-b border-navy/8 scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          <span className="section-eyebrow mb-3">Before You Go</span>
          <h2 className="font-display text-navy text-3xl font-semibold uppercase mb-8">Visit & Getting Here</h2>
          <div className="grid md:grid-cols-2 gap-10 md:gap-14">
            <div>
              <h3 className="font-inter text-navy font-semibold text-xs uppercase tracking-widest mb-3">
                In the Park
              </h3>
              <p className="font-inter text-navy/80 text-sm leading-relaxed mb-4">{visitInfo.directions}</p>
              <p className="font-inter text-navy text-sm font-medium mb-4">
                {visitInfo.park}, {visitInfo.address}
              </p>
              <p className="font-inter text-navy/70 text-sm leading-relaxed">{visitInfo.parking}</p>
              <Link to="/plays" className="link-gold inline-block mt-6">
                View Productions & Tickets
              </Link>
            </div>
            <div>
              <h3 className="font-inter text-navy font-semibold text-xs uppercase tracking-widest mb-3">
                Education Tent & Kids' Show
              </h3>
              <p className="font-inter text-navy/80 text-sm leading-relaxed mb-6">{visitInfo.educationTent}</p>
              <p className="font-inter text-navy/60 text-xs leading-relaxed border-t border-navy/10 pt-4">
                {site.cancellationSummary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {faqs.length > 0 && (
        <div id="faq" className="max-w-6xl mx-auto page-gutter py-12 sm:py-16 scroll-mt-28">
          <span className="section-eyebrow mb-3">FAQ</span>
          <h2 className="font-display text-navy text-2xl sm:text-3xl font-semibold uppercase mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-white p-6 border border-navy/8 shadow-soft">
                <p className="text-gold text-[9px] tracking-[0.2em] uppercase font-semibold mb-2">{faq.category}</p>
                <h3 className="font-display text-navy text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="font-inter text-navy/75 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="py-14 sm:py-20 page-gutter bg-navy-deep" data-nav-zone="dark">
        <div className="max-w-6xl mx-auto relative z-[1]">
          <h2 className="font-display text-white text-2xl sm:text-3xl font-semibold uppercase mb-8 sm:mb-12 text-center">
            Who We Are
          </h2>
          <div className="space-y-0 max-w-3xl mx-auto">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex flex-col sm:flex-row gap-2 sm:gap-8 border-b border-white/10 py-5 last:border-0"
              >
                <span className="font-display text-gold text-xl sm:text-2xl font-semibold sm:w-24 flex-shrink-0">
                  {m.year}
                </span>
                <p className="font-inter text-white/85 text-sm leading-relaxed pt-0.5">{m.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto page-gutter py-12 sm:py-16 md:py-20">
        <span className="section-eyebrow mb-3">Leadership</span>
        <h2 className="font-display text-navy text-2xl sm:text-3xl font-semibold uppercase mb-8 sm:mb-10">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white p-6 sm:p-8 border border-navy/8 shadow-soft card-lift h-full flex flex-col"
            >
              <div
                className="w-14 h-14 mb-4 bg-navy/5 border border-gold/30 flex items-center justify-center"
                aria-hidden
              >
                <span className="font-display text-gold text-xl font-semibold">
                  {person.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <p className="font-display text-navy text-lg font-semibold uppercase">{person.name}</p>
              <p className="font-inter text-navy/60 text-xs tracking-widest uppercase mt-1">
                {person.role}
                {person.pronouns ? ` · ${person.pronouns}` : ''}
              </p>
              <p className="font-inter text-navy/75 text-sm leading-relaxed mt-3 mb-4 flex-1">{person.bio}</p>
              <ContactChannelLink
                channel={person.role?.toLowerCase().includes('education') ? 'education' : 'general'}
                className="font-inter text-gold text-sm hover:underline"
              >
                Send a message
              </ContactChannelLink>
            </motion.div>
          ))}
        </div>
      </div>

      <ContactSection />
      <Sponsors />
      <TicketBanner />
    </PageLayout>
  );
}
