/**
 * Instagram media client.
 *
 * Two ways to get posts, in order of preference:
 *
 *  1. Instagram Basic Display API — set VITE_INSTAGRAM_TOKEN in .env to a
 *     long-lived access token (60-day expiry; refresh via the IG Graph API).
 *     Endpoint: https://graph.instagram.com/me/media
 *     Docs: https://developers.facebook.com/docs/instagram-basic-display-api
 *
 *  2. Curated fallback — when no token is set, render a small hardcoded set
 *     of post permalinks/images. This keeps the section visible during dev
 *     and on first deploy before the token is wired up.
 */

const TOKEN = import.meta.env.VITE_INSTAGRAM_TOKEN || "";
export const IG_HANDLE = import.meta.env.VITE_INSTAGRAM_HANDLE || "wonderlyf";
export const IG_PROFILE_URL = `https://www.instagram.com/${IG_HANDLE}/`;

const CACHE_KEY = "wonderlyf-ig-cache";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes — IG rate limits are tight

const FALLBACK_POSTS = [
  // Curated placeholders — replace caption / permalink as needed, or just
  // leave these in until the access token is configured.
  {
    id: "fb1",
    media_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
    permalink: IG_PROFILE_URL,
    caption: "Pure forest honey, straight from Tamil Nadu",
    media_type: "IMAGE",
  },
  {
    id: "fb2",
    media_url: "https://images.unsplash.com/photo-1600620559207-9bf04b9669bb?w=600&q=80",
    permalink: IG_PROFILE_URL,
    caption: "Handcrafted with love",
    media_type: "IMAGE",
  },
  {
    id: "fb3",
    media_url: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&q=80",
    permalink: IG_PROFILE_URL,
    caption: "From our kitchen to yours",
    media_type: "IMAGE",
  },
  {
    id: "fb4",
    media_url: "https://images.unsplash.com/photo-1587049016823-c90100ce4be1?w=600&q=80",
    permalink: IG_PROFILE_URL,
    caption: "Traditional recipes, modern wellness",
    media_type: "IMAGE",
  },
];

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch { return null; }
}
function setCached(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch {}
}

export async function fetchInstagramPosts({ limit = 6 } = {}) {
  if (!TOKEN) return FALLBACK_POSTS.slice(0, limit);
  const cached = getCached();
  if (cached) return cached.slice(0, limit);
  try {
    const url = new URL("https://graph.instagram.com/me/media");
    url.searchParams.set("fields", "id,caption,media_url,permalink,thumbnail_url,media_type,timestamp");
    url.searchParams.set("access_token", TOKEN);
    url.searchParams.set("limit", String(limit));
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`IG ${res.status}`);
    const json = await res.json();
    const posts = (json.data || []).map((p) => ({
      id: p.id,
      // VIDEO posts: media_url points to the video; thumbnail_url is the poster image.
      media_url: p.media_type === "VIDEO" ? (p.thumbnail_url || p.media_url) : p.media_url,
      permalink: p.permalink,
      caption: p.caption || "",
      media_type: p.media_type,
      timestamp: p.timestamp,
    }));
    setCached(posts);
    return posts.slice(0, limit);
  } catch {
    return FALLBACK_POSTS.slice(0, limit);
  }
}
