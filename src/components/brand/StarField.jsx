import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Subtle star field — summer night at Pinkney Park */
export default function StarField({ className = '' }) {
  const reduceMotion = useReducedMotion();

  const stars = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${8 + ((i * 37) % 84)}%`,
        top: `${5 + ((i * 23) % 45)}%`,
        size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 2 : 1.5,
        delay: `${(i % 7) * 0.4}s`,
        opacity: 0.25 + (i % 4) * 0.15,
      })),
    [],
  );

  return (
    <div className={`star-field ${className}`} aria-hidden>
      {stars.map((star) => (
        <span
          key={star.id}
          className={reduceMotion ? 'star-field__star' : 'star-field__star star-field__star--pulse'}
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}
