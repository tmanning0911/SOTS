import { motion, useReducedMotion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 28,
  once = true,
  as: Tag = 'div',
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[Tag] || motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
