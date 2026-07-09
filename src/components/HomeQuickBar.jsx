import { QUICK_BAR_LINKS } from "../../js/data.js";
import { useUI } from "../context/UIContext.jsx";

export function HomeQuickBar() {
  const { openAccessTickets } = useUI();

  return (
    <nav className="orpheum-quickbar orpheum-wave-edge-top" aria-label="Quick links">
      <ul>
        {QUICK_BAR_LINKS.map((link) => (
          <li key={link.label}>
            {link.action === "access-tickets" ? (
              <button type="button" onClick={openAccessTickets}>
                {link.label}
              </button>
            ) : (
              <a href={link.href}>{link.label}</a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
