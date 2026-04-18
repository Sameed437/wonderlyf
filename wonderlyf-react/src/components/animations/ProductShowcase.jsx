import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";

const showcaseProducts = [
  { name: "Forest Honey", tagline: "Pure Wild Forest Honey", price: "£15", image: "/products/8.png", color: "from-honey/10 to-honey-light/5", accent: "#D4940A" },
  { name: "Kambu Laddoo", tagline: "Traditional Pearl Millet Ladoo", price: "£13", image: "https://wonderlyf.com/wp-content/uploads/2026/03/01-300x300.png", color: "from-orange-400/10 to-orange-200/5", accent: "#c2710c" },
  { name: "Meliponini Honey", tagline: "Rare Stingless Bee Honey", price: "£25", image: "/products/9.png", color: "from-emerald-400/10 to-emerald-200/5", accent: "#2d7a4f" },
  { name: "Moringa Honey", tagline: "Moringa-Infused Wellness Honey", price: "£15", image: "/products/7.png", color: "from-honey/10 to-green-200/5", accent: "#B8860B" },
  { name: "Paruthipal Mix", tagline: "Cotton Seed Milk Powder", price: "£10", image: "/products/3.png", color: "from-rose-300/10 to-rose-200/5", accent: "#a0522d" },
];

export default function ProductShowcase() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => setActive((prev) => (prev + 1) % showcaseProducts.length), 3500);
    return () => clearInterval(timer);
  }, [isInView]);

  const current = showcaseProducts[active];

  return (
    <div ref={ref} className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div key={active} className={`absolute inset-0 bg-gradient-to-br ${current.color}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} />
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center min-h-0 md:min-h-[420px]">
          <div className="relative flex items-center justify-center h-[220px] md:h-[350px]">
            <motion.div className="absolute w-72 h-72 rounded-full border border-honey/10" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
            <motion.div className="absolute w-48 h-48 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 3, repeat: Infinity }} style={{ backgroundColor: current.accent + "15" }} />

            <AnimatePresence mode="wait">
              <motion.div key={active} className="relative z-10" initial={{ opacity: 0, scale: 0.7, rotateY: -30, y: 30 }} animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }} exit={{ opacity: 0, scale: 0.8, rotateY: 30, y: -20 }} transition={{ type: "spring", stiffness: 100, damping: 15 }}>
                <motion.img src={current.image} alt={current.name} className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain drop-shadow-lg" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} draggable={false} />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div key={`price-${active}`} className="absolute top-6 right-6 md:right-12 z-20" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }}>
                <div className="bg-white shadow-warm rounded-xl px-4 py-2 text-center border border-honey/10">
                  <div className="text-[10px] text-warm-light uppercase tracking-wider">From</div>
                  <div className="text-lg font-bold" style={{ color: current.accent }}>{current.price}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }}>
                <p className="text-xs md:text-sm tracking-widest uppercase mb-2 md:mb-3 font-medium" style={{ color: current.accent }}>Featured Product</p>
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-warm-brown mb-2 md:mb-3">{current.name}</h3>
                <p className="text-warm-light text-base md:text-lg mb-5 md:mb-8">{current.tagline}</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                  <Link to="/shop" className="inline-block px-6 md:px-8 py-3 md:py-3 rounded-full font-bold text-white text-base md:text-base transition-all no-underline" style={{ backgroundColor: current.accent }}>
                    Shop Now
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-2 md:gap-3 mt-6 md:mt-10">
              {showcaseProducts.map((p, i) => (
                <button key={i} onClick={() => setActive(i)} className="group relative">
                  <motion.div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border-2 transition-all" style={{ borderColor: i === active ? current.accent : "rgba(44,24,16,0.1)" }} whileHover={{ scale: 1.1 }}>
                    <img src={p.image} alt={p.name} className={`w-full h-full object-contain p-1 transition-opacity ${i === active ? "opacity-100" : "opacity-40"}`} />
                  </motion.div>
                  {i === active && <motion.div layoutId="showcaseDot" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: current.accent }} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
