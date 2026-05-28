import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { content } from '@/api/content';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OptimizedImage from '../components/OptimizedImage';

export default function NewsArticle() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
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
        const match = items.find((a) => a.id === id && a.published !== false);
        if (match) setArticle(match);
        else setNotFound(true);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <article className="max-w-3xl mx-auto page-gutter py-10 sm:py-14">
        <Link
          to="/news"
          className="font-inter text-gold text-xs tracking-[0.2em] uppercase font-semibold hover:opacity-75 transition-opacity"
        >
          ← All News
        </Link>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-navy/20 border-t-navy rounded-full animate-spin" />
          </div>
        )}

        {!loading && notFound && (
          <div className="py-16 text-center">
            <h1 className="font-display text-navy text-2xl font-semibold uppercase mb-4">Article Not Found</h1>
            <Link to="/news" className="btn-navy">
              Back to News
            </Link>
          </div>
        )}

        {!loading && article && (
          <>
            {article.image && (
              <div className="aspect-video overflow-hidden my-8 image-shine bg-navy/5">
                <OptimizedImage
                  src={article.image}
                  alt=""
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-gold text-[10px] tracking-[0.2em] uppercase font-semibold">
                {article.category}
              </span>
              <span className="text-navy/50 text-xs font-inter">{article.date}</span>
            </div>
            <h1 className="font-display text-navy text-3xl sm:text-4xl font-semibold uppercase leading-tight text-balance mb-6">
              {article.title}
            </h1>
            <div className="font-inter text-navy/85 text-base leading-relaxed space-y-4">
              <p>{article.content || article.excerpt}</p>
            </div>
          </>
        )}
      </article>

      <Footer />
    </div>
  );
}
