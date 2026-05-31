import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Detects light vs dark content behind the fixed navbar.
 * Uses elementsFromPoint below the header (the header itself blocks a single-point probe).
 */
export function useNavTheme() {
  const headerRef = useRef(null);
  const [atTop, setAtTop] = useState(true);
  const [navZone, setNavZone] = useState('dark');
  const location = useLocation();
  const isHome = location.pathname === '/';

  const measure = useCallback(() => {
    setAtTop(window.scrollY < 20);

    const header = headerRef.current;
    const rect = header?.getBoundingClientRect();
    const probeY = (rect?.bottom ?? 72) + 6;
    const probeX = Math.min(Math.max(window.innerWidth / 2, 8), window.innerWidth - 8);

    const stack = document.elementsFromPoint(probeX, probeY);
    for (const el of stack) {
      if (header?.contains(el)) continue;
      if (el.id === 'main-content' || el.tagName === 'MAIN') continue;
      const zone = el.closest('[data-nav-zone]')?.getAttribute('data-nav-zone');
      if (zone === 'light' || zone === 'dark') {
        setNavZone(zone);
        return;
      }
    }

    // Fallback: past hero on home → usually cream sections
    if (isHome && window.scrollY > window.innerHeight * 0.45) {
      setNavZone('light');
    } else {
      setNavZone('dark');
    }
  }, [isHome]);

  useEffect(() => {
    measure();
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [measure, location.pathname]);

  useEffect(() => {
    const t = setTimeout(measure, 150);
    return () => clearTimeout(t);
  }, [location.pathname, measure]);

  const isHeroOverlay = isHome && navZone === 'dark';
  const isLightBar = navZone === 'light';
  const theme = isHeroOverlay ? 'hero' : isLightBar ? 'light' : 'dark';

  return { headerRef, atTop, navZone, isHome, isHeroOverlay, isLightBar, theme };
}
