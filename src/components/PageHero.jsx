import OptimizedImage from './OptimizedImage';
import PullQuote from './PullQuote';
import { ArtSectionBackground } from './decor';

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  artBackground,
  quote,
  quoteSource,
}) {
  return (
    <div
      data-nav-zone="dark"
      className="relative h-[44vh] min-h-[280px] sm:h-[48vh] sm:min-h-[320px] md:h-[52vh] max-h-[480px] overflow-hidden bg-navy-deep"
    >
      <OptimizedImage
        src={image}
        alt=""
        priority
        className="absolute inset-0 w-full h-full object-cover brightness-[0.45]"
        wrapperClassName="absolute inset-0 w-full h-full"
      />
      {artBackground && <ArtSectionBackground src={artBackground} tone="dark" position="center" />}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/50 to-transparent" />
      <div className="absolute inset-0 flex items-end pb-10 sm:pb-12 z-[1]">
        <div className="site-container w-full">
          {eyebrow && <p className="text-sm text-white/50 mb-2">{eyebrow}</p>}
          <h1 className="heading-display text-white text-balance max-w-3xl">{title}</h1>
          {description && (
            <p className="text-body-lg text-white/65 max-w-prose mt-4">{description}</p>
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
