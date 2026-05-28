import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IconMenu, IconClose, IconSearch } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { site } from '@/content/site';

const navLinks = [
  { label: 'Productions', path: '/plays' },
  { label: 'Learning', path: '/learning' },
  { label: 'News', path: '/news' },
  { label: 'Support', path: '/support' },
  { label: 'About', path: '/about' },
];

const searchablePages = [
  { label: 'Productions', path: '/plays' },
  { label: 'Learning & Education', path: '/learning' },
  { label: 'Support Us / Donate', path: '/support' },
  { label: 'About Us', path: '/about' },
  { label: 'News', path: '/news' },
  { label: 'Watch on YouTube', path: '/watch' },
];

/** Y coordinate to sample what's behind the fixed navbar */
const NAV_PROBE_Y = 40;

function getZoneBehindNav() {
  const el = document.elementFromPoint(Math.min(window.innerWidth / 2, window.innerWidth - 8), NAV_PROBE_Y);
  const zone = el?.closest('[data-nav-zone]')?.getAttribute('data-nav-zone');
  return zone === 'light' ? 'light' : 'dark';
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [atTop, setAtTop] = useState(true);
  const [navZone, setNavZone] = useState('dark');
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const updateNavAppearance = useCallback(() => {
    setAtTop(window.scrollY < 24);
    setNavZone(getZoneBehindNav());
  }, []);

  useEffect(() => {
    updateNavAppearance();
    window.addEventListener('scroll', updateNavAppearance, { passive: true });
    window.addEventListener('resize', updateNavAppearance);
    return () => {
      window.removeEventListener('scroll', updateNavAppearance);
      window.removeEventListener('resize', updateNavAppearance);
    };
  }, [updateNavAppearance, location.pathname]);

  useEffect(() => {
    const t = setTimeout(updateNavAppearance, 100);
    return () => clearTimeout(t);
  }, [location.pathname, updateNavAppearance]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
    else setSearchQuery('');
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filteredResults =
    searchQuery.length > 0
      ? searchablePages.filter((p) => p.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : [];

  const handleResultClick = (path) => {
    setSearchOpen(false);
    navigate(path);
  };

  /** Transparent white text only on home hero at very top */
  const isHeroOverlay = isHome && atTop && navZone === 'dark';
  const isLightBar = !isHeroOverlay && navZone === 'light';

  const headerClass = isHeroOverlay
    ? 'bg-gradient-to-b from-navy-deep/75 via-navy-deep/40 to-transparent py-5 md:py-6 border-b border-transparent'
    : isLightBar
      ? 'bg-cream/96 backdrop-blur-md py-3 shadow-soft border-b border-navy/10'
      : 'bg-navy-deep/96 backdrop-blur-md py-3 shadow-nav border-b border-white/10';

  const linkClass = isLightBar ? 'nav-link-light' : 'nav-link';
  const iconBtnClass = isLightBar
    ? 'text-navy/70 hover:text-navy border-navy/15 hover:border-navy/30'
    : 'text-white/70 hover:text-white border-white/15 hover:border-white/30';

  const donateClass = isLightBar
    ? 'inline-flex min-h-[44px] items-center bg-navy text-white text-[10px] tracking-[0.2em] uppercase font-semibold px-5 py-2.5 hover:bg-navy-light transition-all duration-300'
    : 'inline-flex min-h-[44px] items-center bg-white/95 text-navy-deep text-[10px] tracking-[0.2em] uppercase font-semibold px-5 py-2.5 hover:bg-white transition-all duration-300';

  const logoClass = isLightBar ? 'drop-shadow-none' : 'drop-shadow-lg';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-smooth ${headerClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          <Link to="/" className="relative z-10 flex-shrink-0 min-w-0 transition-opacity duration-300 hover:opacity-90">
            <img
              src="/images/logo.png"
              alt={site.name}
              className={`h-11 sm:h-14 md:h-16 w-auto max-w-[min(52vw,200px)] object-contain object-left transition-[filter] duration-400 ${logoClass}`}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-9" aria-label="Main">
            {navLinks.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`${linkClass} ${active ? 'nav-link-active' : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={`w-10 h-10 flex items-center justify-center border transition-all duration-300 ${iconBtnClass}`}
              aria-label="Search"
            >
              <IconSearch size={16} />
            </button>
            <a href={site.donateUrl} target="_blank" rel="noopener noreferrer" className={donateClass}>
              Donate
            </a>
            <a href={site.ticketsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2.5 !px-5">
              Get Tickets
            </a>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={`w-10 h-10 flex items-center justify-center border transition-colors ${iconBtnClass}`}
              aria-label="Search"
            >
              <IconSearch size={18} />
            </button>
            <button
              type="button"
              className={`w-10 h-10 flex items-center justify-center border transition-colors ${iconBtnClass}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <IconClose size={20} /> : <IconMenu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-navy-deep/80 backdrop-blur-md flex items-start justify-center pt-safe px-4 sm:px-6"
            style={{ paddingTop: 'max(5.5rem, calc(env(safe-area-inset-top) + 4rem))' }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-xl bg-cream shadow-card overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center border-b border-navy/10 px-4">
                <IconSearch size={18} className="text-navy/40 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages..."
                  className="flex-1 py-4 px-3 text-navy text-sm outline-none font-inter bg-transparent"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="text-navy/40 hover:text-navy p-2">
                  <IconClose size={18} />
                </button>
              </div>
              {filteredResults.length > 0 && (
                <ul className="py-2">
                  {filteredResults.map((r) => (
                    <li key={r.path}>
                      <button
                        type="button"
                        onClick={() => handleResultClick(r.path)}
                        className="w-full text-left px-5 py-3.5 font-inter text-sm text-navy hover:bg-cream-dark transition-colors"
                      >
                        {r.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {searchQuery.length > 0 && filteredResults.length === 0 && (
                <p className="px-5 py-6 font-inter text-sm text-navy/50">No results found.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[90] lg:hidden bg-navy-deep px-5 sm:px-8 pb-safe flex flex-col overflow-y-auto overscroll-contain"
            style={{ paddingTop: 'max(5.5rem, calc(env(safe-area-inset-top) + 4.5rem))' }}
          >
            <nav className="flex flex-col gap-5 sm:gap-6 flex-1">
              {navLinks.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className="font-display text-white text-2xl sm:text-3xl font-medium tracking-wide py-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-8 mt-4 border-t border-white/10 sticky bottom-0 bg-navy-deep pb-2">
              <a href={site.donateUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full justify-center">
                Donate
              </a>
              <a href={site.ticketsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center">
                Get Tickets
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
