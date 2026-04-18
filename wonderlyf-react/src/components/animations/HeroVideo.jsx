import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const LOCAL_VIDEO = "/videos/honey-hero.mp4";

export default function HeroVideo() {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => setLoaded(true);
    video.addEventListener("canplay", onLoaded);
    video.src = LOCAL_VIDEO;
    video.load();
    return () => video.removeEventListener("canplay", onLoaded);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Video — clearly visible */}
      <motion.video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        fetchpriority="high"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Very light overlay — just enough for white text readability */}
      <div className="absolute inset-0 bg-warm-brown/30" />

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent" />
    </div>
  );
}
