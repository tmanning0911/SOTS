import OptimizedImage from './OptimizedImage';
import PullQuote from './PullQuote';
import { ArtSectionBackground } from './decor';

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  artBackground,
  quote,
  quoteSource,
}) {
  const alt = imageAlt || (title ? `${title} — Shakespeare on the Sound` : '');

  return (
    <div
      data-nav-zone="dark"
      className="relative min-h-[42svh] sm:min-h-[44vh] h-auto sm:h-[48vh] md:h-[52vh] max-h-[480px] overflow-hidden bg-navy-deep"
    >
      <OptimizedImage
        src={image}
        alt={alt}
        priority
        decorative={!alt}
        className="absolute inset-0 w-full h-full object-cover brightness-[0.45]"
        wrapperClassName="absolute inset-0 w-full h-full"
      />
      {artBackground && <ArtSectionBackground src={artBackground} tone="dark" position="center" />}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/50 to-transparent" />
      <div className="absolute inset-0 flex items-end pb-8 sm:pb-10 md:pb-12 pt-24 sm:pt-28 z-[1]">
        <div className="site-container w-full">
          {eyebrow && <p className="text-sm text-white/50 mb-2">{eyebrow}</p>}
          <h1 className="heading-display text-white text-balance max-w-3xl">{title}</h1>
          {description && (
            <p className="text-body-lg text-white/65 max-w-prose mt-3 sm:mt-4 line-clamp-4 sm:line-clamp-none">
              {description}
            </p>
          )}
          {quote && (
            <PullQuote cite={quoteSource} light className="mt-4 max-w-prose text-sm sm:text-base">
              {quote}
            </PullQuote>
          )}
        </div>
      </div>
    </div>
  );
}
