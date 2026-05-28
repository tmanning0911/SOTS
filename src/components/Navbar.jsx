import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IconMenu, IconClose, IconSearch } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { site } from '@/content/site';
import LogoImage from './LogoImage';
import { useNavTheme } from '@/hooks/useNavTheme';

const navLinks = [
  { label: 'Productions', path: '/plays' },
  { label: 'Learning', path: '/learning' },
  { label: 'News', path: '/news' },
  { label: 'Watch', path: '/watch' },
  { label: 'Support', path: '/support' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const searchablePages = [
  { label: 'Productions', path: '/plays' },
  { label: 'Learning & Education', path: '/learning' },
  { label: 'Support Us / Donate', path: '/support' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'News', path: '/news' },
  { label: 'Watch on YouTube', path: '/watch' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { headerRef, isHeroOverlay, isLightBar, theme } = useNavTheme();

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

  const headerClass = isHeroOverlay
    ? 'nav-theme-hero bg-gradient-to-b from-navy-deep/80 via-navy-deep/50 to-transparent py-5 md:py-6'
    : isLightBar
      ? 'nav-theme-light bg-cream border-b-2 border-navy/15 py-3 shadow-soft'
      : 'nav-theme-dark bg-navy-deep border-b border-white/15 py-3 shadow-nav';

  const linkClass = isLightBar ? 'nav-link-light' : 'nav-link';
  const iconBtnClass = isLightBar ? 'nav-icon-btn-light' : 'nav-icon-btn-dark';
  const donateClass = isLightBar ? 'btn-navy !py-2.5 !px-5' : 'nav-donate-on-dark !py-2.5 !px-5';

  return (
    <>
      <header
        ref={headerRef}
        data-nav-theme={theme}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-smooth ${headerClass}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          <Link
            to="/"
            className="relative z-10 flex-shrink-0 min-w-0 transition-opacity duration-300 hover:opacity-90 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <LogoImage
              priority
              className={`h-11 sm:h-14 md:h-16 w-auto max-w-[min(52vw,200px)] object-contain object-left ${
                isLightBar ? '' : 'drop-shadow-md'
              }`}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-9" aria-label="Main">
            {navLinks.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  aria-current={active ? 'page' : undefined}
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
              className={`w-10 h-10 flex items-center justify-center border ${iconBtnClass}`}
              aria-label="Search site"
            >
              <IconSearch size={16} aria-hidden />
            </button>
            <a
              href={site.donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={donateClass}
            >
              Donate
            </a>
            <a
              href={site.ticketsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !py-2.5 !px-5"
            >
              Get Tickets
            </a>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={`w-10 h-10 flex items-center justify-center border ${iconBtnClass}`}
              aria-label="Search site"
            >
              <IconSearch size={18} aria-hidden />
            </button>
            <button
              type="button"
              className={`w-10 h-10 flex items-center justify-center border ${iconBtnClass}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <IconClose size={20} aria-hidden /> : <IconMenu size={20} aria-hidden />}
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
            className="fixed inset-0 z-[100] bg-navy-deep/85 backdrop-blur-md flex items-start justify-center pt-safe px-4 sm:px-6"
            style={{ paddingTop: 'max(5.5rem, calc(env(safe-area-inset-top) + 4rem))' }}
            onClick={() => setSearchOpen(false)}
            role="presentation"
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-xl bg-cream shadow-card overflow-hidden border border-navy/10"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Search"
            >
              <div className="flex items-center border-b border-navy/15 px-4">
                <IconSearch size={18} className="text-navy flex-shrink-0" aria-hidden />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages..."
                  aria-label="Search pages"
                  className="flex-1 py-4 px-3 text-navy text-sm outline-none font-inter bg-transparent placeholder:text-navy/45"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="nav-icon-btn-light !w-9 !h-9 !min-h-0 border-0"
                  aria-label="Close search"
                >
                  <IconClose size={18} aria-hidden />
                </button>
              </div>
              {filteredResults.length > 0 && (
                <ul className="py-2" role="listbox">
                  {filteredResults.map((r) => (
                    <li key={r.path}>
                      <button
                        type="button"
                        onClick={() => handleResultClick(r.path)}
                        className="w-full text-left px-5 py-3.5 font-inter text-sm text-navy hover:bg-cream-dark focus-visible:bg-cream-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
                      >
                        {r.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {searchQuery.length > 0 && filteredResults.length === 0 && (
                <p className="px-5 py-6 font-inter text-sm text-navy/60">No results found.</p>
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
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            <nav className="flex flex-col gap-5 sm:gap-6 flex-1" aria-label="Mobile">
              {navLinks.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    to={item.path}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                    className="font-display text-white text-2xl sm:text-3xl font-medium tracking-wide py-1 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-8 mt-4 border-t border-white/15 sticky bottom-0 bg-navy-deep pb-2">
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
