import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchSquareShopCatalog } from "../netlify/functions/lib/square-catalog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outPath = path.join(root, "public", "data", "shop.json");

const DEFAULT_CATEGORIES = [
  { id: "apparel", label: "Apparel", description: "T-shirts and wearables." },
  { id: "gifts", label: "Gifts & Souvenirs", description: "Totes, pins, and keepsakes." },
  { id: "gift-certificates", label: "Gift Certificates", description: "Good toward any performance." },
  { id: "books", label: "Books & Playbills", description: "Programs and playbooks." },
];

const DEFAULT_PRODUCTS = [
  {
    id: "sots-tee-adult",
    itemId: "sots-tee",
    name: "SOS Logo T-Shirt",
    description: "Soft cotton tee with the Shakespeare on the Sound logo. Unisex fit.",
    category: "apparel",
    categoryLabel: "Apparel",
    price: { value: 2800, display: "$28.00", currency: "USD" },
    image: "/images/hero-much-ado.jpg",
    sku: "SOTS-TEE",
    onSale: true,
    options: [{ name: "Size", values: ["S", "M", "L", "XL"] }],
  },
  {
    id: "sots-tote",
    itemId: "sots-tote",
    name: "Canvas Tote Bag",
    description: "Sturdy tote for picnics at Pinkney Park — fits a blanket and a bottle of wine.",
    category: "gifts",
    categoryLabel: "Gifts & Souvenirs",
    price: { value: 2200, display: "$22.00", currency: "USD" },
    image: "/images/news/kids-kings.jpg",
    sku: "SOTS-TOTE",
    onSale: true,
  },
  {
    id: "sots-pin",
    itemId: "sots-pin",
    name: "Much Ado Enamel Pin",
    description: "Collectible pin from the 2026 production.",
    category: "gifts",
    categoryLabel: "Gifts & Souvenirs",
    price: { value: 1500, display: "$15.00", currency: "USD" },
    image: "/images/decor/shakespeare-portrait.png",
    sku: "SOTS-PIN",
    onSale: true,
  },
  {
    id: "sots-gift-50",
    itemId: "sots-gift-cert",
    name: "Gift Certificate — $50",
    description: "Redeemable for any Shakespeare on the Sound performance. Emailed after purchase.",
    category: "gift-certificates",
    categoryLabel: "Gift Certificates",
    price: { value: 5000, display: "$50.00", currency: "USD" },
    image: "/images/backgrounds/park-audience-nyt.jpg",
    sku: "GIFT-50",
    onSale: true,
    digital: true,
  },
  {
    id: "sots-gift-100",
    itemId: "sots-gift-cert",
    name: "Gift Certificate — $100",
    description: "Redeemable for any Shakespeare on the Sound performance. Emailed after purchase.",
    category: "gift-certificates",
    categoryLabel: "Gift Certificates",
    price: { value: 10000, display: "$100.00", currency: "USD" },
    image: "/images/backgrounds/park-audience-nyt.jpg",
    sku: "GIFT-100",
    onSale: true,
    digital: true,
  },
  {
    id: "sots-playbill",
    itemId: "sots-playbill",
    name: "Much Ado About Nothing Playbill",
    description: "Collectible program from the 2026 summer production.",
    category: "books",
    categoryLabel: "Books & Playbills",
    price: { value: 800, display: "$8.00", currency: "USD" },
    image: "/images/news/season-maan-banner.jpg",
    sku: "PLAYBILL-2026",
    onSale: true,
  },
];

const SHOP_DINE_PARTNERS = [
  {
    id: "ardens",
    name: "Arden's",
    location: "Rowayton, CT",
    description: "Picnic baskets specially prepared for SOS productions — order ahead for opening night.",
    href: "https://www.ardensct.com/",
    external: true,
  },
  {
    id: "rowayton-social",
    name: "Rowayton Social",
    location: "Rowayton, CT",
    description: "Neighborhood spot for a pre-show drink or late dinner after the curtain.",
    href: "https://www.rowaytonsocial.com/",
    external: true,
  },
  {
    id: "fat-cat",
    name: "Fat Cat Pie Co.",
    location: "Norwalk, CT",
    description: "Wood-fired pizza and salads — great for grabbing dinner before the show.",
    href: "https://www.fatcatpie.com/",
    external: true,
  },
];

function buildCatalog(products, source) {
  const categories = DEFAULT_CATEGORIES.filter((cat) =>
    products.some((p) => p.category === cat.id),
  );
  return {
    provider: "square",
    source,
    syncedAt: new Date().toISOString(),
    categories: categories.length ? categories : DEFAULT_CATEGORIES,
    products: products.filter((p) => p.onSale !== false),
    shopAndDine: SHOP_DINE_PARTNERS,
    fulfillment: {
      pickup: "Pick up at the Pinkney Park box office during performances (June–August).",
      shipping: "Select items ship within 5–7 business days. We'll email tracking when your order ships.",
      giftCertificates: "Gift certificates are emailed within one business day of purchase.",
    },
  };
}

async function main() {
  let products = [];
  let source = "seed";

  if (process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_APPLICATION_ID) {
    try {
      products = await fetchSquareShopCatalog();
      if (products.length) source = "square";
    } catch (err) {
      console.warn("Square catalog sync failed, using seed products:", err.message);
    }
  }

  if (!products.length) {
    products = DEFAULT_PRODUCTS;
    source = "seed";
  } else {
    const testProducts = products.filter((p) => p.name.startsWith("TEST —"));
    if (testProducts.length) {
      products = testProducts;
    }
  }

  const catalog = buildCatalog(products, source);
  await writeFile(outPath, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Wrote ${outPath} (${catalog.products.length} products, source: ${source})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
