#!/usr/bin/env node
/**
 * Constant Contact Authorization Code OAuth helper (local one-time setup).
 *
 * 1) Create an app in the V3 portal (Authorization Code Flow)
 * 2) Generate client secret; set redirect URI exactly as below
 * 3) Put API key + secret in .env
 * 4) Run: node scripts/constant-contact-oauth.mjs
 * 5) Sign in as the SOS Constant Contact owner and Approve
 * 6) Script writes refresh/access tokens into .env
 *
 * Never paste secrets into chat.
 */
import { createServer } from "node:http";
import { createHash, randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { exec } from "node:child_process";

const ENV_PATH = resolve(process.cwd(), ".env");
const AUTH_URL = "https://authz.constantcontact.com/oauth2/default/v1/authorize";
const TOKEN_URL = "https://authz.constantcontact.com/oauth2/default/v1/token";
const DEFAULT_REDIRECT = "http://localhost:8888/";
const SCOPES = ["contact_data", "offline_access", "account_read"];

function loadDotEnv() {
  if (!existsSync(ENV_PATH)) return {};
  const values = {};
  for (const line of readFileSync(ENV_PATH, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
    if (!process.env[key]) process.env[key] = value;
  }
  return values;
}

function upsertEnv(updates) {
  const existing = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : "";
  const lines = existing ? existing.split("\n") : [];
  const keys = Object.keys(updates);
  const seen = new Set();

  const next = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return line;
    const eq = trimmed.indexOf("=");
    if (eq < 1) return line;
    const key = trimmed.slice(0, eq).trim();
    if (!(key in updates)) return line;
    seen.add(key);
    return `${key}=${updates[key]}`;
  });

  for (const key of keys) {
    if (!seen.has(key)) next.push(`${key}=${updates[key]}`);
  }

  const out = `${next.filter((line, i, arr) => !(line === "" && arr[i - 1] === "")).join("\n").replace(/\n*$/, "")}\n`;
  writeFileSync(ENV_PATH, out, "utf8");
}

function openBrowser(url) {
  const platform = process.platform;
  const cmd =
    platform === "darwin" ? `open "${url}"` : platform === "win32" ? `start "" "${url}"` : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

function buildAuthorizeUrl({ clientId, redirectUri, state }) {
  const url = new URL(AUTH_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", SCOPES.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "login");
  return url.toString();
}

async function exchangeCode({ clientId, clientSecret, code, redirectUri }) {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const url = new URL(TOKEN_URL);
  url.searchParams.set("code", code);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("grant_type", "authorization_code");

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = body.error_description || body.error || res.statusText;
    throw new Error(`Token exchange failed: ${detail}`);
  }
  if (!body.access_token || !body.refresh_token) {
    throw new Error("Token response missing access_token or refresh_token.");
  }
  return body;
}

function waitForCode({ redirectUri, expectedState }) {
  const redirect = new URL(redirectUri);
  const port = Number(redirect.port || (redirect.protocol === "https:" ? 443 : 80));
  const host = redirect.hostname === "localhost" ? "127.0.0.1" : redirect.hostname;

  return new Promise((resolveWait, reject) => {
    const server = createServer((req, res) => {
      try {
        const incoming = new URL(req.url || "/", `http://${host}:${port}`);
        const code = incoming.searchParams.get("code");
        const state = incoming.searchParams.get("state");
        const error = incoming.searchParams.get("error");

        if (error) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end(`<h1>Authorization failed</h1><p>${error}</p><p>You can close this tab.</p>`);
          server.close();
          reject(new Error(`Authorization denied: ${error}`));
          return;
        }

        if (!code) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end("<h1>Missing code</h1><p>Try running the script again.</p>");
          return;
        }

        if (state !== expectedState) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end("<h1>State mismatch</h1><p>Try running the script again.</p>");
          server.close();
          reject(new Error("OAuth state mismatch."));
          return;
        }

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(
          "<h1>Connected</h1><p>Constant Contact authorization succeeded. You can close this tab and return to the terminal.</p>",
        );
        server.close();
        resolveWait(code);
      } catch (err) {
        server.close();
        reject(err);
      }
    });

    server.listen(port, host, () => {
      console.log(`Listening for OAuth redirect on ${redirectUri}`);
    });
    server.on("error", reject);
  });
}

async function main() {
  loadDotEnv();

  const clientId =
    process.env.CONSTANT_CONTACT_API_KEY?.trim() ||
    process.env.CONSTANT_CONTACT_CLIENT_ID?.trim();
  const clientSecret = process.env.CONSTANT_CONTACT_CLIENT_SECRET?.trim();
  const redirectUri = (process.env.CONSTANT_CONTACT_REDIRECT_URI || DEFAULT_REDIRECT).trim();

  if (!clientId || !clientSecret) {
    console.error(`
Missing credentials in .env

Add these first (from the Constant Contact My Applications page):
  CONSTANT_CONTACT_API_KEY=...          # API key / client id
  CONSTANT_CONTACT_CLIENT_SECRET=...    # shown once when generated

Also set this exact redirect URI on the app (and optionally in .env):
  CONSTANT_CONTACT_REDIRECT_URI=${DEFAULT_REDIRECT}
`);
    process.exit(1);
  }

  if (!redirectUri.startsWith("http://localhost") && !redirectUri.startsWith("https://localhost")) {
    console.error("For this helper, redirect URI must be http://localhost… or https://localhost…");
    process.exit(1);
  }

  const state = createHash("sha256").update(randomBytes(32)).digest("hex").slice(0, 32);
  const authorizeUrl = buildAuthorizeUrl({ clientId, redirectUri, state });

  console.log("\n=== Constant Contact OAuth ===\n");
  console.log("Scopes:", SCOPES.join(" "));
  console.log("Redirect URI (must match the app setting exactly):\n ", redirectUri);
  console.log("\nOpening browser. If it doesn’t open, visit:\n");
  console.log(authorizeUrl);
  console.log("");

  const codePromise = waitForCode({ redirectUri, expectedState: state });
  openBrowser(authorizeUrl);

  const code = await codePromise;
  console.log("Got authorization code. Exchanging for tokens…");

  const tokens = await exchangeCode({ clientId, clientSecret, code, redirectUri });

  upsertEnv({
    CONSTANT_CONTACT_API_KEY: clientId,
    CONSTANT_CONTACT_CLIENT_SECRET: clientSecret,
    CONSTANT_CONTACT_REDIRECT_URI: redirectUri,
    CONSTANT_CONTACT_ACCESS_TOKEN: tokens.access_token,
    CONSTANT_CONTACT_REFRESH_TOKEN: tokens.refresh_token,
  });

  console.log("\nSaved to .env:");
  console.log("  CONSTANT_CONTACT_ACCESS_TOKEN");
  console.log("  CONSTANT_CONTACT_REFRESH_TOKEN");
  console.log("\nNext:");
  console.log("  1) Set CONSTANT_CONTACT_LIST_ID (from your Website Newsletter list)");
  console.log("     tip: node scripts/constant-contact-lists.mjs");
  console.log("  2) Copy the same four secret vars + LIST_ID into Netlify env");
  console.log("");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
