import { motion, useReducedMotion } from 'framer-motion';
import { site } from '@/content/site';
import { images } from '@/content/images';
import OptimizedImage from '../OptimizedImage';

/** Orpheum 1:1 — full-bleed hero, one headline, one primary CTA */
export default function HomeHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      data-nav-zone="dark"
      className="relative min-h-[min(88vh,820px)] flex items-end sm:items-center justify-center overflow-hidden bg-navy-deep"
    >
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <OptimizedImage
          src={images.heroMuchAdo}
          webp={images.heroMuchAdoWebp}
          alt=""
          priority
          className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.48]"
          wrapperClassName="absolute inset-0 w-full h-full"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/45 to-navy-deep/25" />

      <div className="relative z-[1] w-full site-container pb-16 sm:pb-0 py-24 sm:py-32 text-center">
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-display text-white text-[clamp(2.25rem,7.5vw,5.25rem)] font-semibold leading-[1.02] text-balance max-w-5xl mx-auto mb-8 sm:mb-10"
        >
          Experience the Magic of Shakespeare in Rowayton
        </motion.h1>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <a
            href={site.ticketsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs sm:text-sm min-w-[240px] sm:min-w-[280px] justify-center"
          >
            Get Tickets
          </a>
        </motion.div>
      </div>
    </section>
  );
}
