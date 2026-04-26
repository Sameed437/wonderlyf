/**
 * WooCommerce client — combines the REST API (products, auth'd) and the
 * Store API (cart + checkout, guest-friendly with Cart-Token/Nonce).
 *
 * Configure via .env:
 *   VITE_WOO_URL=https://api.wonderlyf.co.uk
 *   VITE_WOO_KEY=ck_xxxxx
 *   VITE_WOO_SECRET=cs_xxxxx
 */

const RAW_BASE = import.meta.env.VITE_WOO_URL?.replace(/\/$/, "") || "";
const KEY = import.meta.env.VITE_WOO_KEY || "";
const SECRET = import.meta.env.VITE_WOO_SECRET || "";

// In dev (Vite), route through the proxy to bypass CORS. In prod, go direct.
const BASE = import.meta.env.DEV ? "" : RAW_BASE;

export const isWooConfigured = Boolean(RAW_BASE);

// ── REST API v3 (Basic auth — products, categories) ───────────────────────
const authHeader = KEY && SECRET ? `Basic ${btoa(`${KEY}:${SECRET}`)}` : null;

export async function wooFetch(path, params = {}) {
  if (!isWooConfigured) throw new Error("VITE_WOO_URL not configured");
  const url = new URL(`${BASE}/wp-json/wc/v3${path}`, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== "") url.searchParams.set(k, String(v));
  });
  const res = await fetch(url.toString(), {
    headers: authHeader ? { Authorization: authHeader } : {},
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Woo REST ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

// ── Store API (cart, checkout — Cart-Token + Nonce) ───────────────────────
const CART_TOKEN_KEY = "wonderlyf-woo-cart-token";
const NONCE_KEY = "wonderlyf-woo-nonce";

const getToken = () => {
  try { return localStorage.getItem(CART_TOKEN_KEY) || ""; } catch { return ""; }
};
const setToken = (t) => {
  try { if (t) localStorage.setItem(CART_TOKEN_KEY, t); } catch {}
};
const getNonce = () => {
  try { return localStorage.getItem(NONCE_KEY) || ""; } catch { return ""; }
};
const setNonce = (n) => {
  try { if (n) localStorage.setItem(NONCE_KEY, n); } catch {}
};

export function resetCartSession() {
  try {
    localStorage.removeItem(CART_TOKEN_KEY);
    localStorage.removeItem(NONCE_KEY);
  } catch {}
}

export async function storeFetch(path, { method = "GET", body } = {}) {
  if (!isWooConfigured) throw new Error("VITE_WOO_URL not configured");
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  const nonce = getNonce();
  if (token) headers["Cart-Token"] = token;
  if (nonce) headers["Nonce"] = nonce;

  const res = await fetch(`${BASE}/wp-json/wc/store/v1${path}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  // Persist session headers returned by the Store API
  setToken(res.headers.get("Cart-Token"));
  setNonce(res.headers.get("Nonce"));

  if (!res.ok) {
    let msg = `Woo Store ${res.status}`;
    try {
      const data = await res.json();
      msg = data.message || msg;
    } catch {
      try { msg = await res.text(); } catch {}
    }
    throw new Error(msg);
  }

  // DELETE /cart/items returns 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

// ── Product queries ───────────────────────────────────────────────────────
// Only request the fields mapProduct/mapCategory actually read — keeps the
// payload small and the response fast.
const PRODUCT_FIELDS =
  "id,name,slug,type,price,regular_price,on_sale,stock_status,weight," +
  "average_rating,rating_count,short_description,description," +
  "images,categories,variations,meta_data";
const CATEGORY_FIELDS = "id,name,slug";

export const fetchProducts = (opts = {}) =>
  wooFetch("/products", {
    per_page: 100,
    status: "publish",
    _fields: PRODUCT_FIELDS,
    ...opts,
  });

export const fetchProduct = (id) =>
  wooFetch(`/products/${id}`, { _fields: PRODUCT_FIELDS });

export const fetchProductBySlug = (slug) =>
  wooFetch("/products", { slug, per_page: 1, _fields: PRODUCT_FIELDS }).then((arr) => arr[0]);

export const fetchCategories = () =>
  wooFetch("/products/categories", {
    per_page: 100,
    hide_empty: true,
    _fields: CATEGORY_FIELDS,
  });

// ── In-memory + localStorage cache (5 min TTL) ───────────────────────────
const CACHE_TTL_MS = 5 * 60 * 1000;
const PRODUCTS_CACHE_KEY = "wonderlyf-woo-products-v1";
const CATEGORIES_CACHE_KEY = "wonderlyf-woo-categories-v1";

let productsMem = null;
let productsInFlight = null;
let categoriesMem = null;
let categoriesInFlight = null;

const readLocal = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return data;
  } catch { return null; }
};
const writeLocal = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch {}
};

export function getCachedProducts() {
  if (productsMem) return productsMem;
  const local = readLocal(PRODUCTS_CACHE_KEY);
  if (local) { productsMem = local; return local; }
  return null;
}

export function fetchProductsCached() {
  if (productsMem) return Promise.resolve(productsMem);
  if (productsInFlight) return productsInFlight;
  productsInFlight = fetchProducts()
    .then((data) => { productsMem = data; writeLocal(PRODUCTS_CACHE_KEY, data); return data; })
    .finally(() => { productsInFlight = null; });
  return productsInFlight;
}

export function getCachedCategories() {
  if (categoriesMem) return categoriesMem;
  const local = readLocal(CATEGORIES_CACHE_KEY);
  if (local) { categoriesMem = local; return local; }
  return null;
}

export function fetchCategoriesCached() {
  if (categoriesMem) return Promise.resolve(categoriesMem);
  if (categoriesInFlight) return categoriesInFlight;
  categoriesInFlight = fetchCategories()
    .then((data) => { categoriesMem = data; writeLocal(CATEGORIES_CACHE_KEY, data); return data; })
    .finally(() => { categoriesInFlight = null; });
  return categoriesInFlight;
}

// ── Cart mutations (Store API) ────────────────────────────────────────────
export const getCart = () => storeFetch("/cart");

export const addToCart = (id, quantity = 1, variation = []) =>
  storeFetch("/cart/add-item", {
    method: "POST",
    body: { id: Number(id), quantity, variation },
  });

export const updateCartItem = (key, quantity) =>
  storeFetch("/cart/update-item", { method: "POST", body: { key, quantity } });

export const removeCartItem = (key) =>
  storeFetch("/cart/remove-item", { method: "POST", body: { key } });

export const clearWooCart = () =>
  storeFetch("/cart/items", { method: "DELETE" });

export const applyCoupon = (code) =>
  storeFetch("/cart/apply-coupon", { method: "POST", body: { code } });

// ── Checkout ──────────────────────────────────────────────────────────────
export const placeOrder = (payload) =>
  storeFetch("/checkout", { method: "POST", body: payload });

export const fetchOrder = (id, key, email = "") => {
  const params = new URLSearchParams({ key });
  if (email) params.set("billing_email", email);
  return storeFetch(`/order/${id}?${params.toString()}`);
};

// ── Schema mappers: Woo → app product shape ──────────────────────────────
const stripHtml = (html) =>
  (html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

const metaToObject = (meta_data = []) => {
  const out = {};
  meta_data.forEach((m) => { out[m.key] = m.value; });
  return out;
};

/** REST API product → app shape */
export function mapProduct(p) {
  const meta = metaToObject(p.meta_data);
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.categories?.[0]?.name || "",
    price: Number(p.price) || 0,
    originalPrice: Number(p.regular_price || p.price) || 0,
    image: p.images?.[0]?.src || "",
    images: (p.images || []).map((img) => img.src).filter(Boolean),
    description: stripHtml(p.short_description),
    longDescription: stripHtml(p.description),
    rating: Number(p.average_rating) || 0,
    reviews: Number(p.rating_count) || 0,
    weight: p.weight ? `${p.weight}g` : "",
    badge: p.on_sale ? "Sale" : meta.badge || "",
    benefits: Array.isArray(meta.benefits) ? meta.benefits : [],
    variants: (p.variations || []).length > 0
      ? [] // populated via fetchVariations() when viewing detail
      : p.weight
        ? [{ weight: `${p.weight}g`, price: Number(p.price) || 0 }]
        : [],
    inStock: p.stock_status === "instock",
    productType: p.type, // 'simple' | 'variable' | ...
    wooId: p.id,
  };
}

/** Fetch & map variations for a variable product */
export async function fetchVariations(productId) {
  const vars = await wooFetch(`/products/${productId}/variations`, { per_page: 50 });
  return vars.map((v) => {
    const weight = v.attributes?.find((a) => a.name?.toLowerCase() === "weight")?.option;
    return {
      id: v.id,
      weight: weight || (v.weight ? `${v.weight}g` : ""),
      price: Number(v.price) || 0,
      inStock: v.stock_status === "instock",
      attributes: v.attributes || [],
    };
  });
}
