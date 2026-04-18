import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import SEO from "../components/SEO";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="pt-28 pb-24 bg-cream">
      <SEO
        title="Contact Us"
        description="Get in touch with Wonderlyf UK. Questions about our traditional Indian wellness products, orders, or delivery? We're here to help. Reach us by email, phone, or contact form."
        keywords="contact Wonderlyf UK, customer service, Indian food delivery UK, order enquiry"
        canonical="/contact"
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-honey text-sm tracking-widest uppercase mb-4 font-medium">Get in Touch</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-warm-brown mb-4">Contact Us</h1>
          <p className="text-warm-light max-w-lg mx-auto">Have a question or feedback? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-warm-brown text-2xl font-semibold mb-6">Let's Connect</h2>
            <p className="text-warm-light leading-relaxed mb-8">Whether you want to learn more about our products, have a suggestion, or just want to say hello — reach out to us anytime.</p>
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "info@wonderlyf.com" },
                { icon: Phone, label: "Phone", value: "+91 63826 63539" },
                { icon: MapPin, label: "Address", value: "Erode, Tamil Nadu, India" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-honey/5 border border-honey/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-honey" />
                  </div>
                  <div>
                    <p className="text-warm-light text-xs uppercase tracking-wider">{label}</p>
                    <p className="text-warm-brown text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 space-y-5 shadow-warm border border-honey/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-warm-light text-xs uppercase tracking-wider block mb-2">Name</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-cream border border-honey/10 rounded-xl px-4 py-3 text-sm text-warm-brown placeholder-warm-light/40 outline-none focus:border-honey/30 transition-colors" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-warm-light text-xs uppercase tracking-wider block mb-2">Email</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-cream border border-honey/10 rounded-xl px-4 py-3 text-sm text-warm-brown placeholder-warm-light/40 outline-none focus:border-honey/30 transition-colors" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="text-warm-light text-xs uppercase tracking-wider block mb-2">Subject</label>
                <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-cream border border-honey/10 rounded-xl px-4 py-3 text-sm text-warm-brown placeholder-warm-light/40 outline-none focus:border-honey/30 transition-colors" placeholder="How can we help?" />
              </div>
              <div>
                <label className="text-warm-light text-xs uppercase tracking-wider block mb-2">Message</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-cream border border-honey/10 rounded-xl px-4 py-3 text-sm text-warm-brown placeholder-warm-light/40 outline-none focus:border-honey/30 transition-colors resize-none" placeholder="Tell us more..." />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-honey text-white py-3.5 rounded-full font-bold hover:bg-honey-dark transition-all duration-300">
                {submitted ? "Message Sent!" : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
