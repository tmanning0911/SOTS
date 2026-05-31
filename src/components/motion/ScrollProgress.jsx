import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/** Thin reading-progress bar — common on editorial / portfolio sites */
export default function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  if (reduceMotion) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gold origin-left z-[200] pointer-events-none"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
