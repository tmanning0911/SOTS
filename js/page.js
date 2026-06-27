/**
 * Creates inner page shell with shared header/footer.
 */
function getBasePath() {
  const depth = (window.location.pathname.match(/\//g) || []).length - 1;
  if (window.location.protocol === "file:") {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const pageParts = parts.length - 1;
    return "../".repeat(Math.max(0, pageParts - 1));
  }
  const segments = window.location.pathname.split("/").filter(Boolean);
  return segments.length <= 1 ? "" : "../".repeat(segments.length - 1);
}

function renderInnerPage({ title, heading, content }) {
  const base = getBasePath();
  document.title = `${title} - Shakespeare on the Sound`;

  const main = document.getElementById("page-main");
  if (main) {
    main.innerHTML = `
      <section class="page-hero">
        <div class="container--wide">
          <h1>${heading}</h1>
        </div>
      </section>
      <section class="page-content">
        <div class="container">${content}</div>
      </section>
    `;
  }

  document.querySelectorAll("[data-base]").forEach((el) => {
    const attr = el.getAttribute("data-base");
    if (attr === "href") el.setAttribute("href", base + el.getAttribute("data-path"));
    if (attr === "src") el.setAttribute("src", base + el.getAttribute("data-path"));
  });

  const header = document.querySelector(".site-header");
  if (header) header.classList.add("is-scrolled");
}

export function initPage() {
  if (document.body.dataset.page && window.PAGE_CONTENT) {
    renderInnerPage(window.PAGE_CONTENT);
  }
}
