import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import SEO from "../components/SEO";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";
import { useWooProducts, useWooCategories } from "../hooks/useWooProducts";

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function Shop() {
  const { products, loading } = useWooProducts();
  const categories = useWooCategories();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "All") result = result.filter((p) => p.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      default: result.sort((a, b) => b.reviews - a.reviews);
    }
    return result;
  }, [products, selectedCategory, sortBy, searchQuery]);

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <SEO
        title="Shop Traditional Indian Food Products"
        description="Browse our full collection of authentic Indian wellness products. Honey, herbal preserves, traditional spice blends, soup mixes, and handcrafted laddoos. All natural, FSSAI certified. Free UK delivery over £30."
        keywords="buy Indian food online UK, traditional Indian products, honey online UK, herbal food UK, moringa products, banana stem soup, kambu laddoo, urad dal laddoo"
        canonical="/shop"
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeading subtitle="Our Collection" title="Shop the Collection" description="Explore our full range of traditional wellness products." />

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-light" />
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-full pl-11 pr-4 py-3 text-sm text-warm-brown placeholder-warm-light/50 outline-none border border-honey/10 focus:border-honey/30 transition-colors shadow-warm" />
          </div>
          <div className="relative">
            <SlidersHorizontal size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-light" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="bg-white rounded-full pl-11 pr-8 py-3 text-sm text-warm-gray outline-none appearance-none cursor-pointer border border-honey/10 shadow-warm w-full md:min-w-[180px]">
              {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors">
              {selectedCategory === cat && (
                <motion.div layoutId="categoryPill" className="absolute inset-0 bg-honey rounded-full shadow-warm" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
              )}
              <span className={`relative z-10 ${selectedCategory === cat ? "text-white font-bold" : "text-warm-gray hover:text-warm-brown"}`}>{cat}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-warm-light text-lg">Loading products...</p>
          </motion.div>
        ) : filteredProducts.length > 0 ? (
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }} transition={{ type: "spring", stiffness: 200, damping: 25 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-warm-light text-lg">No products found. Try a different search or category.</p>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <p className="text-warm-light text-sm">Showing {filteredProducts.length} of {products.length} products</p>
        </div>
      </div>
    </div>
  );
}
