import { useEffect, useId, useRef, useState } from "react";
import { NAV_ITEMS } from "../../js/data.js";
import { TicketCheckoutLink } from "./ticketing/TicketCheckoutLink.jsx";

/**
 * Collage Dance–style primary nav: hover/focus flyouts with keyboard support.
 * Triggers remain real links (Enter activates navigation). Escape closes panels.
 */
function NavFeatured({ featured }) {
  if (!featured) return null;
  return (
    <a className="cdc-nav__feature" href={featured.href}>
      <img src={featured.image} alt="" width={220} height={140} loading="lazy" />
      <span className="cdc-nav__feature-body">
        <span className="cdc-nav__feature-meta">{featured.meta}</span>
        <strong className="cdc-nav__feature-title">{featured.title}</strong>
        <span className="cdc-nav__feature-dates">{featured.dates}</span>
        <span className="cdc-nav__feature-cta">Learn More</span>
      </span>
    </a>
  );
}

export function CollageNav() {
  const [open, setOpen] = useState(null);
  const navRef = useRef(null);
  const closeTimer = useRef(null);
  const baseId = useId();

  function clearClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function scheduleClose() {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  }

  function openItem(label) {
    clearClose();
    setOpen(label);
  }

  function isDesktop() {
    return window.matchMedia("(min-width: 1100px)").matches;
  }

  useEffect(() => {
    function onDoc(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(null);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(null);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      clearClose();
    };
  }, []);

  return (
    <nav className={`cdc-nav${open ? " is-open" : ""}`} aria-label="Primary navigation" ref={navRef}>
      <ul className="cdc-nav__list">
        {NAV_ITEMS.map((item, index) => {
          const isOpen = open === item.label;
          const links = item.columns?.flatMap((col) => col.links || []) || [];
          const hasPanel = links.length > 0 || Boolean(item.featured) || Boolean(item.venues?.length);
          const primaryHref = item.href || links[0]?.href || "/";
          const panelId = `${baseId}-panel-${index}`;

          return (
            <li
              key={item.label}
              className={`cdc-nav__item${isOpen ? " is-open" : ""}${item.featured ? " cdc-nav__item--rich" : ""}`}
              onMouseEnter={() => {
                if (isDesktop() && hasPanel) openItem(item.label);
              }}
              onMouseLeave={() => {
                if (isDesktop()) scheduleClose();
              }}
            >
              <a
                className="cdc-nav__trigger"
                href={primaryHref}
                aria-expanded={hasPanel ? isOpen : undefined}
                aria-haspopup={hasPanel ? "true" : undefined}
                aria-controls={hasPanel ? panelId : undefined}
                onFocus={() => {
                  if (hasPanel) openItem(item.label);
                }}
                onKeyDown={(e) => {
                  if (!hasPanel || !isDesktop()) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    openItem(item.label);
                    requestAnimationFrame(() => {
                      navRef.current
                        ?.querySelector(`#${CSS.escape(panelId)} a, #${CSS.escape(panelId)} .cdc-nav__flyout-link`)
                        ?.focus();
                    });
                  }
                  if (e.key === "Escape") {
                    setOpen(null);
                  }
                }}
              >
                {item.label}
              </a>

              {hasPanel ? (
                <div
                  id={panelId}
                  className={`cdc-nav__flyout${isOpen ? " is-open" : ""}${item.featured || item.venues?.length ? " cdc-nav__flyout--rich" : ""}`}
                  role="region"
                  aria-label={`${item.label} submenu`}
                  hidden={!isOpen}
                >
                  <div className="cdc-nav__flyout-grid">
                    <ul className={`cdc-nav__flyout-list${links.length >= 6 ? " cdc-nav__flyout-list--split" : ""}`}>
                      {links.map((link) => (
                        <li key={link.href + link.label}>
                          <TicketCheckoutLink
                            href={link.href}
                            className="cdc-nav__flyout-link"
                            external={link.external}
                            onClick={() => setOpen(null)}
                          >
                            {link.label}
                          </TicketCheckoutLink>
                        </li>
                      ))}
                    </ul>

                    {item.venues?.length ? (
                      <div className="cdc-nav__venues">
                        <p className="cdc-nav__venues-label">Venue</p>
                        {item.venues.map((venue) => (
                          <a key={venue.name} className="cdc-nav__venue" href={venue.href} onClick={() => setOpen(null)}>
                            <strong>{venue.name}</strong>
                            <span>{venue.address}</span>
                          </a>
                        ))}
                      </div>
                    ) : null}

                    {item.featured ? <NavFeatured featured={item.featured} /> : null}
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
