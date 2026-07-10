import { QUICK_BAR_LINKS } from "../../js/data.js";

export function HomeQuickBar() {
  return (
    <nav className="orpheum-quickbar orpheum-wave-edge-top" aria-label="Quick links">
      <ul>
        {QUICK_BAR_LINKS.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
