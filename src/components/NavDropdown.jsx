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

export default function NavDropdown({ item, isLightBar, isOpen, onOpen, onClose }) {
  const ref = useRef(null);
  const closeTimer = useRef(null);
  const location = useLocation();
  const { pathname, hash } = location;

  const linkClass = isLightBar ? 'nav-link-light' : 'nav-link';
  const active = isNavItemActive(item, pathname, hash);
  const hasMenu = item.mega ? item.groups?.length : item.children?.length;

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    onOpen?.();
  };

  const scheduleClose = () => {
    clearCloseTimer();
    if (!item.mega) {
      closeTimer.current = setTimeout(() => onClose?.(), 150);
    }
  };

  useEffect(() => {
    onClose?.();
  }, [pathname, hash, onClose]);

  useEffect(() => {
    if (!item.mega) {
      const onPointerDown = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          onClose?.();
        }
      };
      document.addEventListener('pointerdown', onPointerDown);
      return () => document.removeEventListener('pointerdown', onPointerDown);
    }
    return undefined;
  }, [item.mega, onClose]);

  useEffect(() => () => clearCloseTimer(), []);

  if (!hasMenu && item.path) {
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
        className={`${linkClass} gap-1 ${active || isOpen ? 'nav-link-active' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => (isOpen ? onClose?.() : onOpen?.())}
      >
        {item.label}
        <IconChevronDown
          size={12}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {!item.mega && (
        <div
          className={`nav-dropdown-flyout ${isOpen ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'}`}
          aria-hidden={!isOpen}
        >
          <div
            className={`nav-dropdown-panel ${isLightBar ? 'nav-dropdown-panel-light' : 'nav-dropdown-panel-dark'}`}
            role="menu"
          >
            {item.path && (
              <Link
                to={item.path}
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
                className="nav-dropdown-item nav-dropdown-item-featured"
                onClick={onClose}
              >
                <span className="nav-dropdown-label">All {item.label}</span>
              </Link>
            )}
            {item.children?.map((child) => {
              const childActive = matchPath(pathname, hash, child.path);
              return (
                <Link
                  key={child.path}
                  to={child.path}
                  role="menuitem"
                  tabIndex={isOpen ? 0 : -1}
                  aria-current={childActive ? 'page' : undefined}
                  className={`nav-dropdown-item ${childActive ? 'nav-dropdown-item-active' : ''}`}
                  onClick={onClose}
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
      )}
    </div>
  );
}

export function MobileNavGroup({ item, onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const { pathname, hash } = location;
  const active = isNavItemActive(item, pathname, hash);
  const groups = item.mega ? item.groups : null;
  const children = item.children || [];

  if (!groups?.length && !children.length && item.path) {
    return (
      <Link
        to={item.path}
        aria-current={pathname === item.path ? 'page' : undefined}
        className={`font-display text-white text-2xl sm:text-3xl font-medium tracking-wide py-2 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm ${
          active ? 'text-gold' : ''
        }`}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    );
  }

  const allLinks = groups
    ? groups.flatMap((g) => g.links.map((l) => ({ ...l, group: g.title })))
    : children;

  return (
    <div>
      <button
        type="button"
        className={`w-full flex items-center justify-between font-display text-white text-xl sm:text-2xl md:text-3xl font-medium tracking-wide py-3 min-h-[48px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm ${
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
        <ul className="mt-3 mb-2 pl-4 border-l border-white/15 space-y-1">
          {item.path && (
            <li>
              <Link
                to={item.path}
                className="font-inter text-white/80 hover:text-gold text-sm flex items-center min-h-[44px] py-2"
                onClick={onNavigate}
              >
                All {item.label}
              </Link>
            </li>
          )}
          {allLinks.map((link) => (
            <li key={link.path + link.label}>
              {link.path?.startsWith('http') || link.path?.startsWith('tel:') ? (
                <a
                  href={link.path}
                  className="font-inter text-white/80 hover:text-gold text-sm flex items-center min-h-[44px] py-2"
                  onClick={onNavigate}
                  {...(link.path.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  to={link.path}
                  className="font-inter text-white/80 hover:text-gold text-sm flex items-center min-h-[44px] py-2"
                  onClick={onNavigate}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
