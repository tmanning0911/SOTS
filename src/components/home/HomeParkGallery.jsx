import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IconChevronLeft, IconChevronRight } from '@/components/icons';
import OptimizedImage from '../OptimizedImage';
import Reveal from '../Reveal';
import { images } from '@/content/images';

const slides = [
  {
    src: images.backgrounds.audience,
    caption: 'Blankets on the lawn · Pinkney Park',
    alt: 'Audience watching Shakespeare outdoors at Pinkney Park',
  },
  {
    src: images.backgrounds.cast,
    caption: 'Much Ado About Nothing · 2026',
    alt: 'Cast of Much Ado About Nothing',
  },
  {
    src: images.backgrounds.spotlight,
    caption: 'Main stage · 7:30pm',
    alt: 'Performer under stage lights',
  },
  {
    src: images.backgrounds.kids,
    caption: "Kids' Show · free at 6:30pm",
    alt: 'Shakespeare for Kids performance',
  },
  {
    src: images.news.audience,
    caption: 'Thirty summers on the Five Mile River',
    alt: 'Evening audience at Shakespeare on the Sound',
  },
];

export default function HomeParkGallery() {
  const reduceMotion = useReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return undefined;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || reduceMotion) return undefined;
    const timer = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => clearInterval(timer);
  }, [emblaApi, reduceMotion]);

  return (
    <section className="relative bg-twilight overflow-hidden" data-nav-zone="dark" aria-label="Park gallery">
      <div className="site-container py-14 md:py-20">
        <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="label text-starlight/50 mb-2">The experience</p>
            <h2 className="heading-section text-white">Under the Connecticut sky</h2>
          </div>
          <Link to="/about#visit" className="text-link-light text-sm shrink-0">
            Plan your visit
          </Link>
        </Reveal>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              className="relative flex-[0_0_85%] sm:flex-[0_0_70%] lg:flex-[0_0_55%] min-w-0 pl-4 sm:pl-6 first:pl-5 sm:first:pl-8 last:pr-5 sm:last:pr-8"
            >
              <figure
                className={`relative transition-opacity duration-500 ${
                  i === selected ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <OptimizedImage
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full aspect-[16/10] object-cover"
                  wrapperClassName="w-full"
                />
                <figcaption className="mt-4 font-display text-lg text-white/80 italic">
                  {slide.caption}
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      <div className="site-container flex items-center justify-between pt-8 pb-14 md:pb-20">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === selected ? 'w-8 bg-gold' : 'w-4 bg-white/25 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => emblaApi?.scrollPrev()}
            className="w-11 h-11 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <IconChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => emblaApi?.scrollNext()}
            className="w-11 h-11 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <IconChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
