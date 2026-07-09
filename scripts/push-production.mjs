#!/usr/bin/env node
/**
 * Push main to both remotes — origin (SOTS GitHub) and netlify (Netlify-linked repo).
 * Netlify deploys from the `netlify` remote, NOT origin alone.
 */
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
console.log('\nPushed to origin + netlify. Netlify will build from ubiquitous-maamoul-8b9b7f.');
