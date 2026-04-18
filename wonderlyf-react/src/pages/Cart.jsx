import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import SEO from "../components/SEO";

export default function Cart() {
  const { cart, updateQuantity, removeItem, cartTotal } = useCart();
  const shipping = cartTotal > 30 ? 0 : 5;
  const total = cartTotal + shipping;

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <SEO
        title="Shopping Cart"
        description="Review your Wonderlyf shopping cart. Traditional Indian wellness products with free UK delivery over £30."
        canonical="/cart"
      />
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-warm-brown mb-2">Your Cart</h1>
          <p className="text-warm-light text-sm">{cart.length} item{cart.length !== 1 && "s"} in your cart</p>
        </motion.div>

        {cart.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <ShoppingBag size={48} className="mx-auto text-warm-brown/10 mb-4" />
            <p className="text-warm-light mb-6">Your cart is empty</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-honey text-white px-8 py-3 rounded-full font-bold no-underline">Start Shopping <ArrowRight size={16} /></Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="md:col-span-2 space-y-4">
              {cart.map((item, i) => (
                <motion.div key={item.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-4 flex gap-4 border border-honey/10 shadow-warm">
                  <Link to={`/product/${item.slug || item.id}`} className="flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-contain bg-cream p-2" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-honey text-xs font-medium">{item.category}</p>
                    <Link to={`/product/${item.slug || item.id}`} className="no-underline">
                      <h3 className="text-warm-brown font-semibold">{item.name}</h3>
                    </Link>
                    <p className="text-warm-light text-xs">{item.selectedWeight}</p>
                    <p className="text-honey-dark font-bold mt-1">£{item.selectedPrice}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.key)} className="text-warm-brown/20 hover:text-red-400 transition-colors p-1"><Trash2 size={16} /></button>
                    <div className="flex items-center gap-3 bg-cream rounded-full px-2 py-1 border border-honey/10">
                      <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="text-warm-light hover:text-warm-brown p-1"><Minus size={14} /></button>
                      <span className="text-warm-brown text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="text-warm-light hover:text-warm-brown p-1"><Plus size={14} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div>
              <div className="bg-white rounded-2xl p-4 md:p-6 sticky top-28 border border-honey/10 shadow-warm">
                <h3 className="text-warm-brown font-semibold mb-6">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-warm-light">Subtotal</span><span className="text-warm-brown">£{cartTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-warm-light">Shipping</span><span className="text-warm-brown">{shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}</span></div>
                  {shipping > 0 && <p className="text-honey text-xs">Free shipping on orders above £30</p>}
                  <div className="border-t border-honey/10 pt-3 flex justify-between"><span className="text-warm-brown font-semibold">Total</span><span className="text-honey-dark font-bold text-lg">£{total.toFixed(2)}</span></div>
                </div>
                <Link to="/checkout" className="block w-full text-center bg-honey text-white py-3.5 rounded-full font-bold hover:bg-honey-dark transition-all no-underline">Proceed to Checkout</Link>
                <Link to="/shop" className="block text-center text-warm-light text-sm mt-4 hover:text-honey transition-colors no-underline">Continue Shopping</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
