export const SHOP_CATEGORIES = [
  { id: "apparel", label: "Apparel", description: "T-shirts and wearables." },
  { id: "gifts", label: "Gifts & Souvenirs", description: "Totes, pins, and keepsakes." },
  { id: "gift-certificates", label: "Gift Certificates", description: "Good toward any performance." },
  { id: "books", label: "Books & Playbills", description: "Programs and playbooks." },
];

export const SHOP_PRODUCTS = [
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
    description: "Collectible enamel pin from the 2026 summer production.",
    category: "gifts",
    categoryLabel: "Gifts & Souvenirs",
    price: { value: 1500, display: "$15.00", currency: "USD" },
    image: "/images/decor/shakespeare-portrait.png",
    sku: "SOTS-PIN",
    onSale: true,
  },
  {
    id: "sots-gift-50",
    itemId: "sots-gift-cert-50",
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
    itemId: "sots-gift-cert-100",
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

export const SHOP_DINE_PARTNERS = [
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

export const SHOP_FULFILLMENT = {
  pickup: "Pick up at the Pinkney Park box office during performances (June–August).",
  shipping: "Select items ship within 5–7 business days. We'll email tracking when your order ships.",
  giftCertificates: "Gift certificates are emailed within one business day of purchase.",
};

const CATEGORY_BY_LABEL = Object.fromEntries(SHOP_CATEGORIES.map((cat) => [cat.label, cat]));

const CATEGORY_SLUG_ALIASES = {
  "gifts-souvenirs": "gifts",
  "books-playbills": "books",
  "gift-certificates": "gift-certificates",
  apparel: "apparel",
  gifts: "gifts",
  books: "books",
};

export function isTestShopProduct(product) {
  if (!product) return true;
  const name = String(product.name ?? "");
  const sku = String(product.sku ?? "");
  return name.startsWith("TEST —") || name.startsWith("TEST -") || sku.startsWith("TEST-");
}

export function filterLiveShopProducts(products = []) {
  return products.filter((product) => !isTestShopProduct(product) && product.onSale !== false);
}

export const KNOWN_SHOP_SKUS = new Set(SHOP_PRODUCTS.map((product) => product.sku).filter(Boolean));

export function isKnownShopSku(sku) {
  return Boolean(sku && KNOWN_SHOP_SKUS.has(sku));
}

export function mergeSeedWithSquareProducts(squareProducts = []) {
  const squareBySku = new Map();
  for (const product of squareProducts) {
    if (!isKnownShopSku(product?.sku)) continue;
    squareBySku.set(product.sku, product);
  }

  const merged = SHOP_PRODUCTS.map((seed) => {
    const square = squareBySku.get(seed.sku);
    if (!square) return { ...seed };

    return {
      ...seed,
      id: square.id ?? seed.id,
      itemId: square.itemId ?? seed.itemId,
      price: square.price ?? seed.price,
      image: square.image || seed.image,
      onSale: square.onSale !== false,
    };
  });

  return buildShopCatalog(merged, squareBySku.size ? "square" : "seed");
}

export function resolveShopCatalog(data) {
  if (!data?.products?.length) {
    return buildShopCatalog(SHOP_PRODUCTS, "seed");
  }

  const knownProducts = data.products.filter((product) => isKnownShopSku(product.sku));
  if (knownProducts.length) {
    return mergeSeedWithSquareProducts(data.products);
  }

  return buildShopCatalog(SHOP_PRODUCTS, "seed");
}

export function canonicalCategoryId(slug) {
  const normalized = String(slug ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return CATEGORY_SLUG_ALIASES[normalized] ?? normalized;
}

export function categoryMetaForSlug(slug) {
  const id = canonicalCategoryId(slug);
  const cat = SHOP_CATEGORIES.find((entry) => entry.id === id);
  return cat ?? { id, label: id };
}

export function buildShopCatalog(products, source) {
  const liveProducts = filterLiveShopProducts(products);
  const categories = SHOP_CATEGORIES.filter((cat) => liveProducts.some((p) => p.category === cat.id));
  return {
    provider: "square",
    source,
    syncedAt: new Date().toISOString(),
    categories: categories.length ? categories : SHOP_CATEGORIES,
    products: liveProducts,
    shopAndDine: SHOP_DINE_PARTNERS,
    fulfillment: SHOP_FULFILLMENT,
  };
}

export function enrichShopProducts(products = [], seedProducts = SHOP_PRODUCTS) {
  const seedBySku = new Map(seedProducts.filter((p) => p.sku).map((p) => [p.sku, p]));
  return filterLiveShopProducts(products).map((product) => {
    const seed = seedBySku.get(product.sku);
    const category = seed?.category ?? canonicalCategoryId(product.category);
    const categoryLabel = seed?.categoryLabel ?? categoryMetaForSlug(product.category).label;
    return {
      ...product,
      category,
      categoryLabel,
      image: product.image || seed?.image || null,
      options: seed?.options,
      digital: seed?.digital ?? product.digital,
      description: product.description || seed?.description || "",
    };
  });
}

export function seedProductsForSquare() {
  return SHOP_PRODUCTS.map((product) => ({
    tempId: `#shop-${product.sku.toLowerCase()}`,
    categoryLabel: product.categoryLabel,
    name: product.name,
    description: product.description,
    sku: product.sku,
    priceCents: product.price.value,
    image: product.image,
    digital: Boolean(product.digital),
  }));
}
