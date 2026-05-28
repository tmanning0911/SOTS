import { useState, useEffect } from 'react';
import { content } from '@/api/content';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    content.entities.Article.list('-date').then(data => {
      setArticles(data.filter(a => a.published !== false));
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <PageHero
        eyebrow="Shakespeare on the Sound"
        title="Latest News"
        image="/images/news/season-banner-2026.jpg"
      />

      <div className="max-w-6xl mx-auto page-gutter py-12 sm:py-16">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-navy/20 border-t-navy rounded-full animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {articles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col"
              >
                <Link to={`/news/${article.id}`} className="flex flex-col h-full">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-rust text-[9px] tracking-[0.2em] uppercase font-medium">{article.category}</span>
                    <span className="text-navy/60 text-[10px]">{article.date}</span>
                  </div>
                  <h3 className="font-playfair text-navy font-bold text-lg uppercase leading-tight mb-3 group-hover:text-rust transition-colors">
                    {article.title}
                  </h3>
                  <p className="font-inter text-navy/80 text-xs leading-relaxed">{article.excerpt}</p>
                </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}