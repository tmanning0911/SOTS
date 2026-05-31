import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import { Link } from 'react-router-dom';
import { site } from '@/content/site';
import { pageHeroImages } from '@/content/images';
import { pageCopy, homeCopy } from '@/content/voice';
import { contactPaths } from '@/lib/contactPaths';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';

const ways = [
  {
    title: 'Donate',
    description: site.donateBlurb,
    cta: 'Make a donation',
    href: site.donateUrl,
    external: true,
  },
  {
    title: '2026 gala',
    description: `Much Ado About Something — ${site.gala.date}, ${site.gala.time} at ${site.gala.venue}. Cocktails, bites, dancing, and live & silent auctions.`,
    cta: 'Gala details',
    href: '/events#gala-2026',
    external: false,
  },
  {
    title: 'Corporate partners',
    description: homeCopy.getInvolved,
    cta: 'Sponsorship inquiry',
    href: contactPaths.sponsorship,
    external: false,
  },
];

function SupportCard({ way }) {
  const className =
    'group flex flex-col h-full p-8 border border-navy/10 bg-white hover:border-navy/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold';

  const inner = (
    <>
      <h3 className="font-display text-2xl font-medium text-navy mb-3">{way.title}</h3>
      <p className="text-body text-sm mb-8 flex-1 max-w-prose">{way.description}</p>
      <span className="text-link text-sm">{way.cta}</span>
    </>
  );

  if (way.external) {
    return (
      <a href={way.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link to={way.href} className={className}>
      {inner}
    </Link>
  );
}

export default function Support() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Get involved"
        title="Support the festival"
        description={pageCopy.support.hero}
        image={pageHeroImages.support}
      />

      <PageSection variant="white" first>
        <SectionHeader
          eyebrow="Ways to give"
          title="Help keep tickets affordable"
          description={homeCopy.supportCard}
          align="left"
        />
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {ways.map((way) => (
            <SupportCard key={way.title} way={way} />
          ))}
        </div>
      </PageSection>

      <PageSection variant="white" tight className="text-center !border-t">
        <p className="text-body max-w-prose mx-auto mb-6">
          Sixteen summer performances, eight education programs, and thirty seasons on the Five Mile River — made
          possible by neighbors who show up.
        </p>
        <Link to="/#sponsors" className="text-link text-sm">
          See our {new Date().getFullYear()} partners
        </Link>
      </PageSection>
    </PageLayout>
  );
}
