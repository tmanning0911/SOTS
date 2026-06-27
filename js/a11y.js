/**
 * Accessibility enhancements — Microsoft Web Dev for Beginners (A11y lesson)
 */

export function initA11y() {
  initFocusVisible();
  initReducedMotion();
  initLandmarkLabels();
}

function initFocusVisible() {
  document.body.addEventListener("mousedown", () => document.body.classList.add("using-mouse"));
  document.body.addEventListener("keydown", (e) => {
    if (e.key === "Tab") document.body.classList.remove("using-mouse");
  });
}

function initReducedMotion() {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.documentElement.classList.add("reduce-motion");
}

function initLandmarkLabels() {
  const main = document.getElementById("main");
  if (main && !main.getAttribute("aria-label") && !main.getAttribute("aria-labelledby")) {
    main.setAttribute("aria-label", "Main content");
  }
}

export function trapFocus(container) {
  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  function handleKey(e) {
    if (e.key !== "Tab") return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  container.addEventListener("keydown", handleKey);
  first?.focus();
  return () => container.removeEventListener("keydown", handleKey);
}

export function initFaqA11y() {
  document.querySelectorAll(".faq-item__trigger").forEach((btn) => {
    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const items = [...document.querySelectorAll(".faq-item__trigger")];
        const i = items.indexOf(btn);
        const next = e.key === "ArrowDown" ? items[i + 1] : items[i - 1];
        next?.focus();
      }
    });
  });
}
