import { motion, useReducedMotion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

/** Staggered word reveal — inspired by Motion / Framer marketing sites */
export default function TextReveal({
  text,
  className = '',
  as: Tag = 'span',
  delay = 0,
  stagger = 0.06,
}) {
  const reduceMotion = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);

  if (reduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = motion[Tag] || motion.span;

  return (
    <MotionTag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: '110%' }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: delay + i * stagger, ease }}
          >
            {word}
            {i < words.length - 1 ? '\u00a0' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
