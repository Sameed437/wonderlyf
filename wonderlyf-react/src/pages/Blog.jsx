import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import { useWpPosts } from "../hooks/useWpPosts";
import SEO from "../components/SEO";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch { return ""; }
};

export default function Blog() {
  const { posts, loading, error } = useWpPosts();

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Wonderlyf Blog",
    url: "https://wonderlyf.co.uk/blog",
    description:
      "Recipes, traditions, and wellness wisdom from the makers of Wonderlyf — pure honey, herbal remedies, and handcrafted Indian food.",
    blogPost: posts.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://wonderlyf.co.uk/blog/${p.slug}`,
      datePublished: p.date,
      dateModified: p.modified,
      author: { "@type": "Person", name: p.author },
      image: p.image || undefined,
    })),
  };

  return (
    <div className="pt-24 md:pt-28 pb-16 md:pb-24 bg-cream min-h-screen">
      <SEO
        title="Blog | Wonderlyf UK — Recipes, Traditions & Wellness"
        description="Recipes, traditions, and wellness wisdom from the makers of Wonderlyf — pure honey, herbal remedies, and handcrafted Indian food, delivered across the UK."
        canonical="/blog"
        structuredData={blogSchema}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-honey text-xs md:text-sm tracking-[0.3em] uppercase font-medium mb-3">
            Wonderlyf Journal
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-warm-brown mb-4">
            Stories from the Kitchen
          </h1>
          <p className="text-warm-brown/80 text-base md:text-lg max-w-2xl mx-auto">
            Recipes, traditions, and the wisdom behind every Wonderlyf product.
          </p>
        </motion.header>

        {loading && (
          <p className="text-center text-warm-brown py-20">Loading posts…</p>
        )}

        {error && (
          <p className="text-center text-red-600 py-20">
            Couldn't load posts right now. Please try again later.
          </p>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-warm-brown py-20">
            No blog posts yet. Check back soon!
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden border border-honey/10 shadow-warm hover:shadow-warm-lg transition-shadow"
            >
              <Link to={`/blog/${post.slug}`} className="no-underline block">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    className="w-full h-48 md:h-56 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 md:h-56 bg-honey/10 flex items-center justify-center">
                    <span className="text-honey/40 text-4xl font-serif">W</span>
                  </div>
                )}

                <div className="p-5 md:p-6">
                  {post.categories.length > 0 && (
                    <p className="text-honey text-xs tracking-wider uppercase font-medium mb-2">
                      {post.categories[0]}
                    </p>
                  )}
                  <h2 className="font-serif text-lg md:text-xl font-bold text-warm-brown mb-3 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-warm-brown/80 text-sm md:text-base leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-warm-brown/70 text-xs md:text-sm mb-4">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(post.date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User size={12} /> {post.author}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-honey-dark font-semibold text-sm">
                    Read more <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
