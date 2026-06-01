import { useState, useEffect } from 'react';
import SectionHeading from './SectionHeading';
import NewsCard from '../NewsCard';
import { ArtSectionBackground } from '../decor';
import { images } from '@/content/images';
import { cms } from '@/lib/cms';
import { seedArticles } from '@/lib/contentSeed';

export default function HomeRecentNews() {
  const [articles, setArticles] = useState(() => seedArticles.slice(0, 3));

  useEffect(() => {
    cms.articles
      .list('-date')
      .then((data) => {
        const published = data.filter((a) => a.published !== false).slice(0, 3);
        setArticles(published.length > 0 ? published : seedArticles.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="section relative bg-white border-t border-navy/10 overflow-hidden" data-nav-zone="light">
      <ArtSectionBackground src={images.art.masqueArches} tone="light" position="left" />
      <div className="site-container relative z-[1]">
        <SectionHeading label="News" title="Latest updates" href="/news" linkLabel="All news" />
        <div className="news-card-grid">
          {articles.map((item) => (
            <NewsCard key={item.id} article={item} layout="editorial" />
          ))}
        </div>
      </div>
    </section>
  );
}
