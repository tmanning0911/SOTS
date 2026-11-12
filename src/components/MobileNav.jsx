import { useEffect, useState } from "react";
import { MEDIA, NAV_ITEMS, SITE } from "../../js/data.js";
import { trapFocus } from "../../js/a11y.js";
import { useNav } from "../context/NavContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { TicketCheckoutLink } from "./ticketing/TicketCheckoutLink.jsx";

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconPlus({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      {!open ? <path d="M7 2v10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /> : null}
    </svg>
  );
}

/**
 * Collage Dance–style mobile MENU: accordion sections with +/- expanders.
 */
export function MobileNav() {
  const { menuOpen, closeMenu } = useNav();
  const { openSearch } = useUI();
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    if (!menuOpen) {
      setOpenSection(null);
      return undefined;
    }

    document.body.classList.add("nav-open");
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.classList.remove("nav-open");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const panel = document.querySelector(".mobile-nav.is-open");
    return panel ? trapFocus(panel) : undefined;
  }, [menuOpen, openSection]);

  const handleClose = () => {
    closeMenu();
    setOpenSection(null);
  };

  return (
    <div
      className={`mobile-nav orpheum-mobile-nav cdc-mobile-nav${menuOpen ? " is-open" : ""}`}
      aria-hidden={menuOpen ? "false" : "true"}
      role="dialog"
      aria-modal={menuOpen ? "true" : undefined}
      aria-label="Menu"
    >
      <header className="mobile-nav__top cdc-mobile-nav__top">
        <p className="mobile-nav__brand">
          <img src={MEDIA.logo} alt={SITE.name} width={120} height={34} decoding="async" />
        </p>
        <div className="mobile-nav__top-actions">
          <button
            type="button"
            className="mobile-nav__icon-btn"
            aria-label="Search site"
            onClick={() => {
              handleClose();
              openSearch();
            }}
          >
            <IconSearch />
          </button>
          <button type="button" className="mobile-nav__icon-btn" aria-label="Close menu" onClick={handleClose}>
            <IconClose />
          </button>
        </div>
      </header>

      <div className="mobile-nav__scroll cdc-mobile-nav__scroll">
        <p className="cdc-mobile-nav__label">Menu</p>

        <nav className="cdc-mobile-nav__accordion" aria-label="Sections">
          {NAV_ITEMS.map((item) => {
            const links = item.columns?.flatMap((col) => col.links || []) || [];
            const isOpen = openSection === item.label;
            return (
              <div key={item.label} className={`cdc-mobile-nav__section${isOpen ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="cdc-mobile-nav__section-trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpenSection(isOpen ? null : item.label)}
                >
                  <span>{item.label}</span>
                  <IconPlus open={isOpen} />
                </button>
                {isOpen ? (
                  <ul className="cdc-mobile-nav__links">
                    {links.map((link) => (
                      <li key={link.href + link.label}>
                        <TicketCheckoutLink
                          href={link.href}
                          className="cdc-mobile-nav__link"
                          external={link.external}
                          onClick={handleClose}
                        >
                          {link.label}
                        </TicketCheckoutLink>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </nav>

        <nav className="cdc-mobile-nav__utility" aria-label="Account">
          <a href={SITE.accountUrl} onClick={handleClose}>
            My Tickets
          </a>
          <a href="/about/contact/" onClick={handleClose}>
            Contact
          </a>
        </nav>
      </div>

      <footer className="mobile-nav__foot cdc-mobile-nav__foot">
        <a href="/tickets/" className="cdc-btn" onClick={handleClose}>
          Tickets
        </a>
        <a href="/support/donate/" className="cdc-btn cdc-btn--navy" onClick={handleClose}>
          Donate
        </a>
      </footer>
    </div>
  );
}
