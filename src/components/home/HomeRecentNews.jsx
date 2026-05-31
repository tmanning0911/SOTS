import { useState, useEffect } from 'react';
import SectionHeading from './SectionHeading';
import NewsCard from '../NewsCard';
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
    <section className="section bg-white border-t border-navy/10" data-nav-zone="light">
      <div className="site-container">
        <SectionHeading label="News" title="Latest from Rowayton" href="/news" linkLabel="All news" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {articles.map((item) => (
            <NewsCard key={item.id} article={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
