import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CategoryCarousel({ categories }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const visibleCount = isMobile ? 2 : 4;
  const maxIndex = Math.max(0, categories.length - visibleCount);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const visibleCategories = categories.slice(current, current + visibleCount);
  if (visibleCategories.length < visibleCount) {
    visibleCategories.push(...categories.slice(0, visibleCount - visibleCategories.length));
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous categories"
        onClick={prev}
        className="absolute left-1 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-10 md:h-10 rounded-full bg-white/90 shadow-warm flex items-center justify-center text-warm-gray hover:text-honey transition-all"
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Next categories"
        onClick={next}
        className="absolute right-1 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-10 md:h-10 rounded-full bg-white/90 shadow-warm flex items-center justify-center text-warm-gray hover:text-honey transition-all"
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-hidden">
        <AnimatePresence mode="popLayout" custom={direction}>
          {visibleCategories.map((cat, i) => (
            <motion.div
              key={`${cat.name}-${current}-${i}`}
              custom={direction}
              initial={{ opacity: 0, x: direction * 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction * -100, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 25, delay: i * 0.05 }}
            >
              <Link
                to="/shop"
                className="group block relative overflow-hidden rounded-2xl aspect-[4/3] no-underline shadow-warm hover:shadow-warm-hover transition-shadow"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warm-brown/70 via-warm-brown/10 to-transparent" />
                <motion.div className="absolute bottom-0 left-0 right-0 p-4" whileHover={{ y: -4 }}>
                  <h3 className="text-white font-semibold text-sm md:text-base">
                    {cat.name}
                  </h3>
                  <div className="h-0.5 w-0 group-hover:w-full bg-honey-light transition-all duration-500 mt-1 rounded-full" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Category slides">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className="relative p-3 -m-2 group"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === current ? "bg-honey w-6 h-2" : "bg-warm-brown/30 group-hover:bg-warm-brown/50 w-2 h-2"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
