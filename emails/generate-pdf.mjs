#!/usr/bin/env node
/**
 * Export step-inside-summer-2026.html as a single-page letter PDF.
 * Usage: node emails/generate-pdf.mjs
 */
import { execFileSync } from 'child_process';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { tmpdir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const template = join(__dirname, 'templates/step-inside-summer-2026.html');
const assetsDir = join(__dirname, 'assets');
const output = join(__dirname, 'step-inside-summer-2026.pdf');

const chrome =
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium'].find(
    existsSync,
  ) ?? 'google-chrome';

const html = readFileSync(template, 'utf8');

function absolutizeAssetPaths(markup) {
  return markup.replace(/src="\.\.\/assets\/([^"]+)"/g, (_, file) => {
    const assetPath = join(assetsDir, file);
    if (!existsSync(assetPath)) {
      throw new Error(`Missing asset for PDF export: ${assetPath}`);
    }
    return `src="${pathToFileURL(assetPath).href}"`;
  });
}

const printBlock = (zoom) => `
    @media print {
      @page { size: letter; margin: 0.12in; }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .email-bg { background: #ffffff !important; }
      .email-bg > tbody > tr > td { padding: 0 !important; }
      body { zoom: ${zoom}; }
    }`;

function pageCount(pdfPath) {
  const raw = readFileSync(pdfPath);
  const match = raw.toString('latin1').match(/\/Count\s+(\d+)/);
  return match ? Number(match[1]) : null;
}

function renderPdf(zoom, pdfPath) {
  const styled = absolutizeAssetPaths(
    html.includes('@media print {')
      ? html.replace(/@media print \{[\s\S]*?\n    \}/, printBlock(zoom).trim())
      : html.replace('</style>', `${printBlock(zoom)}\n  </style>`),
  );

  const tmpHtml = join(tmpdir(), `sots-email-${zoom}.html`);
  writeFileSync(tmpHtml, styled);

  execFileSync(
    chrome,
    ['--headless', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, `file://${tmpHtml}`],
    { stdio: 'pipe' },
  );

  unlinkSync(tmpHtml);
}

// Binary search zoom to fit one letter page
let lo = 0.28;
let hi = 0.55;
let bestZoom = 0.38;
const testPdf = join(tmpdir(), 'sots-email-fit-test.pdf');

for (let i = 0; i < 10; i++) {
  const mid = Math.round(((lo + hi) / 2) * 1000) / 1000;
  renderPdf(mid, testPdf);
  const pages = pageCount(testPdf);
  if (pages === 1) {
    bestZoom = mid;
    lo = mid;
  } else if (pages && pages > 1) {
    hi = mid - 0.005;
  } else {
    lo = mid + 0.005;
  }
}

renderPdf(bestZoom, output);
const finalPages = pageCount(output);
unlinkSync(testPdf);

console.log(`Saved ${output}`);
console.log(`Pages: ${finalPages ?? 'unknown'} · zoom: ${bestZoom}`);

if (finalPages !== 1) {
  process.exitCode = 1;
  console.error('Could not fit email on one page — try reducing content or margins.');
}
