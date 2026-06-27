import { chromium } from "playwright";
import { readFileSync } from "fs";

const BASE = process.argv[2] || "https://ubiquitous-maamoul-8b9b7f.netlify.app";
const OUT = process.argv[3] || "/tmp/site-audit.json";

const viewports = [
  { id: "mobile", name: "iPhone 14", width: 390, height: 844 },
  { id: "tablet", name: "iPad portrait", width: 768, height: 1024 },
  { id: "desktop", name: "Desktop 1440", width: 1440, height: 900 },
];

function pathsFromSitemap() {
  const xml = readFileSync(new URL("../dist/sitemap.xml", import.meta.url), "utf8");
  return [...xml.matchAll(/<loc>https:\/\/www\.shakespeareonthesound\.org([^<]*)<\/loc>/g)].map((m) => {
    const path = m[1] || "/";
    return path.endsWith("/") ? path : `${path}/`;
  });
}

const paths = pathsFromSitemap();
const browser = await chromium.launch();
const findings = [];
const pageScores = {};

function add(finding) {
  findings.push(finding);
}

for (const vp of viewports) {
  for (const path of paths) {
    const label = path.replace(/^\/|\/$/g, "") || "home";
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 120));
    });

    await page.setViewportSize({ width: vp.width, height: vp.height });
    let status = 0;
    try {
      const resp = await page.goto(`${BASE}${path === "/" ? "" : path.slice(0, -1)}`, {
        waitUntil: "networkidle",
        timeout: 45000,
      });
      status = resp?.status() ?? 0;
    } catch (e) {
      add({
        severity: "critical",
        vp: vp.id,
        path: label,
        type: "navigation-failed",
        detail: e.message.slice(0, 100),
      });
      await page.close();
      continue;
    }

    await page.waitForTimeout(500);

    const data = await page.evaluate(() => {
      const main = document.querySelector("#main");
      const h1 = document.querySelector("h1");
      const footer = document.querySelector(".orpheum-footer");
      const mobileNav = document.querySelector(".orpheum-mobile-nav");
      const desktopNav = document.querySelector(".orpheum-header__inner .orpheum-nav");
      const quickbar = document.querySelector(".orpheum-quickbar");
      const dock = document.querySelector(".mobile-dock");
      const chrome = document.querySelector("[data-site-chrome]");

      const brokenImages = [...document.querySelectorAll("img")].filter(
        (img) => img.src && !img.src.startsWith("data:") && img.complete && img.naturalWidth === 0
      ).length;

      const gutterEl =
        document.querySelector(".orpheum-inner-page__body") ||
        document.querySelector(".orpheum-events-grid") ||
        document.querySelector(".orpheum-hero__shell");
      const gutter = gutterEl ? parseFloat(getComputedStyle(gutterEl).paddingLeft) : null;

      return {
        title: document.title,
        h1: h1?.textContent?.trim().slice(0, 80) || null,
        overflowX: document.documentElement.scrollWidth - window.innerWidth,
        mainTop: main ? Math.round(main.getBoundingClientRect().top) : null,
        chromeH: chrome ? Math.round(chrome.getBoundingClientRect().height) : null,
        mobileNavDisplay: mobileNav ? getComputedStyle(mobileNav).display : null,
        mobileNavH: mobileNav ? Math.round(mobileNav.getBoundingClientRect().height) : 0,
        desktopNavDisplay: desktopNav ? getComputedStyle(desktopNav).display : null,
        bodyClass: document.body.className,
        bodyPadBottom: Math.round(parseFloat(getComputedStyle(document.body).paddingBottom) || 0),
        bottomChromeH: quickbar?.offsetHeight || dock?.offsetHeight || 0,
        hasFooter: !!footer,
        brokenImages,
        gutter,
        is404: !!document.querySelector(".orpheum-not-found-page"),
      };
    });

    const key = `${vp.id}:${label}`;
    let score = 100;
    const pageFindings = [];

    if (status !== 200) {
      pageFindings.push({ severity: "critical", type: "http-status", detail: String(status) });
      score -= 40;
    }
    if (!data.h1 && !data.is404) {
      pageFindings.push({ severity: "major", type: "missing-h1", detail: "No h1 on page" });
      score -= 15;
    }
    if (data.overflowX > 2) {
      pageFindings.push({ severity: "major", type: "horizontal-overflow", detail: `${data.overflowX}px` });
      score -= 20;
    }
    if (vp.id === "desktop" && data.mobileNavDisplay !== "none") {
      pageFindings.push({ severity: "critical", type: "mobile-nav-leak", detail: data.mobileNavDisplay });
      score -= 30;
    }
    if (vp.id === "desktop" && data.mobileNavH > 0) {
      pageFindings.push({ severity: "critical", type: "mobile-nav-height", detail: `${data.mobileNavH}px` });
      score -= 30;
    }
    if (vp.id === "desktop" && data.desktopNavDisplay === "none" && !data.is404) {
      pageFindings.push({ severity: "critical", type: "desktop-nav-missing", detail: "hidden" });
      score -= 25;
    }
    if (data.mainTop != null && data.chromeH != null && data.mainTop > data.chromeH + 8) {
      pageFindings.push({
        severity: "critical",
        type: "layout-gap",
        detail: `main ${data.mainTop}px vs chrome ${data.chromeH}px`,
      });
      score -= 25;
    }
    if (data.bottomChromeH > 0 && Math.abs(data.bodyPadBottom - data.bottomChromeH) > 20) {
      pageFindings.push({
        severity: "major",
        type: "bottom-pad-mismatch",
        detail: `body ${data.bodyPadBottom}px chrome ${data.bottomChromeH}px`,
      });
      score -= 10;
    }
    if (data.brokenImages > 0) {
      pageFindings.push({ severity: "major", type: "broken-images", detail: String(data.brokenImages) });
      score -= 15;
    }
    if (!data.hasFooter) {
      pageFindings.push({ severity: "critical", type: "missing-footer", detail: "no footer" });
      score -= 20;
    }
    if (consoleErrors.length) {
      pageFindings.push({ severity: "minor", type: "console-error", detail: consoleErrors[0] });
      score -= 5;
    }

    pageScores[key] = Math.max(0, score);

    for (const f of pageFindings) {
      add({ ...f, vp: vp.id, path: label });
    }

    await page.close();
  }
}

