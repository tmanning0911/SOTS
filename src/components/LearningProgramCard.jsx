import { motion } from 'framer-motion';
import { LearningIcon, IconArrowRight } from '@/components/icons';
import CtaLink from './CtaLink';
import OptimizedImage from './OptimizedImage';
import { getLearningProgramImage } from '@/content/learningImages';

export default function LearningProgramCard({ program, index = 0 }) {
  const imageSrc = getLearningProgramImage(program);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="bg-white group shadow-soft card-lift border border-navy/5 h-full flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden image-shine">
        <OptimizedImage
          src={imageSrc}
          alt=""
          className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105 brightness-[0.88] group-hover:brightness-95"
          wrapperClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/75 via-navy-deep/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex items-end justify-between gap-3">
          <h3 className="font-display text-white text-lg sm:text-xl font-semibold uppercase leading-tight text-balance">
            {program.title}
          </h3>
          <div
            className="w-10 h-10 border border-white/35 bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0"
            aria-hidden
          >
            <LearningIcon name={program.icon} className="text-gold" size={20} />
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7 flex flex-col flex-1">
        <p className="font-inter text-navy/80 text-sm leading-relaxed mb-6 flex-1">{program.description}</p>
        <CtaLink href={program.ctaLink} className="link-gold inline-flex items-center gap-2 mt-auto">
          {program.ctaText}
          <IconArrowRight size={14} />
        </CtaLink>
      </div>
    </motion.article>
  );
}
