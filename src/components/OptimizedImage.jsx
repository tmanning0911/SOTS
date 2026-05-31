import { useState } from 'react';
import { webpSrc } from '@/lib/media';

export default function OptimizedImage({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
  priority = false,
  webp,
  /** Skip fade-in — for decorative backgrounds that set their own opacity */
  decorative = false,
  ...props
}) {
  const [loaded, setLoaded] = useState(decorative);
  const webpPath = webp ?? webpSrc(src);
  const imgClass = decorative
    ? className
    : `transition-opacity duration-700 ease-smooth ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`;

  const imgProps = {
    src,
    alt,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    fetchPriority: priority ? 'high' : undefined,
    onLoad: () => setLoaded(true),
    className: imgClass,
    ...props,
  };

  return (
    <div className={`relative overflow-hidden bg-navy-deep/10 ${wrapperClassName}`}>
      {!loaded && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-cream-dark via-cream to-cream-dark animate-shimmer bg-[length:200%_100%]"
          aria-hidden
        />
      )}
      {webpPath ? (
        <picture className="block w-full h-full">
          <source srcSet={webpPath} type="image/webp" />
          <img {...imgProps} />
        </picture>
      ) : (
        <img {...imgProps} />
      )}
    </div>
  );
}
