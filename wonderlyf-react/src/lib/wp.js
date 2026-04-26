/**
 * WordPress posts client (separate from the WooCommerce REST client).
 * Hits the public /wp/v2 endpoints — no auth needed for published posts.
 *
 * Uses the same VITE_WOO_URL base; in dev requests go through the Vite
 * proxy, in prod they hit WordPress directly (CORS is whitelisted in the
 * site's PHP snippet).
 */

const RAW_BASE = import.meta.env.VITE_WOO_URL?.replace(/\/$/, "") || "";
const BASE = import.meta.env.DEV ? "" : RAW_BASE;
export const isWpConfigured = Boolean(RAW_BASE);

async function wpFetch(path, params = {}) {
  if (!isWpConfigured) throw new Error("VITE_WOO_URL not configured");
  const url = new URL(`${BASE}/wp-json/wp/v2${path}`, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== "") url.searchParams.set(k, String(v));
  });
  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WP ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

// Strip HTML tags + decode common entities for short text contexts.
const stripHtml = (html = "") =>
  String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/&hellip;/g, "…")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();

function mapPost(p) {
  const featured = p._embedded?.["wp:featuredmedia"]?.[0];
  const author = p._embedded?.author?.[0];
  return {
    id: p.id,
    slug: p.slug,
    title: stripHtml(p.title?.rendered),
    titleHtml: p.title?.rendered || "",
    excerpt: stripHtml(p.excerpt?.rendered),
    contentHtml: p.content?.rendered || "",
    date: p.date,
    modified: p.modified,
    author: author?.name || "Wonderlyf",
    image: featured?.source_url || featured?.media_details?.sizes?.large?.source_url || null,
    imageAlt: featured?.alt_text || "",
    categories: (p._embedded?.["wp:term"]?.[0] || []).map((t) => t.name),
  };
}

const POSTS_CACHE_KEY = "wonderlyf-wp-posts-cache";
const POSTS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached() {
  try {
    const raw = localStorage.getItem(POSTS_CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > POSTS_CACHE_TTL) return null;
    return data;
  } catch { return null; }
}
function setCached(data) {
  try { localStorage.setItem(POSTS_CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch {}
}

export async function fetchPosts({ perPage = 20 } = {}) {
  const cached = getCached();
  if (cached) return cached;
  const raw = await wpFetch("/posts", { per_page: perPage, _embed: 1 });
  const mapped = raw.map(mapPost);
  setCached(mapped);
  return mapped;
}

export async function fetchPostBySlug(slug) {
  const list = await wpFetch("/posts", { slug, _embed: 1 });
  return list[0] ? mapPost(list[0]) : null;
}
