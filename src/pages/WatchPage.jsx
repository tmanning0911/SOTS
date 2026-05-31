import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import WatchOnline from '../components/WatchOnline';
import { pageHeroImages } from '@/content/images';

export default function WatchPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Watch & listen"
        title="On YouTube"
        description="Performance clips, education features, and season highlights from Pinkney Park."
        image={pageHeroImages.watch}
      />
      <WatchOnline />
    </PageLayout>
  );
}
