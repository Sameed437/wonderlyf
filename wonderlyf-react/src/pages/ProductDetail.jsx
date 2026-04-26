import { useState, useMemo, useEffect, useRef } from "react";

// Product image zoom. Works on:
//   • Desktop: hover → magnify 2.5× tracking the cursor; wheel → fine zoom 1–4×;
//     mouse leave / double-click → reset.
//   • Mobile/touch: tap → toggle zoom 2.5×; drag finger → pan around the
//     magnified image; tap again → reset. Pinch (2-finger) → smooth zoom 1–4×.
function ZoomableImage({ src, alt, className }) {
  const ref = useRef(null);
  const [hovering, setHovering] = useState(false);   // desktop hover state
  const [tapped, setTapped] = useState(false);       // mobile tap-to-zoom state
  const [extraZoom, setExtraZoom] = useState(0);     // wheel + pinch additive zoom
  const [pos, setPos] = useState({ x: 50, y: 50 });

  // Wheel zoom (desktop) — needs non-passive listener for preventDefault.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setExtraZoom((z) => Math.min(1.5, Math.max(0, z - e.deltaY * 0.003)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Touch handling — tap toggle, drag-to-pan when zoomed, pinch-to-zoom.
  // Native touchmove must be non-passive so we can stop the page from
  // scrolling while the user is panning the magnified image.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lastPinchDist = 0;
    let touchStartTime = 0;
    let touchStartXY = null;
    let didMove = false;

    const dist = (t1, t2) =>
      Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

    const updatePos = (clientX, clientY) => {
      const r = el.getBoundingClientRect();
      setPos({
        x: Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)),
        y: Math.max(0, Math.min(100, ((clientY - r.top) / r.height) * 100)),
      });
    };

    const onTouchStart = (e) => {
      touchStartTime = Date.now();
      didMove = false;
      if (e.touches.length === 2) {
        lastPinchDist = dist(e.touches[0], e.touches[1]);
      } else if (e.touches.length === 1) {
        const t = e.touches[0];
        touchStartXY = { x: t.clientX, y: t.clientY };
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 2) {
        // Pinch-to-zoom — block page scroll & set extraZoom from finger spread.
        e.preventDefault();
        const d = dist(e.touches[0], e.touches[1]);
        if (lastPinchDist > 0) {
          const delta = (d - lastPinchDist) * 0.01;
          setExtraZoom((z) => Math.min(3, Math.max(0, z + delta)));
        }
        lastPinchDist = d;
        didMove = true;
      } else if (e.touches.length === 1) {
        const t = e.touches[0];
        if (touchStartXY) {
          const moved = Math.hypot(t.clientX - touchStartXY.x, t.clientY - touchStartXY.y);
          if (moved > 6) didMove = true;
        }
        // Only hijack scroll & pan when already zoomed in.
        if (tapped || extraZoom > 0) {
          e.preventDefault();
          updatePos(t.clientX, t.clientY);
        }
      }
    };

    const onTouchEnd = (e) => {
      const elapsed = Date.now() - touchStartTime;
      // Quick tap (no drag, < 250ms) toggles zoom.
      if (!didMove && elapsed < 250 && e.changedTouches.length === 1) {
        const t = e.changedTouches[0];
        updatePos(t.clientX, t.clientY);
        setTapped((v) => {
          const next = !v;
          if (!next) setExtraZoom(0); // collapsing → reset pinch zoom too
          return next;
        });
      }
      lastPinchDist = 0;
      touchStartXY = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [tapped, extraZoom]);

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  const baseZoom = hovering || tapped ? 2.5 : 1;
  const zoom = baseZoom + extraZoom;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovering(true)}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { setHovering(false); setExtraZoom(0); }}
      onDoubleClick={() => { setExtraZoom(0); setTapped(false); }}
      className="relative overflow-hidden cursor-zoom-in select-none"
      style={{
        backgroundImage: `url("${src}")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: zoom === 1 ? "contain" : `${zoom * 100}%`,
        backgroundPosition: `${pos.x}% ${pos.y}%`,
        transition: "background-size 120ms ease-out",
        overscrollBehavior: "contain",
        touchAction: "manipulation", // disables double-tap-to-zoom so our handler runs cleanly
      }}
      role="img"
      aria-label={alt}
    >
      {/* Invisible img reserves natural width/height for the layout. */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={`${className} opacity-0 pointer-events-none`}
      />
    </div>
  );
}

// Default per-product copy used when the WooCommerce product itself doesn't
// supply richer fields. Mirrors the kind of detail wonderlyf.com shows under
// each product. Each product can override any field via Woo metadata later.
const DEFAULT_DETAILS = (product) => [
  {
    title: "Description",
    body: product.longDescription || product.description ||
      `${product.name} — handcrafted in Tamil Nadu using traditional methods, ` +
      `made from 100% natural ingredients with no preservatives, no artificial colours, ` +
      `and no added refined sugar.`,
  },
  {
    title: "Ingredients",
    body: product.ingredients ||
      "100% pure, natural ingredients sourced from trusted organic farms and wild forests across Tamil Nadu. No preservatives, no artificial colours, no added refined sugar.",
  },
  {
    title: "How to Use",
    body: product.howToUse ||
      "Enjoy a teaspoon (5–10g) daily on its own, with warm water, or mixed into tea, milk, yoghurt, smoothies, or porridge. Suitable for the whole family. Not recommended for infants under 1 year if the product contains honey.",
  },
  {
    title: "Storage & Shelf Life",
    body: product.storage ||
      "Store in a cool, dry place away from direct sunlight. Use a clean, dry spoon to scoop. Crystallisation in honey is natural and a sign of purity — gently warm the jar in lukewarm water to liquefy. Best consumed within 24 months of manufacture.",
  },
  {
    title: "Shipping & Returns",
    body: "Free UK delivery on orders over £30. Standard delivery in 2–4 working days via Royal Mail / DPD. Unopened items can be returned within 14 days for a full refund — see our Shipping & Returns page for details.",
  },
];

const DEFAULT_FAQS = (product) => product.faqs || [
  {
    q: `Is ${product.name} 100% natural?`,
    a: `Yes. ${product.name} is made from 100% natural ingredients with no preservatives, no artificial colours, and no added refined sugar. It is FSSAI certified and crafted in small batches in Tamil Nadu.`,
  },
  {
    q: "Where do you ship to?",
    a: "We ship across the United Kingdom. Standard delivery takes 2–4 working days via Royal Mail or DPD. Free UK delivery on orders over £30.",
  },
  {
    q: "How long does it last once opened?",
    a: "Once opened, store in a cool dry place away from direct sunlight and always use a clean, dry spoon. Best consumed within 6 months of opening for peak freshness.",
  },
  {
    q: "Is it safe for children?",
    a: "Suitable for children over 1 year. We do not recommend honey-based products for infants under 12 months. If your child has any food allergies, please check the ingredients before use.",
  },
  {
    q: "Are your products vegetarian / vegan?",
    a: "All our products are vegetarian. Honey-based products are not vegan; herbal and plant-based products are vegan-friendly — check each product's ingredients for confirmation.",
  },
  {
    q: "Do you offer refunds if I'm not satisfied?",
    a: "Yes. Unopened items can be returned within 14 days for a full refund. For opened items or quality concerns, contact us at contact@wonderlyf.co.uk and we'll make it right.",
  },
];

// Reusable accordion item — expand on click, reveal on enter, semantic <details>
// would be even simpler but we want animated chevron + keyboard parity with
// the rest of the UI. Kept inline to avoid creating new files.
function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-honey/15 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-4 md:py-5 text-left"
      >
        <span className="font-serif text-base md:text-lg font-semibold text-warm-brown">
          {title}
        </span>
        <ChevronDown
          size={18}
          className={`text-honey flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-5 text-warm-brown leading-relaxed text-base md:text-base">
          {children}
        </div>
      )}
    </div>
  );
}

