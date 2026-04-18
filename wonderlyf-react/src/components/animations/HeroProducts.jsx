import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useWooProducts } from "../../hooks/useWooProducts";

// Visual slot layout — the actual product data is pulled from Woo.
const SLOTS = [
  { size: 140, x: "50%", y: "45%", delay: 0,   duration: 5,   floatY: -18, floatX:  8,  rotate: [-3,  3, -3], z: 10 },
  { size: 100, x: "15%", y: "20%", delay: 0.5, duration: 6,   floatY: -14, floatX: -10, rotate: [ 2, -4,  2], z:  5 },
  { size: 110, x: "78%", y: "18%", delay: 0.8, duration: 7,   floatY: -16, floatX:  12, rotate: [-2,  5, -2], z:  6 },
  { size:  90, x: "20%", y: "72%", delay: 1.1, duration: 5.5, floatY: -12, floatX: -8,  rotate: [ 3, -2,  3], z:  4 },
  { size:  85, x: "75%", y: "70%", delay: 1.4, duration: 6.5, floatY: -10, floatX:  6,  rotate: [-4,  2, -4], z:  3 },
  { size:  75, x: "48%", y: "85%", delay: 1.7, duration: 5.8, floatY:  -8, floatX: -5,  rotate: [ 1, -3,  1], z:  2 },
];

export default function HeroProducts() {
  const { products } = useWooProducts();
  const heroProducts = products.slice(0, SLOTS.length).map((p, i) => ({ ...SLOTS[i], ...p }));

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const mobileProducts = heroProducts.slice(0, 4);

  if (heroProducts.length === 0) {
    return <div className="min-h-[300px]" />;
  }

  // ─── MOBILE: 2x2 grid of clickable products ───
  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-4 px-2">
        {mobileProducts.map((product, i) => (
          <Link key={product.id} to={`/product/${product.slug || product.id}`} className="no-underline">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 120 }}
              className="bg-white rounded-2xl p-4 border border-honey/10 shadow-warm flex flex-col items-center text-center"
            >
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 object-contain mb-3 drop-shadow-md"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                draggable={false}
              />
              <p className="text-warm-brown font-semibold text-sm">{product.name}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    );
  }

  // ─── DESKTOP: Floating animated products ───
  return (
    <div className="relative w-full h-[500px]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-honey/8 rounded-full blur-3xl" />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-honey/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {heroProducts.map((product) => (
        <motion.div
          key={product.id}
          className="absolute"
          style={{
            left: product.x,
            top: product.y,
            zIndex: product.z,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ opacity: 0, scale: 0, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            delay: product.delay,
            duration: 0.7,
            type: "spring",
            stiffness: 120,
            damping: 12,
          }}
        >
          <Link to={`/product/${product.slug || product.id}`} className="no-underline">
            <motion.div
              animate={{
                y: [0, product.floatY, 0],
                x: [0, product.floatX, 0],
                rotate: product.rotate,
              }}
              transition={{
                duration: product.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.15, zIndex: 20 }}
              className="relative group cursor-pointer"
            >
              <div
                className="absolute inset-0 rounded-full bg-honey/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ transform: "scale(1.3)" }}
              />
              <img
                src={product.image}
                alt={product.name}
                className="relative drop-shadow-lg"
                style={{ width: product.size, height: product.size, objectFit: "contain" }}
                draggable={false}
              />
              <motion.div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-white shadow-warm text-[10px] text-honey-dark px-2.5 py-1 rounded-full font-medium border border-honey/10">
                  {product.name}
                </span>
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>
      ))}

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.2, type: "spring", stiffness: 100 }}
      >
        <div className="bg-white shadow-warm-lg rounded-full w-20 h-20 flex items-center justify-center border border-honey/15">
          <div className="text-center">
            <div className="text-honey font-bold text-base">21+</div>
            <div className="text-warm-light text-[10px] uppercase tracking-wider">Products</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
