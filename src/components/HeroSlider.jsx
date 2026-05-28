import { useState, useEffect, useCallback, useRef } from 'react';
import { IconChevronLeft, IconChevronRight } from '@/components/icons';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { site } from '@/content/site';

const SLIDE_DURATION = 10000;

const slides = [
  {
    title: 'Much Ado About Nothing',
    subtitle: '30th Summer Season · 2026',
    description:
      "Shakespeare's most sparkling comedy — under the stars at Pinkney Park, Rowayton, CT.",
    tag: 'Get Tickets',
    image: '/images/hero-much-ado.png',
    ticketUrl: site.ticketsUrl,
    external: true,
  },
  {
    title: 'Much Ado About Something',
    subtitle: 'Gala — October 16, 2026',
    description:
      'An evening of cocktails, bites, dancing, and live & silent auctions at The House Up on the Hill, Norwalk.',
    tag: 'Save the Date',
    image: '/images/news/gala-2026.jpg',
    ticketUrl: `mailto:${site.email}?subject=Gala%202026`,
    external: false,
  },
  {
    title: 'Shakespeare for Everyone',
    subtitle: 'Education Programs',
    description:
      'Workshops, summer camps, school tours, and in-park performances across Fairfield County.',
    tag: 'Explore Learning',
    image: '/images/news/shakespeare-for-kids.jpg',
    ticketUrl: '/learning',
    external: false,
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const reduceMotion = useReducedMotion();
  const timerRef = useRef(null);

  const advance = useCallback((dir = 1) => {
    setCurrent((c) => (c + dir + slides.length) % slides.length);
    setProgressKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (reduceMotion) return undefined;
    timerRef.current = setInterval(() => advance(1), SLIDE_DURATION);
    return () => clearInterval(timerRef.current);
  }, [advance, reduceMotion, current]);

  const goTo = (i) => {
    setCurrent(i);
    setProgressKey((k) => k + 1);
  };

  const slide = slides[current];
  const isExternal = slide.external || slide.ticketUrl.startsWith('http');

  return (
    <section className="relative h-[100dvh] min-h-[520px] sm:min-h-[580px] md:min-h-[620px] max-h-[960px] overflow-hidden bg-navy-deep grain-overlay">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <motion.img
            src={slide.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={reduceMotion ? false : { scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 12, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/92 via-navy-deep/55 to-navy-deep/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-transparent to-navy-deep/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,hsl(38_72%_48%/0.12),transparent_55%)]" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-end pb-28 sm:pb-24 md:pb-32 px-4 sm:px-6 md:px-16 pointer-events-none">
        <div className="max-w-7xl mx-auto w-full pointer-events-auto pr-0 sm:pr-16 md:pr-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="section-eyebrow text-gold-light mb-4">{slide.subtitle}</span>
              <h1 className="font-display text-white text-[2.35rem] leading-[0.98] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold mb-4 sm:mb-5 max-w-4xl text-balance">
                {slide.title}
              </h1>
              <p className="font-inter text-white/75 text-sm sm:text-base md:text-lg max-w-lg mb-7 sm:mb-9 leading-relaxed">
                {slide.description}
              </p>
              <div className="btn-stack-mobile max-w-md sm:max-w-none">
                {isExternal ? (
                  <a
                    href={slide.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    {slide.tag}
                  </a>
                ) : slide.ticketUrl.startsWith('mailto:') ? (
                  <a href={slide.ticketUrl} className="btn-primary">
                    {slide.tag}
                  </a>
                ) : (
                  <Link to={slide.ticketUrl} className="btn-primary">
                    {slide.tag}
                  </Link>
                )}
                <Link to="/plays" className="btn-secondary">
                  See Productions
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {!reduceMotion && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
          <motion.div
            key={progressKey}
            className="h-full bg-gold origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
          />
        </div>
      )}

      <div className="absolute bottom-[5.5rem] sm:bottom-8 md:bottom-10 left-4 right-4 sm:left-auto sm:right-6 md:right-12 z-20 flex items-center justify-center sm:justify-end gap-2 sm:gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-500 ${
              i === current ? 'w-10 h-2 bg-gold' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-20 flex justify-between px-2 sm:px-4 md:px-8 pointer-events-none">
        <button
          type="button"
          onClick={() => advance(-1)}
          aria-label="Previous slide"
          className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-gold/50 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
        >
          <IconChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => advance(1)}
          aria-label="Next slide"
          className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-gold/50 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
        >
          <IconChevronRight size={20} />
        </button>
      </div>

      <div className="absolute bottom-36 sm:bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-10 animate-fade-in hidden sm:block">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/40 to-transparent mx-auto" />
      </div>
    </section>
  );
}
