import { Link } from 'react-router-dom';
import { site } from '@/content/site';
import { images } from '@/content/images';
import OptimizedImage from './OptimizedImage';
import PageSection from './PageSection';

const playlists = [
  {
    title: 'Shakespeare in 30 Minutes',
    description: 'Family-friendly half-hour versions before select performances.',
    image: images.news.kids,
  },
  {
    title: 'Education & outreach',
    description: 'Workshops, touring shows, and summer camps across Fairfield County.',
    image: images.learning.inSchools,
  },
  {
    title: 'Season highlights',
    description: 'Clips, interviews, and behind-the-scenes from Pinkney Park.',
    image: images.news.audience,
  },
];

export default function WatchOnline() {
  return (
    <PageSection variant="white" first>
      <div className="relative aspect-video bg-navy-deep overflow-hidden mb-12 md:mb-16">
        <OptimizedImage
          src={images.news.audience}
          alt=""
          className="w-full h-full object-cover opacity-80"
          wrapperClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-navy-deep/50 flex flex-col items-center justify-center text-center p-8">
          <p className="label text-white/45 mb-3">YouTube channel</p>
          <h2 className="heading-section text-white mb-4 max-w-lg">Performance clips & education features</h2>
          <a
            href={site.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Open channel
          </a>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-8 mb-12">
        {playlists.map((item) => (
          <a
            key={item.title}
            href={site.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
          >
            <OptimizedImage
              src={item.image}
              alt=""
              className="w-full aspect-[16/10] object-cover mb-4"
              wrapperClassName="w-full"
            />
            <h3 className="font-display text-lg font-medium text-navy mb-2 group-hover:text-gold transition-colors">
              {item.title}
            </h3>
            <p className="text-body text-sm">{item.description}</p>
          </a>
        ))}
      </div>

      <div className="border-t border-navy/10 pt-10 text-center">
        <p className="text-body max-w-prose mx-auto mb-6">
          Subscribe for behind-the-scenes moments, education spotlights, and performance highlights from Pinkney Park.
        </p>
        <Link to="/learning" className="text-link text-sm">
          Explore education programs
        </Link>
      </div>
    </PageSection>
  );
}
