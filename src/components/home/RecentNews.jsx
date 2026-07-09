import { useMemo, useState } from "react";
import { HOMEPAGE_NEWS } from "../../../js/data.js";
import { ArrowButton } from "../ArrowButton.jsx";

const NEWS_FILTERS = ["All", "Production", "Events", "News"];

function InlineChevron() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9.141 12.914L14.141 7.914L9.141 2.914"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.625 8H1.715"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReadMoreLink() {
  return (
    <span className="orpheum-news-feed__read-more">
      Read More
      <InlineChevron />
    </span>
  );
}

function NewsMeta({ item }) {
  return (
    <p className="orpheum-news-feed__meta">
      <span className="orpheum-news-feed__tag">{item.category}</span>
      {item.date ? (
        <time dateTime={item.dateIso || undefined}>{item.date}</time>
      ) : null}
    </p>
  );
}

function FeaturedNewsCard({ item }) {
  return (
    <article className="orpheum-news-feed__feature">
      <a className="orpheum-news-feed__feature-link" href={item.href}>
        <div className="orpheum-news-feed__feature-media">
          <img src={item.image} alt="" loading="lazy" width={1200} height={675} />
        </div>
        <div className="orpheum-news-feed__feature-body">
          <div className="orpheum-news-feed__feature-copy">
            <NewsMeta item={item} />
            <h2>{item.title}</h2>
            <p className="orpheum-news-feed__excerpt">{item.excerpt}</p>
          </div>
          <ReadMoreLink />
        </div>
      </a>
    </article>
  );
}

function SideNewsCard({ item }) {
  return (
    <article className="orpheum-news-feed__card">
      <a className="orpheum-news-feed__card-link" href={item.href}>
        <div className="orpheum-news-feed__card-media">
          <img src={item.image} alt="" loading="lazy" width={320} height={180} />
        </div>
        <div className="orpheum-news-feed__card-body">
          <NewsMeta item={item} />
          <h2>{item.title}</h2>
          <p className="orpheum-news-feed__excerpt">{item.excerpt}</p>
          <ReadMoreLink />
        </div>
      </a>
    </article>
  );
}

function ScrollNewsCard({ item }) {
  return (
    <article className="orpheum-news-feed__scroll-card">
      <a className="orpheum-news-feed__scroll-link" href={item.href}>
        <div className="orpheum-news-feed__scroll-media">
          <img src={item.image} alt="" loading="lazy" width={320} height={180} />
        </div>
        <div className="orpheum-news-feed__scroll-body">
          <NewsMeta item={item} />
          <h2>{item.title}</h2>
          <p className="orpheum-news-feed__excerpt">{item.excerpt}</p>
        </div>
      </a>
    </article>
  );
}

export function RecentNews() {
  const [filter, setFilter] = useState("All");

  const filteredNews = useMemo(() => {
    if (filter === "All") return HOMEPAGE_NEWS;
    return HOMEPAGE_NEWS.filter((item) => item.category === filter);
  }, [filter]);

  const [featured, ...sideItems] = filteredNews;

  return (
    <section className="orpheum-news-feed" id="recent-news" aria-labelledby="news-heading">
      <div className="orpheum-news-feed__shell">
        <div className="orpheum-news-feed__head" data-reveal>
          <div>
            <p className="orpheum-news-feed__eyebrow">Season Updates</p>
            <h3 id="news-heading">Recent News</h3>
          </div>
          <ArrowButton href="/productions/much-ado-about-nothing/">View Season Hub</ArrowButton>
        </div>

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

        {featured ? (
          <>
            <div className="orpheum-news-feed__grid orpheum-news-feed__grid--desktop">
              <FeaturedNewsCard item={featured} />
              <div className="orpheum-news-feed__stack">
                {sideItems.map((item) => (
                  <SideNewsCard key={`${item.href}-${item.title}`} item={item} />
                ))}
              </div>
            </div>

            <div className="orpheum-news-feed__scroll" aria-label="Recent news">
              <div className="orpheum-news-feed__scroll-track">
                {filteredNews.map((item) => (
                  <ScrollNewsCard key={`scroll-${item.href}-${item.title}`} item={item} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="orpheum-news-feed__empty">No updates in this category yet. Check back soon.</p>
        )}
      </div>
    </section>
  );
}
