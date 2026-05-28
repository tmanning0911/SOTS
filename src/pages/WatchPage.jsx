import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import WatchOnline from '../components/WatchOnline';
import { site } from '@/content/site';
import { pageHeroImages } from '@/content/images';

export default function WatchPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Watch & Listen"
        title="On YouTube"
        description={`Clips, education features, and season highlights from ${site.name}. Subscribe for updates from Pinkney Park and beyond.`}
        image={pageHeroImages.watch}
      />
      <WatchOnline />
    </PageLayout>
  );
}
