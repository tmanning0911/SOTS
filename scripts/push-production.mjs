#!/usr/bin/env node
/**
 * Push main to both remotes:
 *   origin  → github.com/tmanning0911/SOTS (backup)
 *   netlify → github.com/tmanning0911/ubiquitous-maamoul-8b9b7f (triggers Netlify deploy)
 *
 * QA / preview site (NOT the live Wix domain):
 *   https://ubiquitous-maamoul-8b9b7f.netlify.app
 */
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PREVIEW_URL = 'https://ubiquitous-maamoul-8b9b7f.netlify.app';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { cwd: root, stdio: 'inherit' });
}

const branch = execSync('git branch --show-current', { cwd: root, encoding: 'utf8' }).trim();
if (branch !== 'main') {
  console.error(`Refusing to push from branch "${branch}". Checkout main first.`);
  process.exit(1);
}

run('git push origin main');
run('git push netlify main');
console.log(`\nDeploy triggered. Preview site (check here): ${PREVIEW_URL}`);
console.log('Note: www.shakespeareonthesound.org is still on Wix until DNS is pointed to Netlify.');
