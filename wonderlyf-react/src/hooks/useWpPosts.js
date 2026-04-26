import { useEffect, useState } from "react";
import { fetchPosts, fetchPostBySlug, isWpConfigured } from "../lib/wp";

export function useWpPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(isWpConfigured);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isWpConfigured) { setLoading(false); return; }
    let cancelled = false;
    fetchPosts({ perPage: 20 })
      .then((data) => { if (!cancelled) setPosts(data); })
      .catch((e) => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { posts, loading, error };
}

export function useWpPost(slug) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isWpConfigured || !slug) { setLoading(false); return; }
    let cancelled = false;
    fetchPostBySlug(slug)
      .then((data) => { if (!cancelled) setPost(data); })
      .catch((e) => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  return { post, loading, error };
}
