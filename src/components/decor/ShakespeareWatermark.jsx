/**
 * Subtle Shakespeare / folio line art for section backgrounds.
 * Keep opacity low — texture, not decoration.
 */
export default function ShakespeareWatermark({
  variant = 'quill',
  tone = 'light',
  className = '',
  position = 'right',
}) {
  const color = tone === 'light' ? 'text-navy' : 'text-white';
  const opacity = tone === 'light' ? 'opacity-[0.045]' : 'opacity-[0.06]';

  const positionClass =
    position === 'left'
      ? 'left-0 bottom-0 -translate-x-1/4 translate-y-1/4'
      : position === 'center'
        ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        : 'right-0 bottom-0 translate-x-1/4 translate-y-1/4';

  if (variant === 'folio') {
    return (
      <div
        className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
        aria-hidden
      >
        <svg
          className={`absolute ${positionClass} w-[min(420px,55vw)] h-auto ${color} ${opacity}`}
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M40 280c40-80 120-140 200-160M60 260c30-50 80-90 140-110M220 40c-20 30-30 70-25 110M250 70c-15 25-20 55-15 85"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M280 280H40M280 280V40M40 40h240M40 40v240"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
          <circle cx="280" cy="40" r="3" fill="currentColor" fillOpacity="0.4" />
          <circle cx="40" cy="280" r="3" fill="currentColor" fillOpacity="0.4" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <svg
        className={`absolute ${positionClass} w-[min(380px,50vw)] h-auto ${color} ${opacity}`}
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M220 40c-8 42-28 78-58 108-22 22-48 38-76 48 28-6 52-20 72-42 24-26 42-58 52-94 6-22 8-44 6-66-2-18-8-34-18-48"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M58 196c-18 8-32 20-42 36-6 10-9 22-8 34 14-10 28-16 42-18 18-2 34 2 48 12"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M48 248l-16 24 28-8c-4-6-8-11-12-16z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M200 56c12 18 18 38 16 58M188 72c8 12 12 26 10 40"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
      </svg>
    </div>
  );
}
