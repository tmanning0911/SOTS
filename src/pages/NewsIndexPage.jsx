import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { NEWS_ARCHIVE, NEWS_FILTERS, newsForFilter } from "../../js/news-archive.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";

export function NewsIndexPage() {
  const [filter, setFilter] = useState("All");
  const items = useMemo(() => newsForFilter(filter), [filter]);

  useEffect(() => {
    document.title = "News & History - Shakespeare on the Sound";
  }, []);

  return (
    <InnerPageShell className="orpheum-page-shell--news">
      <div className="orpheum-inner-page sots-news-index">
        <InnerPageHero
          compact
          eyebrow="From 1995 to today"
          title="News & History"
          intro="Season updates, education milestones, and the story of Shakespeare on the Sound — from a Rowayton kitchen table to thirty summers in Pinkney Park."
          image={NEWS_ARCHIVE[0]?.image}
          actions={
            <>
              <ArrowButton href="/about/mission-history/" variant="ghost">
                Mission & History
              </ArrowButton>
              <ArrowButton href="/productions/past-productions/">Past Productions</ArrowButton>
            </>
          }
        />

        <div className="orpheum-inner-page__body sots-news-index__body">
          <div className="orpheum-news-feed__filters" role="tablist" aria-label="Filter news by topic">
            {NEWS_FILTERS.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={filter === category}
                className={`orpheum-news-feed__filter${filter === category ? " is-active" : ""}`}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <ul className="sots-news-index__grid">
            {items.map((item) => (
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
                    <p className="orpheum-news-feed__meta">
                      <span className="orpheum-news-feed__tag">{item.category}</span>
                      <time dateTime={item.dateIso}>{item.date}</time>
                    </p>
                    <h2>{item.title}</h2>
                    <p>{item.excerpt}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </InnerPageShell>
  );
}
