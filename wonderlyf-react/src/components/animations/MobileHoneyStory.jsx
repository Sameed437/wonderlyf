import { motion } from "framer-motion";

/**
 * Mobile-only professional animated honey-production scene.
 * Fast, snappy loop (~3s cycle): bees harvest → honey pours → jar fills → brand reveal.
 * Optimised: lean SVG, no whileInView, minimal filters, GPU-friendly transforms.
 */
export default function MobileHoneyStory() {
  const bees = [
    { delay: 0, duration: 2.4, path: "M 30 280 Q 100 200 180 130" },
    { delay: 0.5, duration: 2.2, path: "M 330 270 Q 260 190 180 130" },
    { delay: 1.0, duration: 2.6, path: "M 50 330 Q 140 230 180 130" },
  ];

  const drops = [0, 0.35, 0.7, 1.05, 1.4];

  return (
    <section className="md:hidden relative overflow-hidden py-8 bg-[#1a0f05]">
      {/* Ambient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a1805] via-[#4a2d0a] to-[#1a0f05]" />

      {/* Heading */}
      <div className="relative z-10 text-center px-6 mb-3">
        <motion.p
          className="text-[#F0C14B] text-[11px] tracking-[0.35em] uppercase font-bold mb-2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Nature's Finest
        </motion.p>
        <motion.h2
          className="font-serif text-3xl font-bold text-white leading-tight"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Crafted <span className="text-[#F0C14B]">drop by drop</span>
        </motion.h2>
      </div>

      {/* Scene */}
      <div className="relative mx-auto w-full max-w-[360px] aspect-[3/4]">
        <svg
          viewBox="0 0 360 480"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="honey" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD76B" />
              <stop offset="40%" stopColor="#E8A820" />
              <stop offset="100%" stopColor="#8B5A0A" />
            </linearGradient>
            <linearGradient id="honeyShine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF3B0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#E8A820" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="hive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFC94A" />
              <stop offset="50%" stopColor="#D4940A" />
              <stop offset="100%" stopColor="#5c3a00" />
            </linearGradient>
            <radialGradient id="hiveGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF3B0" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFD76B" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="15%" stopColor="rgba(255,255,255,0.22)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.06)" />
              <stop offset="85%" stopColor="rgba(255,255,255,0.18)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>
            <radialGradient id="spotlight" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFE9A8" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#FFD76B" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <clipPath id="jarMask">
              <path d="M 126 312 L 126 438 Q 126 450 138 450 L 222 450 Q 234 450 234 438 L 234 312 Z" />
            </clipPath>
            <pattern id="honeycomb" x="0" y="0" width="22" height="38" patternUnits="userSpaceOnUse">
              <path
                d="M 11 0 L 22 6 L 22 18 L 11 24 L 0 18 L 0 6 Z"
                fill="none"
                stroke="#F0C14B"
                strokeOpacity="0.13"
                strokeWidth="0.7"
              />
            </pattern>
          </defs>

          {/* Background */}
          <rect width="360" height="480" fill="url(#spotlight)" />
          <rect width="360" height="480" fill="url(#honeycomb)" />

          {/* Ground glow */}
          <ellipse cx="180" cy="470" rx="160" ry="18" fill="#F0C14B" opacity="0.15" />

          {/* Hive halo */}
          <motion.circle
            cx="180"
            cy="120"
            r="70"
            fill="url(#hiveGlow)"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "180px 120px" }}
          />

          {/* Hive — static structure, snappy entrance */}
          <motion.g
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", damping: 14 }}
          >
            <line x1="180" y1="10" x2="180" y2="78" stroke="#2a1a00" strokeWidth="1.5" />
            {[
              { y: 82, rx: 30 },
              { y: 98, rx: 36 },
              { y: 116, rx: 40 },
              { y: 134, rx: 38 },
              { y: 150, rx: 32 },
            ].map((b, i) => (
              <g key={i}>
                <ellipse
                  cx="180"
                  cy={b.y}
                  rx={b.rx}
                  ry="9"
                  fill="url(#hive)"
                  stroke="#3a2500"
                  strokeWidth="1.2"
                />
                <ellipse
                  cx="176"
                  cy={b.y - 3}
                  rx={b.rx * 0.65}
                  ry="2"
                  fill="#FFF3B0"
                  opacity="0.4"
                />
              </g>
            ))}
            <ellipse cx="180" cy="140" rx="5" ry="4" fill="#1a0f05" />
          </motion.g>

          {/* Bees — clean fast swoop, no wing flutter (CSS burden) */}
          {bees.map((bee, i) => (
            <motion.g
              key={i}
              animate={{ offsetDistance: ["0%", "100%"] }}
              transition={{
                delay: bee.delay,
                duration: bee.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ offsetPath: `path('${bee.path}')`, offsetRotate: "auto" }}
            >
              {/* Trail */}
              <ellipse cx="-9" cy="0" rx="8" ry="1.5" fill="#FFC94A" opacity="0.3" />
              <ellipse cx="-5" cy="0" rx="5" ry="1.2" fill="#FFD76B" opacity="0.45" />
              {/* Body */}
              <ellipse cx="0" cy="0" rx="5" ry="3.5" fill="#F0C14B" />
              {/* Stripes */}
              <rect x="-3" y="-3.5" width="1.5" height="7" fill="#2a1a00" />
              <rect x="0" y="-3.5" width="1.5" height="7" fill="#2a1a00" />
              {/* Head */}
              <circle cx="-4.5" cy="0" r="2" fill="#2a1a00" />
              {/* Wings — single subtle motion */}
              <ellipse cx="0" cy="-4" rx="5" ry="2.5" fill="rgba(255,255,255,0.8)" />
              <ellipse cx="3" cy="-4" rx="3.5" ry="2" fill="rgba(255,255,255,0.65)" />
            </motion.g>
          ))}

          {/* Honey stream */}
          <motion.path
            d="M 180 155 Q 180 200 180 255 Q 180 290 180 310"
            stroke="url(#honey)"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2,
              times: [0, 0.35, 0.85, 1],
              repeat: Infinity,
              repeatDelay: 0.2,
              ease: "easeOut",
            }}
          />

          {/* Falling honey drops */}
          {drops.map((delay, i) => (
            <motion.ellipse
              key={i}
              cx="180"
              rx="3.2"
              ry="4.5"
              fill="url(#honey)"
              initial={{ cy: 155, opacity: 0 }}
              animate={{ cy: [155, 310], opacity: [0, 1, 1, 0] }}
              transition={{
                delay,
                duration: 0.7,
                repeat: Infinity,
                repeatDelay: 1.3,
                ease: "easeIn",
              }}
            />
          ))}

          {/* Splash ripple */}
          <motion.ellipse
            cx="180"
            cy="313"
            ry="2.5"
            fill="none"
            stroke="#FFD76B"
            strokeWidth="1.5"
            initial={{ rx: 4, opacity: 0.9 }}
            animate={{ rx: [4, 28], opacity: [0.9, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "easeOut" }}
          />

          {/* Jar */}
          <g>
            <rect x="120" y="282" width="120" height="6" rx="2" fill="#5c3a00" />
            <rect x="124" y="288" width="112" height="20" rx="3" fill="#8B5A0A" />
            <rect x="130" y="291" width="100" height="3" rx="1.5" fill="#D4940A" opacity="0.7" />

            <path
              d="M 126 308 L 126 438 Q 126 452 140 452 L 220 452 Q 234 452 234 438 L 234 308 Z"
              fill="rgba(255,255,255,0.05)"
              stroke="#F0C14B"
              strokeWidth="2"
              strokeOpacity="0.7"
            />

            {/* Honey fill inside jar */}
            <g clipPath="url(#jarMask)">
              <motion.g
                animate={{ y: [140, 0, 0, 140] }}
                transition={{
                  duration: 3,
                  times: [0, 0.4, 0.88, 1],
                  repeat: Infinity,
                  ease: [0.45, 0, 0.25, 1],
                }}
              >
                <rect x="126" y="312" width="108" height="140" fill="url(#honey)" />
                <rect x="126" y="312" width="108" height="28" fill="url(#honeyShine)" />
                <motion.path
                  d="M 126 315 Q 150 310 180 315 Q 210 320 234 315 L 234 325 L 126 325 Z"
                  fill="#FFD76B"
                  opacity="0.7"
                  animate={{ x: [-2, 2, -2] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Bubbles */}
                <motion.circle
                  cx="150"
                  r="2"
                  fill="#FFF3B0"
                  initial={{ cy: 445, opacity: 0 }}
                  animate={{ cy: [445, 320], opacity: [0, 0.55, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.circle
                  cx="210"
                  r="1.5"
                  fill="#FFF3B0"
                  initial={{ cy: 445, opacity: 0 }}
                  animate={{ cy: [445, 320], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, delay: 0.6, repeat: Infinity, ease: "easeOut" }}
                />
              </motion.g>
            </g>

            {/* Glass refraction */}
            <path
              d="M 126 308 L 126 438 Q 126 452 140 452 L 220 452 Q 234 452 234 438 L 234 308 Z"
              fill="url(#glass)"
              pointerEvents="none"
            />
            <rect x="134" y="314" width="4" height="126" rx="2" fill="#FFF3B0" opacity="0.4" />
            <rect x="224" y="318" width="2" height="118" rx="1" fill="#FFF3B0" opacity="0.25" />
          </g>

          {/* Label — snappy pop-in */}
          <motion.g
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.35, type: "spring", damping: 10 }}
            style={{ transformOrigin: "180px 395px" }}
          >
            <rect
              x="140"
              y="370"
              width="80"
              height="50"
              rx="3"
              fill="#FFFDF0"
              stroke="#5c3a00"
              strokeWidth="0.8"
            />
            <rect x="143" y="373" width="74" height="44" rx="2" fill="none" stroke="#D4940A" strokeWidth="0.5" />
            <text
              x="180"
              y="392"
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="13"
              fontWeight="800"
              fill="#5c3a00"
            >
              Wonderlyf
            </text>
            <line x1="152" y1="397" x2="208" y2="397" stroke="#D4940A" strokeWidth="0.4" />
            <text
              x="180"
              y="409"
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="7"
              fill="#8B5A0A"
              letterSpacing="2.5"
            >
              PURE · RAW · HONEY
            </text>
          </motion.g>

          {/* Floating pollen particles */}
          {[
            { cx: 50, cy: 200, delay: 0 },
            { cx: 310, cy: 170, delay: 0.4 },
            { cx: 80, cy: 280, delay: 0.8 },
            { cx: 290, cy: 250, delay: 1.2 },
          ].map((p, i) => (
            <motion.circle
              key={i}
              cx={p.cx}
              r="1.5"
              fill="#FFF3B0"
              initial={{ cy: p.cy, opacity: 0 }}
              animate={{
                cy: [p.cy, p.cy - 50],
                opacity: [0, 0.9, 0],
              }}
              transition={{
                delay: p.delay,
                duration: 1.8,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </svg>
      </div>

      {/* Caption */}
      <motion.div
        className="relative z-10 text-center px-6 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <p className="text-[#F0C14B] text-sm italic font-light">
          Harvested wild. Bottled pure.
        </p>
      </motion.div>
    </section>
  );
}
