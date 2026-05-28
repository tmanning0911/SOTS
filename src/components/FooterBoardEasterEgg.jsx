import { Link } from 'react-router-dom';
import { IconMasks, IconLaurel } from '@/components/icons';

/**
 * Footer Easter egg — hover or tap “Made with love by the Board”.
 */
export default function FooterBoardEasterEgg() {
  return (
    <div className="border-t border-white/5 bg-[hsl(220_52%_8%)]">
      <div className="max-w-6xl mx-auto page-gutter py-3 sm:py-4 flex justify-center">
        <details className="footer-board-egg group relative text-center">
          <summary className="footer-board-egg-trigger font-inter text-[10px] sm:text-[11px] text-white/50 hover:text-white/70 focus-visible:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(220_52%_8%)] rounded-sm cursor-pointer list-none transition-colors duration-300 select-none">
            Made with{' '}
            <span className="text-gold/55 group-open:text-gold" aria-hidden>
              ♥
            </span>{' '}
            by the Board
          </summary>

          <div
            className="footer-board-egg-panel absolute bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 w-[min(100vw-2rem,320px)] z-20 pointer-events-none opacity-0 translate-y-1 scale-[0.97] transition-all duration-300 ease-smooth motion-reduce:transition-none group-open:opacity-100 group-open:translate-y-0 group-open:scale-100 group-open:pointer-events-auto [@media(hover:hover)]:sm:group-hover:opacity-100 [@media(hover:hover)]:sm:group-hover:translate-y-0 [@media(hover:hover)]:sm:group-hover:scale-100 [@media(hover:hover)]:sm:group-hover:pointer-events-auto"
            role="note"
          >
            <div className="relative border border-gold/35 bg-navy-deep/95 backdrop-blur-md px-5 py-4 shadow-[0_12px_40px_hsl(220_48%_5%/0.55)] text-left">
              <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-gold/35 bg-navy-deep/95"
                aria-hidden
              />
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 border border-gold/40 flex items-center justify-center shrink-0 mt-0.5">
                  <IconMasks size={18} className="text-gold" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-gold text-sm font-semibold uppercase tracking-wide mb-1">
                    Exit, pursued by a board member
                  </p>
                  <p className="font-inter text-white/65 text-[11px] leading-relaxed mb-3">
                    You found the footnotes. Our Board of Directors keeps the lamps lit, the grants
                    written, and the picnic blankets folded — with love from Rowayton to the rafters.
                  </p>
                  <p className="font-inter text-white/45 text-[10px] italic leading-relaxed flex items-center gap-1.5">
                    <IconLaurel size={14} className="text-gold/50 shrink-0" aria-hidden />
                    &ldquo;The play&rsquo;s the thing.&rdquo; — and so is the paperwork.
                  </p>
                  <Link
                    to="/about"
                    className="inline-block mt-3 font-inter text-gold text-[10px] tracking-[0.15em] uppercase font-semibold border-b border-gold/50 pb-0.5 hover:text-white hover:border-white/40 transition-colors pointer-events-auto"
                  >
                    Mission &amp; History →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
