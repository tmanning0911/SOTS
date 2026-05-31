import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cms } from '@/lib/cms';
import { seedPlays } from '@/lib/contentSeed';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import ProductionFeature from '../components/ProductionFeature';
import { pageHeroImages, pageArtBackgrounds } from '@/content/images';
import { pageCopy } from '@/content/voice';

export default function Plays() {
  const [productions, setProductions] = useState(seedPlays);

  useEffect(() => {
    cms.plays
      .list('sort_order')
      .then((data) => setProductions(data.filter((p) => p.status !== 'Archived')))
      .catch(() => {});
  }, []);

  return (
    <PageLayout>
      <PageHero
        eyebrow="Pinkney Park · Rowayton, CT"
        title="Productions"
        description={pageCopy.plays.hero}
        image={pageHeroImages.plays}
        artBackground={pageArtBackgrounds.plays}
      />

      <PageSection variant="white" first>
        <SectionHeader
          eyebrow="2026 season"
          title="On stage this summer"
          description={pageCopy.plays.section}
          align="left"
        />
        {productions.length === 0 ? (
          <div className="text-center py-16 border-t border-navy/10">
            <p className="heading-section mb-4">Season details coming soon</p>
            <p className="text-body max-w-md mx-auto">
              Check back for our summer lineup, or{' '}
              <Link to="/contact" className="text-link text-sm !inline-flex">
                contact us
              </Link>{' '}
              for the latest schedule.
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {productions.map((prod, i) => (
              <ProductionFeature key={prod.id} production={prod} index={i} />
            ))}
          </div>
        )}
      </PageSection>
    </PageLayout>
  );
}
