/**
 * Sync Orpheum rebuild to SOTS repo and push to Netlify.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sots = path.resolve(root, "../SOTS");

const excludes = [
  "node_modules",
  ".git",
  "dist",
  "assets",
  ".playwright-browsers",
  ".netlify",
  ".vite",
].map((item) => `--exclude=${item}`);

function run(cmd, cwd = root) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd, stdio: "inherit" });
}

if (!fs.existsSync(sots)) {
  throw new Error(`SOTS folder not found at ${sots}`);
}

run("node scripts/sync-sots-content.mjs");

run(
  `rsync -a --delete ${excludes.join(" ")} "${root}/" "${sots}/"`,
);

run("npm install", sots);
run("npm run build", sots);

const status = execSync("git status --porcelain", { cwd: sots, encoding: "utf8" }).trim();
if (!status) {
  console.log("\nNo changes to deploy.");
  process.exit(0);
}

run(
  `git add -A && git commit -m "$(cat <<'EOF'
Deploy Orpheum rebuild with SOTS content sync.

Merge Netlify CMS data (events, news, FAQs, sponsors, tickets) into the Orpheum-style site and push to production.
EOF
)"`,
  sots,
);

run("git push origin main", sots);
run("git push netlify main", sots);

console.log("\nDeploy complete: https://ubiquitous-maamoul-8b9b7f.netlify.app");
