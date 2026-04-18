import { motion } from "framer-motion";

export default function SectionHeading({ subtitle, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      {subtitle && (
        <p className="text-honey text-sm tracking-widest uppercase mb-3 font-medium">
          {subtitle}
        </p>
      )}
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-warm-brown mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-warm-light max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
