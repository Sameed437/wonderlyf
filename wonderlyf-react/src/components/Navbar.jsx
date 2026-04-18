import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Our Story", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-warm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img
            src="https://wonderlyf.com/wp-content/uploads/2026/01/Logo_Wonderlyf-1.png"
            alt="Wonderlyf"
            className="h-10"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm tracking-wide no-underline transition-colors ${
                location.pathname === link.path
                  ? "text-honey font-semibold"
                  : "text-warm-gray hover:text-warm-brown"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="relative p-2 text-warm-gray hover:text-honey transition-colors"
          >
            <ShoppingCart size={20} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 bg-honey text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button
            className="md:hidden p-2 text-warm-brown"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-warm-lg mt-2 mx-4 rounded-2xl p-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block py-3 text-sm tracking-wide no-underline ${
                location.pathname === link.path
                  ? "text-honey font-semibold"
                  : "text-warm-gray"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
