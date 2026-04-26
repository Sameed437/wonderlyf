import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, ChevronLeft } from "lucide-react";
import { useWpPost } from "../hooks/useWpPosts";
import SEO from "../components/SEO";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch { return ""; }
};

export default function BlogPost() {
  const { slug } = useParams();
  const { post, loading, error } = useWpPost(slug);

  if (loading) {
    return (
      <div className="pt-28 pb-24 bg-cream min-h-screen text-center">
        <p className="text-warm-brown py-20">Loading post…</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-28 pb-24 bg-cream min-h-screen text-center">
        <h1 className="font-serif text-2xl text-warm-brown mb-4">Post Not Found</h1>
        <p className="text-warm-brown/80 mb-6">
          The article you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/blog" className="inline-flex items-center gap-2 bg-honey-dark text-white px-6 py-3 rounded-full font-bold no-underline text-sm">
          Back to Blog
        </Link>
      </div>
    );
  }

  const articleSchema = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      image: post.image ? [post.image] : undefined,
      datePublished: post.date,
      dateModified: post.modified,
      author: { "@type": "Person", name: post.author },
      publisher: {
        "@type": "Organization",
        name: "Wonderlyf",
        logo: { "@type": "ImageObject", url: "https://wonderlyf.com/wp-content/uploads/2026/01/Logo_Wonderlyf-1.png" },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": `https://wonderlyf.co.uk/blog/${post.slug}` },
      articleBody: post.contentHtml.replace(/<[^>]*>/g, "").slice(0, 500),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://wonderlyf.co.uk/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://wonderlyf.co.uk/blog" },
        { "@type": "ListItem", position: 3, name: post.title, item: `https://wonderlyf.co.uk/blog/${post.slug}` },
      ],
    },
  ];

  return (
    <div className="pt-24 md:pt-28 pb-16 md:pb-24 bg-cream min-h-screen">
      <SEO
        title={`${post.title} | Wonderlyf Blog`}
        description={post.excerpt.slice(0, 160)}
        canonical={`/blog/${post.slug}`}
        ogImage={post.image || undefined}
        ogType="article"
        structuredData={articleSchema}
      />

      <article className="max-w-3xl mx-auto px-4 md:px-8">
        <Link to="/blog" className="inline-flex items-center gap-1 text-warm-brown/70 text-sm mb-6 no-underline hover:text-honey">
          <ChevronLeft size={16} /> All articles
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          {post.categories.length > 0 && (
            <p className="text-honey text-xs tracking-[0.25em] uppercase font-medium mb-3">
              {post.categories[0]}
            </p>
          )}
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-warm-brown leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-5 text-warm-brown/70 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} /> {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User size={14} /> {post.author}
            </span>
          </div>
        </motion.header>

        {post.image && (
          <img
            src={post.image}
            alt={post.imageAlt || post.title}
            className="w-full h-auto max-h-[480px] object-cover rounded-2xl mb-8 md:mb-10 shadow-warm"
          />
        )}

        <div
          className="wp-content text-warm-brown text-base md:text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </div>
  );
}
