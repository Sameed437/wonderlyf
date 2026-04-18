import { motion } from "framer-motion";
import { Truck, ShieldCheck, Heart, Users, Leaf, Sprout } from "lucide-react";

const iconMap = { truck: Truck, shield: ShieldCheck, heart: Heart, users: Users, leaf: Leaf, sprout: Sprout };

export default function WhyChooseUs({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item, i) => {
        const Icon = iconMap[item.icon] || Leaf;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 120, damping: 14 }}
            whileHover={{ y: -6 }}
            className="group bg-white rounded-2xl p-6 text-center border border-honey/10 shadow-warm hover:shadow-warm-hover transition-all"
          >
            <motion.div
              className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-honey/5 border border-honey/10 flex items-center justify-center"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(212,148,10,0.12)" }}
            >
              <Icon size={24} className="text-honey group-hover:text-honey-dark transition-colors" />
            </motion.div>
            <h3 className="text-warm-brown font-semibold mb-2">{item.title}</h3>
            <p className="text-warm-light text-sm leading-relaxed">{item.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
