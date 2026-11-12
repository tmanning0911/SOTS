import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "../../js/data.js";
import { TicketCheckoutLink } from "./ticketing/TicketCheckoutLink.jsx";

/**
 * Collage Dance–style primary nav: all-caps triggers with hover flyout link lists.
 * Click still works for keyboard/touch; hover opens on desktop like collagedance.org.
 */
export function CollageNav() {
  const [open, setOpen] = useState(null);
  const navRef = useRef(null);
  const closeTimer = useRef(null);

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
        {NAV_ITEMS.map((item) => {
          const isOpen = open === item.label;
          const links = item.columns?.flatMap((col) => col.links || []) || [];
          const primaryHref = item.href || links[0]?.href || "/";

          return (
            <li
              key={item.label}
              className={`cdc-nav__item${isOpen ? " is-open" : ""}`}
              onMouseEnter={() => {
                if (window.matchMedia("(min-width: 1100px)").matches) openItem(item.label);
              }}
              onMouseLeave={() => {
                if (window.matchMedia("(min-width: 1100px)").matches) scheduleClose();
              }}
            >
              <a
                className="cdc-nav__trigger"
                href={primaryHref}
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={(e) => {
                  if (!window.matchMedia("(min-width: 1100px)").matches) return;
                  if (links.length) {
                    e.preventDefault();
                    setOpen(isOpen ? null : item.label);
                  }
                }}
                onFocus={() => openItem(item.label)}
              >
                {item.label}
              </a>

              {links.length ? (
                <div className={`cdc-nav__flyout${isOpen ? " is-open" : ""}`} role="region" aria-label={item.label}>
                  <ul className="cdc-nav__flyout-list">
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
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
