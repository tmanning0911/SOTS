import { motion, useReducedMotion } from 'framer-motion';
import OptimizedImage from './OptimizedImage';
import { OrnamentDivider } from './decor';

export default function PageHero({ eyebrow, title, description, image }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      data-nav-zone="dark"
      className="relative h-[42vh] min-h-[280px] sm:h-[48vh] sm:min-h-[340px] md:h-[55vh] md:min-h-[380px] max-h-[520px] overflow-hidden bg-navy-deep grain-overlay"
    >
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <OptimizedImage
          src={image}
          alt=""
          priority
          className="w-full h-full object-cover brightness-[0.45]"
          wrapperClassName="absolute inset-0 w-full h-full"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-navy-deep/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/80 to-transparent" />
      <div className="absolute inset-0 flex items-end px-4 sm:px-6 md:px-16 pb-10 sm:pb-14 md:pb-16 z-[2]">
        <motion.div
          className="max-w-6xl mx-auto w-full"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {eyebrow && <span className="section-eyebrow mb-4">{eyebrow}</span>}
          <h1 className="font-display text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold uppercase leading-[1.02] text-balance">
            {title}
          </h1>
          {description && (
            <p className="font-inter text-white/70 text-base md:text-lg max-w-xl mt-5 leading-relaxed">
              {description}
            </p>
          )}
          <OrnamentDivider light className="!max-w-xs mt-6 !mx-0" />
        </motion.div>
      </div>
    </div>
  );
}
