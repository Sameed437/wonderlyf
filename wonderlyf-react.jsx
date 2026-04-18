import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   WONDERLYF — Mobile-First React Product Experience
   Honey Jar Assembly Animation + Full Product Showcase
   ───────────────────────────────────────────── */

// ══════════════════════════════════════════════
// 1. PRELOADER
// ══════════════════════════════════════════════
function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let frame;
    let start = Date.now();
    const duration = 2200;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 600);
        }, 400);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#1a0a2e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* Animated honey drip */}
      <div style={{ position: "relative", width: 80, height: 100, marginBottom: 32 }}>
        <svg viewBox="0 0 80 100" width="80" height="100">
          <defs>
            <linearGradient id="honeyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>
          <ellipse cx="40" cy="55" rx="28" ry="32" fill="url(#honeyGrad)" opacity="0.9">
            <animate attributeName="ry" values="28;32;28" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
          <path d="M32 25 Q40 0 48 25" fill="url(#honeyGrad)" opacity="0.8">
            <animate attributeName="d" values="M32 25 Q40 5 48 25;M32 25 Q40 -2 48 25;M32 25 Q40 5 48 25" dur="2s" repeatCount="indefinite" />
          </path>
          <ellipse cx="40" cy="50" rx="8" ry="6" fill="#FFF8DC" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
          </ellipse>
        </svg>
      </div>

      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 28, color: "#FFD700", fontWeight: 600, letterSpacing: 3 }}>
        WONDERLYF
      </div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 12, color: "#B8860B", letterSpacing: 6, marginTop: 4, textTransform: "uppercase" }}>
        Nature's Gold
      </div>

      {/* Progress bar */}
      <div style={{ width: 180, height: 3, background: "rgba(255,215,0,0.15)", borderRadius: 3, marginTop: 32, overflow: "hidden" }}>
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg, #FFD700, #B8860B)",
            borderRadius: 3,
            transition: "width 0.1s linear",
          }}
        />
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,215,0,0.5)", marginTop: 10 }}>
        {progress}%
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// 2. HONEY JAR ASSEMBLY SCENE (CSS 3D)
// ══════════════════════════════════════════════
function HoneyJarAssembly({ scrollProgress = 0 }) {
  // 6 stages mapped to scroll progress 0–1
  // 0.00–0.15: Glass jar forms (scale up + fade in)
  // 0.15–0.35: Ingredients orbit around jar
  // 0.35–0.55: Honey pours & fills jar
  // 0.55–0.70: Label wraps around jar
  // 0.70–0.85: Cap bounces down onto jar
  // 0.85–1.00: Final sparkle reveal

  const stage = scrollProgress;

  // Jar appearance
  const jarScale = stage < 0.15 ? stage / 0.15 : 1;
  const jarOpacity = stage < 0.15 ? stage / 0.15 : 1;

  // Honey fill level (0 to 1)
  const fillStart = 0.35;
  const fillEnd = 0.55;
  const fillLevel = stage < fillStart ? 0 : stage > fillEnd ? 1 : (stage - fillStart) / (fillEnd - fillStart);

  // Label
  const labelStart = 0.55;
  const labelEnd = 0.70;
  const labelProgress = stage < labelStart ? 0 : stage > labelEnd ? 1 : (stage - labelStart) / (labelEnd - labelStart);

  // Cap
  const capStart = 0.70;
  const capEnd = 0.85;
  const capProgress = stage < capStart ? 0 : stage > capEnd ? 1 : (stage - capStart) / (capEnd - capStart);
  const capBounce = capProgress < 0.5 ? capProgress * 2 : 1 - Math.sin((capProgress - 0.5) * 2 * Math.PI) * 0.15 * (1 - capProgress);

  // Sparkle
  const sparkleStart = 0.85;
  const sparkleProgress = stage < sparkleStart ? 0 : (stage - sparkleStart) / (1 - sparkleStart);

  // Ingredients orbit
  const orbitStart = 0.15;
  const orbitEnd = 0.35;
  const orbitProgress = stage < orbitStart ? 0 : stage > orbitEnd ? 1 : (stage - orbitStart) / (orbitEnd - orbitStart);

  const ingredients = [
    { emoji: "🌿", label: "Herbs", angle: 0 },
    { emoji: "🍯", label: "Raw Honey", angle: 60 },
    { emoji: "🌸", label: "Flowers", angle: 120 },
    { emoji: "🫚", label: "Ginger", angle: 180 },
    { emoji: "🍋", label: "Lemon", angle: 240 },
    { emoji: "✨", label: "Spices", angle: 300 },
  ];

  // Stage label text
  const getStageText = () => {
    if (stage < 0.15) return "Crafting the perfect vessel...";
    if (stage < 0.35) return "Gathering nature's finest ingredients...";
    if (stage < 0.55) return "Pouring liquid gold...";
    if (stage < 0.70) return "Sealing with heritage...";
    if (stage < 0.85) return "The finishing touch...";
    return "Pure. Natural. Wonderlyf.";
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: `radial-gradient(ellipse at 50% 60%, rgba(255,215,0,${0.08 + sparkleProgress * 0.12}) 0%, transparent 70%)`,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,215,0,${0.1 + fillLevel * 0.15}) 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(40px)",
        }}
      />

      {/* Orbiting ingredients */}
      {ingredients.map((ing, i) => {
        const baseAngle = ing.angle + (orbitProgress > 0 ? orbitProgress * 720 : 0);
        const radius = orbitProgress < 1 ? 120 + (1 - orbitProgress) * 30 : 0;
        const opacity = orbitProgress > 0 && orbitProgress < 1 ? Math.sin(orbitProgress * Math.PI) : 0;
        const rad = (baseAngle * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius * 0.5;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              fontSize: 28,
              opacity,
              transition: "none",
              textShadow: "0 4px 12px rgba(0,0,0,0.3)",
              zIndex: y > 0 ? 20 : 5,
            }}
          >
            <div>{ing.emoji}</div>
            <div
              style={{
                fontSize: 8,
                color: "#FFD700",
                textAlign: "center",
                fontFamily: "'Fredoka', sans-serif",
                marginTop: 2,
                textShadow: "0 1px 4px rgba(0,0,0,0.8)",
              }}
            >
              {ing.label}
            </div>
          </div>
        );
      })}

      {/* THE JAR — SVG based for reliability */}
      <div
        style={{
          transform: `scale(${jarScale * (0.9 + sparkleProgress * 0.1)})`,
          opacity: jarOpacity,
          position: "relative",
          zIndex: 10,
          filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.3)) drop-shadow(0 0 ${sparkleProgress * 30}px rgba(255,215,0,${sparkleProgress * 0.5}))`,
        }}
      >
        <svg viewBox="0 0 200 280" width="180" height="252" style={{ display: "block" }}>
          <defs>
            <linearGradient id="jarGlass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(200,220,255,0.25)" />
              <stop offset="30%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(200,220,255,0.2)" />
            </linearGradient>
            <linearGradient id="honeyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#DAA520" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
            <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B6914" />
              <stop offset="50%" stopColor="#654321" />
              <stop offset="100%" stopColor="#3E2723" />
            </linearGradient>
            <clipPath id="jarClip">
              <path d="M55 65 Q40 80 38 120 L38 230 Q38 255 60 260 L140 260 Q162 255 162 230 L162 120 Q160 80 145 65 Z" />
            </clipPath>
          </defs>

          {/* Jar body (glass) */}
          <path
            d="M55 65 Q40 80 38 120 L38 230 Q38 255 60 260 L140 260 Q162 255 162 230 L162 120 Q160 80 145 65 Z"
            fill="url(#jarGlass)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
          />

          {/* Honey fill */}
          <g clipPath="url(#jarClip)">
            <rect
              x="38"
              y={260 - fillLevel * 195}
              width="124"
              height={fillLevel * 200}
              fill="url(#honeyFill)"
              opacity={fillLevel > 0 ? 0.85 : 0}
            />
            {/* Honey surface wave */}
            {fillLevel > 0 && fillLevel < 1 && (
              <ellipse
                cx="100"
                cy={260 - fillLevel * 195}
                rx="62"
                ry="5"
                fill="#FFD700"
                opacity="0.6"
              />
            )}
            {/* Honey bubbles */}
            {fillLevel > 0.3 && (
              <>
                <circle cx="75" cy={220 - fillLevel * 60} r="3" fill="#FFE44D" opacity="0.4" />
                <circle cx="120" cy={200 - fillLevel * 50} r="2" fill="#FFE44D" opacity="0.3" />
                <circle cx="95" cy={240 - fillLevel * 70} r="2.5" fill="#FFE44D" opacity="0.35" />
              </>
            )}
          </g>

          {/* Jar neck */}
          <path
            d="M65 40 L65 65 L135 65 L135 40 Q130 35 100 33 Q70 35 65 40 Z"
            fill="url(#jarGlass)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />

          {/* Glass reflection */}
          <path
            d="M52 80 Q48 130 50 200"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M56 90 Q54 120 55 150"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />

          {/* Label */}
          <g opacity={labelProgress} transform={`translate(${(1 - labelProgress) * 40}, 0)`}>
            <rect x="50" y="140" width="100" height="80" rx="6" fill="#3C3D99" opacity="0.9" />
            <rect x="52" y="142" width="96" height="76" rx="5" fill="none" stroke="#FFD700" strokeWidth="0.8" opacity="0.6" />
            <text x="100" y="165" textAnchor="middle" fill="#FFD700" fontSize="11" fontFamily="Fredoka, sans-serif" fontWeight="600">
              WONDERLYF
            </text>
            <text x="100" y="180" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="Fredoka, sans-serif" opacity="0.8">
              Pure Heritage Honey
            </text>
            <line x1="70" y1="188" x2="130" y2="188" stroke="#FFD700" strokeWidth="0.4" opacity="0.5" />
            <text x="100" y="200" textAnchor="middle" fill="#FFD700" fontSize="6" fontFamily="Fredoka, sans-serif" opacity="0.7">
              100% Natural • Organic
            </text>
            <text x="100" y="212" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="5" fontFamily="Fredoka, sans-serif">
              500ml • Product of India
            </text>
          </g>

          {/* Cap */}
          <g
            transform={`translate(0, ${capProgress > 0 ? -(1 - capBounce) * 80 : -120})`}
            opacity={capProgress > 0 ? 1 : 0}
          >
            <rect x="60" y="25" width="80" height="20" rx="4" fill="url(#capGrad)" />
            <rect x="58" y="28" width="84" height="10" rx="2" fill="#654321" />
            {/* Cap texture lines */}
            <line x1="68" y1="29" x2="68" y2="37" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="80" y1="29" x2="80" y2="37" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="92" y1="29" x2="92" y2="37" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="104" y1="29" x2="104" y2="37" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="116" y1="29" x2="116" y2="37" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="128" y1="29" x2="128" y2="37" stroke="rgba(255,255,255,0.1" strokeWidth="0.5" />
          </g>

          {/* Pour stream when filling */}
          {fillLevel > 0 && fillLevel < 0.95 && (
            <path
              d={`M97 0 Q100 ${30 + fillLevel * 10} 100 ${65 - fillLevel * 5}`}
              stroke="url(#honeyFill)"
              strokeWidth="6"
              fill="none"
              opacity={0.7 * (1 - fillLevel)}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Sparkle particles */}
        {sparkleProgress > 0 &&
          Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 360;
            const rad = (angle * Math.PI) / 180;
            const dist = 60 + sparkleProgress * 80;
            const x = Math.cos(rad) * dist;
            const y = Math.sin(rad) * dist;
            return (
              <div
                key={`sparkle-${i}`}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 4 + Math.random() * 4,
                  height: 4 + Math.random() * 4,
                  borderRadius: "50%",
                  background: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#FFF8DC" : "#B8860B",
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  opacity: sparkleProgress * (1 - sparkleProgress) * 4,
                  boxShadow: `0 0 ${6 + sparkleProgress * 10}px ${i % 3 === 0 ? "#FFD700" : "#FFF8DC"}`,
                }}
              />
            );
          })}
      </div>

      {/* Stage text */}
      <div
        style={{
          marginTop: 40,
          fontFamily: "'Fredoka', sans-serif",
          fontSize: 16,
          color: "#FFD700",
          textAlign: "center",
          opacity: 0.9,
          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          padding: "0 20px",
          maxWidth: 300,
          lineHeight: 1.5,
        }}
      >
        {getStageText()}
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        {[0, 0.15, 0.35, 0.55, 0.70, 0.85].map((threshold, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: stage >= threshold ? "#FFD700" : "rgba(255,215,0,0.2)",
              transition: "background 0.3s ease",
              boxShadow: stage >= threshold ? "0 0 8px rgba(255,215,0,0.5)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// 3. PRODUCT CARD
// ══════════════════════════════════════════════
function ProductCard({ product, index, isVisible }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      style={{
        width: "100%",
        maxWidth: 300,
        background: "rgba(255,255,255,0.04)",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid rgba(255,215,0,0.1)",
        transform: `translateY(${isVisible ? 0 : 40}px) scale(${hovered ? 1.02 : 1})`,
        opacity: isVisible ? 1 : 0,
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s`,
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {/* Product Image Area */}
      <div
        style={{
          height: 200,
          background: `linear-gradient(135deg, ${product.bg[0]}, ${product.bg[1]})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.1)",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${hovered ? 1.2 : 1})`,
            transition: "transform 0.6s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.08)",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${hovered ? 1.3 : 1})`,
            transition: "transform 0.8s ease",
          }}
        />

        <div
          style={{
            fontSize: 64,
            transform: `scale(${hovered ? 1.15 : 1}) rotate(${hovered ? -5 : 0}deg)`,
            transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            filter: `drop-shadow(0 8px 16px rgba(0,0,0,0.3))`,
          }}
        >
          {product.emoji}
        </div>

        {/* Category tag */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            padding: "4px 10px",
            borderRadius: 20,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
            fontSize: 10,
            color: "#FFD700",
            fontFamily: "'Fredoka', sans-serif",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {product.category}
        </div>
      </div>

      {/* Product Info */}
      <div style={{ padding: "16px 18px 20px" }}>
        <div
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: 17,
            color: "#FFFFFF",
            fontWeight: 500,
            marginBottom: 6,
          }}
        >
          {product.name}
        </div>
        <div
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.5,
            marginBottom: 12,
          }}
        >
          {product.desc}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 20, color: "#FFD700", fontWeight: 600 }}>
            ₹{product.price}
          </div>
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 25,
              background: hovered ? "#FFD700" : "rgba(255,215,0,0.12)",
              color: hovered ? "#1a0a2e" : "#FFD700",
              fontSize: 12,
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 600,
              transition: "all 0.3s ease",
              letterSpacing: 0.5,
            }}
          >
            Add to Cart
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// 4. FEATURE PILL
// ══════════════════════════════════════════════
function FeaturePill({ icon, text, delay = 0, isVisible }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 18px",
        borderRadius: 50,
        background: "rgba(255,215,0,0.06)",
        border: "1px solid rgba(255,215,0,0.12)",
        transform: `translateY(${isVisible ? 0 : 20}px)`,
        opacity: isVisible ? 1 : 0,
        transition: `all 0.5s ease ${delay}s`,
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
        {text}
      </span>
    </div>
  );
}

// ══════════════════════════════════════════════
// 5. TESTIMONIAL CARD
// ══════════════════════════════════════════════
function TestimonialCard({ testimonial, isVisible, delay }) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 20,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,215,0,0.08)",
        maxWidth: 300,
        width: "100%",
        transform: `translateY(${isVisible ? 0 : 30}px)`,
        opacity: isVisible ? 1 : 0,
        transition: `all 0.6s ease ${delay}s`,
      }}
    >
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ fontSize: 14, color: "#FFD700" }}>★</span>
        ))}
      </div>
      <div
        style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: 14,
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.6,
          marginBottom: 16,
          fontStyle: "italic",
        }}
      >
        "{testimonial.text}"
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${testimonial.color}, #3C3D99)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          {testimonial.avatar}
        </div>
        <div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 13, color: "#FFFFFF", fontWeight: 500 }}>
            {testimonial.name}
          </div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
            {testimonial.location}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// 6. INTERSECTION OBSERVER HOOK
// ══════════════════════════════════════════════
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

// ══════════════════════════════════════════════
// 7. CATEGORY BADGE (horizontally scrolling)
// ══════════════════════════════════════════════
function CategoryBadge({ name, emoji, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "10px 18px",
        borderRadius: 50,
        background: isActive ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${isActive ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.08)"}`,
        color: isActive ? "#FFD700" : "rgba(255,255,255,0.6)",
        fontFamily: "'Fredoka', sans-serif",
        fontSize: 13,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.3s ease",
        flexShrink: 0,
        outline: "none",
      }}
    >
      <span>{emoji}</span>
      <span>{name}</span>
    </button>
  );
}

