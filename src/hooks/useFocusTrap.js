import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Trap focus inside a modal and restore focus on close. */
export function useFocusTrap(active, containerRef) {
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return undefined;

    previousFocus.current = document.activeElement;

    const container = containerRef.current;

    const focusables = () =>
      [...container.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

    const focusFirst = () => {
      const first = focusables()[0];
      first?.focus();
    };

    requestAnimationFrame(focusFirst);

    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const els = focusables();
      if (!els.length) return;

      const firstEl = els[0];
      const lastEl = els[els.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    container.addEventListener('keydown', onKeyDown);

    return () => {
      container.removeEventListener('keydown', onKeyDown);
      if (previousFocus.current?.focus) {
        previousFocus.current.focus();
      }
    };
  }, [active, containerRef]);
}
