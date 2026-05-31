import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Infinite horizontal scroll — adapted from Magic UI marquee pattern.
 * @see https://github.com/magicuidesign/magicui
 */
export default function Marquee({
  children,
  className = '',
  reverse = false,
  pauseOnHover = true,
  vertical = false,
  repeat = 4,
  duration = '40s',
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={cn('flex overflow-x-auto gap-8 py-4', className)}>{children}</div>;
  }

  return (
    <div
      className={cn(
        'group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]',
        vertical && 'flex-col [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]',
        className,
      )}
      style={{ '--duration': duration }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 justify-around gap-8 min-w-full',
            vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
            reverse && '[animation-direction:reverse]',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
