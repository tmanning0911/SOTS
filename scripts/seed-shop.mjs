import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeSeedWithSquareProducts, buildShopCatalog, SHOP_PRODUCTS } from "../js/shop-catalog.js";
import { fetchSquareShopCatalog } from "../netlify/functions/lib/square-catalog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outPath = path.join(root, "public", "data", "shop.json");

async function main() {
  let catalog = buildShopCatalog(SHOP_PRODUCTS, "seed");

  if (process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_APPLICATION_ID) {
    try {
      const squareProducts = await fetchSquareShopCatalog();
      catalog = mergeSeedWithSquareProducts(squareProducts);
    } catch (err) {
      console.warn("Square catalog sync failed, using seed products:", err.message);
    }
  }

  await writeFile(outPath, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Wrote ${outPath} (${catalog.products.length} products, source: ${catalog.source})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
