import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import OptimizedImage from './OptimizedImage';
import { images } from '@/content/images';

export default function AboutBanner() {
  return (
    <section className="bg-cream overflow-hidden">
      <div className="grid md:grid-cols-2 md:min-h-[480px]">
        <Reveal className="relative overflow-hidden min-h-[280px] sm:min-h-[340px] md:min-h-full order-2 md:order-1 image-shine">
          <OptimizedImage
            src={images.parkPerformance}
            alt="Outdoor theatre performance at Pinkney Park"
            className="absolute inset-0 w-full h-full object-cover"
            wrapperClassName="absolute inset-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-navy-deep/30" />
          <div className="absolute bottom-6 left-4 sm:bottom-8 sm:left-8 bg-gold px-5 py-3 sm:px-6 sm:py-4 shadow-soft">
            <p className="font-display text-navy-deep text-3xl sm:text-4xl font-semibold leading-none">16</p>
            <p className="font-inter text-navy-deep/80 text-[10px] tracking-[0.2em] uppercase mt-1">
              Summer Performances
            </p>
          </div>
        </Reveal>

        <Reveal
          delay={0.1}
          className="flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 bg-cream relative order-1 md:order-2"
        >
          <img
            src={images.aboutBanner}
            alt=""
            className="absolute -right-8 sm:-right-12 bottom-0 w-48 sm:w-72 opacity-[0.05] pointer-events-none select-none max-w-[50%]"
            aria-hidden
          />
          <span className="section-eyebrow mb-4 sm:mb-5">About Us</span>
          <h2 className="font-display text-navy text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold uppercase leading-tight mb-4 sm:mb-6 text-balance">
            Professional Shakespeare in Fairfield County
          </h2>
          <p className="font-inter text-navy/70 text-sm md:text-base leading-relaxed mb-4">
            We perform sixteen summer shows in Pinkney Park, Rowayton — with ticket prices kept intentionally low. Each
            year we raise at least $115,000 from supporters to make that possible.
          </p>
          <p className="font-inter text-navy/70 text-sm md:text-base leading-relaxed mb-8 sm:mb-10">
            Our productions and education programs reach communities who might otherwise not have access to professional
            Shakespeare.
          </p>
          <div className="flex items-center gap-6 sm:gap-10 mb-8 sm:mb-10">
            <div>
              <p className="font-display text-gold text-3xl sm:text-4xl font-semibold">$115K</p>
              <p className="font-inter text-navy/50 text-[10px] tracking-[0.2em] uppercase mt-1">Raised Annually</p>
            </div>
            <div className="w-px h-10 sm:h-12 bg-navy/15" />
            <div>
              <p className="font-display text-gold text-3xl sm:text-4xl font-semibold">30</p>
              <p className="font-inter text-navy/50 text-[10px] tracking-[0.2em] uppercase mt-1">Seasons & Counting</p>
            </div>
          </div>
          <Link to="/about" className="link-gold w-fit">
            Our Story
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
