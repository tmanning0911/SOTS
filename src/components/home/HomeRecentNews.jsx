import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../Reveal';
import OptimizedImage from '../OptimizedImage';
import { cms } from '@/lib/cms';
import { seedArticles } from '@/lib/contentSeed';

function NewsCard({ item }) {
  return (
    <Reveal className="h-full">
      <article className="orpheum-news-card group h-full flex flex-col">
        <Link
          to={`/news/${item.id}`}
          className="orpheum-news-card-media block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <OptimizedImage
            src={item.image}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            wrapperClassName="absolute inset-0 w-full h-full"
          />
          <span className="orpheum-news-tag">{item.category}</span>
        </Link>
        <div className="orpheum-news-card-body flex flex-col flex-1">
          <h3 className="orpheum-news-title">
            <Link to={`/news/${item.id}`} className="hover:text-gold transition-colors">
              {item.title}
            </Link>
          </h3>
          <Link to={`/news/${item.id}`} className="orpheum-text-cta mt-auto pt-4">
            Read More
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

/** Orpheum 1:1 — Recent News 4-card grid */
export default function HomeRecentNews() {
  const [articles, setArticles] = useState(() => seedArticles.slice(0, 4));

  useEffect(() => {
    cms.articles
      .list('-date')
      .then((data) => {
        const published = data.filter((a) => a.published !== false).slice(0, 4);
        setArticles(published.length > 0 ? published : seedArticles.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="bg-white section-pad border-t border-navy/10" data-nav-zone="light">
      <div className="site-container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <h2 className="font-display text-navy text-3xl sm:text-4xl font-semibold uppercase tracking-wide">
            Recent News
          </h2>
          <Link to="/news" className="orpheum-text-cta orpheum-text-cta-lg shrink-0">
            View All News
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {articles.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
