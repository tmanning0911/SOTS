import { useEffect } from "react";
import { SiteHeader } from "./SiteHeader.jsx";
import { UtilityBar } from "./UtilityBar.jsx";

export function syncChromeMetrics() {
  const chrome = document.querySelector("[data-site-chrome]");
  const utility = document.querySelector(".orpheum-utility");

  const utilityVisible =
    utility && utility.offsetHeight > 0 && getComputedStyle(utility).display !== "none";
  document.documentElement.style.setProperty(
    "--utility-height",
    utilityVisible ? `${utility.offsetHeight}px` : "0px"
  );

  if (chrome) {
    document.documentElement.style.setProperty("--chrome-top", `${chrome.offsetHeight}px`);
  }
}

export function SiteChrome({ isHome }) {
  useEffect(() => {
    syncChromeMetrics();

    const header = document.querySelector(".site-header.orpheum-header");
    function onScroll() {
      header?.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    const onResize = () => syncChromeMetrics();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const observer = new ResizeObserver(syncChromeMetrics);
    const chrome = document.querySelector("[data-site-chrome]");
    const utility = document.querySelector(".orpheum-utility");
    const headerEl = document.querySelector(".site-header.orpheum-header");
    if (chrome) observer.observe(chrome);
    if (utility) observer.observe(utility);
    if (headerEl) observer.observe(headerEl);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [isHome]);

  return (
    <div className="orpheum-site-chrome" data-site-chrome>
      <UtilityBar />
      <header
        className={`site-header orpheum-header${isHome ? " orpheum-header--overlay" : ""}`}
      >
        <SiteHeader />
      </header>
    </div>
  );
}
