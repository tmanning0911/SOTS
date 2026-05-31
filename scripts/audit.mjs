#!/usr/bin/env node
/**
 * Site audit — image paths, nav anchor IDs, lint, and production build.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const pub = path.join(root, 'public');

const errors = [];
const warnings = [];

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
}

function collectImageRefs() {
  const refs = new Set();
  const walk = (o) => {
    if (typeof o === 'string' && o.startsWith('/images/')) refs.add(o);
    else if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') Object.values(o).forEach(walk);
  };

  for (const f of fs.readdirSync(path.join(pub, 'data')).filter((n) => n.endsWith('.json'))) {
    walk(readJson(`public/data/${f}`));
  }

  const scanDir = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory() && e.name !== 'node_modules') scanDir(p);
      else if (/\.(jsx?|tsx?|js|mjs)$/.test(e.name)) {
        const text = fs.readFileSync(p, 'utf8');
        for (const m of text.matchAll(/['"`](\/images\/[^'"`]+)['"`]/g)) refs.add(m[1]);
      }
    }
  };
  scanDir(path.join(root, 'src'));
  return refs;
}

function checkImages() {
  const refs = collectImageRefs();
  for (const ref of refs) {
    const file = path.join(pub, ref.slice(1));
    if (!fs.existsSync(file)) errors.push(`Missing image: ${ref}`);
  }
  console.log(`✓ ${refs.size} image references checked`);
}

function checkAnchorIds() {
  const plays = readJson('public/data/plays.json');
  const events = readJson('public/data/events.json');
  const playIds = new Set(plays.map((p) => p.id));
  const eventIds = new Set(events.map((e) => e.id));

  const navText = fs.readFileSync(path.join(root, 'src/content/nav.js'), 'utf8');
  const hashes = [...navText.matchAll(/path:\s*['"]([^'"]+#([^'"]+))['"]/g)];

  for (const [, full, id] of hashes) {
    const [route] = full.split('#');
    if (route === '/plays' && !playIds.has(id)) errors.push(`Nav anchor missing play id: ${id} (${full})`);
    if (route === '/events' && !eventIds.has(id)) errors.push(`Nav anchor missing event id: ${id} (${full})`);
    if (route === '/about' || route === '/#sponsors' || route === '/#email-signup') continue;
  }

  console.log(`✓ Nav anchor IDs checked against plays (${playIds.size}) and events (${eventIds.size})`);
}

function checkRequiredRoutes() {
  const app = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8');
  const required = ['/plays', '/events', '/learning', '/support', '/about', '/contact', '/news', '/watch'];
  for (const route of required) {
    if (!app.includes(`path="${route}"`)) warnings.push(`Route may be missing in App.jsx: ${route}`);
  }
  console.log('✓ Core routes present in App.jsx');
}

function run(cmd) {
  execSync(cmd, { cwd: root, stdio: 'inherit' });
}

console.log('Running site audit...\n');
checkImages();
checkAnchorIds();
checkRequiredRoutes();

console.log('\nRunning lint...');
run('npm run lint');

console.log('\nRunning production build...');
run('npm run build');

if (warnings.length) {
  console.warn('\nWarnings:');
  warnings.forEach((w) => console.warn(`  ⚠ ${w}`));
}

if (errors.length) {
  console.error('\nAudit failed:');
  errors.forEach((e) => console.error(`  ✗ ${e}`));
  process.exit(1);
}

console.log('\n✓ Audit passed');
