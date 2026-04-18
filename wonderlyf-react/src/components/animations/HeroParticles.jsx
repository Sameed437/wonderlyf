import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export default function HeroParticles({ count = 10 }) {
  const prefersReduced = useReducedMotion();

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const isGold = i % 3 !== 0;
      return {
        id: i,
        size: rand(6, 28),
        x: rand(5, 95),
        y: rand(5, 95),
        color: isGold
          ? "rgba(212, 148, 10, 0.06)"
          : "rgba(139, 105, 20, 0.04)",
        blur: rand(8, 20),
        duration: rand(8, 18),
        delayStart: rand(0, 6),
        moveX: rand(-60, 60),
        moveY: rand(-80, 80),
        scaleMax: rand(1.1, 1.5),
      };
    });
  }, [count]);

  if (prefersReduced) {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-honey/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-honey-light/5 rounded-full blur-3xl" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            filter: `blur(${p.blur}px)`,
          }}
          animate={{
            y: [0, p.moveY, 0],
            x: [0, p.moveX, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, p.scaleMax, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delayStart,
          }}
        />
      ))}
    </div>
  );
}