await browser.close();

const bySeverity = { critical: 0, major: 0, minor: 0 };
for (const f of findings) bySeverity[f.severity] = (bySeverity[f.severity] || 0) + 1;

const vpGrades = {};
for (const vp of viewports) {
  const scores = Object.entries(pageScores)
    .filter(([k]) => k.startsWith(`${vp.id}:`))
    .map(([, v]) => v);
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  vpGrades[vp.id] = {
    name: vp.name,
    avgScore: Math.round(avg),
    grade: avg >= 95 ? "A" : avg >= 88 ? "A-" : avg >= 82 ? "B+" : avg >= 75 ? "B" : "C",
    pages: scores.length,
  };
}

const report = {
  base: BASE,
  auditedAt: new Date().toISOString(),
  pageCount: paths.length,
  viewportCount: viewports.length,
  totalChecks: paths.length * viewports.length,
  findingsCount: findings.length,
  bySeverity,
  vpGrades,
  findings,
  pageScores,
  paths,
};

import { writeFileSync } from "fs";
writeFileSync(OUT, JSON.stringify(report, null, 2));

console.log(`\n=== FULL SITE AUDIT ===`);
console.log(`Base: ${BASE}`);
console.log(`Pages: ${paths.length} × ${viewports.length} viewports = ${report.totalChecks} checks`);
console.log(`Findings: ${findings.length} (critical ${bySeverity.critical}, major ${bySeverity.major}, minor ${bySeverity.minor})`);
console.log("\nViewport grades:");
for (const [id, g] of Object.entries(vpGrades)) {
  console.log(`  ${g.name}: ${g.grade} (${g.avgScore}/100 avg)`);
}
console.log(`\nReport: ${OUT}`);

if (findings.filter((f) => f.severity === "critical").length) {
  console.log("\nCritical issues:");
  for (const f of findings.filter((f) => f.severity === "critical").slice(0, 20)) {
    console.log(`  [${f.vp}] ${f.path}: ${f.type} — ${f.detail}`);
  }
}

process.exit(bySeverity.critical > 0 ? 1 : 0);
