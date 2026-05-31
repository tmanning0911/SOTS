import OptimizedImage from './OptimizedImage';
import PullQuote from './PullQuote';

export default function PageHero({ eyebrow, title, description, image, quote, quoteSource }) {
  const isArtwork = image?.includes('/art/');

  return (
    <div
      data-nav-zone="dark"
      className="relative h-[44vh] min-h-[280px] sm:h-[48vh] sm:min-h-[320px] md:h-[52vh] max-h-[480px] overflow-hidden bg-navy-deep"
    >
      <OptimizedImage
        src={image}
        alt=""
        priority
        className={`absolute inset-0 w-full h-full object-cover ${
          isArtwork ? 'object-[center_40%] scale-105' : 'brightness-[0.45]'
        }`}
        wrapperClassName="absolute inset-0 w-full h-full"
      />
      <div
        className={`absolute inset-0 ${
          isArtwork
            ? 'bg-gradient-to-r from-navy-deep/92 via-navy-deep/55 to-navy-deep/25'
            : 'bg-gradient-to-t from-navy-deep/95 via-navy-deep/50 to-transparent'
        }`}
      />
      {isArtwork && (
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/30 to-transparent" />
      )}
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
