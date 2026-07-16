import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { NEWS_FILTERS, newsForFilter } from "../../js/news-archive.js";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

export function NewsIndexPage() {
  const [filter, setFilter] = useState("All");
  const items = useMemo(() => newsForFilter(filter), [filter]);
  const [featured, ...rest] = items;

  usePageMeta("/news/");

  return (
    <InnerPageShell className="orpheum-page-shell--news">
      <div className="orpheum-inner-page sots-news-index">
        <InnerPageHero
          className="sots-news-hero sots-news-hero--index"
          title="News & History"
          compact
        />

        <div className="orpheum-inner-page__body sots-news-index__body">
          <p className="sots-news-index__lede">
            Season announcements, education programs, and thirty years of Shakespeare on the Sound — from Pinkney Park to today.
          </p>

          <div className="sots-news-index__filters" role="tablist" aria-label="Filter news by topic">
            {NEWS_FILTERS.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={filter === category}
                className={`sots-news-index__filter${filter === category ? " is-active" : ""}`}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {featured ? (
            <Link to={featured.href} className="sots-news-index__feature">
              <div className="sots-news-index__feature-media">
                <img
                  src={featured.image}
                  alt=""
                  loading="eager"
                  width={1200}
                  height={675}
                  style={{ objectPosition: featured.imagePosition || "center center" }}
                />
              </div>
              <div className="sots-news-index__feature-copy">
                <p className="sots-news-index__meta">
                  <span>{featured.category}</span>
                  <time dateTime={featured.dateIso}>{featured.date}</time>
                </p>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <span className="sots-news-index__read">Read story</span>
              </div>
            </Link>
          ) : (
            <p className="sots-news-index__empty">No updates in this category yet. Check back soon.</p>
          )}

          {rest.length ? (
            <ul className="sots-news-index__grid">
              {rest.map((item) => (
                <li key={item.slug}>
                  <Link to={item.href} className="sots-news-index__card">
                    <div className="sots-news-index__media">
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        width={640}
                        height={360}
                        style={{ objectPosition: item.imagePosition || "center center" }}
                      />
                    </div>
                    <div className="sots-news-index__copy">
                      <p className="sots-news-index__meta">
                        <span>{item.category}</span>
                        <time dateTime={item.dateIso}>{item.date}</time>
                      </p>
                      <h2>{item.title}</h2>
                      <p>{item.excerpt}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </InnerPageShell>
  );
}
