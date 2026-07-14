import { useRef } from "react";
import { QUICK_BAR_LINKS } from "../../js/data.js";
import { useHideChromeAtFooter } from "../hooks/useHideChromeAtFooter.js";

export function HomeQuickBar() {
  const ref = useRef(null);
  useHideChromeAtFooter(ref);

  return (
    <nav ref={ref} className="orpheum-quickbar orpheum-wave-edge-top" aria-label="Quick links">
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
