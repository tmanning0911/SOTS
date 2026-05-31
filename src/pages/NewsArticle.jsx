import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cms } from '@/lib/cms';
import { seedArticles } from '@/lib/contentSeed';
import { useSeoOverride } from '@/lib/SeoOverrideContext';
import PageLayout from '../components/PageLayout';
import OptimizedImage from '../components/OptimizedImage';
import LoadingSpinner from '../components/LoadingSpinner';
import { paragraphsFromContent } from '@/lib/formatArticleContent';
import { contactPaths } from '@/lib/contactPaths';
import { site } from '@/content/site';
import NewsCard from '../components/NewsCard';

export default function NewsArticle() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const seoMeta = useMemo(() => {
    if (article) {
      return {
        title: `${article.title} | Shakespeare on the Sound`,
        description: article.excerpt || article.content?.slice(0, 160),
        path: `/news/${article.id}`,
        datePublished: article.date,
        image: article.image,
      };
    }
    if (notFound) {
      return {
        title: 'Article not found | Shakespeare on the Sound',
        description: 'This news story may have moved or is no longer published.',
        path: `/news/${id}`,
        noindex: true,
      };
    }
    return null;
  }, [article, notFound, id]);

  useSeoOverride(seoMeta);

  useEffect(() => {
    const applyArticles = (items) => {
      const published = items.filter((a) => a.published !== false);
      const match = published.find((a) => a.id === id);
      if (match) {
        setArticle(match);
        setRelated(published.filter((a) => a.id !== id).slice(0, 3));
        setNotFound(false);
      } else {
        setArticle(null);
        setRelated([]);
        setNotFound(true);
      }
      setLoading(false);
    };

    cms.articles
      .list('-date')
      .then(applyArticles)
      .catch(() => applyArticles(seedArticles));
  }, [id]);

  return (
    <PageLayout>
      {loading && (
        <div className="site-container py-20">
          <LoadingSpinner label="Loading article" />
        </div>
      )}

      {!loading && notFound && (
        <div className="max-w-3xl mx-auto site-container py-20 text-center">
          <p className="font-display text-navy/20 text-8xl font-semibold mb-4">404</p>
          <h1 className="heading-section mb-4">Article not found</h1>
          <p className="text-body text-sm mb-8">This story may have moved or is no longer published.</p>
          <Link to="/news" className="btn-primary">
            Back to news
          </Link>
        </div>
      )}

      {!loading && article && (
        <>
          {article.image ? (
            <div
              data-nav-zone="dark"
              className="relative h-[44vh] min-h-[280px] sm:h-[48vh] max-h-[480px] overflow-hidden bg-navy-deep"
            >
              <OptimizedImage
                src={article.image}
                alt={article.title}
                priority
                className="absolute inset-0 w-full h-full object-cover brightness-[0.45]"
                wrapperClassName="absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/50 to-transparent" />
              <div className="absolute inset-0 flex items-end pb-10 sm:pb-12 z-[1]">
                <div className="site-container w-full max-w-3xl">
                  <Link to="/news" className="text-link-light text-sm mb-4 inline-flex">
                    All news
                  </Link>
                  <p className="label text-white/45 mb-2">
                    {article.category} · {article.date}
                  </p>
                  <h1 className="heading-display text-white text-balance">{article.title}</h1>
                </div>
              </div>
            </div>
          ) : (
            <div data-nav-zone="dark" className="bg-navy-deep pt-28 sm:pt-32 pb-10">
              <div className="site-container max-w-3xl">
                <Link to="/news" className="text-link-light text-sm mb-4 inline-flex">
                  All news
                </Link>
                <p className="label text-white/45 mb-2">
                  {article.category} · {article.date}
                </p>
                <h1 className="heading-display text-white text-balance">{article.title}</h1>
              </div>
            </div>
          )}

          <article className="site-container max-w-3xl py-10 sm:py-14">
            <div className="prose-article space-y-4">
              {paragraphsFromContent(article.content || article.excerpt).map((para, i) => (
                <p key={`${article.id}-p-${i}`}>{para}</p>
              ))}
            </div>
            {article.category === 'Events' && (
              <div className="mt-10 pt-8 border-t border-navy/10 flex flex-wrap gap-3">
                <Link to="/events#gala-2026" className="btn-primary">
                  View gala details
                </Link>
                <Link to={contactPaths.gala} className="btn-outline">
                  Gala & sponsorship inquiry
                </Link>
              </div>
            )}
            {article.category === 'Education' && (
              <div className="mt-10 pt-8 border-t border-navy/10">
                <Link to={contactPaths.education} className="btn-primary">
                  Book an education program
                </Link>
              </div>
            )}
            {article.category === 'Production' && (
              <div className="mt-10 pt-8 border-t border-navy/10 flex flex-wrap gap-3">
                <a href={site.ticketsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Get tickets
                </a>
                <Link to="/plays" className="btn-outline">
                  View productions
                </Link>
              </div>
            )}
          </article>

          {related.length > 0 && (
            <section className="section bg-white border-t border-navy/10">
              <div className="site-container">
                <p className="label mb-2">Keep reading</p>
                <h2 className="heading-section mb-10">More news</h2>
                <div className="grid sm:grid-cols-3 gap-x-8 gap-y-10">
                  {related.map((item) => (
                    <NewsCard key={item.id} article={item} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </PageLayout>
  );
}
