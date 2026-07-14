import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { subscribeScroll } from "../polish.js";
import { SiteHeader } from "./SiteHeader.jsx";
import { UtilityBar } from "./UtilityBar.jsx";

const CHROME_MOUNT_ID = "site-chrome";

function visibleChromeHeight(el) {
  if (!el) return 0;
  const style = getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return 0;
  return el.offsetHeight;
}

export function syncChromeMetrics() {
  const chrome = document.querySelector("[data-site-chrome]");
  const utility = document.querySelector(".orpheum-utility");

  const utilityVisible =
    utility && utility.offsetHeight > 0 && getComputedStyle(utility).display !== "none";
  document.documentElement.style.setProperty(
    "--utility-height",
    utilityVisible ? `${utility.offsetHeight}px` : "0px",
  );

  if (chrome) {
    document.documentElement.style.setProperty("--chrome-top", `${chrome.offsetHeight}px`);
    document.documentElement.style.setProperty(
      "--header-height",
      `${chrome.querySelector(".orpheum-header")?.offsetHeight ?? 64}px`,
    );
  }

  const quickbar = document.querySelector(".orpheum-quickbar");
  const dock = document.querySelector(".mobile-dock");
  const bottomChrome = visibleChromeHeight(quickbar) || visibleChromeHeight(dock);
  // Set on both html and body so body-scoped CSS cannot shadow the measured value.
  document.documentElement.style.setProperty("--bottom-chrome-height", `${bottomChrome}px`);
  document.body.style.setProperty("--bottom-chrome-height", `${bottomChrome}px`);
}

function getChromeMount() {
  return document.getElementById(CHROME_MOUNT_ID) || document.body;
}

export function SiteChrome({ isHome }) {
  const [mount, setMount] = useState(null);

  useEffect(() => {
    const el = getChromeMount();
    el.classList.add("orpheum-site-chrome");
    el.dataset.siteChrome = "";
    setMount(el);
  }, []);

  useEffect(() => {
    if (!mount) return undefined;

    syncChromeMetrics();

    const chrome = document.querySelector("[data-site-chrome]");
    const header = document.querySelector(".site-header.orpheum-header");

    function onScroll() {
      const scrolled = window.scrollY > 24;
      header?.classList.toggle("is-scrolled", scrolled);
      chrome?.classList.toggle("is-scrolled", scrolled);
    }

    const unsubscribe = subscribeScroll(onScroll);
    const onResize = () => syncChromeMetrics();
    onScroll();
    window.addEventListener("resize", onResize);

    const observer = new ResizeObserver(syncChromeMetrics);
    const utility = document.querySelector(".orpheum-utility");
    const headerEl = document.querySelector(".site-header.orpheum-header");
    const quickbar = document.querySelector(".orpheum-quickbar");
    const dock = document.querySelector(".mobile-dock");
    if (chrome) observer.observe(chrome);
    if (utility) observer.observe(utility);
    if (headerEl) observer.observe(headerEl);
    if (quickbar) observer.observe(quickbar);
    if (dock) observer.observe(dock);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [isHome, mount]);

  if (!mount) return null;

  return createPortal(
    <>
      <UtilityBar />
      <header className={`site-header orpheum-header${isHome ? " orpheum-header--overlay" : ""}`}>
        <SiteHeader />
      </header>
    </>,
    mount,
  );
}
