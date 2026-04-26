import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ChevronLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { placeOrder, storeFetch, addToCart as wooAddToCart, clearWooCart, resetCartSession } from "../lib/woo";
import SEO from "../components/SEO";
import FloatingElements from "../components/animations/FloatingElements";

const PAYMENT_METHODS = [
  { id: "ppcp-gateway", title: "PayPal", description: "Pay securely with PayPal — you'll be redirected." },
  { id: "paypal", title: "PayPal (legacy)", description: "Legacy PayPal Standard gateway." },
  { id: "bacs", title: "Direct Bank Transfer", description: "Pay via bank transfer. Details emailed after order." },
];

const emptyAddress = {
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postcode: "",
  country: "GB",
  phone: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, wooEnabled } = useCart();
  const [billing, setBilling] = useState({ ...emptyAddress, email: "" });
  const [shipToSame, setShipToSame] = useState(true);
  const [shipping, setShipping] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState("ppcp-gateway");
  const [availableMethods, setAvailableMethods] = useState(PAYMENT_METHODS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Pull actual enabled payment methods from Woo (if possible)
  useEffect(() => {
    if (!wooEnabled) return;
    storeFetch("/checkout")
      .then((data) => {
        if (data?.payment_methods?.length) {
          // Hard-strip Cash on Delivery from the React storefront — even if
          // the gateway is still enabled in WooCommerce we don't offer it
          // to online buyers.
          const mapped = data.payment_methods
            .filter((m) => m !== "cod")
            .map((m) => ({
              id: m,
              title: PAYMENT_METHODS.find((p) => p.id === m)?.title || m,
              description: PAYMENT_METHODS.find((p) => p.id === m)?.description || "",
            }));
          if (mapped.length) {
            setAvailableMethods(mapped);
            if (!mapped.find((m) => m.id === paymentMethod)) {
              setPaymentMethod(mapped[0].id);
            }
          }
        }
      })
      .catch(() => {}); // silently fall back to the default list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wooEnabled]);

  const update = (which) => (field) => (e) => {
    const v = e.target.value;
    if (which === "billing") setBilling((b) => ({ ...b, [field]: v }));
    else setShipping((s) => ({ ...s, [field]: v }));
  };

  const redirectToWpCheckout = () => {
    // Fallback: submit a top-level form POST to our WP prefill endpoint.
    // WordPress empties the cart, re-adds each item, and 302-redirects
    // to /checkout/. Because this is top-level navigation (not fetch),
    // there's no CORS and the WC session cookie is set first-party.
    const base = import.meta.env.VITE_WOO_URL?.replace(/\/$/, "") || "";
    if (!base) {
      setError("Checkout unavailable — missing VITE_WOO_URL.");
      return;
    }
    const items = cart.map((i) => ({ id: i.purchasableId || i.id, qty: i.quantity }));
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${base}/`;
    form.style.display = "none";
    const addField = (name, value) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };
    addField("wonderlyf_action", "prefill_cart");
    addField("items", JSON.stringify(items));
    document.body.appendChild(form);
    form.submit();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!wooEnabled) {
      setError("WooCommerce is not configured.");
      return;
    }
    setError(null);
    setSubmitting(true);

    // Single server-side round-trip: submit billing, shipping, payment,
    // and cart items as a form POST. WordPress builds the cart, creates
    // the order, runs the payment gateway, and redirects back to the
    // React thank-you page (or to PayPal for off-site payments).
    // No CORS because this is top-level navigation, not a fetch.
    const base = import.meta.env.VITE_WOO_URL?.replace(/\/$/, "") || "";
    if (!base) {
      setError("Checkout unavailable — missing VITE_WOO_URL.");
      setSubmitting(false);
      return;
    }
    // Clear any lingering Store API session so the new server cart starts
    // fresh. Do NOT clear the local cart yet — if the server rejects the
    // order the user needs to land back with their items intact. The
    // OrderConfirmation page clears the cart only when it sees a real order.
    resetCartSession();

    // Persist the billing email so the thank-you page can fetch order
    // details even if the URL email param is missing on the redirect back.
    try { sessionStorage.setItem("wonderlyf-last-email", billing.email || ""); } catch {}

    // Send parent product id + variation id separately. WooCommerce's
    // add_to_cart() for variable products requires the parent id as the
    // first arg; the variation id (what we stored as purchasableId) goes
    // in the third arg.
    const items = cart.map((i) => {
      const parentId = i.id;
      const variationId = i.purchasableId && i.purchasableId !== i.id ? i.purchasableId : 0;
      return { id: parentId, variation_id: variationId, qty: i.quantity };
    });
    const shipAddr = shipToSame ? billing : { ...shipping, email: billing.email };

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${base}/`;
    form.style.display = "none";

    const addField = (name, value) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value ?? "";
      form.appendChild(input);
    };

    addField("wonderlyf_action", "place_order");
    addField("items", JSON.stringify(items));
    addField("payment_method", paymentMethod);
    addField("customer_note", "");

    addField("billing_email",      billing.email);
    ["first_name","last_name","company","address_1","address_2","city","state","postcode","country","phone"]
      .forEach((f) => {
        addField(`billing_${f}`, billing[f] || "");
        addField(`shipping_${f}`, (shipToSame ? billing[f] : shipping[f]) || "");
      });

    document.body.appendChild(form);
    form.submit();
  };

  if (cart.length === 0) {
    return (
      <div className="pt-28 pb-24 bg-cream min-h-screen">
        <div className="max-w-2xl mx-auto px-4 text-center py-20">
          <h1 className="font-serif text-2xl text-warm-brown mb-3">Your cart is empty</h1>
          <p className="text-warm-light mb-6">Add something before you check out.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-honey-dark text-white px-6 py-3 rounded-full font-bold no-underline text-sm">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const shipFee = cartTotal > 30 ? 0 : 5;
  const total = cartTotal + shipFee;

  return (
    <div className="relative overflow-hidden pt-28 pb-24 bg-cream min-h-screen">
      <SEO title="Checkout" description="Complete your Wonderlyf order." canonical="/checkout" />
      <FloatingElements />
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
        <Link to="/cart" className="inline-flex items-center gap-1 text-warm-light text-sm mb-6 no-underline hover:text-honey">
          <ChevronLeft size={16} /> Back to cart
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl md:text-4xl font-bold text-warm-brown mb-8"
        >
          Checkout
        </motion.h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* ── Left column: forms ── */}
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl p-5 md:p-6 border border-honey/10 shadow-warm">
              <h2 className="text-warm-brown font-semibold mb-4">Contact</h2>
              <input
                type="email"
                required
                placeholder="Email address"
                value={billing.email}
                onChange={(e) => setBilling((b) => ({ ...b, email: e.target.value }))}
                className="w-full border border-honey/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-honey"
              />
            </section>

            <section className="bg-white rounded-2xl p-5 md:p-6 border border-honey/10 shadow-warm">
              <h2 className="text-warm-brown font-semibold mb-4">Billing address</h2>
              <AddressFields data={billing} onChange={update("billing")} />
            </section>

            <section className="bg-white rounded-2xl p-5 md:p-6 border border-honey/10 shadow-warm">
              <label className="flex items-center gap-2 text-sm text-warm-gray mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shipToSame}
                  onChange={(e) => setShipToSame(e.target.checked)}
                  className="accent-honey"
                />
                Ship to the same address
              </label>
              {!shipToSame && (
                <>
                  <h2 className="text-warm-brown font-semibold mb-4">Shipping address</h2>
                  <AddressFields data={shipping} onChange={update("shipping")} />
                </>
              )}
            </section>

            <section className="bg-white rounded-2xl p-5 md:p-6 border border-honey/10 shadow-warm">
              <h2 className="text-warm-brown font-semibold mb-4">Payment</h2>
              <div className="space-y-2">
                {availableMethods.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === m.id
                        ? "border-honey bg-honey/5"
                        : "border-honey/15 hover:border-honey/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 accent-honey"
                    />
                    <div>
                      <p className="text-warm-brown font-semibold text-sm">{m.title}</p>
                      {m.description && <p className="text-warm-light text-xs mt-0.5">{m.description}</p>}
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* ── Right column: summary ── */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-honey/10 shadow-warm md:sticky md:top-28">
              <h3 className="text-warm-brown font-semibold mb-4">Order summary</h3>
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.key} className="flex justify-between text-sm">
                    <span className="text-warm-gray truncate mr-2">
                      {item.name} <span className="text-warm-light">×{item.quantity}</span>
                    </span>
                    <span className="text-warm-brown whitespace-nowrap">
                      £{(item.selectedPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-honey/10 pt-3 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-light">Subtotal</span>
                  <span className="text-warm-brown">£{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-light">Shipping</span>
                  <span className="text-warm-brown">
                    {shipFee === 0 ? "Free" : `£${shipFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-honey/10 pt-2 flex justify-between">
                  <span className="text-warm-brown font-semibold">Total</span>
                  <span className="text-honey-dark font-bold text-lg">£{total.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-honey-dark text-white py-3.5 rounded-full font-bold hover:bg-honey-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  "Placing order…"
                ) : (
                  <>
                    <Lock size={14} /> Place Order
                  </>
                )}
              </button>
              <p className="text-warm-light text-[11px] text-center mt-3">
                Secure checkout. By placing your order you agree to our terms.
              </p>
              <img
                src="/safe-checkout.png"
                alt="Guaranteed safe checkout — Visa, Mastercard, American Express, Discover, Stripe, AES-256bit, PayPal"
                loading="lazy"
                className="w-full h-auto mt-4"
              />
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

function AddressFields({ data, onChange }) {
  const f = "w-full border border-honey/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-honey";
  return (
    <div className="grid grid-cols-2 gap-3">
      <input required placeholder="First name" value={data.first_name} onChange={onChange("first_name")} className={f} />
      <input required placeholder="Last name" value={data.last_name} onChange={onChange("last_name")} className={f} />
      <input placeholder="Company (optional)" value={data.company} onChange={onChange("company")} className={`${f} col-span-2`} />
      <input required placeholder="Address line 1" value={data.address_1} onChange={onChange("address_1")} className={`${f} col-span-2`} />
      <input placeholder="Address line 2 (optional)" value={data.address_2} onChange={onChange("address_2")} className={`${f} col-span-2`} />
      <input required placeholder="City" value={data.city} onChange={onChange("city")} className={f} />
      <input placeholder="County / State" value={data.state} onChange={onChange("state")} className={f} />
      <input required placeholder="Postcode" value={data.postcode} onChange={onChange("postcode")} className={f} />
      <select value={data.country} onChange={onChange("country")} className={f}>
        <option value="GB">United Kingdom</option>
        <option value="IE">Ireland</option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
        <option value="AU">Australia</option>
        <option value="IN">India</option>
      </select>
      <input required placeholder="Phone" value={data.phone} onChange={onChange("phone")} className={`${f} col-span-2`} />
    </div>
  );
}
