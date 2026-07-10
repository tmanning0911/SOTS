import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { syncChromeMetrics } from "./components/SiteChrome.jsx";

gsap.registerPlugin(ScrollTrigger);

let lenis;
let homeMotionCtx = null;
let innerMotionCtx = null;

export function initPolish() {
  initSmoothScroll();
}

function initSmoothScroll() {
  if (lenis) return;

  lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    anchors: true,
  });

  document.documentElement.classList.add("lenis");
  document.body.classList.add("lenis", "lenis-smooth");

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function revealOnScroll(el, { y = 32, duration = 0.8 } = {}) {
  gsap.from(el, {
    y,
    opacity: 0,
    duration,
    ease: "power3.out",
    immediateRender: false,
    scrollTrigger: {
      trigger: el,
      start: "top 92%",
      once: true,
      toggleActions: "play none none none",
    },
    onComplete: () => {
      gsap.set(el, { clearProps: "transform,opacity" });
    },
  });
}

/** Run after React mounts HomePage */
export function initHomePageMotion() {
  const root = document.querySelector(".home--orpheum");
  if (!root) return;

  resetHomePageMotion();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  homeMotionCtx = gsap.context(() => {
    const heroContent = document.querySelector("[data-hero-animate]");
    if (heroContent) {
      gsap.from(heroContent.children, {
        y: 28,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.2,
      });
    }

    if (window.matchMedia("(min-width: 768px)").matches) {
      const heroMedia = document.querySelector(".orpheum-hero__media video, .orpheum-hero__media img");
      if (heroMedia) {
        gsap.to(heroMedia, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: ".orpheum-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }

    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      revealOnScroll(el);
    });

    ScrollTrigger.refresh();
  }, root);
}

export function resetHomePageMotion() {
  homeMotionCtx?.revert();
  homeMotionCtx = null;
}

export function initInnerPageMotion() {
  resetInnerPageMotion();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  innerMotionCtx = gsap.context(() => {
    const heroInner = document.querySelector(
      ".orpheum-inner-page__hero-inner[data-reveal], .orpheum-production-page__hero-inner[data-reveal]"
    );

    if (heroInner) {
      gsap.from(heroInner.children, {
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.85,
        ease: "power3.out",
        delay: 0.15,
      });
    }

    gsap.utils.toArray("main [data-reveal]").forEach((el) => {
      if (heroInner && (el === heroInner || heroInner.contains(el))) return;

      revealOnScroll(el, { y: 28, duration: 0.75 });
    });

    ScrollTrigger.refresh();
  });
}

export function resetInnerPageMotion() {
  innerMotionCtx?.revert();
  innerMotionCtx = null;
}

export function refreshScroll() {
  ScrollTrigger.refresh();
  syncChromeMetrics();
}

export function pauseSmoothScroll() {
  lenis?.stop();
}

export function resumeSmoothScroll() {
  lenis?.start();
  refreshScroll();
}
