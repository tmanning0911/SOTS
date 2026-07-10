import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildShopCatalog,
  enrichShopProducts,
  SHOP_PRODUCTS,
} from "../js/shop-catalog.js";
import { fetchSquareShopCatalog } from "../netlify/functions/lib/square-catalog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outPath = path.join(root, "public", "data", "shop.json");

async function main() {
  let products = [];
  let source = "seed";

  if (process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_APPLICATION_ID) {
    try {
      const squareProducts = await fetchSquareShopCatalog();
      const enriched = enrichShopProducts(squareProducts);
      if (enriched.length) {
        products = enriched;
        source = "square";
      }
    } catch (err) {
      console.warn("Square catalog sync failed, using seed products:", err.message);
    }
  }

  if (!products.length) {
    products = SHOP_PRODUCTS;
    source = "seed";
  }

  const catalog = buildShopCatalog(products, source);
  await writeFile(outPath, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Wrote ${outPath} (${catalog.products.length} products, source: ${source})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
