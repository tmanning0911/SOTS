import { chromium } from "playwright";

const BASE = process.argv[2] || "http://127.0.0.1:3456";

const viewports = [
  { name: "iphone-se", width: 375, height: 667 },
  { name: "iphone-14", width: 390, height: 844 },
  { name: "iphone-14-pro-max", width: 430, height: 932 },
  { name: "ipad-portrait", width: 768, height: 1024 },
  { name: "ipad-landscape", width: 1024, height: 768 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1920, height: 1080 },
];

const pages = [
  { path: "/", label: "home" },
  { path: "/about/visit/", label: "visit" },
  { path: "/productions/much-ado-about-nothing/", label: "production" },
  { path: "/about/faq/", label: "faq" },
];

function issue(vp, page, type, detail, severity = "major") {
  return { vp, page, type, detail, severity };
}

const browser = await chromium.launch();
const allIssues = [];

for (const vp of viewports) {
  for (const pg of pages) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`${BASE}${pg.path}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(700);

    const data = await page.evaluate(() => {
      const root = document.documentElement;
      const body = document.body;
      const chrome = document.querySelector("[data-site-chrome]");
      const main = document.querySelector("#main");
      const mobileNav = document.querySelector(".orpheum-mobile-nav");
      const desktopNav = document.querySelector(".orpheum-header__inner .orpheum-nav");
      const quickbar = document.querySelector(".orpheum-quickbar");
      const dock = document.querySelector(".mobile-dock");
      const footer = document.querySelector(".orpheum-footer");

      const transforms = [];
      document.querySelectorAll("[data-reveal], .orpheum-visit-bar, section").forEach((el) => {
        const s = getComputedStyle(el);
        const t = s.transform;
        const y = s.translate;
        if ((t && t !== "none") || (y && y !== "none")) {
          const r = el.getBoundingClientRect();
          if (r.height > 0 && r.width > 0) {
            transforms.push({
              cls: (el.className || el.tagName).toString().slice(0, 50),
              transform: t,
              translate: y,
              opacity: s.opacity,
            });
          }
        }
      });

      const overflowX = root.scrollWidth - window.innerWidth;
      const bodyPad = parseFloat(getComputedStyle(body).paddingBottom) || 0;
      const bottomH = quickbar?.offsetHeight || dock?.offsetHeight || 0;

      const footerRect = footer?.getBoundingClientRect();
      const scrollH = root.scrollHeight;

      return {
        chromeH: chrome ? Math.round(chrome.getBoundingClientRect().height) : 0,
        mainTop: main ? Math.round(main.getBoundingClientRect().top) : 0,
        mobileNavDisplay: mobileNav ? getComputedStyle(mobileNav).display : null,
        mobileNavH: mobileNav ? Math.round(mobileNav.getBoundingClientRect().height) : 0,
        desktopNavDisplay: desktopNav ? getComputedStyle(desktopNav).display : null,
        overflowX,
        bodyPadBottom: Math.round(bodyPad),
        bottomChromeH: bottomH,
        footerBottom: footerRect ? Math.round(footerRect.bottom) : null,
        scrollH,
        transforms: transforms.slice(0, 8),
        heroTop: document.querySelector(".orpheum-hero")?.getBoundingClientRect().top,
        innerHeroTop: document.querySelector(".orpheum-inner-page__hero")?.getBoundingClientRect().top,
      };
    });

    if (data.mainTop > data.chromeH + 5) {
      allIssues.push(
        issue(vp.name, pg.label, "main-below-chrome-gap", `main@${data.mainTop}px chrome@${data.chromeH}px`)
      );
    }
    if (vp.width >= 992 && data.mobileNavDisplay !== "none") {
      allIssues.push(issue(vp.name, pg.label, "mobile-nav-visible-desktop", data.mobileNavDisplay, "critical"));
    }
    if (vp.width >= 992 && data.mobileNavH > 0) {
      allIssues.push(issue(vp.name, pg.label, "mobile-nav-height-desktop", `${data.mobileNavH}px`, "critical"));
    }
    if (vp.width >= 992 && data.desktopNavDisplay === "none") {
      allIssues.push(issue(vp.name, pg.label, "desktop-nav-hidden", "nav display none", "critical"));
    }
    if (data.overflowX > 2) {
      allIssues.push(issue(vp.name, pg.label, "horizontal-overflow", `${data.overflowX}px`));
    }
    if (data.bottomChromeH > 0 && Math.abs(data.bodyPadBottom - data.bottomChromeH) > 16) {
      allIssues.push(
        issue(
          vp.name,
          pg.label,
          "bottom-pad-mismatch",
          `body ${data.bodyPadBottom}px vs chrome ${data.bottomChromeH}px`
        )
      );
    }

    // Stale GSAP offsets on structural sections
    for (const t of data.transforms) {
      if (
        t.cls.includes("visit-bar") ||
        t.cls.includes("orpheum-our-story") ||
        t.cls.includes("orpheum-inner-page")
      ) {
        if (t.transform !== "none" || (t.opacity && parseFloat(t.opacity) < 0.99)) {
          allIssues.push(
            issue(vp.name, pg.label, "stale-transform", `${t.cls}: ${t.transform} opacity ${t.opacity}`)
          );
        }
      }
    }

    if (pg.label === "home" && data.heroTop != null && Math.abs(data.heroTop - data.chromeH) > 8 && vp.width >= 992) {
      allIssues.push(
        issue(vp.name, pg.label, "hero-not-under-header", `hero top ${Math.round(data.heroTop)} chrome ${data.chromeH}`)
      );
    }

    await page.close();
  }
}

// Section gap audit on home mobile
{
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const gaps = await page.evaluate(() => {
    const sels = [
      ".orpheum-hero",
      ".orpheum-season-promo",
      ".orpheum-events-grid",
      ".orpheum-visit-bar",
      ".orpheum-our-story",
      ".orpheum-impact-split",
      ".orpheum-support-banner",
      ".orpheum-news-feed",
      ".orpheum-partners",
      ".orpheum-newsletter-banner",
    ];
    const out = [];
    for (let i = 0; i < sels.length - 1; i++) {
      const a = document.querySelector(sels[i]);
      const b = document.querySelector(sels[i + 1]);
      if (!a || !b) continue;
      const gap = Math.round(b.getBoundingClientRect().top - a.getBoundingClientRect().bottom);
      if (gap < -8) out.push({ from: sels[i], to: sels[i + 1], gap });
    }
    return out;
  });
  for (const g of gaps) {
    allIssues.push(issue("iphone-14", "home", "section-overlap", `${g.from} → ${g.to}: ${g.gap}px`, "critical"));
  }
  await page.close();
}

await browser.close();

const grouped = {};
for (const i of allIssues) {
  grouped[i.type] = (grouped[i.type] || 0) + 1;
}

console.log(`\n=== SPACING AUDIT (${BASE}) ===`);
console.log(`Total issues: ${allIssues.length}`);
console.log("By type:", grouped);
console.log("\nDetails:");
for (const i of allIssues) {
  console.log(`[${i.severity}] ${i.vp}/${i.page}: ${i.type} — ${i.detail}`);
}

process.exit(allIssues.length > 0 ? 1 : 0);