// Convert a weight string like "1kg" / "500g" / "1 KG" / "0.5kg" / "100" to grams.
// Returns NaN when unparseable so the caller can fall back.
const weightToGrams = (w) => {
  if (w == null) return NaN;
  const s = String(w).toLowerCase().replace(/\s+/g, "");
  const num = parseFloat(s);
  if (Number.isNaN(num)) return NaN;
  if (s.includes("kg")) return num * 1000;
  return num; // grams (or unit-less — comparison still valid if all share units)
};
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Check, Truck, Shield, Leaf, Award, ChevronRight, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWooProducts, useWooProduct } from "../hooks/useWooProducts";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useWooProducts();
  const { product: fetched, loading } = useWooProduct(id);
  // URL can be either a numeric id or a slug — match either
  const product = fetched || products.find(
    (p) => String(p.id) === id || p.slug === id
  );
  const productUrlSegment = product?.slug || id;
  const { addItem } = useCart();
  // The smallest-weight variant is the implicit "base" the buyer starts on.
  // Computed sync from product so first paint already shows the base price —
  // no flash from "1kg/£34 → 100g/£6" after a useEffect kicks in.
  const smallestVariantIdx = useMemo(() => {
    const variants = product?.variants;
    if (!variants?.length) return 0;
    // Prefer the lightest weight; if no variant has a parseable weight
    // (e.g. attribute stored without "g"/"kg"), fall back to the lowest price
    // so we never default to the most expensive 1kg option by accident.
    const grams = variants.map((v) => weightToGrams(v.weight));
    const anyParsed = grams.some((g) => !Number.isNaN(g));
    const score = anyParsed
      ? grams.map((g) => (Number.isNaN(g) ? Infinity : g))
      : variants.map((v) => Number(v.price) || Infinity);
    let idx = 0;
    for (let i = 1; i < score.length; i++) {
      if (score[i] < score[idx]) idx = i;
    }
    return idx;
  }, [product?.id, product?.variants]);
  const [userPickedIdx, setUserPickedIdx] = useState(null);
  const selectedVariant = userPickedIdx ?? smallestVariantIdx;
  const setSelectedVariant = setUserPickedIdx;
  // Reset user choice if the product changes (e.g. navigating between products).
  useEffect(() => { setUserPickedIdx(null); }, [product?.id]);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Gallery: WooCommerce returns all product gallery images in `product.images`.
  // Reset to the first one whenever the product changes.
  const gallery = (product?.images?.length ? product.images : [product?.image]).filter(Boolean);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  useEffect(() => { setActiveImageIdx(0); }, [product?.id]);
  const activeImage = gallery[activeImageIdx] || product?.image;

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && String(p.id) !== String(product.id))
      .slice(0, 4);
  }, [product]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 bg-cream min-h-screen">
        <div className="max-w-5xl mx-auto px-4 text-center py-20">
          <p className="text-warm-light text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-16 bg-cream min-h-screen">
        <div className="max-w-5xl mx-auto px-4 text-center py-20">
          <h1 className="font-serif text-2xl md:text-3xl text-warm-brown mb-4">Product Not Found</h1>
          <p className="text-warm-light mb-6">The product you are looking for does not exist.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-honey-dark text-white px-6 py-3 rounded-full font-bold no-underline text-sm">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const activeVariant = product.variants?.[selectedVariant];
  const currentPrice = activeVariant?.price ?? product.price;
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const detailSections = DEFAULT_DETAILS(product);
  const faqs = DEFAULT_FAQS(product);

  const productSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.longDescription || product.description,
      image: product.image.startsWith("/") ? `https://wonderlyf.co.uk${product.image}` : product.image,
      brand: { "@type": "Brand", name: "Wonderlyf" },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "GBP",
        lowPrice: product.variants?.[0]?.price ?? product.price,
        highPrice: product.variants?.[product.variants.length - 1]?.price ?? product.price,
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "Wonderlyf UK" },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviews,
        bestRating: 5,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://wonderlyf.co.uk/" },
        { "@type": "ListItem", position: 2, name: "Shop", item: "https://wonderlyf.co.uk/shop" },
        { "@type": "ListItem", position: 3, name: product.name, item: `https://wonderlyf.co.uk/product/${productUrlSegment}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="pt-24 md:pt-28 pb-16 md:pb-24 bg-cream min-h-screen">
      <SEO
        title={`${product.name} | Buy Online UK`}
        description={`Buy ${product.name} online in the UK. ${product.description} From £${product.variants?.[0]?.price ?? product.price}. Free UK delivery over £30. 100% natural, FSSAI certified.`}
        keywords={`${product.name} UK, buy ${product.name} online, ${product.category} UK, Indian ${product.category.toLowerCase()} UK, Wonderlyf ${product.name}`}
        canonical={`/product/${productUrlSegment}`}
        ogImage={product.image.startsWith("/") ? `https://wonderlyf.co.uk${product.image}` : product.image}
        ogType="product"
        structuredData={productSchema}
      />
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-warm-light mb-6 md:mb-8 overflow-x-auto"
        >
          <Link to="/" className="hover:text-honey transition-colors no-underline text-warm-light whitespace-nowrap">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-honey transition-colors no-underline text-warm-light whitespace-nowrap">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-warm-brown font-medium truncate">{product.name}</span>
        </motion.nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-16 mb-12 md:mb-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex gap-3 md:gap-4">
              {/* Vertical thumbnail strip on the LEFT (desktop). On mobile it
                  stacks horizontally below the main image (kept inside the
                  image card via order-2). */}
              {gallery.length > 1 && (
                <div className="hidden md:flex flex-col gap-2 md:gap-3 max-h-[520px] overflow-y-auto pr-1 flex-shrink-0">
                  {gallery.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      onClick={() => setActiveImageIdx(i)}
                      aria-label={`View image ${i + 1}`}
                      aria-current={i === activeImageIdx}
                      className={`w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 bg-white transition-all ${
                        i === activeImageIdx
                          ? "border-honey shadow-warm"
                          : "border-honey/15 hover:border-honey/40 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex-1 bg-white rounded-2xl md:rounded-3xl p-3 md:p-8 lg:p-12 border border-honey/10 shadow-warm">
                <div className="relative">
                  {product.badge && (
                    <span className="absolute top-0 left-0 bg-honey-dark text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                      {product.badge}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full z-10">
                      -{discount}%
                    </span>
                  )}
                  <ZoomableImage
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-[280px] sm:h-[380px] md:h-[460px] lg:h-[520px] object-contain"
                  />
                </div>

                {/* Mobile: horizontal thumbnail strip below the main image
                    (vertical strip would crowd the small viewport). */}
                {gallery.length > 1 && (
                  <div className="md:hidden mt-4 flex gap-2 overflow-x-auto pb-1">
                    {gallery.map((src, i) => (
                      <button
                        key={src + i}
                        type="button"
                        onClick={() => setActiveImageIdx(i)}
                        aria-label={`View image ${i + 1}`}
                        aria-current={i === activeImageIdx}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 bg-white transition-all ${
                          i === activeImageIdx
                            ? "border-honey shadow-warm"
                            : "border-honey/15 opacity-80"
                        }`}
                      >
                        <img
                          src={src}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-honey text-xs md:text-sm tracking-wider uppercase font-medium mb-2">
              {product.category}
            </p>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-warm-brown mb-3 md:mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(product.rating)
                        ? "fill-honey text-honey"
                        : "text-warm-brown/15"
                    }
                  />
                ))}
              </div>
              <span className="text-warm-brown font-medium text-sm">{product.rating}</span>
              <span className="text-warm-brown text-sm md:text-sm">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 md:gap-3 mb-4 md:mb-6">
              <span className="text-honey-dark font-bold text-2xl md:text-3xl">
                £{currentPrice}
              </span>
              {product.originalPrice > currentPrice && (
                <span className="text-warm-brown/30 line-through text-base md:text-lg">
                  £{product.originalPrice}
                </span>
              )}
              {activeVariant && (
                <span className="text-warm-brown text-sm md:text-sm">/ {activeVariant.weight}</span>
              )}
            </div>

            {/* Short description teaser — keeps the page scannable while
                pushing the long copy below the Add to Cart. */}
            {product.description && (
              <p className="text-warm-brown text-base md:text-lg leading-relaxed mb-5 md:mb-6 line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Size Variants */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-5 md:mb-6">
                <h3 className="text-warm-brown font-semibold text-sm mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {product.variants.map((variant, i) => (
                    <button
                      key={variant.weight}
                      onClick={() => setSelectedVariant(i)}
                      className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                        selectedVariant === i
                          ? "border-honey bg-honey/10 text-honey-dark"
                          : "border-honey/15 text-warm-light hover:border-honey/40"
                      }`}
                    >
                      {variant.weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="flex items-center justify-center gap-3 bg-white rounded-full px-4 py-2.5 border border-honey/15 self-start">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-warm-light hover:text-warm-brown text-lg font-bold w-8 h-8 flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-warm-brown font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-warm-light hover:text-warm-brown text-lg font-bold w-8 h-8 flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <button
                disabled={product.productType === "variable" && (!product.variants || product.variants.length === 0)}
                onClick={() => {
                  addItem(product, quantity, activeVariant?.weight || product.weight, currentPrice);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 1500);
                }}
                className={`flex-1 flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3.5 rounded-full font-bold transition-all duration-300 text-base disabled:opacity-60 disabled:cursor-not-allowed ${
                  added ? "bg-green-500 text-white" : "bg-honey hover:bg-honey-dark text-white"
                }`}
              >
                {added ? <Check size={16} /> : <ShoppingCart size={16} />}
                {added ? "Added to Cart!"
                  : (product.productType === "variable" && (!product.variants || product.variants.length === 0))
                  ? "Loading options…"
                  : `Add to Cart — £${currentPrice * quantity}`}
              </button>
            </div>

            {/* Full description — moved below the Add to Cart so the buy box
                stays visible without scrolling. */}
            {product.longDescription && product.longDescription !== product.description && (
              <p className="text-warm-brown text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                {product.longDescription}
              </p>
            )}

            {/* Trust / Safe Checkout badge */}
            <div className="mb-6 md:mb-8">
              <img
                src="/safe-checkout.png"
                alt="Guaranteed safe checkout — Visa, Mastercard, American Express, Discover, Stripe, AES-256bit, PayPal"
                loading="lazy"
                className="w-full max-w-md mx-auto md:mx-0 h-auto"
              />
            </div>

            {/* Benefits */}
            {product.benefits && (
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-honey/10 mb-6 md:mb-8">
                <h3 className="text-warm-brown font-semibold text-base mb-3 md:mb-4">Key Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {product.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-honey flex-shrink-0" />
                      <span className="text-warm-brown text-sm md:text-base">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {[
                { icon: Truck, label: "Free delivery over £30" },
                { icon: Shield, label: "FSSAI Certified" },
                { icon: Leaf, label: "100% Natural" },
                { icon: Award, label: "Handcrafted Quality" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-warm-brown text-sm md:text-base">
                  <Icon size={14} className="text-honey flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── Detailed Information ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mb-12 md:mb-16"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-warm-brown mb-6 md:mb-8">
            Product Details
          </h2>
          <div className="bg-white rounded-2xl border border-honey/10 px-5 md:px-8 shadow-warm">
            {detailSections.map((section, i) => (
              <AccordionItem key={section.title} title={section.title} defaultOpen={i === 0}>
                <p>{section.body}</p>
              </AccordionItem>
            ))}
          </div>
        </motion.section>

        {/* ─── FAQs (rendered with FAQPage schema for rich results) ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mb-12 md:mb-20"
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-warm-brown mb-6 md:mb-8">
            Frequently Asked Questions
          </h2>
          <div className="bg-white rounded-2xl border border-honey/10 px-5 md:px-8 shadow-warm">
            {faqs.map((f, i) => (
              <div
                key={f.q}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <AccordionItem title={<span itemProp="name">{f.q}</span>} defaultOpen={i === 0}>
                  <div
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p itemProp="text">{f.a}</p>
                  </div>
                </AccordionItem>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-warm-brown">
                You May Also Like
              </h2>
              <Link
                to="/shop"
                className="text-honey font-semibold text-xs md:text-sm hover:text-honey-dark transition-colors no-underline flex items-center gap-1"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* ─── Sticky bottom Add-to-Cart bar (always visible across the whole
              product page so the buy box never falls below the fold). */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-honey/15 shadow-warm-lg">
        <div className="max-w-6xl mx-auto px-3 md:px-8 py-2.5 md:py-3 flex items-center gap-3 md:gap-5">
          <img
            src={activeImage}
            alt=""
            className="hidden sm:block w-12 h-12 md:w-14 md:h-14 rounded-lg object-contain border border-honey/15 bg-white flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-serif text-sm md:text-base font-bold text-warm-brown truncate">
              {product.name}
            </p>
            <p className="text-honey-dark font-bold text-sm md:text-base">
              £{currentPrice}
              {activeVariant && (
                <span className="text-warm-brown/60 font-normal text-xs md:text-sm ml-1">
                  / {activeVariant.weight}
                </span>
              )}
            </p>
          </div>
          <button
            disabled={product.productType === "variable" && (!product.variants || product.variants.length === 0)}
            onClick={() => {
              addItem(product, quantity, activeVariant?.weight || product.weight, currentPrice);
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
            className={`flex-shrink-0 inline-flex items-center justify-center gap-2 px-5 md:px-7 py-2.5 md:py-3 rounded-full font-bold text-sm md:text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
              added ? "bg-green-500 text-white" : "bg-honey hover:bg-honey-dark text-white"
            }`}
          >
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
            <span className="hidden sm:inline">
              {added ? "Added!" : `Add to Cart — £${currentPrice * quantity}`}
            </span>
            <span className="sm:hidden">
              {added ? "Added!" : `Add — £${currentPrice * quantity}`}
            </span>
          </button>
        </div>
      </div>

      {/* Page bottom spacer so the sticky bar doesn't cover real content */}
      <div className="h-20 md:h-24" aria-hidden="true" />
    </div>
  );
}
