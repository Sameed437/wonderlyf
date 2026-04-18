import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const journeySteps = [
  { label: "Step 1", title: "From the Wild Forests", description: "Deep in the Western Ghats, wild bee colonies create nature's purest honey." },
  { label: "Step 2", title: "Handpicked Harvest", description: "Our farmers carefully harvest raw honeycomb, preserving every natural enzyme." },
  { label: "Step 3", title: "Cold Extracted & Pure", description: "No heat, no chemicals. Pure cold extraction keeps all the goodness intact." },
  { label: "Step 4", title: "Lab Tested & Certified", description: "FSSAI certified. Every batch tested for purity before it reaches you." },
  { label: "Step 5", title: "Ready for Your Home", description: "Sealed fresh and delivered from our kitchen to your doorstep." },
];

export default function ProductJourney() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

  const productScale = useTransform(scrollYProgress, [0, 0.15, 0.5, 0.85, 1], [0.3, 0.6, 1, 1.1, 1]);
  const productOpacity = useTransform(scrollYProgress, [0, 0.1, 0.5, 0.9, 1], [0, 0.5, 1, 1, 0.8]);
  const productRotate = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [15, 5, -2, 0]);
  const productY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -30]);
  const glowScale = useTransform(scrollYProgress, [0.4, 0.7, 1], [0.5, 1, 1.5]);
  const glowOpacity = useTransform(scrollYProgress, [0.3, 0.6, 0.9], [0, 0.4, 0.1]);
  const combOpacity = useTransform(scrollYProgress, [0, 0.15, 0.4], [0.5, 0.3, 0]);
  const combScale = useTransform(scrollYProgress, [0, 0.3], [1.2, 0.8]);
  const drip1Y = useTransform(scrollYProgress, [0.2, 0.5], [-20, 120]);
  const drip1Opacity = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.5], [0, 0.6, 0.6, 0]);
  const drip2Y = useTransform(scrollYProgress, [0.25, 0.55], [-10, 100]);
  const drip2Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.5, 0.55], [0, 0.4, 0.4, 0]);
  const badgeScale = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);
  const badgeOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
  const sparkle1 = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
  const sparkle2 = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const step1 = useTransform(scrollYProgress, [0, 0.15], [0.3, 1]);
  const step2 = useTransform(scrollYProgress, [0.15, 0.35], [0.3, 1]);
  const step3 = useTransform(scrollYProgress, [0.35, 0.55], [0.3, 1]);
  const step4 = useTransform(scrollYProgress, [0.55, 0.75], [0.3, 1]);
  const step5 = useTransform(scrollYProgress, [0.75, 0.9], [0.3, 1]);
  const stepOpacities = [step1, step2, step3, step4, step5];

  return (
    <div ref={containerRef} className="relative py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <p className="text-honey text-sm tracking-widest uppercase mb-3 font-medium">The Making Of</p>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-warm-brown mb-4">Our Forest Honey</h2>
        <p className="text-warm-light max-w-xl mx-auto">Watch how nature's golden elixir transforms from wild forests to your kitchen table.</p>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="relative flex flex-col md:flex-row items-center gap-12">
          <div className="relative w-full md:w-1/2 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
            <motion.svg viewBox="0 0 200 200" className="absolute w-48 h-48 md:w-64 md:h-64" style={{ opacity: combOpacity, scale: combScale }}>
              {[[60,50],[100,50],[140,50],[80,85],[120,85],[60,120],[100,120],[140,120],[80,155],[120,155]].map(([cx,cy],i) => (
                <polygon key={i} points={hexPoints(cx,cy,18)} fill="none" stroke="#D4940A" strokeWidth="0.8" opacity={0.15 + (i%3)*0.1} />
              ))}
            </motion.svg>

            <motion.div className="absolute w-3 rounded-full bg-gradient-to-b from-honey to-honey-dark" style={{ height: 30, left: "38%", top: "20%", y: drip1Y, opacity: drip1Opacity }} />
            <motion.div className="absolute w-2 rounded-full bg-gradient-to-b from-honey/80 to-honey-dark/80" style={{ height: 22, left: "58%", top: "25%", y: drip2Y, opacity: drip2Opacity }} />

            <motion.div className="relative z-10" style={{ scale: productScale, opacity: productOpacity, rotate: productRotate, y: productY }}>
              <img src="/products/8.png" alt="Forest Honey" className="w-40 h-40 md:w-64 md:h-64 object-contain drop-shadow-lg" draggable={false} />
            </motion.div>

            <motion.div className="absolute w-48 h-48 rounded-full blur-3xl -z-0" style={{ background: "radial-gradient(circle, rgba(212,148,10,0.15) 0%, transparent 70%)", scale: glowScale, opacity: glowOpacity }} />

            <motion.div className="absolute top-4 right-4 md:top-8 md:right-8 z-20" style={{ scale: badgeScale, opacity: badgeOpacity }}>
              <div className="bg-white shadow-warm rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-honey/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-warm-brown font-semibold tracking-wider uppercase">100% Pure</span>
              </div>
            </motion.div>

            <motion.div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20" style={{ scale: badgeScale, opacity: badgeOpacity }}>
              <div className="bg-white shadow-warm rounded-full px-3 py-1.5 border border-honey/10">
                <span className="text-[10px] text-honey-dark font-bold tracking-wider">FSSAI Certified</span>
              </div>
            </motion.div>

            {[{x:"20%",y:"30%",size:4},{x:"75%",y:"25%",size:3},{x:"80%",y:"65%",size:5},{x:"15%",y:"70%",size:3},{x:"50%",y:"10%",size:4},{x:"60%",y:"80%",size:3}].map((s,i) => (
              <motion.div key={i} className="absolute rounded-full bg-honey" style={{ width: s.size, height: s.size, left: s.x, top: s.y, opacity: i%2===0 ? sparkle1 : sparkle2 }} animate={{ scale: [1,1.5,1], opacity: [0.3,0.7,0.3] }} transition={{ duration: 2+i*0.3, repeat: Infinity, delay: i*0.4 }} />
            ))}
          </div>

          <div className="w-full md:w-1/2 space-y-1">
            <div className="relative h-1 bg-warm-brown/5 rounded-full mb-8 overflow-hidden">
              <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-honey to-honey-dark rounded-full" style={{ width: progressWidth }} />
            </div>

            {journeySteps.map((step, i) => (
              <motion.div key={i} className="flex items-start gap-4 py-4" style={{ opacity: stepOpacities[i] }}>
                <motion.div className="flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center" style={{ borderColor: useTransform(stepOpacities[i], [0.3,1], ["rgba(44,24,16,0.1)","rgba(212,148,10,0.6)"]) }}>
                  <motion.span className="text-xs font-bold" style={{ color: useTransform(stepOpacities[i], [0.3,1], ["rgba(44,24,16,0.2)","#D4940A"]) }}>{i+1}</motion.span>
                </motion.div>
                <div>
                  <p className="text-honey/60 text-[10px] tracking-[0.2em] uppercase mb-0.5">{step.label}</p>
                  <h4 className="text-warm-brown font-semibold text-sm mb-1">{step.title}</h4>
                  <p className="text-warm-light text-xs leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function hexPoints(cx, cy, r) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI/3)*i - Math.PI/6;
    return `${cx+r*Math.cos(angle)},${cy+r*Math.sin(angle)}`;
  }).join(" ");
}
