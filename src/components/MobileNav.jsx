import { useEffect, useState } from "react";
import { MEDIA, NAV_ITEMS, SITE } from "../../js/data.js";
import { trapFocus } from "../../js/a11y.js";
import { useNav } from "../context/NavContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { ArrowButton } from "./ArrowButton.jsx";
import { TicketCheckoutLink } from "./ticketing/TicketCheckoutLink.jsx";

function flattenNavLinks(item) {
  const links = [];
  item.columns?.forEach((col) => links.push(...col.links));
  return links;
}

export function MobileNav() {
  const { menuOpen, closeMenu } = useNav();
  const { openSearch } = useUI();
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

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
  }, [menuOpen]);

  const handleClose = () => {
    closeMenu();
    setExpanded(null);
  };

  return (
    <div className={`mobile-nav orpheum-mobile-nav${menuOpen ? " is-open" : ""}`} aria-hidden={menuOpen ? "false" : "true"}>
      <div className="mobile-nav__header">
        <a href="/" onClick={handleClose}>
          <img src={MEDIA.logo} alt={SITE.name} width={140} />
        </a>
        <button className="mobile-nav__close" type="button" aria-label="Close menu" onClick={handleClose}>
          &times;
        </button>
      </div>

      <div className="mobile-nav__ctas">
        <ArrowButton
          type="button"
          variant="ghost"
          flat
          className="mobile-nav__search"
          onClick={() => {
            closeMenu();
            openSearch();
          }}
        >
          Search site
        </ArrowButton>
        <ArrowButton href="/tickets/" onClick={handleClose}>
          Tickets
        </ArrowButton>
        <ArrowButton href="/my-tickets/" variant="ghost" onClick={handleClose}>
          My Tickets
        </ArrowButton>
        <ArrowButton href="/support/donate/" onClick={handleClose}>
          Donate
        </ArrowButton>
      </div>

      {NAV_ITEMS.map((item) => (
        <div key={item.label} className={`mobile-nav__section ${expanded === item.label ? "is-open" : ""}`}>
          <button
            className="mobile-nav__toggle"
            type="button"
            aria-expanded={expanded === item.label}
            onClick={() => setExpanded(expanded === item.label ? null : item.label)}
          >
            {item.label}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1.5 4L6 8L10.5 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <div className="mobile-nav__sub">
            {flattenNavLinks(item).map((link) => (
              <TicketCheckoutLink
                key={link.href + link.label}
                href={link.href}
                className="sots-ticket-checkout-link"
                external={link.external}
                onClick={handleClose}
              >
                {link.label}
              </TicketCheckoutLink>
            ))}
            {item.featured ? (
              <a href={item.featured.href} onClick={handleClose}>
                {item.featured.title}
              </a>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
