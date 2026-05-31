import { useState, useEffect, useCallback, useRef } from 'react';
import { IconChevronLeft, IconChevronRight } from '@/components/icons';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { site } from '@/content/site';
import { homeCopy } from '@/content/voice';
import { webpSrc } from '@/lib/media';
import PullQuote from './PullQuote';

const SLIDE_DURATION = 10000;

const slides = [
  {
    title: 'Much Ado About Nothing',
    subtitle: homeCopy.heroMain.subtitle,
    description: homeCopy.heroMain.description,
    quote: homeCopy.heroMain.quote,
    quoteSource: homeCopy.heroMain.quoteSource,
    tag: 'Get Tickets',
    image: '/images/hero-much-ado.jpg',
    ticketUrl: site.ticketsUrl,
    external: true,
  },
  {
    title: 'Much Ado About Something',
    subtitle: 'Gala — October 16, 2026',
    description: homeCopy.heroGala.description,
    tag: 'Join the Committee',
    image: '/images/news/gala-2026.jpg',
    ticketUrl: '/events#gala-2026',
    external: false,
  },
  {
    title: 'Shakespeare for Everyone',
    subtitle: 'Education Programs',
    description: homeCopy.heroEducation.description,
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
    <section
      data-nav-zone="dark"
      className="relative min-h-[min(100dvh,920px)] h-[100svh] max-h-[920px] overflow-hidden bg-navy-deep grain-overlay"
    >
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
            src={webpSrc(slide.image) || slide.image}
            alt=""
            fetchPriority={current === 0 ? 'high' : 'auto'}
            className="absolute inset-0 w-full h-full object-cover object-center"
            initial={reduceMotion ? false : { scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 12, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/92 via-navy-deep/55 to-navy-deep/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/40 to-navy-deep/15" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,hsl(38_72%_48%/0.12),transparent_55%)]" />
        </motion.div>
      </AnimatePresence>

      {/* Prev / next — desktop & tablet only to avoid crowding mobile */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-20 hidden sm:flex justify-between px-3 md:px-8 pointer-events-none">
        <button
          type="button"
          onClick={() => advance(-1)}
          aria-label="Previous slide"
          className="pointer-events-auto w-11 h-11 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-gold/50 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
        >
          <IconChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => advance(1)}
          aria-label="Next slide"
          className="pointer-events-auto w-11 h-11 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-gold/50 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
        >
          <IconChevronRight size={20} />
        </button>
      </div>

      {/* Main copy — sits above bottom chrome */}
      <div className="absolute inset-x-0 top-[4.5rem] sm:top-[5.5rem] bottom-[7.5rem] sm:bottom-[5.5rem] flex items-end px-4 sm:px-6 md:px-16 pointer-events-none">
        <div className="max-w-6xl mx-auto w-full pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="section-eyebrow text-gold-light mb-3 sm:mb-4">{slide.subtitle}</span>
              <h1 className="font-display text-white text-[clamp(2rem,8vw,4.5rem)] leading-[0.98] font-semibold mb-3 sm:mb-4 max-w-4xl text-balance">
                {slide.title}
              </h1>
              <p className="font-inter text-white/75 text-sm sm:text-base md:text-lg max-w-lg mb-4 sm:mb-5 leading-relaxed">
                {slide.description}
              </p>
              {slide.quote && (
                <PullQuote cite={slide.quoteSource} light className="mb-6 sm:mb-8 hidden sm:block">
                  {slide.quote}
                </PullQuote>
              )}
              <div className="btn-stack-mobile max-w-md">
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

      {/* Bottom chrome: dots + progress — fixed height so nothing overlaps */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col">
        <div className="flex items-center justify-center gap-2 px-4 py-4 sm:py-3">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current ? 'true' : undefined}
              className={`rounded-full transition-all duration-500 min-h-[44px] min-w-[44px] flex items-center justify-center sm:min-h-0 sm:min-w-0 ${
                i === current ? 'sm:w-10 sm:h-2' : 'sm:w-2 sm:h-2'
              }`}
            >
              <span
                className={`block rounded-full transition-all duration-500 ${
                  i === current ? 'w-10 h-2 bg-gold' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            </button>
          ))}
        </div>
        {!reduceMotion && (
          <div className="h-0.5 bg-white/10 w-full">
            <motion.div
              key={progressKey}
              className="h-full bg-gold origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
