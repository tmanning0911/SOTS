import { useState } from 'react';

/**
 * Sponsor logo with graceful fallback if the image fails to load.
 */
export default function SponsorLogo({ sponsor, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (!sponsor.logo || failed) {
    return (
      <span
        className={`font-display text-navy/75 text-sm sm:text-base font-semibold text-center leading-snug px-2 ${className}`}
      >
        {sponsor.name}
      </span>
    );
  }

  const img = (
    <img
      src={sponsor.logo}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`max-h-12 sm:max-h-14 w-auto max-w-[min(100%,200px)] object-contain transition-opacity duration-300 group-hover:opacity-100 ${className}`}
    />
  );

  if (sponsor.url) {
    return (
      <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center w-full h-full min-h-[72px] rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        aria-label={sponsor.name}
      >
        {img}
      </a>
    );
  }

  return <div className="flex items-center justify-center w-full h-full min-h-[72px]">{img}</div>;
}
