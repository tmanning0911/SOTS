import { useState, useEffect } from 'react';
import { IconArrowRight } from '@/components/icons';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import OptimizedImage from './OptimizedImage';
import SectionHeader from './SectionHeader';
import { content } from '@/api/content';

export default function LatestNews() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    content.entities.Article.list('-date')
      .then((data) => setArticles(data.filter((a) => a.published !== false).slice(0, 6)))
      .catch(() => setArticles([]));
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="section-pad bg-navy-deep grain-overlay" data-nav-zone="dark">
      <div className="max-w-6xl mx-auto relative z-[1]">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <SectionHeader
            eyebrow="News & Updates"
            title="Latest"
            align="left"
            light
            className="!mb-0"
          />
          <Link
            to="/news"
            className="text-white/50 hover:text-gold text-xs tracking-[0.2em] uppercase font-semibold flex items-center gap-2 transition-colors shrink-0"
          >
            All News <IconArrowRight size={14} />
          </Link>
        </div>

        <div className="flex gap-4 sm:gap-5 overflow-x-auto overscroll-x-contain pb-4 -mx-4 px-4 sm:-mx-2 sm:px-2 snap-x snap-mandatory scrollbar-thin scroll-pl-4">
          {articles.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05} className="flex-shrink-0 w-[min(85vw,18rem)] sm:w-72 snap-start">
              <Link to={`/news/${item.id}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden mb-4 image-shine bg-navy-light">
                  <OptimizedImage
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.75] group-hover:brightness-90"
                    wrapperClassName="w-full h-full"
                  />
                </div>
                <span className="text-gold text-[9px] tracking-[0.2em] uppercase font-semibold">{item.category}</span>
                <p className="font-display text-white text-lg font-medium mt-2 leading-snug group-hover:text-gold transition-colors duration-300">
                  {item.title}
                </p>
                <p className="text-white/40 text-[10px] mt-2 font-inter tracking-wide">{item.date}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
