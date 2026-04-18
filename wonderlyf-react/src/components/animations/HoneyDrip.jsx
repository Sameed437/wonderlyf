import { motion } from "framer-motion";

const drips = [
  { x: "8%", width: 45, height: 120, delay: 0, duration: 3.5, bulge: 22 },
  { x: "18%", width: 35, height: 90, delay: 0.8, duration: 4.2, bulge: 18 },
  { x: "30%", width: 50, height: 140, delay: 0.3, duration: 3.8, bulge: 25 },
  { x: "42%", width: 30, height: 70, delay: 1.5, duration: 4.5, bulge: 15 },
  { x: "55%", width: 55, height: 160, delay: 0.1, duration: 3.2, bulge: 28 },
  { x: "65%", width: 38, height: 100, delay: 1.0, duration: 4.0, bulge: 20 },
  { x: "76%", width: 48, height: 130, delay: 0.6, duration: 3.6, bulge: 24 },
  { x: "88%", width: 32, height: 80, delay: 1.2, duration: 4.3, bulge: 16 },
  { x: "95%", width: 42, height: 110, delay: 0.4, duration: 3.9, bulge: 21 },
  { x: "3%", width: 28, height: 60, delay: 2.0, duration: 4.8, bulge: 14 },
  { x: "50%", width: 25, height: 55, delay: 1.8, duration: 5.0, bulge: 13 },
  { x: "72%", width: 40, height: 95, delay: 0.9, duration: 4.1, bulge: 19 },
];

// Smaller drip drops that fall from the main drips
const fallingDrops = [
  { x: "31%", delay: 2.0, duration: 2.5, size: 8 },
  { x: "56%", delay: 3.0, duration: 2.8, size: 10 },
  { x: "77%", delay: 2.5, duration: 2.2, size: 7 },
  { x: "9%", delay: 3.5, duration: 3.0, size: 9 },
  { x: "19%", delay: 4.0, duration: 2.6, size: 6 },
];

export default function HoneyDrip() {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none overflow-hidden">
      {/* Top honey bar - thick flowing edge */}
      <div className="relative w-full h-3 bg-gradient-to-b from-[#C8860A] via-[#D4940A] to-[#E8A820]" />

      {/* SVG Drips */}
      <svg
        className="absolute top-0 left-0 w-full"
        style={{ height: 220 }}
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="honeyDripGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4940A" />
            <stop offset="40%" stopColor="#E8A820" />
            <stop offset="70%" stopColor="#F0C14B" />
            <stop offset="100%" stopColor="#F0C14B" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="honeyShine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <filter id="honeyBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          </filter>
        </defs>

        {/* Continuous wavy top edge */}
        <path
          d="M0,0 L0,12 Q60,18 120,14 Q180,10 240,16 Q300,22 360,15 Q420,8 480,14 Q540,20 600,16 Q660,12 720,18 Q780,24 840,16 Q900,8 960,15 Q1020,22 1080,14 Q1140,6 1200,16 Q1260,20 1320,14 Q1380,8 1440,12 L1440,0 Z"
          fill="url(#honeyDripGrad)"
        />

        {/* Individual drips */}
        {drips.map((drip, i) => {
          const cx = parseFloat(drip.x) * 14.4; // Convert % to SVG coords (1440 width)
          const halfW = drip.width / 2;
          const bulgeY = drip.height - drip.bulge;

          return (
            <motion.g key={i} filter="url(#honeyBlur)">
              <motion.path
                d={`
                  M${cx - halfW},12
                  Q${cx - halfW},12 ${cx - halfW * 0.7},${drip.height * 0.3}
                  L${cx - halfW * 0.5},${bulgeY}
                  Q${cx - halfW * 0.5},${drip.height} ${cx},${drip.height + drip.bulge}
                  Q${cx + halfW * 0.5},${drip.height} ${cx + halfW * 0.5},${bulgeY}
                  L${cx + halfW * 0.7},${drip.height * 0.3}
                  Q${cx + halfW},12 ${cx + halfW},12
                  Z
                `}
                fill="url(#honeyDripGrad)"
                initial={{ scaleY: 0, originY: 0 }}
                animate={{ scaleY: [0, 1, 1, 0.95, 1] }}
                transition={{
                  delay: drip.delay,
                  duration: drip.duration,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  repeat: Infinity,
                  repeatDelay: drip.duration * 1.5,
                }}
              />
              {/* Shine highlight on each drip */}
              <motion.ellipse
                cx={cx - halfW * 0.2}
                cy={drip.height * 0.5}
                rx={halfW * 0.2}
                ry={drip.height * 0.25}
                fill="url(#honeyShine)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0.3, 0.6, 0] }}
                transition={{
                  delay: drip.delay + 0.5,
                  duration: drip.duration,
                  repeat: Infinity,
                  repeatDelay: drip.duration * 1.5,
                }}
              />
            </motion.g>
          );
        })}
      </svg>

      {/* Falling drops */}
      {fallingDrops.map((drop, i) => (
        <motion.div
          key={`drop-${i}`}
          className="absolute rounded-full"
          style={{
            left: drop.x,
            top: 140,
            width: drop.size,
            height: drop.size * 1.4,
            background: "radial-gradient(ellipse, #F0C14B 30%, #D4940A 100%)",
            borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
          }}
          initial={{ y: 0, opacity: 0, scale: 0.5 }}
          animate={{
            y: [0, 200, 400],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.6],
          }}
          transition={{
            delay: drop.delay,
            duration: drop.duration,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
