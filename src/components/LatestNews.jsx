import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useReducedMotion } from 'framer-motion';
import { IconArrowRight, IconChevronLeft, IconChevronRight } from '@/components/icons';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import OptimizedImage from './OptimizedImage';
import SectionHeader from './SectionHeader';
import { cms } from '@/lib/cms';
import { seedArticles } from '@/lib/contentSeed';

function formatArticleDate(dateStr) {
  if (!dateStr) return '';
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function NewsCard({ item }) {
  return (
    <Link
      to={`/news/${item.id}`}
      className="group flex flex-col h-full bg-navy-light/40 border border-white/10 hover:border-gold/35 transition-colors duration-300 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <div className="aspect-[16/10] overflow-hidden image-shine bg-navy-light relative">
        <OptimizedImage
          src={item.image}
          alt=""
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.8] group-hover:brightness-95"
          wrapperClassName="w-full h-full"
        />
        <span className="absolute top-3 left-3 px-2 py-1 bg-navy-deep/85 border border-white/10 font-inter text-[9px] tracking-[0.2em] uppercase font-semibold text-gold-light">
          {item.category}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <h3 className="font-display text-white text-lg sm:text-xl font-medium leading-snug group-hover:text-gold transition-colors duration-300 line-clamp-3 flex-1">
          {item.title}
        </h3>
        <time
          dateTime={item.date}
          className="font-inter text-white/40 text-[11px] tracking-wide mt-4 pt-4 border-t border-white/10"
        >
          {formatArticleDate(item.date)}
        </time>
      </div>
    </Link>
  );
}

export default function LatestNews() {
  const [articles, setArticles] = useState(() => seedArticles.slice(0, 6));
  const reduceMotion = useReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    containScroll: 'trimSnaps',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  useEffect(() => {
    cms.articles
      .list('-date')
      .then((data) => {
        const published = data.filter((a) => a.published !== false).slice(0, 6);
        setArticles(published.length > 0 ? published : seedArticles.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return undefined;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    emblaApi.reInit();
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect, articles]);

  useEffect(() => {
    if (!emblaApi || reduceMotion || articles.length < 2) return undefined;
    const timer = setInterval(() => emblaApi.scrollNext(), 7000);
    return () => clearInterval(timer);
  }, [emblaApi, reduceMotion, articles.length]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (articles.length === 0) return null;

  const [featured, ...carouselArticles] = articles;
  const slides = carouselArticles.length > 0 ? carouselArticles : [featured];

  return (
    <section className="section-pad bg-navy-deep grain-overlay relative overflow-hidden accent-top-dark" data-nav-zone="dark">
      <div className="page-container relative z-[1]">
        <div className="flex flex-col gap-6 mb-8 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="News & Updates"
            title="Latest Stories"
            description="Season announcements, tickets, sponsors, and education news."
            align="left"
            light
            className="!mb-0 max-w-2xl"
          />

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2" role="group" aria-label="News carousel controls">
              <button
                type="button"
                onClick={scrollPrev}
                className="w-11 h-11 flex items-center justify-center border border-white/25 text-white/80 hover:text-white hover:border-gold/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                aria-label="Previous articles"
              >
                <IconChevronLeft size={18} aria-hidden />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="w-11 h-11 flex items-center justify-center border border-white/25 text-white/80 hover:text-white hover:border-gold/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                aria-label="Next articles"
              >
                <IconChevronRight size={18} aria-hidden />
              </button>
            </div>
            <Link
              to="/news"
              className="text-white/50 hover:text-gold text-xs tracking-[0.2em] uppercase font-semibold inline-flex items-center gap-2 transition-colors min-h-[44px]"
            >
              All News <IconArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </div>

        {featured && (
          <Reveal className="mb-6 sm:mb-8">
            <Link
              to={`/news/${featured.id}`}
              className="group grid md:grid-cols-2 gap-0 border border-white/10 bg-navy-light/30 hover:border-gold/35 transition-colors duration-300 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[16rem] overflow-hidden image-shine">
                <OptimizedImage
                  src={featured.image}
                  alt=""
                  className="w-full h-full object-cover brightness-[0.75] group-hover:brightness-90 transition-all duration-700 group-hover:scale-[1.02]"
                  wrapperClassName="absolute inset-0"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 bg-gold text-navy-deep font-inter text-[9px] tracking-[0.2em] uppercase font-bold">
                  Latest
                </span>
              </div>
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                <span className="section-eyebrow text-gold-light mb-3">{featured.category}</span>
                <h3 className="font-display text-white text-2xl sm:text-3xl font-semibold uppercase leading-tight mb-4 group-hover:text-gold transition-colors">
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p className="font-inter text-white/55 text-sm leading-relaxed mb-6 line-clamp-2 hidden sm:block">
                    {featured.excerpt}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                  <time dateTime={featured.date} className="font-inter text-white/40 text-xs tracking-wide">
                    {formatArticleDate(featured.date)}
                  </time>
                  <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-gold">
                    Read story <IconArrowRight size={14} aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        )}

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y -ml-4 sm:-ml-5">
            {slides.map((item) => (
              <div
                key={item.id}
                className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] sm:pl-5 lg:flex-[0_0_33.333%]"
              >
                <NewsCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {scrollSnaps.length > 1 && (
          <div className="flex justify-center gap-2 mt-6 sm:mt-8" role="tablist" aria-label="News slides">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === selectedIndex}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-1.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  index === selectedIndex ? 'w-8 bg-gold' : 'w-2 bg-white/25 hover:bg-white/45'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
