import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IconMenu, IconClose, IconSearch } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { site } from '@/content/site';
import LogoImage from './LogoImage';
import NavDropdown, { MobileNavGroup } from './NavDropdown';
import { navItems, searchablePages } from '@/content/nav';
import { useNavTheme } from '@/hooks/useNavTheme';

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
      ? 'nav-theme-light bg-cream border-b-2 border-navy/15 py-3.5 shadow-soft'
      : 'nav-theme-dark bg-navy-deep border-b border-white/15 py-3.5 shadow-nav';

  const iconBtnClass = isLightBar ? 'nav-icon-btn-light' : 'nav-icon-btn-dark';
  const donateClass = isLightBar ? 'btn-navy !py-2.5 !px-6' : 'nav-donate-on-dark !py-2.5 !px-6';
  const actionsDividerClass = isLightBar ? 'nav-actions-divider-light' : 'nav-actions-divider-dark';

  return (
    <>
      <header
        ref={headerRef}
        data-nav-theme={theme}
        className={`fixed top-0 left-0 right-0 z-50 overflow-visible transition-colors duration-300 ease-smooth ${headerClass}`}
      >
        <div className="max-w-[92rem] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16">
          {/* Desktop: logo | nav | actions in three balanced columns */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] items-center gap-x-12 xl:gap-x-20 min-h-[4rem]">
            <div className="flex justify-start min-w-0 pr-4 xl:pr-8">
              <Link
                to="/"
                className="relative z-10 flex-shrink-0 min-w-0 transition-opacity duration-300 hover:opacity-90 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                <LogoImage
                  priority
                  className={`h-12 lg:h-14 xl:h-[3.75rem] w-auto max-w-[min(42vw,200px)] object-contain object-left ${
                    isLightBar ? '' : 'drop-shadow-md'
                  }`}
                />
              </Link>
            </div>

            <nav
              className="flex items-center justify-center gap-x-3 xl:gap-x-4 2xl:gap-x-5 overflow-visible px-2 xl:px-4"
              aria-label="Main"
            >
              {navItems.map((item) => (
                <NavDropdown key={item.label} item={item} isLightBar={isLightBar} />
              ))}
            </nav>

            <div className={`flex items-center justify-end gap-5 flex-shrink-0 pl-4 xl:pl-8 ${actionsDividerClass}`}>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={`w-11 h-11 flex items-center justify-center border ${iconBtnClass}`}
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
                className="btn-primary !py-2.5 !px-6"
              >
                Get Tickets
              </a>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-3 min-h-[3.75rem]">
            <Link
              to="/"
              className="relative z-10 flex-shrink-0 min-w-0 transition-opacity duration-300 hover:opacity-90 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <LogoImage
                priority
                className={`h-11 sm:h-12 w-auto max-w-[min(48vw,190px)] object-contain object-left ${
                  isLightBar ? '' : 'drop-shadow-md'
                }`}
              />
            </Link>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={`w-11 h-11 flex items-center justify-center border ${iconBtnClass}`}
                aria-label="Search site"
              >
                <IconSearch size={18} aria-hidden />
              </button>
              <button
                type="button"
                className={`w-11 h-11 flex items-center justify-center border ${iconBtnClass}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <IconClose size={20} aria-hidden /> : <IconMenu size={20} aria-hidden />}
              </button>
            </div>
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
            className="fixed inset-0 z-[90] lg:hidden bg-navy-deep px-6 sm:px-10 pb-safe flex flex-col overflow-y-auto overscroll-contain"
            style={{ paddingTop: 'max(5.5rem, calc(env(safe-area-inset-top) + 4.5rem))' }}
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            <nav className="flex flex-col gap-7 sm:gap-8 flex-1" aria-label="Mobile">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <MobileNavGroup item={item} onNavigate={() => setMenuOpen(false)} />
                </motion.div>
              ))}
            </nav>
            <div className="flex flex-col gap-4 pt-10 mt-6 border-t border-white/15 sticky bottom-0 bg-navy-deep pb-2">
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
