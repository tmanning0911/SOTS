import { motion } from 'framer-motion';
import { IconPlay } from '@/components/icons';
import { site } from '@/content/site';

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
    <section className="bg-white py-14 sm:py-20 page-gutter">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="text-rust text-[10px] tracking-[0.3em] uppercase font-inter font-medium block mb-3">
              Watch & Listen
            </span>
            <h2 className="font-playfair text-navy font-bold text-3xl md:text-4xl uppercase leading-tight">
              On YouTube
            </h2>
          </div>
          <p className="font-inter text-navy/50 text-sm max-w-xs mt-4 md:mt-0 leading-relaxed">
            Follow {site.name} for performance clips, education features, and season announcements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 mb-8 sm:mb-10">
          {highlights.map((item, i) => (
            <motion.a
              key={item.title}
              href={site.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group block border border-navy/10 p-6 hover:border-rust/30 transition-colors"
            >
              <div className="w-10 h-10 bg-navy flex items-center justify-center mb-4 group-hover:bg-gold transition-colors duration-300">
                <IconPlay size={18} className="text-white" />
              </div>
              <span className="text-rust text-[9px] tracking-[0.2em] uppercase font-medium">{item.category}</span>
              <p className="font-playfair text-navy font-bold text-lg uppercase mt-2 mb-2">{item.title}</p>
              <p className="font-inter text-navy/70 text-xs leading-relaxed">{item.description}</p>
            </motion.a>
          ))}
        </div>

        <a
          href={site.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center bg-navy text-white text-xs tracking-[0.2em] uppercase font-medium px-7 py-3 hover:bg-navy/80 transition-colors"
        >
          Visit Our YouTube Channel
        </a>
      </div>
    </section>
  );
}
