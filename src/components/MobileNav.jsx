import { useEffect, useState } from "react";
import { MEDIA, NAV_ITEMS, SITE } from "../../js/data.js";
import { trapFocus } from "../../js/a11y.js";
import { useNav } from "../context/NavContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { ArrowButton } from "./ArrowButton.jsx";
import { TicketCheckoutLink } from "./ticketing/TicketCheckoutLink.jsx";

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconBack() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M11.5 3.5L6 9l5.5 5.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
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

function IconChevron() {
  return (
    <svg className="mobile-nav__row-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4 1.5L8.5 6L4 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function featuredSeason() {
  return NAV_ITEMS.find((item) => item.featured)?.featured ?? null;
}

export function MobileNav() {
  const { menuOpen, closeMenu } = useNav();
  const { openSearch } = useUI();
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    if (!menuOpen) {
      setActiveItem(null);
      return undefined;
    }

    document.body.classList.add("nav-open");
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") {
        if (activeItem) setActiveItem(null);
        else closeMenu();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.classList.remove("nav-open");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, closeMenu, activeItem]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const panel = document.querySelector(".mobile-nav.is-open");
    return panel ? trapFocus(panel) : undefined;
  }, [menuOpen, activeItem]);

  const handleClose = () => {
    closeMenu();
    setActiveItem(null);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const scroller = document.querySelector(".orpheum-mobile-nav.is-open .mobile-nav__scroll");
    if (scroller) scroller.scrollTop = 0;
  }, [menuOpen, activeItem]);

  const season = featuredSeason();
  const detail = activeItem ? NAV_ITEMS.find((item) => item.label === activeItem) : null;

  return (
    <div
      className={`mobile-nav orpheum-mobile-nav${menuOpen ? " is-open" : ""}${detail ? " is-detail" : ""}`}
      aria-hidden={menuOpen ? "false" : "true"}
      role="dialog"
      aria-modal={menuOpen ? "true" : undefined}
      aria-label={detail ? detail.label : "Site menu"}
    >
      <header className="mobile-nav__top">
        {detail ? (
          <button type="button" className="mobile-nav__back" onClick={() => setActiveItem(null)}>
            <IconBack />
            <span>All sections</span>
          </button>
        ) : (
          <p className="mobile-nav__brand">
            <img src={MEDIA.logo} alt={SITE.name} width={120} height={34} decoding="async" />
          </p>
        )}
        <div className="mobile-nav__top-actions">
          {!detail ? (
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
          ) : null}
          <button type="button" className="mobile-nav__icon-btn" aria-label="Close menu" onClick={handleClose}>
            <IconClose />
          </button>
        </div>
      </header>

      <div className="mobile-nav__scroll" key={detail ? detail.label : "root"}>
        {!detail ? (
          <>
            {season ? (
              <a className="mobile-nav__feature" href={season.href} onClick={handleClose}>
                <img src={season.image} alt="" width={96} height={128} loading="lazy" />
                <span className="mobile-nav__feature-copy">
                  <span className="mobile-nav__feature-eyebrow">Now playing</span>
                  <strong>{season.title}</strong>
                  <span className="mobile-nav__feature-meta">{season.dates}</span>
                  <span className="mobile-nav__feature-cta">View production</span>
                </span>
                <IconChevron />
              </a>
            ) : null}

            <nav className="mobile-nav__primary" aria-label="Sections">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="mobile-nav__row"
                  onClick={() => setActiveItem(item.label)}
                >
                  <span>{item.label}</span>
                  <IconChevron />
                </button>
              ))}
            </nav>

            <nav className="mobile-nav__quick" aria-label="Shortcuts">
              {[
                { href: "/my-tickets/", label: "My Tickets" },
                { href: "/shop/", label: "Shop" },
                { href: "/news/", label: "News" },
                { href: "/about/mission-history/", label: "About" },
                { href: "/about/contact/", label: "Contact" },
              ].map((link, index) => (
                <span key={link.href} className="mobile-nav__quick-item">
                  {index > 0 ? <span className="mobile-nav__quick-dot" aria-hidden="true" /> : null}
                  <a href={link.href} onClick={handleClose}>
                    {link.label}
                  </a>
                </span>
              ))}
            </nav>
          </>
        ) : (
          <div className="mobile-nav__detail">
            <h2 className="mobile-nav__detail-title">{detail.label}</h2>

            {detail.featured ? (
              <a className="mobile-nav__feature mobile-nav__feature--compact" href={detail.featured.href} onClick={handleClose}>
                <img src={detail.featured.image} alt="" width={72} height={96} loading="lazy" />
                <span className="mobile-nav__feature-copy">
                  <span className="mobile-nav__feature-eyebrow">{detail.featured.meta}</span>
                  <strong>{detail.featured.title}</strong>
                  <span className="mobile-nav__feature-meta">{detail.featured.dates}</span>
                  <span className="mobile-nav__feature-cta">Learn more</span>
                </span>
                <IconChevron />
              </a>
            ) : null}

            {detail.columns?.map((col) => (
              <section key={col.title} className="mobile-nav__group">
                <h3 className="mobile-nav__group-title">{col.title}</h3>
                <ul className="mobile-nav__links">
                  {col.links?.map((link) => (
                    <li key={link.href + link.label}>
                      <TicketCheckoutLink
                        href={link.href}
                        className="sots-ticket-checkout-link"
                        external={link.external}
                        onClick={handleClose}
                      >
                        {link.label}
                      </TicketCheckoutLink>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {detail.venues?.map((venue) => (
              <section key={venue.name} className="mobile-nav__group">
                <h3 className="mobile-nav__group-title">Our venues</h3>
                <a className="mobile-nav__venue" href={venue.href} onClick={handleClose}>
                  <strong>{venue.name}</strong>
                  <span>{venue.address}</span>
                </a>
              </section>
            ))}
          </div>
        )}
      </div>

      <footer className="mobile-nav__foot">
        <ArrowButton href="/support/donate/" className="mobile-nav__foot-btn" onClick={handleClose}>
          Give now
        </ArrowButton>
        <ArrowButton href="/events/" className="mobile-nav__foot-btn" onClick={handleClose}>
          Past events
        </ArrowButton>
      </footer>
    </div>
  );
}
