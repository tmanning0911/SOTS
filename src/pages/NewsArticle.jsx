import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { content } from '@/api/content';
import PageLayout from '../components/PageLayout';
import OptimizedImage from '../components/OptimizedImage';
import LoadingSpinner from '../components/LoadingSpinner';
import TicketBanner from '../components/TicketBanner';

export default function NewsArticle() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!article) return;
    document.title = `${article.title} | Shakespeare on the Sound`;
    const desc = article.excerpt || article.content?.slice(0, 160);
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
  }, [article]);

  useEffect(() => {
    content.entities.Article.list('-date')
      .then((items) => {
        const published = items.filter((a) => a.published !== false);
        const match = published.find((a) => a.id === id);
        if (match) {
          setArticle(match);
          setRelated(published.filter((a) => a.id !== id).slice(0, 3));
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  return (
    <PageLayout>
      {loading && (
        <div className="page-gutter py-20">
          <LoadingSpinner label="Loading article" />
        </div>
      )}

      {!loading && notFound && (
        <div className="max-w-3xl mx-auto page-gutter py-20 text-center">
          <p className="font-display text-navy/20 text-8xl font-semibold mb-4">404</p>
          <h1 className="font-display text-navy text-2xl font-semibold uppercase mb-4">Article Not Found</h1>
          <p className="font-inter text-navy/60 text-sm mb-8">This story may have moved or is no longer published.</p>
          <Link to="/news" className="btn-navy">
            Back to News
          </Link>
        </div>
      )}

      {!loading && article && (
        <>
          {article.image && (
            <div className="relative h-[40vh] min-h-[260px] sm:h-[50vh] max-h-[480px] overflow-hidden bg-navy-deep grain-overlay">
              <OptimizedImage
                src={article.image}
                alt=""
                priority
                className="w-full h-full object-cover brightness-[0.45]"
                wrapperClassName="absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/50 to-transparent" />
            </div>
          )}

          <article className="max-w-3xl mx-auto page-gutter py-10 sm:py-14 -mt-8 sm:-mt-12 relative z-[1]">
            <div className="bg-cream/95 backdrop-blur-sm border border-navy/5 shadow-soft p-6 sm:p-10 md:p-12">
              <Link
                to="/news"
                className="font-inter text-gold text-xs tracking-[0.2em] uppercase font-semibold hover:opacity-75 transition-opacity inline-block mb-6"
              >
                ← All News
              </Link>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-gold text-[10px] tracking-[0.2em] uppercase font-semibold">
                  {article.category}
                </span>
                <span className="text-navy/40">·</span>
                <span className="text-navy/50 text-xs font-inter">{article.date}</span>
              </div>
              <h1 className="font-display text-navy text-3xl sm:text-4xl md:text-[2.75rem] font-semibold uppercase leading-tight text-balance mb-8">
                {article.title}
              </h1>
              <div className="prose-article">
                <p>{article.content || article.excerpt}</p>
              </div>
            </div>
          </article>

          {related.length > 0 && (
            <section className="max-w-6xl mx-auto page-gutter pb-14 sm:pb-20">
              <h2 className="font-display text-navy text-xl font-semibold uppercase mb-6">More News</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.id}`}
                    className="news-card group p-0 overflow-hidden"
                  >
                    <div className="aspect-video overflow-hidden">
                      <OptimizedImage
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                        wrapperClassName="w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-display text-navy text-sm font-semibold uppercase leading-snug group-hover:text-gold transition-colors">
                        {item.title}
                      </p>
                      <p className="font-inter text-navy/50 text-[10px] mt-2">{item.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <TicketBanner />
        </>
      )}
    </PageLayout>
  );
}
