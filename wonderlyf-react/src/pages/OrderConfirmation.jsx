import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { fetchOrder, isWooConfigured } from "../lib/woo";
import { useCart } from "../context/CartContext";
import SEO from "../components/SEO";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const orderKey = params.get("key");
  // Prefer the email from the URL, fall back to what we saved in
  // sessionStorage right before submitting the order.
  const billingEmail =
    params.get("email") ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("wonderlyf-last-email") || ""
      : "");
  const { clearCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Landing here with a valid order id + key means checkout succeeded on
  // the server. Safe to empty the local cart now (not before submitting —
  // we only clear on confirmed success so failed attempts preserve items).
  useEffect(() => {
    if (id && orderKey) clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, orderKey]);

  useEffect(() => {
    if (!isWooConfigured || !id || !orderKey) {
      setLoading(false);
      return;
    }
    fetchOrder(id, orderKey, billingEmail)
      .then(setOrder)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, orderKey, billingEmail]);

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <SEO title={`Order #${id} confirmed`} canonical={`/order/${id}`} />
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="text-center mb-10"
        >
          <CheckCircle2 size={72} className="mx-auto text-green-500 mb-4" />
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-warm-brown mb-2">
            Thank you for your order!
          </h1>
          <p className="text-warm-light">
            Order <span className="font-semibold text-warm-brown">#{id}</span> has been placed.
          </p>
        </motion.div>

        {loading && (
          <p className="text-center text-warm-light">Loading order details…</p>
        )}

        {error && (
          <div className="bg-white rounded-2xl p-6 border border-honey/10 shadow-warm text-center">
            <p className="text-warm-brown font-semibold mb-2">Your order has been placed successfully.</p>
            <p className="text-warm-light text-sm">A confirmation email is on its way.</p>
          </div>
        )}

        {order && (
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-honey/10 shadow-warm">
            <div className="flex items-center gap-2 mb-6">
              <Package size={20} className="text-honey" />
              <h2 className="font-semibold text-warm-brown">Order summary</h2>
            </div>

            <div className="space-y-3 mb-6">
              {(order.items || []).map((item) => (
                <div key={item.key} className="flex justify-between text-sm">
                  <span className="text-warm-gray">
                    {item.name} <span className="text-warm-light">×{item.quantity}</span>
                  </span>
                  <span className="text-warm-brown">
                    {order.totals?.currency_symbol}
                    {(Number(item.totals?.line_total || 0) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-honey/10 pt-4 space-y-2 text-sm">
              <Row
                label="Subtotal"
                value={`${order.totals?.currency_symbol || "£"}${(Number(order.totals?.total_items || 0) / 100).toFixed(2)}`}
              />
              <Row
                label="Shipping"
                value={`${order.totals?.currency_symbol || "£"}${(Number(order.totals?.total_shipping || 0) / 100).toFixed(2)}`}
              />
              {Number(order.totals?.total_tax) > 0 && (
                <Row
                  label="Tax"
                  value={`${order.totals?.currency_symbol || "£"}${(Number(order.totals.total_tax) / 100).toFixed(2)}`}
                />
              )}
              <div className="border-t border-honey/10 pt-2 flex justify-between">
                <span className="text-warm-brown font-semibold">Total</span>
                <span className="text-honey-dark font-bold text-lg">
                  {order.totals?.currency_symbol || "£"}
                  {(Number(order.totals?.total_price || 0) / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-honey/10 text-sm text-warm-gray">
              <p>
                Status:{" "}
                <span className="font-semibold text-warm-brown capitalize">{order.status}</span>
              </p>
              {order.payment_method_title && (
                <p className="mt-1">
                  Paid via:{" "}
                  <span className="font-semibold text-warm-brown">{order.payment_method_title}</span>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-honey-dark text-white px-8 py-3 rounded-full font-bold no-underline text-sm hover:bg-honey-dark transition-all"
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-warm-light">{label}</span>
      <span className="text-warm-brown">{value}</span>
    </div>
  );
}
