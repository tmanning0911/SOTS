import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import ContactCta from '../components/ContactCta';
import ContactChannelLink from '../components/ContactChannelLink';
import Reveal from '../components/Reveal';
import { Link } from 'react-router-dom';
import { TheatreBackdrop } from '../components/decor';
import OptimizedImage from '../components/OptimizedImage';
import { site, visitInfo } from '@/content/site';
import { images, pageHeroImages } from '@/content/images';

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
      <PageHero
        eyebrow="Rowayton, Connecticut"
        title="About Us"
        description={site.tagline}
        image={pageHeroImages.about}
      />

      <TheatreBackdrop variant="parchment" className="page-gutter py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-16 items-start">
          <Reveal>
            <span className="section-eyebrow mb-4">Mission & History</span>
            <h2 className="font-display text-navy text-3xl font-semibold uppercase mb-6">{site.name}</h2>
            <p className="font-inter text-navy/85 text-sm md:text-base leading-relaxed mb-4">{site.mission}</p>
            <p className="font-inter text-navy/85 text-sm md:text-base leading-relaxed mb-4">{site.missionEducation}</p>
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
          </Reveal>
          <Reveal delay={0.08} className="relative image-shine">
            <OptimizedImage
              src={images.shakespeareForEveryone}
              alt="Shakespeare on the Sound performance"
              className="w-full object-cover aspect-[4/5] sm:aspect-[3/4]"
              wrapperClassName="w-full shadow-soft border border-navy/5"
            />
          </Reveal>
        </div>
      </TheatreBackdrop>

      <TheatreBackdrop variant="cream" className="py-12 sm:py-14 page-gutter border-y border-navy/8">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <span className="section-eyebrow mb-3">Equality & Inclusivity</span>
            <h2 className="font-display text-navy text-2xl font-semibold uppercase mb-4">Diversity Statement</h2>
            <p className="font-inter text-navy/80 text-sm leading-relaxed">{site.diversityStatement}</p>
          </Reveal>
        </div>
      </TheatreBackdrop>

      <TheatreBackdrop variant="white" id="visit" className="py-12 sm:py-16 page-gutter scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <span className="section-eyebrow mb-3">Before You Go</span>
            <h2 className="font-display text-navy text-3xl font-semibold uppercase mb-8">Visit & Getting Here</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-10 md:gap-14">
            <Reveal delay={0.05}>
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
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-inter text-navy font-semibold text-xs uppercase tracking-widest mb-3">
                Education Tent & Kids&apos; Show
              </h3>
              <p className="font-inter text-navy/80 text-sm leading-relaxed mb-6">{visitInfo.educationTent}</p>
              <p className="font-inter text-navy/60 text-xs leading-relaxed border-t border-navy/10 pt-4">
                {site.cancellationSummary}
              </p>
            </Reveal>
          </div>
        </div>
      </TheatreBackdrop>

      {faqs.length > 0 && (
        <TheatreBackdrop variant="cream" id="faq" className="page-gutter py-12 sm:py-16 scroll-mt-28">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <span className="section-eyebrow mb-3">FAQ</span>
              <h2 className="font-display text-navy text-2xl sm:text-3xl font-semibold uppercase mb-8">
                Frequently Asked Questions
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, i) => (
                <Reveal key={faq.question} delay={i * 0.04}>
                  <div className="bg-white p-6 border border-navy/8 shadow-soft h-full">
                    <p className="text-gold text-[9px] tracking-[0.2em] uppercase font-semibold mb-2">{faq.category}</p>
                    <h3 className="font-display text-navy text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="font-inter text-navy/75 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </TheatreBackdrop>
      )}

      <section className="py-14 sm:py-20 page-gutter bg-navy-deep grain-overlay" data-nav-zone="dark">
        <div className="max-w-6xl mx-auto relative z-[1]">
          <Reveal className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-white text-2xl sm:text-3xl font-semibold uppercase">Who We Are</h2>
          </Reveal>
          <div className="space-y-0 max-w-3xl mx-auto">
            {milestones.map((m, i) => (
              <Reveal
                key={m.year}
                delay={i * 0.04}
                className="flex flex-col sm:flex-row gap-2 sm:gap-8 border-b border-white/10 py-5 last:border-0"
              >
                <span className="font-display text-gold text-xl sm:text-2xl font-semibold sm:w-24 flex-shrink-0">
                  {m.year}
                </span>
                <p className="font-inter text-white/85 text-sm leading-relaxed pt-0.5">{m.event}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <TheatreBackdrop variant="parchment" className="page-gutter py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <span className="section-eyebrow mb-3">Leadership</span>
            <h2 className="font-display text-navy text-2xl sm:text-3xl font-semibold uppercase mb-8 sm:mb-10">Our Team</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((person, i) => (
              <Reveal key={person.name} delay={i * 0.06} className="h-full">
                <div className="bg-white p-6 sm:p-8 border border-navy/8 shadow-soft h-full flex flex-col">
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
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </TheatreBackdrop>

      <ContactCta />
    </PageLayout>
  );
}
