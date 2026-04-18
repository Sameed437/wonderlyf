import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: (staggerDelay) => ({
    transition: { staggerChildren: staggerDelay },
  }),
};

const wordVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const charVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function TextReveal({
  text,
  as: Tag = "span",
  mode = "word",
  className = "",
  staggerDelay = 0.05,
  once = true,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  const MotionTag = motion[Tag] || motion.span;
  const items = mode === "word" ? text.split(" ") : text.split("");
  const variants = mode === "word" ? wordVariants : charVariants;

  return (
    <MotionTag
      ref={ref}
      className={`inline-block ${className}`}
      variants={containerVariants}
      custom={staggerDelay}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          variants={variants}
          className="inline-block"
          style={{ whiteSpace: "pre" }}
        >
          {item}
          {mode === "word" && i < items.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}
