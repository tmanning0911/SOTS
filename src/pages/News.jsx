import { useState, useEffect } from 'react';
import { content } from '@/api/content';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import OptimizedImage from '../components/OptimizedImage';
import LoadingSpinner from '../components/LoadingSpinner';
import { IconArrowRight } from '@/components/icons';
import { pageHeroImages } from '@/content/images';
import { TheatreBackdrop } from '../components/decor';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    content.entities.Article.list('-date').then((data) => {
      setArticles(data.filter((a) => a.published !== false));
      setLoading(false);
    });
  }, []);

  const [featured, ...rest] = articles;

  return (
    <PageLayout>
      <PageHero
        eyebrow="Shakespeare on the Sound"
        title="Latest News"
        description="Season announcements, gala updates, education highlights, and stories from Pinkney Park."
        image={pageHeroImages.news}
      />

      <TheatreBackdrop variant="parchment" wash="audience" ornaments="minimal" className="page-gutter py-12 sm:py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <LoadingSpinner label="Loading news" />
        ) : articles.length === 0 ? (
          <p className="text-center font-inter text-navy/60 py-16">No articles yet. Check back soon.</p>
        ) : (
          <>
            {featured && (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="news-card mb-10 sm:mb-14 md:grid md:grid-cols-2 overflow-hidden"
              >
                <Link to={`/news/${featured.id}`} className="contents">
                  <div className="aspect-video md:aspect-auto md:min-h-[280px] overflow-hidden image-shine">
                    <OptimizedImage
                      src={featured.image}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 brightness-90"
                      wrapperClassName="w-full h-full min-h-[220px]"
                    />
                  </div>
                  <div className="p-8 sm:p-10 flex flex-col justify-center">
                    <span className="text-gold text-[10px] tracking-[0.2em] uppercase font-semibold">
                      Featured · {featured.category}
                    </span>
                    <h2 className="font-display text-navy text-2xl sm:text-3xl font-semibold uppercase leading-tight mt-3 mb-4 group-hover:text-gold transition-colors">
                      {featured.title}
                    </h2>
                    <p className="font-inter text-navy/75 text-sm leading-relaxed mb-4 flex-1">{featured.excerpt}</p>
                    <span className="font-inter text-navy/50 text-xs mb-5">{featured.date}</span>
                    <span className="link-gold inline-flex items-center gap-2 w-fit">
                      Read article <IconArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.article>
            )}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {rest.map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="news-card group"
                  >
                    <Link to={`/news/${article.id}`} className="flex flex-col h-full">
                      <div className="aspect-video overflow-hidden image-shine">
                        <OptimizedImage
                          src={article.image}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                          wrapperClassName="w-full h-full"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-3 gap-2">
                          <span className="text-gold text-[9px] tracking-[0.2em] uppercase font-semibold">
                            {article.category}
                          </span>
                          <span className="text-navy/50 text-[10px] shrink-0">{article.date}</span>
                        </div>
                        <h3 className="font-display text-navy font-semibold text-lg uppercase leading-tight mb-3 group-hover:text-gold transition-colors">
                          {article.title}
                        </h3>
                        <p className="font-inter text-navy/75 text-xs leading-relaxed mb-4 flex-1">{article.excerpt}</p>
                        <span className="text-gold text-[10px] tracking-widest uppercase font-semibold">Read more →</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      </TheatreBackdrop>
    </PageLayout>
  );
}
