import { SITE } from "../../js/data.js";
import { useNav } from "../context/NavContext.jsx";

export function MobileDock() {
  const { openMenu } = useNav();

  return (
    <nav id="mobile-dock" className="mobile-dock" aria-label="Quick actions">
      <button className="mobile-dock__item" type="button" aria-label="Open menu" onClick={openMenu}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
        Menu
      </button>
      <a className="mobile-dock__item" href="/productions/much-ado-about-nothing/">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 19h16M6 16l3-9 3 5 3-7 3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        What&apos;s On
      </a>
      <a className="mobile-dock__item mobile-dock__item--primary" href={SITE.ticketsUrl} target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 4v3M17 4v3M5 8h14v12H5V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Tickets
      </a>
      <a className="mobile-dock__item" href="/support/donate/">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        Donate
      </a>
    </nav>
  );
}
