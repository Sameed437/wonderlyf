import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ChevronRight } from "lucide-react";
import SEO from "../components/SEO";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";
import AnimatedCounter from "../components/animations/AnimatedCounter";
import StaggeredReveal from "../components/animations/StaggeredReveal";
import Marquee from "../components/animations/Marquee";
import HeroVideo from "../components/animations/HeroVideo";
import FloatingElements from "../components/animations/FloatingElements";
import InstagramFeed from "../components/InstagramFeed";

// Below-the-fold — code-split to keep the hero bundle small.
const HoneyProcess     = lazy(() => import("../components/animations/HoneyProcess"));
const CategoryCarousel = lazy(() => import("../components/animations/CategoryCarousel"));
const WhyChooseUs      = lazy(() => import("../components/animations/WhyChooseUs"));
const ProductJourney   = lazy(() => import("../components/animations/ProductJourney"));
const ProductShowcase  = lazy(() => import("../components/animations/ProductShowcase"));

const Fallback = <div className="min-h-[200px]" />;
import {
  testimonials,
  stats,
  marqueeItems,
  categoryImages,
  whyChooseUs,
} from "../data/products";
import { useWooProducts } from "../hooks/useWooProducts";

export default function Home() {
  const { products } = useWooProducts();

  // Prefer products explicitly marked "featured" in Woo; otherwise show the
  // first 6 available. Previously this filtered by hardcoded names that don't
  // exist in this store, so the section was empty.
  const featuredProducts = (
    products.filter((p) => p.badge === "Featured" || p.featured).slice(0, 4).length
      ? products.filter((p) => p.badge === "Featured" || p.featured).slice(0, 4)
      : products.slice(0, 4)
  );

  const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Wonderlyf",
      url: "https://wonderlyf.co.uk",
      logo: "https://wonderlyf.com/wp-content/uploads/2025/12/wonderlyf-logo.png",
      description: "Authentic Indian wellness products handcrafted in Tamil Nadu, delivered across the UK.",
      areaServed: { "@type": "Country", name: "United Kingdom" },
      contactPoint: { "@type": "ContactPoint", contactType: "customer service", availableLanguage: ["English"] },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Wonderlyf UK",
      url: "https://wonderlyf.co.uk",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://wonderlyf.co.uk/shop?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <>
      <SEO
        title="Traditional Indian Wellness Products | Free UK Delivery"
        description="Shop authentic Indian wellness products in the UK. Pure forest honey, moringa honey, traditional herbal food, laddoos, and Ayurvedic remedies. Handcrafted in Tamil Nadu. Free delivery over £30."
        keywords="Indian wellness products UK, forest honey UK, moringa honey, traditional Indian food UK, herbal remedies UK, natural products, Ayurvedic food, Tamil Nadu food, buy honey online UK, Indian sweets UK"
        canonical="/"
        structuredData={homeSchema}
      />

      {/* ─── MARQUEE ─── */}
      <div className="pt-12 md:pt-14">
        <Marquee items={marqueeItems} />
      </div>

      {/* ─── HERO (Split layout: centered logo + right-side video & text) ─── */}
      {/* bg-cream gives the browser a valid LCP candidate instantly,
          so the metric isn't pinned to the video's canplay event. */}
      <section className="relative min-h-[calc(100vh-100px)] md:min-h-[calc(100vh-110px)] flex items-center overflow-hidden bg-cream">
        <HeroVideo />
        <FloatingElements />

        {/* Centered brand logo — sits on top of the video panel, anchored to
            the absolute middle of the hero. Hidden on mobile (the video stack
            already dominates that layout). */}
        <div className="hidden md:flex absolute inset-0 z-10 items-center justify-center pointer-events-none">
          <img
            src="https://wonderlyf.com/wp-content/uploads/2026/01/Logo_Wonderlyf-1.png"
            alt="Wonderlyf"
            className="w-40 lg:w-56 h-auto drop-shadow-2xl"
            width="224"
            height="80"
            fetchPriority="high"
          />
        </div>

        {/* Hero content — left-aligned on the cream half so the headline
            sits opposite the right-side video. The h1 is the LCP element so
            no framer-motion wrappers around it. */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 hero-intro">
          <div className="md:mr-auto md:w-2/5 md:pr-4 lg:pr-8 text-center md:text-left">
            {/* Mobile: text sits on the video → use white + drop-shadow.
                Desktop (md+): text sits on the cream half → switch to dark. */}
            <p className="text-honey-light md:text-honey-dark text-xs md:text-sm tracking-widest uppercase mb-3 md:mb-4 font-medium drop-shadow md:drop-shadow-none">
              Crafting Authentic, Nutritious Food
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] mb-3 md:mb-4 text-white md:text-warm-brown drop-shadow-lg md:drop-shadow-none">
              Bringing Wonders
              <br />
              <span className="text-honey-light md:text-honey-dark">to your Life</span>
            </h1>
            <p className="text-white/90 md:text-warm-brown/80 text-sm md:text-base leading-relaxed mb-5 md:mb-6 md:mr-auto max-w-md drop-shadow md:drop-shadow-none">
              Traditional wellness products rooted in ancient wisdom. Pure. Natural. Homemade.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-3 justify-center md:justify-start">
              <Link to="/shop" className="inline-flex items-center gap-2 bg-honey-dark text-white px-6 md:px-8 py-3 md:py-3 rounded-full font-bold text-sm md:text-base hover:bg-honey-light hover:text-warm-brown transition-all duration-300 no-underline shadow-warm-lg cta-pulse">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 bg-white/15 md:bg-white backdrop-blur-sm border border-white/30 md:border-honey/30 text-white md:text-warm-brown px-6 md:px-8 py-3 md:py-3 rounded-full font-semibold text-sm md:text-base hover:bg-white/25 md:hover:bg-honey-light/30 transition-all duration-300 no-underline">
                Our Story <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <motion.div className="w-1.5 h-3 bg-honey rounded-full" animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>

      {/* ─── STATS ─── */}
      <section className="relative py-12 border-y border-honey/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <AnimatedCounter value={stat.value} className="text-2xl md:text-3xl font-bold honey-text" />
              <div className="text-warm-light text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-12 md:py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading subtitle="Browse Categories" title="Explore Our Range" description="From healing bowls to grandma's crunchy treats, discover wellness in every category." />
          <Suspense fallback={Fallback}><CategoryCarousel categories={categoryImages} /></Suspense>
        </div>
      </section>

      {/* ─── PRODUCT SHOWCASE ─── */}
      <section className="border-y border-honey/10 bg-white">
        <Suspense fallback={Fallback}><ProductShowcase /></Suspense>
      </section>

      {/* ─── FEATURED PRODUCTS + INSTAGRAM ─── */}
      <section className="py-12 md:py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading subtitle="Featured Products" title="Crafted With Care" description="Our most loved products, handpicked from across our collection." />

          {/* Two-column layout: Instagram feed (left) + product grid (right).
              On mobile, Instagram drops below the products. */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            {/* Instagram — left column */}
            <div className="lg:col-span-4 order-2 lg:order-1 lg:sticky lg:top-28">
              <InstagramFeed limit={4} />
            </div>

            {/* Featured products — right column */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <StaggeredReveal className="grid grid-cols-2 gap-4 md:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </StaggeredReveal>
            </div>
          </div>

          <div className="text-center mt-8 md:mt-10">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-white border border-honey/20 text-honey-dark px-8 py-3 rounded-full font-semibold hover:shadow-warm-hover transition-all no-underline shadow-warm">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOREST HONEY JOURNEY ─── */}
      <section className="py-10 md:py-14 border-y border-honey/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Suspense fallback={Fallback}><ProductJourney /></Suspense>
        </div>
      </section>

      {/* ─── HONEY MAKING PROCESS ─── */}
      <section className="relative border-y border-honey/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-16">
          <SectionHeading subtitle="Our Process" title="From Our Kitchen" description="Every product follows a journey from nature to your doorstep, preserving purity at every step." />
        </div>
        <Suspense fallback={Fallback}><HoneyProcess /></Suspense>
      </section>

      {/* ─── ABOUT ─── */}
      <section className="py-12 md:py-16 relative overflow-hidden bg-cream">
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img
              src="https://wonderlyf.com/wp-content/uploads/2026/02/About-US_Wonderlyf.jpg"
              alt="About Wonderlyf"
              className="rounded-2xl w-full shadow-warm-lg"
              width="800"
              height="800"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-honey text-sm tracking-widest uppercase mb-4 font-medium">About Us</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-warm-brown mb-6">Purity, Warmth & Wonders of Home</h2>
            <p className="text-warm-light text-base leading-relaxed mb-8">
              Wonderlyf is dedicated to crafting authentic, nutritious food products rooted in traditional wisdom. Born from a passion for preserving time-honored recipes and promoting holistic well-being, Wonderlyf brings you the purity, warmth, and wonders of home.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 bg-honey-dark text-white px-8 py-3.5 rounded-full font-bold hover:bg-honey-dark transition-all no-underline shadow-warm">
              Discover Our Story <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="py-12 md:py-16 border-y border-honey/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading subtitle="Why Wonderlyf" title="Why Choose Us" description="What makes Wonderlyf different from the rest." />
          <Suspense fallback={Fallback}><WhyChooseUs items={whyChooseUs} /></Suspense>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-12 md:py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading subtitle="Testimonials" title="Loved by Families" description="Hear from the families who've made Wonderlyf a part of their daily wellness." />
          <StaggeredReveal className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-6 border border-honey/10 shadow-warm">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} className="fill-honey text-honey" />)}
                </div>
                <p className="text-warm-gray text-sm leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-warm-brown font-semibold text-sm">{t.name}</p>
                  <p className="text-warm-light text-xs">{t.location}</p>
                </div>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-12 md:py-16 bg-warm-brown">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-honey-light mb-4">Pure. Natural. Wonderlyf.</h2>
            <p className="text-cream-dark/90 mb-8">Join thousands of families who trust Wonderlyf for their wellness journey. Safe & Secure Payments. Fast Delivery Across India.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-honey-dark text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-honey-light hover:text-warm-brown transition-all no-underline">
              Shop Now <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
