/** Shakespeare or season pull quote — used sparingly, not as decoration everywhere. */
export default function PullQuote({ children, cite, light = false, className = '' }) {
  return (
    <blockquote
      className={`border-l-2 pl-4 sm:pl-5 max-w-xl ${light ? 'border-gold/45' : 'border-gold'} ${className}`}
    >
      <p
        className={`font-display text-base sm:text-lg leading-snug italic text-balance ${
          light ? 'text-white/85' : 'text-navy/90'
        }`}
      >
        &ldquo;{children}&rdquo;
      </p>
      {cite && (
        <footer
          className={`font-inter text-[11px] tracking-wide mt-2 not-italic ${
            light ? 'text-white/45' : 'text-navy/50'
          }`}
        >
          — <cite className="not-italic">{cite}</cite>
        </footer>
      )}
    </blockquote>
  );
}
