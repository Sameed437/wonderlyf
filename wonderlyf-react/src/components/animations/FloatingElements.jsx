import { useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function randInt(min, max) {
  return Math.floor(rand(min, max));
}

// ── Lightweight SVG Shapes ──────────────────────────────────

function HoneycombHex({ size, fill }) {
  const r = size / 2;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${r + r * 0.9 * Math.cos(a)},${r + r * 0.9 * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon points={pts} fill={fill} stroke="rgba(184,134,11,0.3)" strokeWidth="1.5" />
    </svg>
  );
}

function HoneyDrop({ size, fill }) {
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 30 45">
      <path
        d="M15 0 C15 0 0 20 0 28 C0 37 6.7 45 15 45 C23.3 45 30 37 30 28 C30 20 15 0 15 0Z"
        fill={fill}
      />
    </svg>
  );
}

function GoldenLeaf({ size, fill }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <path
        d="M20 2 C30 8 38 18 36 30 C34 36 28 38 20 38 C12 38 6 36 4 30 C2 18 10 8 20 2Z"
        fill={fill}
      />
    </svg>
  );
}

function FlowerPetal({ size, fill }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30">
      <ellipse cx="15" cy="15" rx="6" ry="13" fill={fill} />
      <ellipse cx="15" cy="15" rx="13" ry="6" fill={fill} opacity="0.7" />
      <circle cx="15" cy="15" r="4" fill="rgba(212,148,10,0.9)" />
    </svg>
  );
}

const trajectories = [
  { fromX: -10, fromY: -10, toX: 110, toY: 110 },
  { fromX: 110, fromY: -10, toX: -10, toY: 110 },
  { fromX: -10, fromY: 110, toX: 110, toY: -10 },
  { fromX: 110, fromY: 110, toX: -10, toY: -10 },
  { fromX: -10, fromY: 40, toX: 110, toY: 60 },
  { fromX: 110, fromY: 30, toX: -10, toY: 70 },
  { fromX: 40, fromY: -10, toX: 60, toY: 110 },
  { fromX: 60, fromY: 110, toX: 40, toY: -10 },
];

const COLORS = ["#F0C14B", "#D4940A", "#E8A317", "#C68E17", "#7BA05B", "#F5D68A"];
const SHAPES = ["hex", "drop", "leaf", "petal"];
const shapeComponents = { hex: HoneycombHex, drop: HoneyDrop, leaf: GoldenLeaf, petal: FlowerPetal };

export default function FloatingElements() {
  const prefersReduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Fewer elements + faster on mobile
  const count = isMobile ? 5 : 12;
  const speedMultiplier = isMobile ? 0.6 : 1;

  const elements = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const traj = trajectories[i % trajectories.length];
      const shape = SHAPES[i % SHAPES.length];
      const color = COLORS[randInt(0, COLORS.length)];
      const size = isMobile ? rand(20, 35) : rand(30, 65);
      const duration = (isMobile ? rand(8, 14) : rand(12, 22)) * speedMultiplier;
      const delay = i * 0.5;
      const midX = (traj.fromX + traj.toX) / 2 + rand(-20, 20);
      const midY = (traj.fromY + traj.toY) / 2 + rand(-15, 15);

      return {
        id: i, shape, color, size, duration, delay,
        fromX: traj.fromX + rand(-5, 5),
        fromY: traj.fromY + rand(-5, 5),
        midX, midY,
        toX: traj.toX + rand(-5, 5),
        toY: traj.toY + rand(-5, 5),
        rotateEnd: rand(90, 360) * (Math.random() > 0.5 ? 1 : -1),
        scaleRange: [rand(0.8, 0.9), rand(1, 1.2), rand(0.8, 1)],
        opacityRange: [0, rand(0.5, 0.8), rand(0.5, 0.8), 0],
      };
    });
  }, [count, isMobile, speedMultiplier]);

  if (prefersReduced) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {elements.map((el) => {
        const Shape = shapeComponents[el.shape];
        return (
          <motion.div
            key={el.id}
            className="absolute"
            style={{ willChange: "transform" }}
            animate={{
              left: [`${el.fromX}%`, `${el.midX}%`, `${el.toX}%`],
              top: [`${el.fromY}%`, `${el.midY}%`, `${el.toY}%`],
              rotate: [0, el.rotateEnd * 0.5, el.rotateEnd],
              scale: el.scaleRange,
              opacity: el.opacityRange,
            }}
            transition={{
              duration: el.duration,
              repeat: Infinity,
              ease: "linear",
              delay: el.delay,
            }}
          >
            <Shape size={el.size} fill={el.color} />
          </motion.div>
        );
      })}
    </div>
  );
}