// ══════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════
export default function WonderLyfApp() {
  const [loaded, setLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const assemblyRef = useRef(null);

  const [heroRef, heroVisible] = useInView(0.1);
  const [featRef, featVisible] = useInView(0.15);
  const [prodRef, prodVisible] = useInView(0.1);
  const [testRef, testVisible] = useInView(0.15);
  const [ctaRef, ctaVisible] = useInView(0.15);
  const [storyRef, storyVisible] = useInView(0.15);

  // Scroll-driven assembly animation
  useEffect(() => {
    const handleScroll = () => {
      if (!assemblyRef.current) return;
      const rect = assemblyRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const sectionH = assemblyRef.current.offsetHeight;
      const scrolled = -rect.top;
      const total = sectionH - windowH;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const products = [
    { name: "Heritage Honey", emoji: "🍯", price: 499, category: "Nature's Gold", desc: "Pure, unprocessed honey from wild bee colonies in the Western Ghats.", bg: ["#B8860B", "#8B6914"] },
    { name: "Toor Dal Premium", emoji: "🫘", price: 199, category: "Healing Bowl", desc: "Stone-ground, sun-dried dal with authentic village flavor.", bg: ["#8B4513", "#654321"] },
    { name: "Kambu Ladoo", emoji: "🧁", price: 349, category: "Grandma's Crunch", desc: "Pearl millet ladoos sweetened with jaggery and ghee.", bg: ["#DAA520", "#B8860B"] },
    { name: "Moringa Relish", emoji: "🌿", price: 279, category: "Heritage Preserves", desc: "Traditional drumstick leaf preserve with healing spices.", bg: ["#2E7D32", "#1B5E20"] },
    { name: "Keshkalpa Oil", emoji: "🧴", price: 599, category: "Traditional Delights", desc: "Ancient Ayurvedic herbal hair oil with 21 botanicals.", bg: ["#4A148C", "#311B92"] },
    { name: "Banana Stem Soup", emoji: "🍲", price: 189, category: "Instant Vitality", desc: "Instant soup mix from banana stem — detox & nourish.", bg: ["#33691E", "#1B5E20"] },
    { name: "Mudakathan Thokku", emoji: "🫙", price: 249, category: "Heritage Preserves", desc: "Balloon vine chutney — grandmother's immunity recipe.", bg: ["#BF360C", "#8B0000"] },
    { name: "Spice Blend Box", emoji: "🧂", price: 799, category: "Spice Blends", desc: "Curated box of 6 traditional hand-ground masala blends.", bg: ["#E65100", "#BF360C"] },
  ];

  const categories = [
    { name: "All", emoji: "✨" },
    { name: "Nature's Gold", emoji: "🍯" },
    { name: "Healing Bowl", emoji: "🥣" },
    { name: "Heritage Preserves", emoji: "🫙" },
    { name: "Grandma's Crunch", emoji: "🍪" },
    { name: "Spice Blends", emoji: "🧂" },
    { name: "Traditional Delights", emoji: "🪷" },
    { name: "Instant Vitality", emoji: "⚡" },
  ];

  const testimonials = [
    { text: "The Heritage Honey tastes like what honey should always taste like. My family is hooked!", name: "Priya Sharma", location: "Chennai, India", avatar: "👩", color: "#FFD700" },
    { text: "Kambu Ladoo brings back memories of my grandmother's kitchen. Authentic and delicious.", name: "Rajesh Kumar", location: "Bangalore, India", avatar: "👨", color: "#B8860B" },
    { text: "The Keshkalpa Oil transformed my hair. I've tried everything and this actually works!", name: "Anita Patel", location: "Mumbai, India", avatar: "👩", color: "#3C3D99" },
  ];

  const filteredProducts =
    activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0520",
        color: "#fff",
        fontFamily: "'Fredoka', system-ui, sans-serif",
        overflowX: "hidden",
        maxWidth: "100vw",
      }}
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #0d0520; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d0520; }
        ::-webkit-scrollbar-thumb { background: rgba(255,215,0,0.3); border-radius: 4px; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes drip1 { 0% { transform: translateY(-10px); opacity:0; } 30% { opacity:1; } 100% { transform: translateY(60px); opacity:0; } }
        @keyframes drip2 { 0% { transform: translateY(-10px); opacity:0; } 30% { opacity:1; } 100% { transform: translateY(80px); opacity:0; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

      {/* PRELOADER */}
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      {/* ═══════ NAVBAR ═══════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(13,5,32,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,215,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🍯</span>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#FFD700", letterSpacing: 1 }}>Wonderlyf</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: 18, cursor: "pointer" }}>🔍</span>
          <div style={{ position: "relative", cursor: "pointer" }}>
            <span style={{ fontSize: 18 }}>🛒</span>
            <div
              style={{
                position: "absolute",
                top: -4,
                right: -6,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#FFD700",
                fontSize: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0d0520",
                fontWeight: 700,
              }}
            >
              3
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════ HERO SECTION ═══════ */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px 40px",
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* Ambient particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            style={{
              position: "absolute",
              width: 4 + i * 2,
              height: 4 + i * 2,
              borderRadius: "50%",
              background: "rgba(255,215,0,0.15)",
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}

        {/* Honey drips */}
        <div style={{ position: "absolute", top: 0, left: "30%", width: 3, height: 60, overflow: "hidden" }}>
          <div style={{ width: 3, height: 12, borderRadius: 3, background: "rgba(255,215,0,0.3)", animation: "drip1 2.5s ease-in infinite" }} />
        </div>
        <div style={{ position: "absolute", top: 0, left: "70%", width: 2, height: 80, overflow: "hidden" }}>
          <div style={{ width: 2, height: 10, borderRadius: 3, background: "rgba(255,215,0,0.2)", animation: "drip2 3s ease-in infinite 1s" }} />
        </div>

        <div
          style={{
            fontSize: 14,
            color: "#B8860B",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 16,
            transform: `translateY(${heroVisible ? 0 : 20}px)`,
            opacity: heroVisible ? 1 : 0,
            transition: "all 0.6s ease 0.1s",
          }}
        >
          Woman-Led • Heritage • Organic
        </div>

        <h1
          style={{
            fontSize: "clamp(36px, 10vw, 56px)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 16,
            transform: `translateY(${heroVisible ? 0 : 30}px)`,
            opacity: heroVisible ? 1 : 0,
            transition: "all 0.7s ease 0.2s",
          }}
        >
          <span style={{ color: "#FFD700" }}>Nature's</span>
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #FFD700, #FFF8DC, #FFD700)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
            }}
          >
            Golden Touch
          </span>
        </h1>

        <p
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.6)",
            maxWidth: 320,
            lineHeight: 1.7,
            marginBottom: 32,
            transform: `translateY(${heroVisible ? 0 : 20}px)`,
            opacity: heroVisible ? 1 : 0,
            transition: "all 0.6s ease 0.35s",
          }}
        >
          Traditional Indian wellness products crafted with ancient wisdom and modern purity. From our kitchen to yours.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            transform: `translateY(${heroVisible ? 0 : 20}px)`,
            opacity: heroVisible ? 1 : 0,
            transition: "all 0.6s ease 0.45s",
          }}
        >
          <button
            style={{
              padding: "14px 32px",
              borderRadius: 50,
              background: "linear-gradient(135deg, #FFD700, #B8860B)",
              border: "none",
              color: "#0d0520",
              fontSize: 15,
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(255,215,0,0.25)",
            }}
          >
            Shop Now
          </button>
          <button
            style={{
              padding: "14px 24px",
              borderRadius: 50,
              background: "transparent",
              border: "1px solid rgba(255,215,0,0.3)",
              color: "#FFD700",
              fontSize: 15,
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Our Story
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            animation: "pulse 2s ease infinite",
          }}
        >
          <div style={{ fontSize: 10, color: "rgba(255,215,0,0.4)", letterSpacing: 2, textTransform: "uppercase" }}>
            Scroll
          </div>
          <div style={{ width: 1, height: 24, background: "linear-gradient(180deg, rgba(255,215,0,0.4), transparent)" }} />
        </div>
      </section>

      {/* ═══════ ASSEMBLY ANIMATION SECTION ═══════ */}
      <section
        ref={assemblyRef}
        style={{
          height: "400vh",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(ellipse at 50% 50%, rgba(60,61,153,0.15) 0%, #0d0520 70%)",
          }}
        >
          <HoneyJarAssembly scrollProgress={scrollProgress} />
        </div>
      </section>

      {/* ═══════ FEATURES SECTION ═══════ */}
      <section ref={featRef} style={{ padding: "80px 24px", textAlign: "center" }}>
        <div
          style={{
            fontSize: 12,
            color: "#B8860B",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 12,
            transform: `translateY(${featVisible ? 0 : 20}px)`,
            opacity: featVisible ? 1 : 0,
            transition: "all 0.5s ease",
          }}
        >
          Why Wonderlyf
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 7vw, 40px)",
            fontWeight: 600,
            color: "#FFD700",
            marginBottom: 40,
            transform: `translateY(${featVisible ? 0 : 20}px)`,
            opacity: featVisible ? 1 : 0,
            transition: "all 0.5s ease 0.1s",
          }}
        >
          Rooted in Tradition
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
            maxWidth: 400,
            margin: "0 auto",
          }}
        >
          <FeaturePill icon="🌱" text="100% Organic" delay={0.1} isVisible={featVisible} />
          <FeaturePill icon="👩‍🌾" text="Woman-Led" delay={0.2} isVisible={featVisible} />
          <FeaturePill icon="🏺" text="Ancient Recipes" delay={0.3} isVisible={featVisible} />
          <FeaturePill icon="🚫" text="No Preservatives" delay={0.4} isVisible={featVisible} />
          <FeaturePill icon="🇮🇳" text="Made in India" delay={0.5} isVisible={featVisible} />
          <FeaturePill icon="💚" text="Eco-Friendly" delay={0.6} isVisible={featVisible} />
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            marginTop: 48,
            flexWrap: "wrap",
          }}
        >
          {[
            { num: "50+", label: "Products" },
            { num: "10K+", label: "Happy Families" },
            { num: "100%", label: "Natural" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                transform: `translateY(${featVisible ? 0 : 20}px)`,
                opacity: featVisible ? 1 : 0,
                transition: `all 0.5s ease ${0.4 + i * 0.1}s`,
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 700, color: "#FFD700" }}>{stat.num}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ OUR STORY SECTION ═══════ */}
      <section
        ref={storyRef}
        style={{
          padding: "60px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent, rgba(60,61,153,0.08), transparent)",
          }}
        />
        <div style={{ maxWidth: 400, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: 48,
              textAlign: "center",
              marginBottom: 20,
              transform: `translateY(${storyVisible ? 0 : 20}px)`,
              opacity: storyVisible ? 1 : 0,
              transition: "all 0.5s ease",
            }}
          >
            🪷
          </div>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#FFD700",
              textAlign: "center",
              marginBottom: 20,
              transform: `translateY(${storyVisible ? 0 : 20}px)`,
              opacity: storyVisible ? 1 : 0,
              transition: "all 0.5s ease 0.1s",
            }}
          >
            From Our Kitchen
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.8,
              textAlign: "center",
              transform: `translateY(${storyVisible ? 0 : 20}px)`,
              opacity: storyVisible ? 1 : 0,
              transition: "all 0.5s ease 0.2s",
            }}
          >
            Every Wonderlyf product carries the warmth of a grandmother's kitchen. We partner with rural artisans and women-led cooperatives across South India to bring you recipes passed down through generations — made with the same love and care as the originals.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 32,
            }}
          >
            {[
              { icon: "🌾", title: "Farm Fresh", text: "Direct from organic farms" },
              { icon: "👵", title: "Grandma's Way", text: "Traditional hand-made process" },
              { icon: "🧪", title: "Lab Tested", text: "Quality assured purity" },
              { icon: "📦", title: "Eco Packed", text: "Sustainable packaging" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: "rgba(255,215,0,0.04)",
                  border: "1px solid rgba(255,215,0,0.08)",
                  textAlign: "center",
                  transform: `translateY(${storyVisible ? 0 : 20}px)`,
                  opacity: storyVisible ? 1 : 0,
                  transition: `all 0.5s ease ${0.3 + i * 0.1}s`,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#FFD700", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PRODUCTS SECTION ═══════ */}
      <section ref={prodRef} style={{ padding: "60px 0" }}>
        <div style={{ padding: "0 24px", marginBottom: 24 }}>
          <div
            style={{
              fontSize: 12,
              color: "#B8860B",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 8,
              transform: `translateY(${prodVisible ? 0 : 20}px)`,
              opacity: prodVisible ? 1 : 0,
              transition: "all 0.5s ease",
            }}
          >
            Our Products
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 7vw, 38px)",
              fontWeight: 600,
              color: "#FFD700",
              transform: `translateY(${prodVisible ? 0 : 20}px)`,
              opacity: prodVisible ? 1 : 0,
              transition: "all 0.5s ease 0.1s",
            }}
          >
            Shop the Collection
          </h2>
        </div>

        {/* Category pills — horizontal scroll */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "0 24px",
            marginBottom: 24,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {categories.map((cat) => (
            <CategoryBadge
              key={cat.name}
              name={cat.name}
              emoji={cat.emoji}
              isActive={activeCategory === cat.name}
              onClick={() => setActiveCategory(cat.name)}
            />
          ))}
        </div>

        {/* Product grid */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            padding: "0 24px",
          }}
        >
          {/* Two-column grid on slightly wider screens */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
              width: "100%",
              maxWidth: 640,
            }}
          >
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.name} product={product} index={i} isVisible={prodVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section ref={testRef} style={{ padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              fontSize: 12,
              color: "#B8860B",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 8,
              transform: `translateY(${testVisible ? 0 : 20}px)`,
              opacity: testVisible ? 1 : 0,
              transition: "all 0.5s ease",
            }}
          >
            Testimonials
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 7vw, 38px)",
              fontWeight: 600,
              color: "#FFD700",
              transform: `translateY(${testVisible ? 0 : 20}px)`,
              opacity: testVisible ? 1 : 0,
              transition: "all 0.5s ease 0.1s",
            }}
          >
            Loved by Families
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "center",
          }}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} isVisible={testVisible} delay={0.15 + i * 0.12} />
          ))}
        </div>
      </section>

      {/* ═══════ CTA SECTION ═══════ */}
      <section
        ref={ctaRef}
        style={{
          padding: "80px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.06) 0%, transparent 70%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: 56,
              marginBottom: 16,
              transform: `translateY(${ctaVisible ? 0 : 20}px) scale(${ctaVisible ? 1 : 0.8})`,
              opacity: ctaVisible ? 1 : 0,
              transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            🍯
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 8vw, 44px)",
              fontWeight: 700,
              color: "#FFD700",
              marginBottom: 16,
              transform: `translateY(${ctaVisible ? 0 : 20}px)`,
              opacity: ctaVisible ? 1 : 0,
              transition: "all 0.5s ease 0.15s",
            }}
          >
            Start Your
            <br />
            Wellness Journey
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 320,
              margin: "0 auto 32px",
              lineHeight: 1.7,
              transform: `translateY(${ctaVisible ? 0 : 20}px)`,
              opacity: ctaVisible ? 1 : 0,
              transition: "all 0.5s ease 0.25s",
            }}
          >
            Join 10,000+ families who trust Wonderlyf for their daily wellness. Free shipping on orders above ₹499.
          </p>
          <button
            style={{
              padding: "16px 40px",
              borderRadius: 50,
              background: "linear-gradient(135deg, #FFD700, #B8860B)",
              border: "none",
              color: "#0d0520",
              fontSize: 16,
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 12px 40px rgba(255,215,0,0.3)",
              transform: `translateY(${ctaVisible ? 0 : 20}px)`,
              opacity: ctaVisible ? 1 : 0,
              transition: "all 0.5s ease 0.35s",
            }}
          >
            Explore All Products →
          </button>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer
        style={{
          padding: "40px 24px 24px",
          borderTop: "1px solid rgba(255,215,0,0.08)",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 22 }}>🍯</span>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#FFD700" }}>Wonderlyf</span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 320, margin: "0 auto 20px" }}>
          Traditional Indian wellness products. Crafted with love, rooted in heritage. Woman-led and proudly made in India.
        </p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 20 }}>
          {["Shop", "About", "Contact", "Blog"].map((link) => (
            <span
              key={link}
              style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "'Fredoka', sans-serif" }}
            >
              {link}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 24 }}>
          {["📸", "📘", "🐦", "📌"].map((icon, i) => (
            <span
              key={i}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,215,0,0.06)",
                border: "1px solid rgba(255,215,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              {icon}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
          © 2026 Wonderlyf. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
