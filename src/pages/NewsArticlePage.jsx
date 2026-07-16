import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getNewsBySlug, relatedNews } from "../../js/news-archive.js";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { NewsShare } from "../components/news/NewsShare.jsx";

function normalizeCopy(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function isDuplicateCopy(excerpt, paragraph) {
  const a = normalizeCopy(excerpt);
  const b = normalizeCopy(paragraph);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length > 40 && b.length > 40 && (a.includes(b) || b.includes(a))) return true;
  return false;
}

export function NewsArticlePage() {
  const { slug } = useParams();
  const article = getNewsBySlug(slug);
  const related = relatedNews(slug, 3);
  const body = (article?.body || []).filter(
    (paragraph) => !isDuplicateCopy(article?.excerpt, paragraph),
  );

  useEffect(() => {
    if (article) document.title = `${article.title} - Shakespeare on the Sound`;
  }, [article]);

  if (!article) return <Navigate to="/news/" replace />;

  return (
    <InnerPageShell className="orpheum-page-shell--news">
      <article className="orpheum-inner-page sots-news-article">
        <InnerPageHero
          className="sots-news-hero"
          eyebrow={article.category}
          title={article.title}
          intro={article.excerpt}
          image={article.image}
          imagePosition={article.imagePosition || "center center"}
          belowIntro={
            <p className="sots-news-hero__date">
              <time dateTime={article.dateIso}>{article.date}</time>
            </p>
          }
        />

        <div className="orpheum-inner-page__body sots-news-article__body">
          {body.length ? (
            <div className="sots-news-article__prose" data-reveal>
              {body.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}

              {article.sourceUrl ? (
                <p className="sots-news-article__source">
                  <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {article.sourceLabel || "Original coverage"}
                  </a>
                </p>
              ) : null}
            </div>
          ) : article.sourceUrl ? (
            <p className="sots-news-article__source" data-reveal>
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                {article.sourceLabel || "Original coverage"}
              </a>
            </p>
          ) : null}

          <NewsShare path={article.href} title={article.title} />

          {related.length ? (
            <aside className="sots-news-article__related" aria-labelledby="related-news-heading">
              <h2 id="related-news-heading">More stories</h2>
              <ul className="sots-news-article__related-list">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link to={item.href} className="sots-news-article__related-card">
                      <div className="sots-news-article__related-media">
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                          width={320}
                          height={180}
                          style={{ objectPosition: item.imagePosition || "center center" }}
                        />
                      </div>
                      <div className="sots-news-article__related-copy">
                        <p className="sots-news-article__related-meta">
                          <span>{item.category}</span>
                          <time dateTime={item.dateIso}>{item.date}</time>
                        </p>
                        <h3>{item.title}</h3>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}

          <p className="sots-news-article__back">
            <Link to="/news/">← All news &amp; history</Link>
          </p>
        </div>
      </article>
    </InnerPageShell>
  );
}
