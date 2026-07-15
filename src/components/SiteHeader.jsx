import { useEffect, useState } from "react";
import { SITE, MEDIA, NAV_ITEMS } from "../../js/data.js";
import { useNav } from "../context/NavContext.jsx";
import { OrpheumNav, OrpheumNavPanel } from "./OrpheumNav.jsx";
import { ArrowButton } from "./ArrowButton.jsx";
import { SearchTrigger } from "./SiteSearch.jsx";
import { TicketCheckoutButton } from "./ticketing/TicketCheckoutButton.jsx";

function IconMenu() {
  return (
    <svg className="orpheum-header__menu-icon" width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
      <path d="M2 2.5h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 9h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 15.5h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader() {
  const { openMenu } = useNav();
  const [openNav, setOpenNav] = useState(null);
  const openItem = NAV_ITEMS.find((item) => item.label === openNav) ?? null;

  useEffect(() => {
    function onDocClick(e) {
      const header = document.querySelector(".site-header.orpheum-header");
      if (header && !header.contains(e.target)) setOpenNav(null);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpenNav(null);
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const header = document.querySelector(".site-header.orpheum-header");
    header?.classList.toggle("is-nav-open", openNav !== null);
  }, [openNav]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1099px)");
    function onViewportChange() {
      if (mq.matches) setOpenNav(null);
    }

    onViewportChange();
    mq.addEventListener("change", onViewportChange);
    return () => mq.removeEventListener("change", onViewportChange);
  }, []);

  function toggleNav(label) {
    setOpenNav((current) => (current === label ? null : label));
  }

  return (
    <>
      <div className="orpheum-header__inner">
        <a href="/" className="orpheum-header__logo" aria-label={`${SITE.name} Home`}>
          <img
            src={MEDIA.logo}
            alt={SITE.name}
            width={188}
            height={58}
            fetchPriority="high"
            decoding="async"
          />
        </a>

        <OrpheumNav open={openNav} onToggle={toggleNav} />

        <div className="orpheum-header__actions">
          <SearchTrigger className="orpheum-header__search" label="Search site" />
          <TicketCheckoutButton label="Tickets" className="orpheum-arrow-btn--header" />
          <ArrowButton href="/support/donate/" className="orpheum-arrow-btn--header">
            Donate
          </ArrowButton>
          <button
            type="button"
            className="orpheum-header__menu"
            aria-label="Open menu"
            onClick={openMenu}
          >
            <IconMenu />
          </button>
        </div>
      </div>

      <OrpheumNavPanel item={openItem} isOpen={openNav !== null} />
    </>
  );
}
