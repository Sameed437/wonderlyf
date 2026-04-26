export default function Marquee({ items, speed = 25 }) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden py-3 border-y border-honey/10 bg-cream-dark/50">
      <div
        className="flex whitespace-nowrap gap-4 md:gap-8 marquee-track"
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-honey/60" />
            <span className="text-warm-gray tracking-wider uppercase font-medium">
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
