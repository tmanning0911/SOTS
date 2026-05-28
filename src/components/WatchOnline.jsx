import { IconStage } from '@/components/icons';
import { site } from '@/content/site';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';
import { TheatreBackdrop } from './decor';

const highlights = [
  {
    title: 'Shakespeare in 30 Minutes',
    category: 'In the Park',
    description: 'A family-friendly half-hour version of our MainStage show before select performances.',
  },
  {
    title: 'Education & Outreach',
    category: 'Schools & Camps',
    description: 'Workshops, touring shows, and summer camps across Fairfield County.',
  },
  {
    title: 'Season Highlights',
    category: 'On YouTube',
    description: 'Clips, interviews, and behind-the-scenes from Shakespeare on the Sound.',
  },
];

export default function WatchOnline() {
  return (
    <TheatreBackdrop variant="white" className="py-14 sm:py-20 page-gutter">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Watch & Listen"
          title="On YouTube"
          description={`Follow ${site.name} for performance clips, education features, and season announcements.`}
          align="left"
          className="!mb-10 sm:!mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-12">
          {highlights.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06} className="h-full">
              <div className="flex flex-col h-full bg-white border border-navy/8 p-6 sm:p-7 shadow-soft">
                <div
                  className="w-10 h-10 bg-navy flex items-center justify-center mb-5"
                  aria-hidden
                >
                  <IconStage size={18} className="text-white" />
                </div>
                <span className="section-eyebrow !text-[9px] !tracking-[0.25em] mb-2">{item.category}</span>
                <p className="font-display text-navy text-lg font-semibold uppercase leading-tight mb-2">
                  {item.title}
                </p>
                <p className="font-inter text-navy/70 text-sm leading-relaxed flex-1">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center">
          <p className="font-inter text-navy/60 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Subscribe for behind-the-scenes moments, education spotlights, and performance highlights from Pinkney
            Park and beyond.
          </p>
          <a
            href={site.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full sm:w-auto px-8 sm:px-10"
          >
            Open YouTube Channel
          </a>
        </Reveal>
      </div>
    </TheatreBackdrop>
  );
}
