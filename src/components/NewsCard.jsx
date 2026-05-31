import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

/** Editorial news card — dates and titles first, no ticket-style chrome. */
export default function NewsCard({ article, featured = false }) {
  const href = `/news/${article.id}`;
  const imageLabel = `Read: ${article.title}`;

  if (featured) {
    return (
      <article className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center border-b border-navy/10 pb-12 mb-12">
        <Link
          to={href}
          aria-label={imageLabel}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
        >
          <OptimizedImage
            src={article.image}
            alt={article.title}
            className="w-full aspect-[16/10] object-cover"
            wrapperClassName="w-full"
          />
        </Link>
        <div>
          <p className="label mb-3">
            {article.date}
            <span className="text-navy/30 mx-2">·</span>
            {article.category}
          </p>
          <h2 className="heading-section mb-4">
            <Link to={href} className="hover:text-gold transition-colors">
              {article.title}
            </Link>
          </h2>
          {article.excerpt && (
            <p className="text-body mb-6 line-clamp-4">{article.excerpt}</p>
          )}
          <Link to={href} className="text-link text-sm">
            Read story
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="h-full flex flex-col border-t border-navy/10 pt-6">
      <Link
        to={href}
        aria-label={imageLabel}
        className="block mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
      >
        <OptimizedImage
          src={article.image}
          alt={article.title}
          className="w-full aspect-[3/2] object-cover"
          wrapperClassName="w-full"
        />
      </Link>
      <p className="label mb-2">
        {article.date}
        <span className="text-navy/30 mx-2">·</span>
        {article.category}
      </p>
      <h3 className="font-display text-xl font-medium leading-snug text-navy mb-3">
        <Link to={href} className="hover:text-gold transition-colors">
          {article.title}
        </Link>
      </h3>
      {article.excerpt && (
        <p className="text-body text-sm line-clamp-2 mb-4 flex-1">{article.excerpt}</p>
      )}
      <Link to={href} className="text-link text-sm mt-auto">
        Read story
      </Link>
    </article>
  );
}
