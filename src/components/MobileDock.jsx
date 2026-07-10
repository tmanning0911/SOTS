import { useNav } from "../context/NavContext.jsx";

function DockIconTickets() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4v3M17 4v3M5 8h14v12H5V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

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
      <a className="mobile-dock__item" href="/shop/">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="20" r="1.5" fill="currentColor" />
          <circle cx="18" cy="20" r="1.5" fill="currentColor" />
        </svg>
        Shop
      </a>
      <a className="mobile-dock__item mobile-dock__item--primary" href="/tickets/">
        <DockIconTickets />
        Tickets
      </a>
      <a className="mobile-dock__item" href="/my-tickets/">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 12l2 2 4-4M7 20h10a2 2 0 0 0 2-2V8l-5-4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        My Tickets
      </a>
    </nav>
  );
}
