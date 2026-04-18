import { motion } from "framer-motion";

export default function HoneyJar() {
  return (
    <motion.div
      className="relative w-48 h-64 mx-auto"
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 200 280" className="w-full h-full drop-shadow-2xl">
        {/* Jar body */}
        <defs>
          <linearGradient id="honeyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd84d" />
            <stop offset="50%" stopColor="#e6b300" />
            <stop offset="100%" stopColor="#b38a00" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>
        </defs>

        {/* Cap */}
        <path
          d="M65 40 L65 65 L135 65 L135 40 Q130 35 100 33 Q70 35 65 40 Z"
          fill="#2d1b4e"
          stroke="rgba(255,205,26,0.3)"
          strokeWidth="1"
        />

        {/* Jar shape */}
        <path
          d="M55 65 Q40 80 38 120 L38 230 Q38 255 60 260 L140 260 Q162 255 162 230 L162 120 Q160 80 145 65 Z"
          fill="url(#glassGrad)"
          stroke="rgba(255,205,26,0.2)"
          strokeWidth="1"
        />

        {/* Honey fill */}
        <path
          d="M42 130 L42 228 Q42 252 62 256 L138 256 Q158 252 158 228 L158 130 Q150 125 100 122 Q50 125 42 130 Z"
          fill="url(#honeyGrad)"
          opacity="0.85"
        />

        {/* Highlight */}
        <path
          d="M52 82 Q48 132 50 205"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M56 95 Q54 122 55 155"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Label */}
        <rect
          x="60"
          y="155"
          width="80"
          height="55"
          rx="6"
          fill="rgba(11,2,24,0.7)"
          stroke="rgba(255,205,26,0.3)"
          strokeWidth="1"
        />
        <text
          x="100"
          y="178"
          textAnchor="middle"
          fill="#ffd84d"
          fontSize="10"
          fontFamily="'Playfair Display', serif"
          fontWeight="600"
        >
          WONDERLYF
        </text>
        <text
          x="100"
          y="196"
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="7"
        >
          Pure Heritage Honey
        </text>

        {/* Drip */}
        <motion.ellipse
          cx="100"
          cy="33"
          rx="4"
          ry="6"
          fill="#ffd84d"
          animate={{ cy: [33, 28, 33], ry: [6, 8, 6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Glow */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-amber-400 rounded-full scale-75" />
    </motion.div>
  );
}
