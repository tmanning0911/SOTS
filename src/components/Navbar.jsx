import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IconChevronLeft, IconClose, IconSearch, MenuSkullIcon } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { site } from '@/content/site';
import LogoImage from './LogoImage';
import NavDropdown, { MobileNavGroup } from './NavDropdown';
import NavMegaPanel from './NavMegaPanel';
import { navItems, searchablePages } from '@/content/nav';
import { useNavTheme } from '@/hooks/useNavTheme';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openNav, setOpenNav] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { headerRef, isHeroOverlay, isLightBar, theme } = useNavTheme();
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const update = () => setHeaderHeight(el.getBoundingClientRect().height);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [menuOpen, isLightBar, isHeroOverlay, location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setOpenNav(null);
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

  const desktopHeaderClass = isHeroOverlay
    ? 'nav-theme-hero bg-gradient-to-b from-navy-deep/80 via-navy-deep/40 to-transparent py-4 md:py-5'
    : isLightBar
      ? 'nav-theme-light bg-white border-b border-navy/10 shadow-[0_1px_3px_rgba(26,39,68,0.06)] py-3'
      : 'nav-theme-dark bg-navy-deep/95 backdrop-blur-md border-b border-white/10 py-3';

  const mobileBarClass = menuOpen
    ? 'nav-theme-dark bg-navy-deep border-b border-white/10 py-3'
    : isLightBar
      ? 'nav-theme-light bg-white border-b border-navy/10 shadow-[0_1px_3px_rgba(26,39,68,0.06)] py-3'
      : 'nav-theme-dark bg-navy-deep/95 backdrop-blur-md border-b border-white/10 py-3';

  const iconBtnClass = isLightBar ? 'nav-icon-btn-light' : 'nav-icon-btn-dark';
  const donateClass = isLightBar ? 'nav-donate-on-light' : 'nav-donate-on-dark';
  const ticketsClass = isHeroOverlay
    ? 'nav-tickets nav-tickets--hero'
    : isLightBar
      ? 'nav-tickets nav-tickets--light'
      : 'nav-tickets nav-tickets--dark';
  const actionsDividerClass = isLightBar ? 'nav-actions-divider-light' : 'nav-actions-divider-dark';

  const openMegaItem = navItems.find((i) => i.label === openNav && i.mega);
  const closeNav = useCallback(() => setOpenNav(null), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openMenu = useCallback(() => {
    setSearchOpen(false);
    setMenuOpen(true);
  }, []);

  const mobileIconBtnClass = menuOpen ? 'nav-icon-btn-dark' : iconBtnClass;
  const mobileMenuTop = headerHeight || undefined;

  return (
    <>
      <header
        ref={headerRef}
        data-nav-theme={theme}
        className={`site-nav fixed top-0 left-0 right-0 overflow-visible transition-colors duration-300 ease-smooth ${
          menuOpen ? 'z-[100]' : 'z-50'
        }`}
      >
        {/* Utility bar removed — reduces clutter; links live in nav + footer */}
        <div
          className={`hidden lg:block ${desktopHeaderClass}`}
          onMouseLeave={() => openMegaItem && closeNav()}
        >
          <div className="max-w-[92rem] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16">
            <div className="grid lg:grid-cols-[1fr_auto_1fr] items-center gap-x-12 xl:gap-x-20 min-h-[4rem]">
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
                className="flex items-center justify-center gap-x-2 xl:gap-x-3 2xl:gap-x-4 overflow-visible px-2 xl:px-4 relative"
                aria-label="Main"
              >
                {navItems.map((item) => (
                  <NavDropdown
                    key={item.label}
                    item={item}
                    isLightBar={isLightBar}
                    isOpen={openNav === item.label}
                    onOpen={() => setOpenNav(item.label)}
                    onClose={closeNav}
                  />
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
                  className={ticketsClass}
                >
                  Get tickets
                </a>
              </div>
            </div>
          </div>

          {openMegaItem && (
            <NavMegaPanel item={openMegaItem} dark={!isLightBar} onNavigate={closeNav} />
          )}
        </div>

        <div className={`max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 lg:hidden ${mobileBarClass}`}>
          <div className="flex items-center gap-3 min-h-[3.75rem]">
            <Link
              to="/"
              className="relative z-10 flex-shrink-0 min-w-0 transition-opacity duration-300 hover:opacity-90 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <LogoImage
                priority
                className={`h-11 sm:h-12 w-auto max-w-[min(48vw,190px)] object-contain object-left ${
                  isLightBar && !menuOpen ? '' : 'drop-shadow-md'
                }`}
              />
            </Link>

            <div className="flex items-center gap-3 ml-auto">
              {!menuOpen && (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className={`w-11 h-11 flex items-center justify-center border ${mobileIconBtnClass}`}
                  aria-label="Search site"
                >
                  <IconSearch size={18} aria-hidden />
                </button>
              )}
              <button
                type="button"
                className={`flex items-center justify-center border ${mobileIconBtnClass} ${
                  menuOpen ? 'nav-menu-back-btn' : 'w-11 h-11'
                }`}
                onClick={() => (menuOpen ? closeMenu() : openMenu())}
                aria-label={menuOpen ? 'Back to page' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <>
                    <IconChevronLeft size={18} aria-hidden />
                    <span>Back</span>
                  </>
                ) : (
                  <MenuSkullIcon light={isLightBar} />
                )}
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
            className="fixed inset-0 z-[100] bg-navy-deep/85 backdrop-blur-md flex items-start justify-center px-4 sm:px-6"
            style={{
              paddingTop: mobileMenuTop
                ? `${mobileMenuTop + 16}px`
                : 'max(5.5rem, calc(env(safe-area-inset-top) + 4rem))',
            }}
            onClick={() => setSearchOpen(false)}
            role="presentation"
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-xl bg-white shadow-card overflow-hidden border border-navy/10"
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
                  className="nav-icon-btn-light min-w-[44px] min-h-[44px] border-0"
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
            className="fixed left-0 right-0 bottom-0 z-[90] lg:hidden bg-navy-deep px-4 sm:px-6 pb-safe flex flex-col overflow-y-auto overscroll-contain"
            style={{
              top: mobileMenuTop ?? 'max(5.25rem, calc(env(safe-area-inset-top) + 4.5rem))',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            <nav className="flex flex-col gap-7 sm:gap-8 flex-1 pt-6" aria-label="Mobile">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <MobileNavGroup item={item} onNavigate={closeMenu} />
                </motion.div>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-8 mt-6 border-t border-white/15 sticky bottom-0 bg-navy-deep pb-[max(1rem,env(safe-area-inset-bottom))]">
              <a href={site.ticketsUrl} target="_blank" rel="noopener noreferrer" className="nav-tickets nav-tickets--hero w-full justify-center">
                Get tickets
              </a>
              <a href={site.donateUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost-light w-full justify-center">
                Donate
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
