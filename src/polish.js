import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { syncChromeMetrics } from "./components/SiteChrome.jsx";

gsap.registerPlugin(ScrollTrigger);

let homeMotionCtx = null;
let innerMotionCtx = null;
let nativeScrollBound = false;

export function initPolish() {
  if (!nativeScrollBound) {
    window.addEventListener("scroll", ScrollTrigger.update, { passive: true });
    nativeScrollBound = true;
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function revealOnScroll(el, { y = 36, duration = 0.85, delay = 0 } = {}) {
  gsap.from(el, {
    y,
    opacity: 0,
    duration,
    delay,
    ease: "power3.out",
    immediateRender: false,
    scrollTrigger: {
      trigger: el,
      start: "top 88%",
      once: true,
      toggleActions: "play none none none",
    },
    onComplete: () => {
      gsap.set(el, { clearProps: "transform,opacity" });
    },
  });
}

function staggerReveal(els, { y = 28, duration = 0.75, stagger = 0.08, trigger } = {}) {
  if (!els?.length) return;
  gsap.from(els, {
    y,
    opacity: 0,
    duration,
    stagger,
    ease: "power3.out",
    immediateRender: false,
    scrollTrigger: {
      trigger: trigger || els[0],
      start: "top 86%",
      once: true,
    },
    onComplete: () => {
      gsap.set(els, { clearProps: "transform,opacity" });
    },
  });
}

/** Run after React mounts HomePage (Collage shell: `.home--collage`) */
export function initHomePageMotion() {
  const root = document.querySelector(".home--collage") || document.querySelector(".home--orpheum");
  if (!root) return;

  resetHomePageMotion();

  if (prefersReducedMotion()) {
    root.classList.add("is-motion-ready");
    return;
  }

  homeMotionCtx = gsap.context(() => {
    root.classList.add("is-motion-ready");

    /* ——— Hero: brand + tagline rise; subtle image scale ——— */
    const heroContent = root.querySelector("[data-hero-animate]");
    if (heroContent) {
      gsap.from(heroContent.children, {
        y: 40,
        opacity: 0,
        stagger: 0.14,
        duration: 1.05,
        ease: "power3.out",
        delay: 0.15,
      });
    }

    const heroMedia = root.querySelector(".cdc-hero__media img, .orpheum-hero__media img, .orpheum-hero__media video");
    if (heroMedia) {
      gsap.fromTo(
        heroMedia,
        { scale: 1.08 },
        { scale: 1, duration: 1.6, ease: "power2.out" },
      );

      if (window.matchMedia("(min-width: 768px)").matches) {
        gsap.to(heroMedia, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: ".cdc-hero, .orpheum-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }

    /* ——— Season: feature copy + sidebar cards ——— */
    const seasonFeature = root.querySelector(".cdc-season__feature-copy");
    if (seasonFeature) {
      revealOnScroll(seasonFeature, { y: 40, duration: 0.95 });
    }

    const seasonCards = root.querySelectorAll(".cdc-show-card");
    if (seasonCards.length) {
      staggerReveal([...seasonCards], {
        y: 32,
        stagger: 0.12,
        trigger: root.querySelector(".cdc-season__sidebar"),
      });
    }

    const seasonAll = root.querySelector(".cdc-season__all");
    if (seasonAll) {
      gsap.from(seasonAll, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: seasonAll,
          start: "top 95%",
          once: true,
        },
      });
    }

    /* ——— Education banner + program tiles ——— */
    const everyone = root.querySelector(".cdc-everyone");
    if (everyone) revealOnScroll(everyone, { y: 28, duration: 0.8 });

    const programs = root.querySelectorAll(".cdc-program");
    if (programs.length) {
      staggerReveal([...programs], {
        y: 36,
        stagger: 0.06,
        duration: 0.7,
        trigger: root.querySelector(".cdc-programs"),
      });
    }

    /* ——— Story tiles ——— */
    const storyCards = root.querySelectorAll(".cdc-story__card");
    if (storyCards.length) {
      staggerReveal([...storyCards], {
        y: 40,
        stagger: 0.14,
        duration: 0.9,
        trigger: root.querySelector(".cdc-story"),
      });
    }

    /* ——— Newsletter + sponsors ——— */
    const newsletter = root.querySelector(".cdc-newsletter__inner");
    if (newsletter) revealOnScroll(newsletter, { y: 30, duration: 0.8 });

    const sponsors = root.querySelector(".cdc-sponsors__grid");
    if (sponsors) {
      staggerReveal([...sponsors.children], {
        y: 18,
        stagger: 0.05,
        duration: 0.55,
        trigger: root.querySelector(".cdc-sponsors"),
      });
    }

    /* Generic data-reveal hooks */
    gsap.utils.toArray(root.querySelectorAll("[data-reveal]")).forEach((el) => {
      revealOnScroll(el);
    });

    ScrollTrigger.refresh();
  }, root);
}

export function resetHomePageMotion() {
  homeMotionCtx?.revert();
  homeMotionCtx = null;
  document.querySelector(".home--collage")?.classList.remove("is-motion-ready");
  document.querySelector(".home--orpheum")?.classList.remove("is-motion-ready");
}

export function initInnerPageMotion() {
  resetInnerPageMotion();

  if (prefersReducedMotion()) return;

  innerMotionCtx = gsap.context(() => {
    const heroInner = document.querySelector(
      ".orpheum-inner-page__hero-inner[data-reveal], .orpheum-production-page__hero-inner[data-reveal]",
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

export function subscribeScroll(callback) {
  const handler = () => callback(window.scrollY);
  window.addEventListener("scroll", handler, { passive: true });
  return () => window.removeEventListener("scroll", handler);
}

export function pauseSmoothScroll() {}

export function resumeSmoothScroll() {
  refreshScroll();
}

export function enableCheckoutScrollMode() {
  document.documentElement.classList.add("sots-checkout-scroll");
  document.body.classList.add("sots-checkout-active");
}

export function disableCheckoutScrollMode() {
  document.documentElement.classList.remove("sots-checkout-scroll");
  document.body.classList.remove("sots-checkout-active");
  refreshScroll();
}

/** @deprecated Use enableCheckoutScrollMode */
export function disableSmoothScrollForCheckout() {
  enableCheckoutScrollMode();
}

/** @deprecated Use disableCheckoutScrollMode */
export function restoreSmoothScrollAfterCheckout() {
  disableCheckoutScrollMode();
}
