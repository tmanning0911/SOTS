import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import WatchOnline from '../components/WatchOnline';
import { site } from '@/content/site';

export default function WatchPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <PageHero
        eyebrow="Watch & Listen"
        title="On YouTube"
        description={`Clips, education features, and season highlights from ${site.name}. Subscribe for updates from Pinkney Park and beyond.`}
        image="/images/park-performance.jpg"
      />
      <WatchOnline />
      <div className="max-w-6xl mx-auto page-gutter pb-14 sm:pb-20 text-center">
        <a
          href={site.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full sm:w-auto px-8 sm:px-10"
        >
          Open YouTube Channel
        </a>
      </div>
      <Footer />
    </div>
  );
}
