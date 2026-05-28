import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconChevronDown } from '@/components/icons';
import { isNavItemActive } from '@/content/nav';

function matchPath(pathname, hash, targetPath) {
  const [target, targetHash = ''] = targetPath.split('#');
  if (pathname !== target) return false;
  if (!targetHash) return true;
  return hash === `#${targetHash}`;
}

export default function NavDropdown({ item, isLightBar }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const closeTimer = useRef(null);
  const location = useLocation();
  const { pathname, hash } = location;

  const linkClass = isLightBar ? 'nav-link-light' : 'nav-link';
  const active = isNavItemActive(item, pathname, hash);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      clearCloseTimer();
    };
  }, []);

  if (!item.children?.length) {
    return (
      <Link
        to={item.path}
        aria-current={pathname === item.path ? 'page' : undefined}
        className={`${linkClass} ${pathname === item.path ? 'nav-link-active' : ''}`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocus={openMenu}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget)) scheduleClose();
      }}
    >
      <button
        type="button"
        className={`${linkClass} inline-flex items-center gap-1.5 py-2 ${active ? 'nav-link-active' : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <IconChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {/* pt-2 bridge keeps hover alive while moving from button to menu */}
      <div
        className={`nav-dropdown-flyout ${open ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div
          className={`nav-dropdown-panel ${isLightBar ? 'nav-dropdown-panel-light' : 'nav-dropdown-panel-dark'}`}
          role="menu"
        >
          {item.path && (
            <Link
              to={item.path}
              role="menuitem"
              tabIndex={open ? 0 : -1}
              className="nav-dropdown-item nav-dropdown-item-featured"
              onClick={() => setOpen(false)}
            >
              <span className="nav-dropdown-label">All {item.label}</span>
            </Link>
          )}
          {item.children.map((child) => {
            const childActive = matchPath(pathname, hash, child.path);
            return (
              <Link
                key={child.path}
                to={child.path}
                role="menuitem"
                tabIndex={open ? 0 : -1}
                aria-current={childActive ? 'page' : undefined}
                className={`nav-dropdown-item ${childActive ? 'nav-dropdown-item-active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span className="nav-dropdown-label">{child.label}</span>
                {child.description && (
                  <span className="nav-dropdown-desc">{child.description}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MobileNavGroup({ item, onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const { pathname, hash } = location;
  const active = isNavItemActive(item, pathname, hash);

  if (!item.children?.length) {
    return (
      <Link
        to={item.path}
        aria-current={pathname === item.path ? 'page' : undefined}
        className={`font-display text-white text-2xl sm:text-3xl font-medium tracking-wide py-1 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm ${
          active ? 'text-gold' : ''
        }`}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        className={`w-full flex items-center justify-between font-display text-white text-2xl sm:text-3xl font-medium tracking-wide py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm ${
          active ? 'text-gold' : ''
        }`}
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        {item.label}
        <IconChevronDown
          size={20}
          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {expanded && (
        <ul className="mt-3 mb-2 pl-4 border-l border-white/15 space-y-3">
          {item.path && (
            <li>
              <Link
                to={item.path}
                className="font-inter text-white/80 hover:text-gold text-sm block py-0.5"
                onClick={onNavigate}
              >
                All {item.label}
              </Link>
            </li>
          )}
          {item.children.map((child) => (
            <li key={child.path}>
              <Link
                to={child.path}
                className="font-inter text-white/80 hover:text-gold text-sm block py-0.5"
                onClick={onNavigate}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
