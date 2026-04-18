import { useRef, useEffect, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

function parseValue(str) {
  const match = str.match(/^([\d.]+)(.*)/);
  if (!match) return { number: 0, suffix: str, multiplier: 1 };

  let number = parseFloat(match[1]);
  let suffix = match[2];
  let multiplier = 1;

  if (suffix.startsWith("K")) {
    multiplier = 1;
    suffix = suffix;
  }

  return { number, suffix, multiplier };
}

export default function AnimatedCounter({
  value,
  duration = 2,
  className = "",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");
  const motionValue = useMotionValue(0);

  const { number, suffix } = parseValue(value);
  const isAnimatable = number > 0;

  useEffect(() => {
    if (!isInView || !isAnimatable) return;

    const controls = animate(motionValue, number, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => {
        const rounded = number >= 10 ? Math.round(v) : Math.round(v * 10) / 10;
        setDisplayValue(rounded + suffix);
      },
      onComplete: () => {
        setDisplayValue(value);
      },
    });

    return () => controls.stop();
  }, [isInView, isAnimatable, number, suffix, value, duration, motionValue]);

  if (!isAnimatable) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {isInView ? displayValue : "0" + suffix}
    </span>
  );
}
