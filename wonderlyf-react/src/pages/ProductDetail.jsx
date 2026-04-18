import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Check, Truck, Shield, Leaf, Award, ChevronRight } from "lucide-react";
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
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

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
          <Link to="/shop" className="inline-flex items-center gap-2 bg-honey text-white px-6 py-3 rounded-full font-bold no-underline text-sm">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const activeVariant = product.variants?.[selectedVariant];
  const currentPrice = activeVariant?.price ?? product.price;
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

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
            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 lg:p-12 border border-honey/10 shadow-warm md:sticky md:top-28">
              <div className="relative">
                {product.badge && (
                  <span className="absolute top-0 left-0 bg-honey text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                    {product.badge}
                  </span>
                )}
                {discount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full z-10">
                    -{discount}%
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full max-h-[250px] md:max-h-[400px] object-contain"
                />
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
              <span className="text-warm-light text-xs md:text-sm">({product.reviews} reviews)</span>
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
                <span className="text-warm-light text-xs md:text-sm">/ {activeVariant.weight}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-warm-light text-base leading-relaxed mb-6 md:mb-8">
              {product.longDescription || product.description}
            </p>

            {/* Size Variants */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-6 md:mb-8">
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
                      {variant.weight} — £{variant.price}
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

            {/* Benefits */}
            {product.benefits && (
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-honey/10 mb-6 md:mb-8">
                <h3 className="text-warm-brown font-semibold text-base mb-3 md:mb-4">Key Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {product.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-honey flex-shrink-0" />
                      <span className="text-warm-light text-sm">{benefit}</span>
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
                <div key={label} className="flex items-center gap-2 text-warm-light text-sm">
                  <Icon size={14} className="text-honey flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

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
    </div>
  );
}
