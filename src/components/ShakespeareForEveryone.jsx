import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import OptimizedImage from './OptimizedImage';
import { site } from '@/content/site';

export default function ShakespeareForEveryone() {
  return (
    <section className="section-pad bg-cream-dark overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          <Reveal className="relative order-2 md:order-1">
            <div className="image-shine shadow-card">
              <OptimizedImage
                src="/images/shakespeare-for-everyone.webp"
                alt="Shakespeare performance"
                className="w-full object-cover aspect-[4/5] md:aspect-auto md:max-h-[480px]"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-gold hidden md:block" aria-hidden />
          </Reveal>

          <Reveal delay={0.12} className="order-1 md:order-2">
            <span className="section-eyebrow mb-4">{site.tagline}</span>
            <h2 className="font-display text-navy text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[0.95] mb-2">
              Shakespeare
            </h2>
            <p className="font-inter text-gold-muted text-sm tracking-[0.25em] uppercase font-semibold mb-8">
              For Everyone, Everywhere
            </p>
            <p className="font-inter text-navy/85 text-base md:text-lg leading-relaxed mb-4">
              {site.name} brings professional Shakespeare to Pinkney Park every summer — affordable,
              accessible, and alive under the Connecticut sky.
            </p>
            <p className="font-inter text-navy/70 text-base leading-relaxed mb-10">
              {site.mission}
            </p>
            <div className="btn-stack-mobile">
              <Link to="/about" className="btn-navy">
                Our Story
              </Link>
              <Link
                to="/support"
                className="inline-flex items-center justify-center min-h-[44px] border border-navy/25 text-navy text-xs tracking-[0.2em] uppercase font-semibold px-6 sm:px-7 py-3 sm:py-3.5 hover:bg-navy/5 transition-all duration-300 w-full sm:w-auto"
              >
                Get Involved
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
