import { useEffect } from "react";
import { syncChromeMetrics } from "../components/SiteChrome.jsx";

/**
 * Hide a fixed bottom chrome element once the site footer is in view,
 * so Parking / Tickets / My Tickets no longer cover the footer.
 */
export function useHideChromeAtFooter(ref) {
  useEffect(() => {
    const bar = ref?.current;
    const footer = document.querySelector(".orpheum-footer");
    if (!bar || !footer) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const hide = Boolean(entry?.isIntersecting);
        bar.classList.toggle("is-hidden-at-footer", hide);
        bar.setAttribute("aria-hidden", hide ? "true" : "false");
        if (hide) bar.setAttribute("inert", "");
        else bar.removeAttribute("inert");
        syncChromeMetrics();
      },
      {
        root: null,
        threshold: 0,
        // Hide as soon as the footer top approaches the bottom chrome.
        rootMargin: "0px 0px -12% 0px",
      },
    );

    observer.observe(footer);
    return () => {
      observer.disconnect();
      bar.classList.remove("is-hidden-at-footer");
      bar.removeAttribute("aria-hidden");
      bar.removeAttribute("inert");
      syncChromeMetrics();
    };
  }, [ref]);
}
