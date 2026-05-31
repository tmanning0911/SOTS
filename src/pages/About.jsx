import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import ContactCta from '../components/ContactCta';
import ContactChannelLink from '../components/ContactChannelLink';
import OptimizedImage from '../components/OptimizedImage';
import StaAffiliation from '../components/StaAffiliation';
import { site, visitInfo } from '@/content/site';
import { images, pageHeroImages, pageArtBackgrounds } from '@/content/images';
import faqsSeed from '../../public/data/faqs.json';
import teamSeed from '../../public/data/team.json';
import milestonesSeed from '../../public/data/milestones.json';

export default function About() {
  const [faqs, setFaqs] = useState(faqsSeed);
  const [team, setTeam] = useState(teamSeed);
  const [milestones, setMilestones] = useState(milestonesSeed);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/faqs.json').then((r) => (r.ok ? r.json() : faqsSeed)),
      fetch('/data/team.json').then((r) => (r.ok ? r.json() : teamSeed)),
      fetch('/data/milestones.json').then((r) => (r.ok ? r.json() : milestonesSeed)),
    ])
      .then(([f, t, m]) => {
        setFaqs(Array.isArray(f) && f.length ? f : faqsSeed);
        setTeam(Array.isArray(t) && t.length ? t : teamSeed);
        setMilestones(Array.isArray(m) && m.length ? m : milestonesSeed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <PageHero
        eyebrow="Rowayton, Connecticut"
        title="About"
        description={site.mission}
        image={pageHeroImages.about}
        artBackground={pageArtBackgrounds.about}
      />

      <PageSection variant="white" first>
        <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-start">
          <div>
            <SectionHeader
              eyebrow="Mission & history"
              title={site.name}
              align="left"
              className="!mb-6 !max-w-none"
            />
            <p className="text-body mb-4">{site.mission}</p>
            <p className="text-body mb-6">{site.missionEducation}</p>
            <div id="reach-us" className="border-t border-navy/10 pt-6 space-y-3 scroll-mt-28 text-sm text-navy/70">
              <p>
                <span className="font-semibold text-navy">Mailing:</span> {site.mailingAddress}
              </p>
              <p>
                <span className="font-semibold text-navy">Park:</span> {site.parkAddress}
              </p>
              <p>
                <span className="font-semibold text-navy">Office:</span> {site.officeAddress}
              </p>
              <p>
                <span className="font-semibold text-navy">Email:</span>{' '}
                <Link to="/contact" className="text-link text-sm !inline-flex">
                  Contact form
                </Link>
              </p>
              <p>
                <span className="font-semibold text-navy">Phone:</span> {site.phone} ({site.phoneNote})
              </p>
            </div>
          </div>
          <figure>
            <OptimizedImage
              src={images.shakespeareForEveryone}
              alt="Shakespeare on the Sound performance"
              className="w-full object-cover aspect-[4/3]"
              wrapperClassName="w-full"
            />
          </figure>
        </div>
      </PageSection>

      <PageSection variant="white">
        <div className="max-w-3xl">
          <SectionHeader
            eyebrow="Equality & inclusivity"
            title="Diversity statement"
            align="left"
            className="!mb-4 !max-w-none"
          />
          <p className="text-body text-sm">{site.diversityStatement}</p>
        </div>
      </PageSection>

      <PageSection variant="white" id="visit" className="scroll-mt-28">
        <SectionHeader
          eyebrow="Before you go"
          title="Visit & getting here"
          align="left"
          className="!mb-8 !max-w-none"
        />
        <div className="grid md:grid-cols-2 gap-10 md:gap-14">
          <div>
            <h3 className="label mb-3">In the park</h3>
            <p className="text-body text-sm mb-4">{visitInfo.directions}</p>
            <p className="text-sm font-medium text-navy mb-4">
              {visitInfo.park}, {visitInfo.address}
            </p>
            <p className="text-body text-sm">{visitInfo.parking}</p>
            <Link to="/plays" className="text-link text-sm inline-flex mt-6">
              View productions & tickets
            </Link>
          </div>
          <div>
            <h3 className="label mb-3">Education tent & kids&apos; show</h3>
            <p className="text-body text-sm mb-6">{visitInfo.educationTent}</p>
            <p className="text-body text-xs text-navy/55 border-t border-navy/10 pt-4">
              {site.cancellationSummary}
            </p>
          </div>
        </div>
      </PageSection>

      {faqs.length > 0 && (
        <PageSection variant="white" id="faq" className="scroll-mt-28">
          <SectionHeader
            eyebrow="FAQ"
            title="Frequently asked questions"
            align="left"
            className="!mb-8 !max-w-none"
          />
          <dl className="divide-y divide-navy/10 max-w-3xl">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-6 first:pt-0">
                <dt className="label mb-2">{faq.category}</dt>
                <dd>
                  <p className="font-display text-lg text-navy mb-2">{faq.question}</p>
                  <p className="text-body text-sm">{faq.answer}</p>
                </dd>
              </div>
            ))}
          </dl>
        </PageSection>
      )}

      {!loading && milestones.length > 0 && (
        <section className="py-14 md:py-20 lg:py-24 bg-navy-deep border-b border-white/10" data-nav-zone="dark">
          <div className="site-container">
            <SectionHeader eyebrow="History" title="Who we are" align="left" light className="!mb-8 !max-w-none" />
            <ul className="divide-y divide-white/10 max-w-3xl">
              {milestones.map((m) => (
                <li
                  key={m.year}
                  className="flex flex-col sm:flex-row gap-2 sm:gap-8 py-5 first:pt-0"
                >
                  <span className="font-display text-gold text-xl sm:text-2xl font-medium sm:w-24 shrink-0">
                    {m.year}
                  </span>
                  <p className="text-body text-sm text-white/75 pt-0.5">{m.event}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {!loading && team.length > 0 && (
        <PageSection variant="white">
          <SectionHeader
            eyebrow="Leadership"
            title="Our team"
            align="left"
            className="!mb-8 !max-w-none"
          />
          <ul className="divide-y divide-navy/10">
            {team.map((person) => (
              <li key={person.name} className="py-8 grid sm:grid-cols-[minmax(0,12rem)_1fr] gap-4 sm:gap-10">
                <div>
                  <p className="font-display text-xl text-navy">{person.name}</p>
                  <p className="label mt-1">
                    {person.role}
                    {person.pronouns ? ` · ${person.pronouns}` : ''}
                  </p>
                </div>
                <div>
                  <p className="text-body text-sm mb-4">{person.bio}</p>
                  <ContactChannelLink
                    channel={person.role?.toLowerCase().includes('education') ? 'education' : 'general'}
                    className="text-link text-sm"
                  >
                    Send a message
                  </ContactChannelLink>
                </div>
              </li>
            ))}
          </ul>
        </PageSection>
      )}

      <PageSection variant="white">
        <StaAffiliation align="left" compact />
      </PageSection>

      <ContactCta />
    </PageLayout>
  );
}
