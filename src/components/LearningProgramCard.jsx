import CtaLink from './CtaLink';
import OptimizedImage from './OptimizedImage';
import { getLearningProgramImage } from '@/content/learningImages';

export default function LearningProgramCard({ program }) {
  const imageSrc = getLearningProgramImage(program);

  return (
    <article className="h-full flex flex-col">
      <OptimizedImage
        src={imageSrc}
        alt={program.title}
        className="w-full aspect-[16/10] object-cover"
        wrapperClassName="w-full"
      />
      <div className="pt-5 flex flex-col flex-1">
        <h3 className="font-display text-xl font-medium text-navy mb-3">{program.title}</h3>
        <p className="text-body text-sm mb-5 flex-1">{program.description}</p>
        <CtaLink href={program.ctaLink} className="text-link text-sm mt-auto">
          {program.ctaText}
        </CtaLink>
      </div>
    </article>
  );
}
