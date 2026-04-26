import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { honeyProcessStages } from "../../data/products";

export default function HoneyProcess() {
  const containerRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => setActiveStage(Math.min(Math.floor(v * 3), 2)));

  const stage1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.28, 0.36], [0, 1, 1, 0]);
  const stage2Opacity = useTransform(scrollYProgress, [0.34, 0.42, 0.62, 0.7], [0, 1, 1, 0]);
  const stage3Opacity = useTransform(scrollYProgress, [0.68, 0.76, 0.95, 1], [0, 1, 1, 1]);
  const stageOpacities = [stage1Opacity, stage2Opacity, stage3Opacity];

  const jarOutline = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const honeyFill = useTransform(scrollYProgress, [0.4, 0.6], [260, 130]);
  const labelOpacity = useTransform(scrollYProgress, [0.6, 0.72], [0, 1]);
  const labelScale = useTransform(scrollYProgress, [0.6, 0.72], [0.6, 1]);
  const capY = useTransform(scrollYProgress, [0.62, 0.75], [-40, 0]);
  const ribbonPath = useTransform(scrollYProgress, [0.8, 0.95], [0, 1]);
  const glowScale = useTransform(scrollYProgress, [0.85, 1], [0.5, 1.2]);
  const glowOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 0.3]);
  const leaf1X = useTransform(scrollYProgress, [0, 0.15], [-120, 0]);
  const leaf1Y = useTransform(scrollYProgress, [0, 0.15], [-60, 0]);
  const leaf2X = useTransform(scrollYProgress, [0, 0.15], [120, 0]);
  const leaf2Y = useTransform(scrollYProgress, [0, 0.15], [80, 0]);
  const leaf3Y = useTransform(scrollYProgress, [0, 0.12], [120, 0]);
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Extracted inline useTransform calls that were incorrectly inside JSX
  const glassOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const dripOpacity = useTransform(scrollYProgress, [0.4, 0.45, 0.55, 0.6], [0, 0.7, 0.7, 0]);
  const shineOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const ribbonOpacity = useTransform(scrollYProgress, [0.8, 0.85], [0, 1]);

  return (
    <>
      {/* ─── DESKTOP: Scroll-pinned ─── */}
      <div ref={containerRef} className="relative hidden md:block" style={{ height: "150vh" }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-cream">
          <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-2 gap-16 items-center">
            <div className="relative">
              {honeyProcessStages.map((stage, i) => (
                <motion.div key={stage.step} className="absolute inset-0 flex flex-col justify-center" style={{ opacity: stageOpacities[i] }}>
                  <div className="text-honey/50 text-xs tracking-[0.3em] uppercase mb-3">Step {stage.step} of 3</div>
                  <h3 className="font-serif text-4xl lg:text-5xl font-bold mb-2 text-warm-brown">{stage.title}</h3>
                  <p className="text-warm-light text-xl italic mb-4">{stage.subtitle}</p>
                  <p className="text-warm-light/70 text-base leading-relaxed max-w-md">{stage.description}</p>
                </motion.div>
              ))}
              <div className="invisible">
                <div className="text-xs mb-3">&nbsp;</div>
                <h3 className="font-serif text-4xl lg:text-5xl font-bold mb-2">&nbsp;</h3>
                <p className="text-xl mb-4">&nbsp;</p>
                <p className="text-base leading-relaxed max-w-md">&nbsp;<br />&nbsp;</p>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <svg viewBox="0 0 200 300" className="w-72 h-auto drop-shadow-lg">
                <defs>
                  <linearGradient id="hp-honeyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F0C14B" />
                    <stop offset="50%" stopColor="#D4940A" />
                    <stop offset="100%" stopColor="#8B6914" />
                  </linearGradient>
                  <linearGradient id="hp-glassGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(44,24,16,0.06)" />
                    <stop offset="100%" stopColor="rgba(44,24,16,0.02)" />
                  </linearGradient>
                  <clipPath id="hp-honeyClip">
                    <motion.rect x="38" width="124" height="140" style={{ y: honeyFill }} />
                  </clipPath>
                </defs>

                {/* Leaves & nature elements (stage 1) */}
                <motion.g style={{ opacity: stage1Opacity }}>
                  <motion.g style={{ x: leaf1X, y: leaf1Y }}>
                    <ellipse cx="60" cy="120" rx="15" ry="8" fill="rgba(76,175,80,0.5)" transform="rotate(-30 60 120)" />
                  </motion.g>
                  <motion.g style={{ x: leaf2X, y: leaf2Y }}>
                    <ellipse cx="140" cy="100" rx="12" ry="7" fill="rgba(76,175,80,0.4)" transform="rotate(20 140 100)" />
                  </motion.g>
                  <motion.g style={{ y: leaf3Y }}>
                    <circle cx="100" cy="160" r="6" fill="rgba(212,148,10,0.4)" />
                    {[0, 60, 120, 180, 240, 300].map((a) => (
                      <circle key={a} cx={100 + Math.cos((a * Math.PI) / 180) * 10} cy={160 + Math.sin((a * Math.PI) / 180) * 10} r="4" fill="rgba(212,148,10,0.2)" />
                    ))}
                  </motion.g>
                </motion.g>

                {/* Jar outline */}
                <motion.path
                  d="M55 65 Q40 80 38 120 L38 230 Q38 255 60 260 L140 260 Q162 255 162 230 L162 120 Q160 80 145 65 Z"
                  fill="none" stroke="rgba(212,148,10,0.3)" strokeWidth="1.5"
                  style={{ pathLength: jarOutline }}
                />

                {/* Jar glass fill */}
                <motion.path
                  d="M55 65 Q40 80 38 120 L38 230 Q38 255 60 260 L140 260 Q162 255 162 230 L162 120 Q160 80 145 65 Z"
                  fill="url(#hp-glassGrad)"
                  style={{ opacity: glassOpacity }}
                />

                {/* Honey fill */}
                <g clipPath="url(#hp-honeyClip)">
                  <path d="M42 130 L42 228 Q42 252 62 256 L138 256 Q158 252 158 228 L158 130 Q150 125 100 122 Q50 125 42 130 Z" fill="url(#hp-honeyGrad)" opacity="0.85" />
                </g>

                {/* Honey drip */}
                <motion.rect x="96" y="30" width="8" height="95" rx="4" fill="url(#hp-honeyGrad)" style={{ opacity: dripOpacity }} />

                {/* Glass shine */}
                <motion.g style={{ opacity: shineOpacity }}>
                  <path d="M52 82 Q48 132 50 205" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
                </motion.g>

                {/* Cap */}
                <motion.path
                  d="M65 40 L65 65 L135 65 L135 40 Q130 35 100 33 Q70 35 65 40 Z"
                  fill="#F5EBD8" stroke="rgba(212,148,10,0.2)" strokeWidth="1"
                  style={{ y: capY, opacity: labelOpacity }}
                />

                {/* Label */}
                <motion.g style={{ opacity: labelOpacity, scale: labelScale, originX: "100px", originY: "182px" }}>
                  <rect x="60" y="158" width="80" height="50" rx="6" fill="rgba(44,24,16,0.85)" stroke="rgba(212,148,10,0.3)" strokeWidth="1" />
                  <text x="100" y="178" textAnchor="middle" fill="#F0C14B" fontSize="9" fontFamily="'Playfair Display', serif" fontWeight="600">WONDERLYF</text>
                  <text x="100" y="194" textAnchor="middle" fill="rgba(245,235,216,0.6)" fontSize="6.5">Pure Heritage Honey</text>
                </motion.g>

                {/* Ribbon */}
                <motion.path
                  d="M70 65 Q65 55 55 60 Q60 70 70 65 M130 65 Q135 55 145 60 Q140 70 130 65"
                  fill="none" stroke="#D4940A" strokeWidth="1.5" strokeLinecap="round"
                  style={{ pathLength: ribbonPath, opacity: ribbonOpacity }}
                />

                {/* Glow */}
                <motion.circle cx="100" cy="160" r="100" fill="none" stroke="rgba(212,148,10,0.1)" strokeWidth="2" style={{ scale: glowScale, opacity: glowOpacity }} />
              </svg>

              <motion.div className="absolute w-64 h-64 rounded-full blur-3xl -z-10" style={{ background: "radial-gradient(circle, rgba(212,148,10,0.1) 0%, transparent 70%)", scale: glowScale, opacity: glowOpacity }} />
            </div>
          </div>

          {/* Progress indicator */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <div className="relative h-48 w-px">
              <div className="absolute inset-0 bg-warm-brown/10 rounded-full" />
              <motion.div className="absolute top-0 left-0 w-full bg-honey/60 rounded-full origin-top" style={{ height: progressHeight }} />
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-48 flex flex-col justify-between">
              {honeyProcessStages.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${i <= activeStage ? "border-honey bg-honey/20 scale-110" : "border-warm-brown/15 bg-cream"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MOBILE: Timeline layout ─── */}
      <div className="md:hidden px-4 py-16">
        <div className="relative max-w-sm mx-auto">
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-honey/20" />
          {honeyProcessStages.map((stage, i) => (
            <motion.div
              key={stage.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 120 }}
              className="relative pl-16 pb-10 last:pb-0"
            >
              <div className="absolute left-3 top-0 w-7 h-7 rounded-full bg-honey/15 border-2 border-honey flex items-center justify-center">
                <span className="text-honey font-bold text-xs">{stage.step}</span>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-warm border border-honey/10">
                <p className="text-honey text-xs tracking-[0.2em] uppercase font-medium mb-1">Step {stage.step}</p>
                <h3 className="font-serif text-lg font-bold text-warm-brown mb-1">{stage.title}</h3>
                <p className="text-warm-light italic text-sm mb-2">{stage.subtitle}</p>
                <p className="text-warm-light/70 text-sm leading-relaxed">{stage.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
