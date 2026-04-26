const LOCAL_VIDEO = "/videos/honey-hero.mp4";

export default function HeroVideo() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Ambient warm wash across the entire hero so the cream side and the
          video side share the same honey/brown palette — no hard seam where
          the panels meet. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 75% 50%, rgba(212,148,10,0.18) 0%, rgba(212,148,10,0.08) 35%, transparent 70%)",
        }}
      />

      {/* Right-half video panel. Mobile: full-width (cleaner stacked layout
          on small screens). Desktop: occupies only the right half so the
          centered logo and any left-side content remain crisp. */}
      <div className="absolute inset-y-0 right-0 w-full md:w-3/5 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={LOCAL_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          fetchPriority="high"
        />

        {/* Monochrome warm-brown overlay — unifies the video tones with the
            cream/honey palette of the rest of the hero. Slightly darker on
            mobile (text sits directly on top) for white-text contrast. */}
        <div className="absolute inset-0 bg-gradient-to-r from-warm-brown/70 via-warm-brown/45 to-warm-brown/30 md:bg-none md:bg-warm-brown/35" />
        <div className="md:hidden absolute inset-0 bg-warm-brown/20" />

        {/* Wide left-edge fade — bigger, multi-stop gradient so the video
            dissolves smoothly into the cream half rather than ending in a line. */}
        <div className="hidden md:block absolute inset-y-0 -left-1 w-2/3 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #FAF6EE 0%, rgba(250,246,238,0.95) 18%, rgba(250,246,238,0.6) 38%, rgba(250,246,238,0.25) 62%, transparent 100%)",
          }}
        />
      </div>

      {/* Top + bottom fades into surrounding sections (tie the hero into
          the page rather than ending sharply). */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-cream to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent pointer-events-none" />
    </div>
  );
}
