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
      <div className="max-w-6xl mx-auto page-gutter pb-14 sm:pb-20 text-center">
        <p className="font-inter text-navy/60 text-sm max-w-md mx-auto mb-8">
          Follow us for behind-the-scenes moments, education spotlights, and performance highlights.
        </p>
        <a
          href={site.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full sm:w-auto px-8 sm:px-10"
        >
          Open YouTube Channel
        </a>
      </div>
    </PageLayout>
  );
}
