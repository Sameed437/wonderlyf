import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-warm-brown text-cream-dark">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-lg font-bold text-honey-light mb-4">WONDERLYF</h3>
            <p className="text-cream-dark/60 text-sm leading-relaxed">
              Traditional Indian wellness products crafted with ancient wisdom
              and modern purity. From our kitchen to yours.
            </p>
          </div>

          <div>
            <h4 className="text-cream/80 font-semibold mb-4 text-sm tracking-wider uppercase">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {["Home", "Shop", "Our Story", "Blog", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : item === "Our Story" ? "/about" : `/${item.toLowerCase()}`}
                  className="text-cream-dark/50 text-sm hover:text-honey-light transition-colors no-underline"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-cream/80 font-semibold mb-4 text-sm tracking-wider uppercase">
              Categories
            </h4>
            <div className="flex flex-col gap-3">
              {["Nature's Gold", "Instant Vitality", "Spice Blends", "Heritage Preserves", "Traditional Delights"].map((item) => (
                <Link
                  key={item}
                  to="/shop"
                  className="text-cream-dark/50 text-sm hover:text-honey-light transition-colors no-underline"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-cream/80 font-semibold mb-4 text-sm tracking-wider uppercase">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-cream-dark/50 text-sm">
                <Mail size={14} className="text-honey-light/60" />
                info@wonderlyf.com
              </div>
              <div className="flex items-center gap-2 text-cream-dark/50 text-sm">
                <Phone size={14} className="text-honey-light/60" />
                +91 63826 63539
              </div>
              <div className="flex items-center gap-2 text-cream-dark/50 text-sm">
                <MapPin size={14} className="text-honey-light/60" />
                Erode, Tamil Nadu, India
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream-dark/30 text-xs">
            &copy; 2026 Wonderlyf. All rights reserved.
          </p>
          <p className="text-cream-dark/30 text-xs">
            Pure. Natural. Wonderlyf.
          </p>
        </div>
      </div>
    </footer>
  );
}
