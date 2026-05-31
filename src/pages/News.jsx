import { useState, useEffect } from 'react';
import { cms } from '@/lib/cms';
import { seedArticles } from '@/lib/contentSeed';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import NewsCard from '../components/NewsCard';
import { pageHeroImages } from '@/content/images';
import { homeCopy } from '@/content/voice';

export default function News() {
  const [articles, setArticles] = useState(seedArticles);

  useEffect(() => {
    cms.articles
      .list('-date')
      .then((data) => setArticles(data.filter((a) => a.published !== false)))
      .catch(() => {});
  }, []);

  const [featured, ...rest] = articles;

  return (
    <PageLayout>
      <PageHero
        eyebrow="Shakespeare on the Sound"
        title="Latest news"
        description={homeCopy.newsIntro}
        image={pageHeroImages.news}
      />

      <PageSection variant="white" first>
        {articles.length === 0 ? (
          <p className="text-center text-body py-16">No articles yet. Check back soon.</p>
        ) : (
          <>
            {featured && <NewsCard article={featured} featured />}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {rest.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </>
        )}
      </PageSection>
    </PageLayout>
  );
}
