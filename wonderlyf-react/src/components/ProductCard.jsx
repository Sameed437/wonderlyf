import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  const isVariable = product.productType === "variable";

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Variable products need a variation chosen before they can be added
    // to the cart — send the user to the detail page to pick a size.
    if (isVariable) {
      navigate(`/product/${product.slug || product.id}`);
      return;
    }
    addItem(product, 1, product.weight, product.price);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group bg-white rounded-2xl overflow-hidden border border-honey/10 shadow-warm hover:shadow-warm-hover transition-all duration-300"
    >
      <Link to={`/product/${String(product.id).replace("product-", "")}`} className="no-underline block">
        <div className="relative h-44 md:h-52 overflow-hidden bg-cream">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-honey/40 text-4xl font-serif">
              {product.name?.[0] || "?"}
            </div>
          )}
          {product.badge && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
              className="absolute top-2 left-2 bg-honey-dark text-white text-xs font-bold px-2.5 py-0.5 rounded-full"
            >
              {product.badge}
            </motion.span>
          )}
          {discount > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 200 }}
              className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
            >
              -{discount}%
            </motion.span>
          )}
        </div>

        <div className="p-4 md:p-5">
          <p className="text-honey text-xs tracking-wider uppercase mb-1 font-medium">
            {product.category}
          </p>
          <h3 className="text-warm-brown font-semibold text-sm md:text-lg mb-1 md:mb-2 line-clamp-1">{product.name}</h3>
          <p className="text-warm-light text-xs md:text-sm leading-relaxed mb-2 md:mb-3 line-clamp-2 hidden md:block">
            {product.description}
          </p>

          <div className="flex items-center gap-0.5 mb-2 md:mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={
                  i < Math.floor(product.rating)
                    ? "fill-honey text-honey"
                    : "text-warm-brown/15"
                }
              />
            ))}
            <span className="text-warm-light text-xs ml-1">
              ({product.reviews})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-honey-dark font-bold text-base md:text-lg">
                £{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-warm-brown/30 line-through text-xs md:text-sm">
                  £{product.originalPrice}
                </span>
              )}
            </div>
            <button
              onClick={handleAdd}
              className={`flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-honey/10 hover:bg-honey text-honey hover:text-white"
              }`}
            >
              {added ? <Check size={13} /> : <ShoppingCart size={13} />}
              <span>{added ? "Added!" : isVariable ? "Options" : "Add"}</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
