import { HOMEPAGE_NEWS } from "../../../js/data.js";

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

export function RecentNews() {
  const [featured, ...sideItems] = HOMEPAGE_NEWS;

  return (
    <section className="orpheum-news-feed" id="recent-news" aria-labelledby="news-heading">
      <div className="orpheum-news-feed__shell">
        <div className="orpheum-news-feed__head" data-reveal>
          <h3 id="news-heading">Recent News</h3>
          <a className="orpheum-news-feed__view-all" href="/#recent-news">
            View All News
            <InlineChevron />
          </a>
        </div>

        <div className="orpheum-news-feed__grid">
          <article className="orpheum-news-feed__feature">
            <a className="orpheum-news-feed__feature-link" href={featured.href}>
              <div className="orpheum-news-feed__feature-media">
                <img src={featured.image} alt="" loading="lazy" width={1200} height={675} />
              </div>
              <div className="orpheum-news-feed__feature-body">
                <div className="orpheum-news-feed__feature-copy">
                  <p className="orpheum-news-feed__category">{featured.category}</p>
                  <h2>{featured.title}</h2>
                  <p className="orpheum-news-feed__excerpt">{featured.excerpt}</p>
                </div>
                <ReadMoreLink />
              </div>
            </a>
          </article>

          <div className="orpheum-news-feed__stack">
            {sideItems.map((item) => (
              <a key={item.title} className="orpheum-news-feed__card" href={item.href}>
                <div>
                  <h2>{item.title}</h2>
                  <p className="orpheum-news-feed__excerpt">{item.excerpt}</p>
                </div>
                <ReadMoreLink />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
