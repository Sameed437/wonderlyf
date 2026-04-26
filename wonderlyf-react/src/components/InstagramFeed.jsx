import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

// Instagram glyph — inline SVG because the lucide-react version pinned in
// this project doesn't export an Instagram icon.
function Instagram({ size = 18, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
import { fetchInstagramPosts, IG_HANDLE, IG_PROFILE_URL } from "../lib/instagram";

export default function InstagramFeed({ limit = 4 }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchInstagramPosts({ limit })
      .then((p) => { if (!cancelled) setPosts(p); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [limit]);

  return (
    <div className="bg-white rounded-2xl border border-honey/10 shadow-warm p-5 md:p-6 h-full">
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976] flex items-center justify-center text-white">
            <Instagram size={18} />
          </span>
          <div>
            <p className="font-serif text-base md:text-lg font-bold text-warm-brown leading-tight">
              @{IG_HANDLE}
            </p>
            <p className="text-warm-brown/60 text-xs">From the gram</p>
          </div>
        </div>
        <a
          href={IG_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-honey-dark text-xs md:text-sm font-semibold no-underline hover:text-honey"
        >
          Follow <ExternalLink size={12} />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {(loading ? Array.from({ length: limit }) : posts).map((post, i) => (
          <motion.a
            key={post?.id || i}
            href={post?.permalink || IG_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="relative group block aspect-square rounded-lg overflow-hidden bg-honey/5 no-underline"
          >
            {post?.media_url ? (
              <>
                <img
                  src={post.media_url}
                  alt={post.caption?.slice(0, 80) || `Wonderlyf Instagram post`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warm-brown/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <Instagram size={14} className="text-white" />
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-honey/10 animate-pulse" />
            )}
          </motion.a>
        ))}
      </div>

      <a
        href={IG_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 md:mt-5 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#feda75] via-[#fa7e1e] to-[#d62976] text-white font-semibold py-2.5 rounded-full text-sm no-underline hover:opacity-90 transition-opacity"
      >
        <Instagram size={14} /> View on Instagram
      </a>
    </div>
  );
}
