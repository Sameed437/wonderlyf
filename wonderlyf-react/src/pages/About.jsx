import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Shield, Sparkles, TreePine } from "lucide-react";
import SEO from "../components/SEO";
import SectionHeading from "../components/SectionHeading";

const values = [
  { icon: Heart, title: "Made with Love", description: "Every product is crafted with the same love and care our grandmothers put into their recipes." },
  { icon: Shield, title: "No Preservatives", description: "We never use artificial preservatives, colors, or flavors. What you see is what nature intended." },
  { icon: Sparkles, title: "Ancient Wisdom", description: "Our formulations draw from centuries of Ayurvedic and traditional knowledge passed down through generations." },
  { icon: TreePine, title: "Sustainably Sourced", description: "We work directly with organic farmers and wild harvesters, ensuring fair trade and environmental care." },
];

const timeline = [
  { year: "2020", title: "The Seed", description: "A kitchen experiment with grandmother's honey recipe sparked the idea for Wonderlyf." },
  { year: "2021", title: "First Harvest", description: "Partnered with wild bee colonies in Western Ghats. Launched Heritage Honey to 500 families." },
  { year: "2022", title: "Growing Roots", description: "Expanded to 20+ products across 7 categories. Reached 5,000 happy families nationwide." },
  { year: "2023", title: "The Kitchen Grows", description: "Opened our artisanal processing unit in Erode. Introduced Grandma's Crunch line." },
  { year: "2024", title: "10,000 Families", description: "Crossed the milestone of serving 10,000 families. Launched subscription boxes." },
];

export default function About() {
  return (
    <div className="pt-28 pb-24 bg-cream">
      <SEO
        title="About Wonderlyf | Authentic Indian Wellness"
        description="Wonderlyf crafts authentic, nutritious food products rooted in traditional Tamil Nadu wisdom. Born from a passion for preserving time-honoured recipes, we deliver purity and wellness to UK families."
        keywords="about Wonderlyf, Indian wellness brand UK, traditional food company, Tamil Nadu food, Ayurvedic products UK, natural food brand"
        canonical="/about"
      />
      <section className="max-w-4xl mx-auto px-4 md:px-8 text-center mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-honey text-sm tracking-widest uppercase mb-4 font-medium">Our Story</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-warm-brown mb-6">Rooted in Tradition</h1>
          <p className="text-warm-light text-lg leading-relaxed max-w-2xl mx-auto">
            Wonderlyf was born from a simple belief: the best wellness comes from nature, guided by the wisdom of generations.
          </p>
        </motion.div>
      </section>

      <section className="py-24 border-y border-honey/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading subtitle="Why Wonderlyf" title="What We Stand For" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-honey/5 border border-honey/10 flex items-center justify-center">
                  <v.icon size={24} className="text-honey" />
                </div>
                <h3 className="text-warm-brown font-semibold mb-2">{v.title}</h3>
                <p className="text-warm-light text-sm leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-cream">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <SectionHeading subtitle="Our Journey" title="From Kitchen to Community" />
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-honey/20" />
            {timeline.map((item, i) => (
              <motion.div key={item.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative pl-16 pb-12 last:pb-0">
                <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-cream border-2 border-honey" />
                <div className="text-honey text-sm font-bold mb-1">{item.year}</div>
                <h3 className="text-warm-brown font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-warm-light text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-warm-brown">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-honey-light mb-4">Join Our Journey</h2>
            <p className="text-cream-dark/90 mb-8">Experience the magic of traditional wellness. Every purchase supports organic farmers and sustainable practices.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-honey-dark text-white px-8 py-3.5 rounded-full font-bold hover:bg-honey-light hover:text-warm-brown transition-all no-underline">
              Explore Products <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
