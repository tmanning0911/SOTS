import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

function NewsMeta({ date, category }) {
  return (
    <p className="news-card__meta">
      <time dateTime={date}>{date}</time>
      <span className="news-card__meta-sep" aria-hidden>
        ·
      </span>
      <span>{category}</span>
    </p>
  );
}

/** Editorial news card — consistent meta, title, excerpt, and CTA alignment. */
export default function NewsCard({ article, featured = false, layout = 'default' }) {
  const href = `/news/${article.id}`;
  const imageLabel = `Read: ${article.title}`;

  if (featured) {
    return (
      <article className="news-card news-card--featured">
        <Link
          to={href}
          aria-label={imageLabel}
          className="news-card__media news-card__media--featured focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
        >
          <OptimizedImage
            src={article.image}
            alt={article.title}
            className="w-full aspect-[16/10] object-cover"
            wrapperClassName="w-full"
          />
        </Link>
        <div className="news-card__body news-card__body--featured">
          <NewsMeta date={article.date} category={article.category} />
          <h2 className="news-card__title news-card__title--featured">
            <Link to={href} className="news-card__title-link">
              {article.title}
            </Link>
          </h2>
          {article.excerpt && <p className="news-card__excerpt">{article.excerpt}</p>}
          <Link to={href} className="news-card__cta">
            Read story
          </Link>
        </div>
      </article>
    );
  }

  if (layout === 'editorial') {
    return (
      <article className="news-card news-card--editorial">
        <NewsMeta date={article.date} category={article.category} />
        <h3 className="news-card__title">
          <Link to={href} className="news-card__title-link">
            {article.title}
          </Link>
        </h3>
        {article.excerpt && <p className="news-card__excerpt">{article.excerpt}</p>}
        <Link to={href} className="news-card__cta">
          Read story
        </Link>
      </article>
    );
  }

  return (
    <article className="news-card news-card--default">
      <Link
        to={href}
        aria-label={imageLabel}
        className="news-card__media focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
      >
        <OptimizedImage
          src={article.image}
          alt={article.title}
          className="w-full aspect-[3/2] object-cover"
          wrapperClassName="w-full"
        />
      </Link>
      <div className="news-card__body">
        <NewsMeta date={article.date} category={article.category} />
        <h3 className="news-card__title">
          <Link to={href} className="news-card__title-link">
            {article.title}
          </Link>
        </h3>
        {article.excerpt && <p className="news-card__excerpt">{article.excerpt}</p>}
        <Link to={href} className="news-card__cta">
          Read story
        </Link>
      </div>
    </article>
  );
}
