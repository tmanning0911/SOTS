#!/usr/bin/env node
/**
 * Apply Shakespeare on the Sound branding to Square-hosted checkout
 * (Payment Links, Square Online Checkout pages).
 *
 * Sets Buy button color/shape and shows the location logo.
 * On-site ticket/shop card forms are styled separately in js/square-payments.js.
 *
 * Usage:
 *   node scripts/brand-square-checkout.mjs
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getSquareCredentials,
  resolveLocationId,
  squareEnvironment,
  squareRequest,
} from "../netlify/functions/lib/square.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** SOTS brand tokens (css/brand.css) */
const BRAND = {
  buttonColor: "#0f2d4d", // --brand-navy
  buttonShape: "ROUNDED",
  // Uses the logo already uploaded on the Square location (Dashboard).
  headerType: "FRAMED_LOGO",
};

async function loadDotEnv() {
  try {
    const raw = await readFile(path.join(root, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    /* no .env */
  }
}

async function main() {
  await loadDotEnv();
  getSquareCredentials();
  const locationId = await resolveLocationId();
  console.log(`Square environment: ${squareEnvironment()}`);
  console.log(`Location: ${locationId}`);

  const before = await squareRequest(`/v2/online-checkout/location-settings/${locationId}`);
  console.log("Before branding:", JSON.stringify(before.location_settings?.branding, null, 2));

  const updated = await squareRequest(`/v2/online-checkout/location-settings/${locationId}`, {
    method: "PUT",
    body: {
      location_settings: {
        location_id: locationId,
        branding: {
          header_type: BRAND.headerType,
          button_color: BRAND.buttonColor,
          button_shape: BRAND.buttonShape,
        },
        customer_notes_enabled: false,
      },
    },
  });

  console.log("After branding:", JSON.stringify(updated.location_settings?.branding, null, 2));
  console.log("Tipping unchanged:", JSON.stringify(updated.location_settings?.tipping, null, 2));

  try {
    const merchant = await squareRequest("/v2/online-checkout/merchant-settings", {
      method: "PUT",
      body: {
        merchant_settings: {
          payment_methods: {
            apple_pay: { enabled: true },
            google_pay: { enabled: true },
            cash_app_pay: { enabled: true },
          },
        },
      },
    });
    console.log(
      "Payment methods:",
      JSON.stringify(merchant.merchant_settings?.payment_methods, null, 2),
    );
  } catch (err) {
    console.warn("Could not update merchant payment methods:", err.message || err);
  }

  const loc = await squareRequest(`/v2/locations/${locationId}`);
  console.log(`Business: ${loc.location?.business_name}`);
  console.log(`Logo: ${loc.location?.logo_url ? "set" : "missing — add in Square Dashboard → Locations"}`);
  console.log("Done. Open any Payment Link to preview.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
