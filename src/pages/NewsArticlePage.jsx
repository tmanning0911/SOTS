import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getNewsBySlug, relatedNews } from "../../js/news-archive.js";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { NewsShare } from "../components/news/NewsShare.jsx";

export function NewsArticlePage() {
  const { slug } = useParams();
  const article = getNewsBySlug(slug);
  const related = relatedNews(slug, 3);

  useEffect(() => {
    if (article) document.title = `${article.title} - Shakespeare on the Sound`;
  }, [article]);

  if (!article) return <Navigate to="/news/" replace />;

  return (
    <InnerPageShell className="orpheum-page-shell--news">
      <article className="orpheum-inner-page sots-news-article">
        <InnerPageHero title={article.title} />

        <div className="orpheum-inner-page__body sots-news-article__body">
          <p className="sots-news-article__meta">
            <span>{article.category}</span>
            {" · "}
            <time dateTime={article.dateIso}>{article.date}</time>
          </p>
          {article.excerpt ? <p className="orpheum-inner-page__intro">{article.excerpt}</p> : null}
          <figure className="sots-news-article__figure">
            <img
              src={article.image}
              alt=""
              width={1200}
              height={675}
              style={{ objectPosition: article.imagePosition || "center center" }}
            />
          </figure>

          <div className="sots-news-article__prose" data-reveal>
            {article.body.map((paragraph) => (
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
                      <div>
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
        </div>
      </article>
    </InnerPageShell>
  );
}
