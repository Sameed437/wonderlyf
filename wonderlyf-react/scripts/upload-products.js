/**
 * Bulk-upload static products from src/data/products.js into WooCommerce.
 *
 * Usage:
 *   node scripts/upload-products.js
 *
 * Requires .env with:
 *   VITE_WOO_URL=https://api.wonderlyf.co.uk
 *   VITE_WOO_KEY=ck_...         (Read/Write!)
 *   VITE_WOO_SECRET=cs_...
 *
 * What it does:
 *   1. Loads categories from products.js → creates any missing Woo categories
 *   2. For each product: creates it as a VARIABLE product with:
 *      - featured image (if image URL is absolute; skipped if relative)
 *      - short_description + description
 *      - regular_price, sale_price, weight
 *      - "Weight" attribute with variants
 *      - meta_data { benefits: [...], badge: "..." }
 *   3. Creates variations (one per weight/price combo)
 *   4. Skips products with the same SKU/slug that already exist (idempotent)
 */

import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// ── Load .env manually (no dotenv dep) ────────────────────────────────────
async function loadEnv() {
  const envPath = path.resolve(__dirname, "..", ".env");
  const text = await readFile(envPath, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
await loadEnv();

const BASE = (process.env.VITE_WOO_URL || "").replace(/\/$/, "");
const KEY = process.env.VITE_WOO_KEY || "";
const SECRET = process.env.VITE_WOO_SECRET || "";

if (!BASE || !KEY || !SECRET) {
  console.error("✗ Missing env vars. Need VITE_WOO_URL, VITE_WOO_KEY, VITE_WOO_SECRET in .env");
  process.exit(1);
}

const AUTH = "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64");

async function woo(path, { method = "GET", body, params } = {}) {
  const url = new URL(`${BASE}/wp-json/wc/v3${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null) url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString(), {
    method,
    headers: { Authorization: AUTH, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${typeof data === "string" ? data.slice(0, 300) : JSON.stringify(data).slice(0, 300)}`);
  }
  return data;
}

// ── Load products.js (it's ESM) ───────────────────────────────────────────
const productsModule = await import(
  "file:///" + path.resolve(__dirname, "..", "src", "data", "products.js").replace(/\\/g, "/")
);
const { products, categories } = productsModule;

console.log(`Loaded ${products.length} products across ${categories.length} categories.`);

// ── Step 1: ensure categories exist ──────────────────────────────────────
console.log("\n→ Syncing categories...");
const existingCats = await woo("/products/categories", { params: { per_page: 100 } });
const catByName = new Map(existingCats.map((c) => [c.name, c]));

const catSlugs = categories.filter((c) => c !== "All");
for (const name of catSlugs) {
  if (catByName.has(name)) {
    console.log(`  ✓ ${name} (id ${catByName.get(name).id})`);
    continue;
  }
  try {
    const created = await woo("/products/categories", {
      method: "POST",
      body: { name },
    });
    catByName.set(name, created);
    console.log(`  + ${name} (id ${created.id}) created`);
  } catch (e) {
    console.log(`  ✗ ${name} — ${e.message}`);
  }
}

// ── Step 2: check existing products (idempotency) ────────────────────────
console.log("\n→ Checking existing products...");
const existing = await woo("/products", { params: { per_page: 100, status: "any" } });
const existingBySlug = new Map(existing.map((p) => [p.slug, p]));
console.log(`  Found ${existing.length} existing products in Woo.`);

// ── Step 3: upload each product ──────────────────────────────────────────
const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const isAbsoluteUrl = (u) => /^https?:\/\//i.test(u);

const results = { created: 0, skipped: 0, failed: 0 };

console.log("\n→ Uploading products...\n");

for (const p of products) {
  const slug = slugify(p.name);

  if (existingBySlug.has(slug)) {
    console.log(`  ↷ skip: "${p.name}" (already exists, id ${existingBySlug.get(slug).id})`);
    results.skipped++;
    continue;
  }

  const cat = catByName.get(p.category);
  if (!cat) {
    console.log(`  ✗ "${p.name}" — category "${p.category}" not found`);
    results.failed++;
    continue;
  }

  const isVariable = Array.isArray(p.variants) && p.variants.length > 1;
  const weights = p.variants?.map((v) => v.weight) || [p.weight];

  const body = {
    name: p.name,
    slug,
    type: isVariable ? "variable" : "simple",
    status: "publish",
    description: p.longDescription || p.description || "",
    short_description: p.description || "",
    categories: [{ id: cat.id }],
    meta_data: [
      { key: "benefits", value: p.benefits || [] },
      { key: "badge", value: p.badge || "" },
      { key: "app_product_id", value: p.id },
    ],
  };

  if (isAbsoluteUrl(p.image)) {
    body.images = [{ src: p.image, alt: p.name }];
  }

  if (isVariable) {
    body.attributes = [
      {
        name: "Weight",
        slug: "pa_weight",
        visible: true,
        variation: true,
        options: weights,
      },
    ];
  } else {
    body.regular_price = String(p.originalPrice || p.price);
    body.sale_price = p.originalPrice > p.price ? String(p.price) : "";
    if (p.weight) body.weight = String(p.weight).replace(/[^\d.]/g, "");
  }

  try {
    const created = await woo("/products", { method: "POST", body });
    console.log(`  + "${p.name}" → id ${created.id}${isVariable ? ` (variable)` : ""}`);

    if (isVariable) {
      // Create variations
      for (const variant of p.variants) {
        try {
          await woo(`/products/${created.id}/variations`, {
            method: "POST",
            body: {
              regular_price: String(p.originalPrice >= variant.price ? Math.round(variant.price * (p.originalPrice / p.price)) : variant.price),
              sale_price: String(variant.price),
              attributes: [{ name: "Weight", option: variant.weight }],
              status: "publish",
            },
          });
          console.log(`       └ ${variant.weight}: £${variant.price}`);
        } catch (e) {
          console.log(`       └ ✗ variant ${variant.weight} — ${e.message}`);
        }
      }
    }

    results.created++;
  } catch (e) {
    console.log(`  ✗ "${p.name}" — ${e.message}`);
    results.failed++;
  }
}

console.log("\n─────────────────────────────");
console.log(`✓ Created: ${results.created}`);
console.log(`↷ Skipped: ${results.skipped}`);
console.log(`✗ Failed:  ${results.failed}`);
console.log("─────────────────────────────\n");

if (products.some((p) => !isAbsoluteUrl(p.image))) {
  console.log("ℹ Note: product images with relative paths (/products/*.png) were not uploaded.");
  console.log("  Host those images publicly (e.g. on wonderlyf.co.uk) then re-run, or add them");
  console.log("  manually in WP Admin → Products → [product] → Product image.\n");
}
