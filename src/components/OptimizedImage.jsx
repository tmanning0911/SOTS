import { useState } from 'react';

export default function OptimImage({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
  priority = false,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-navy-deep/10 ${wrapperClassName}`}>
      {!loaded && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-cream-dark via-cream to-cream-dark animate-shimmer bg-[length:200%_100%]"
          aria-hidden
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-700 ease-smooth ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        {...props}
      />
    </div>
  );
}
