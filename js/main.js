import {
  SITE,
  MEDIA,
  PRODUCTIONS,
  SPONSORS,
  FOOTER_COLUMNS,
  SOCIAL_LINKS,
} from "./data.js";
import { mountTemplate } from "./templates.js";
import { initAccessibleForm } from "./forms.js";
import { initA11y, initFaqA11y } from "./a11y.js";
import { renderHomepage, initFaqAccordion } from "./render-home.js";

function renderFooter() {
  const root = document.getElementById("site-footer");
  if (!root) return;

  root.innerHTML = `
    <div class="container--wide">
      <div class="footer-grid">
        <div>
          <div class="footer-logo"><img src="${MEDIA.logo}" alt="${SITE.name}" width="180" /></div>
          <p class="footer-tagline">${SITE.tagline}</p>
          <div class="footer-social">
            ${SOCIAL_LINKS.map((s) => `<a href="${s.href}" aria-label="${s.label}" target="_blank" rel="noopener">${s.icon}</a>`).join("")}
          </div>
        </div>
        <div class="footer-columns">
          ${FOOTER_COLUMNS.map(
            (col) => `<div class="footer-col">
            <h2>${col.title}</h2>
            <ul>${col.links.map((l) => `<li><a href="${l.href}"${l.href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${l.label}</a></li>`).join("")}</ul>
          </div>`
          ).join("")}
          <div class="footer-col">
            <h2>Contact</h2>
            <p>${SITE.address}</p>
            <p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
            <p>Main phone: ${SITE.boxOffice}</p>
          </div>
        </div>
      </div>
      <div class="footer-sta">
        <img src="${MEDIA.staLogo}" alt="Shakespeare Theatre Association" width="120" />
        <p>${SITE.name} is a proud member of the Shakespeare Theatre Association</p>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 ${SITE.name}</p>
        <p>Questions should be directed to Stephanie Eiss, Director of Education: <a href="mailto:${SITE.educationContact}">${SITE.educationContact}</a></p>
      </div>
    </div>
  `;
}

function renderProductionSlide(production) {
  const wrapper = document.createElement("div");
  mountTemplate("tpl-production-slide", wrapper, (frag) => {
    const link = frag.querySelector(".production--card");
    link.href = production.href;
    if (production.href.startsWith("http")) {
      link.target = "_blank";
      link.rel = "noopener";
    }
    frag.querySelector(".production__image img").src = production.image;
    frag.querySelector(".production__image img").alt = production.title;
    frag.querySelector(".production__title").textContent = production.title;
    frag.querySelector(".production__date").textContent = production.date;
  });
  return wrapper.innerHTML;
}

function renderSponsors() {
  const wall = document.getElementById("sponsors-wall");
  if (wall) {
    wall.innerHTML = SPONSORS.map(
      (s) => `<img src="${s.image}" alt="${s.name}" loading="lazy" />`
    ).join("");
    return;
  }

  const root = document.getElementById("sponsors-marquee");
  if (!root) return;

  const items = SPONSORS.map(
    (s) => `<div class="marquee__item"><img src="${s.image}" alt="${s.name}" loading="lazy" /></div>`
  ).join("");

  root.innerHTML = `<div class="marquee__track">${items}${items}</div>`;
}

function initMobileDock() {
  if (document.getElementById("mobile-dock")) return;

  const dock = document.createElement("nav");
  dock.id = "mobile-dock";
  dock.className = "mobile-dock";
  dock.setAttribute("aria-label", "Quick actions");
  dock.innerHTML = `
    <button class="mobile-dock__item" type="button" data-mobile-open aria-label="Open menu">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>
      Menu
    </button>
    <a class="mobile-dock__item" href="/productions/much-ado-about-nothing/">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19h16M6 16l3-9 3 5 3-7 3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      What's On
    </a>
    <a class="mobile-dock__item mobile-dock__item--primary" href="${SITE.ticketsUrl}">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 4v3M17 4v3M5 8h14v12H5V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      Tickets
    </a>
    <a class="mobile-dock__item" href="/support/donate/">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" stroke="currentColor" stroke-width="1.5"/></svg>
      Donate
    </a>
  `;
  document.body.appendChild(dock);
}

function setChromeHeights() {
  const announcement = document.querySelector(".announcement");
  const height = announcement ? announcement.offsetHeight : 0;
  document.documentElement.style.setProperty("--announcement-height", `${height}px`);
}

let releaseFocusTrap = null;

function initMobileNav() {
  /* Mobile nav handled by React — see src/components/MobileNav.jsx */
}

async function initCarousel() {
  const slider = document.getElementById("productions-slider");
  const track = document.getElementById("productions-track");
  if (!track || !slider) return;

  track.innerHTML = PRODUCTIONS.map(renderProductionSlide).join("");

  const { default: Swiper } = await import("swiper");
  const { Navigation, EffectCoverflow, Autoplay, Pagination } = await import("swiper/modules");

  new Swiper(slider, {
    modules: [Navigation, EffectCoverflow, Autoplay, Pagination],
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    loop: true,
    speed: 700,
    autoplay: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? false
      : { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
    coverflowEffect: {
      rotate: window.innerWidth < 768 ? 0 : 4,
      stretch: 0,
      depth: window.innerWidth < 768 ? 60 : 120,
      modifier: window.innerWidth < 768 ? 1.5 : 2.2,
      slideShadows: false,
    },
    pagination: { el: ".productions-pagination", clickable: true },
    navigation: { nextEl: ".productions-next", prevEl: ".productions-prev" },
    breakpoints: {
      768: { coverflowEffect: { depth: 160, modifier: 2.5 } },
    },
  });
}

function initContactForm() {
  initAccessibleForm("contact-form", {
    storageKey: "sos-contact-draft",
    onSuccess: () => "Thanks for contacting us! We'll reply soon.",
  });
}

export function initApp() {
  initA11y();
  renderMobileDock();
  renderFooter();
  renderHomepage();
  initFaqAccordion();
  renderSponsors();
  initMobileNav();
  initCarousel();
  initContactForm();
  setChromeHeights();
  window.addEventListener("resize", setChromeHeights, { passive: true });
}
