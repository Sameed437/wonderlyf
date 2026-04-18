import { Children } from "react";
import { motion } from "framer-motion";

const directionOffset = {
  up: { y: 50, x: 0 },
  left: { y: 0, x: -50 },
  right: { y: 0, x: 50 },
};

export default function StaggeredReveal({
  children,
  className = "",
  staggerDelay = 0.12,
  direction = "up",
}) {
  const offset = directionOffset[direction] || directionOffset.up;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: offset.y,
      x: offset.x,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 14,
        mass: 0.8,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {Children.map(children, (child) =>
        child ? (
          <motion.div variants={childVariants}>{child}</motion.div>
        ) : null
      )}
    </motion.div>
  );
}
