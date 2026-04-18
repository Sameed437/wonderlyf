import { useEffect, useState } from "react";
import {
  fetchProductsCached,
  fetchCategoriesCached,
  fetchProduct,
  fetchProductBySlug,
  fetchVariations,
  getCachedProducts,
  getCachedCategories,
  mapProduct,
  isWooConfigured,
} from "../lib/woo";

/** Fetch all products from WooCommerce and map to app shape. */
export function useWooProducts() {
  const cached = getCachedProducts();
  const [products, setProducts] = useState(() =>
    cached ? cached.map(mapProduct) : []
  );
  const [loading, setLoading] = useState(isWooConfigured && !cached);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isWooConfigured) { setLoading(false); return; }
    let cancelled = false;
    fetchProductsCached()
      .then((raw) => {
        if (cancelled) return;
        setProducts((raw || []).map(mapProduct));
      })
      .catch((e) => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { products, loading, error };
}

/** Fetch product categories from WooCommerce, prepending "All". */
export function useWooCategories() {
  const cached = getCachedCategories();
  const [categories, setCategories] = useState(() =>
    cached ? ["All", ...cached.map((c) => c.name)] : ["All"]
  );

  useEffect(() => {
    if (!isWooConfigured) return;
    let cancelled = false;
    fetchCategoriesCached()
      .then((cats) => {
        if (cancelled) return;
        setCategories(["All", ...(cats || []).map((c) => c.name)]);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return categories;
}

/** Fetch a single product (+ variations if it's a variable product). */
export function useWooProduct(idOrSlug) {
  const cached = getCachedProducts();
  const seeded = cached && idOrSlug
    ? cached.find((p) => String(p.id) === String(idOrSlug) || p.slug === idOrSlug)
    : null;
  const [product, setProduct] = useState(seeded ? mapProduct(seeded) : null);
  const [loading, setLoading] = useState(isWooConfigured && !seeded);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isWooConfigured || !idOrSlug) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const raw = /^\d+$/.test(String(idOrSlug))
          ? await fetchProduct(idOrSlug)
          : await fetchProductBySlug(idOrSlug);
        if (!raw || cancelled) return;
        const mapped = mapProduct(raw);
        if (mapped.productType === "variable") {
          mapped.variants = await fetchVariations(mapped.id);
        }
        if (!cancelled) setProduct(mapped);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [idOrSlug]);

  return { product, loading, error };
}
