import Image from "next/image";

interface CurvedHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  height?: "small" | "medium" | "large";
  overlayOpacity?: number;
  curveDepth?: "shallow" | "medium" | "deep";
}

export function CurvedHeader({
  title,
  subtitle,
  backgroundImage = "/curved-header-building.jpg",
  height = "medium",
  overlayOpacity = 0.45,
  curveDepth = "medium",
}: CurvedHeaderProps) {
  const heightClass = {
    small: "h-64",
    medium: "h-96",
    large: "h-screen",
  }[height];

  const curvePaths = {
    shallow: "M0,70 Q300,95 600,95 T1200,70 L1200,120 L0,120 Z",
    medium: "M0,55 Q300,110 600,110 T1200,55 L1200,120 L0,120 Z",
    deep: "M0,35 Q300,125 600,125 T1200,35 L1200,120 L0,120 Z",
  };

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden`}>
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt={title}
        fill
        priority
        className="object-cover"
      />

      {/* Soft cinematic overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(0,0,0,${overlayOpacity}) 0%,
            rgba(0,0,0,${overlayOpacity * 0.6}) 60%,
            rgba(0,0,0,0) 100%
          )`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center -translate-y-6 md:-translate-y-10 px-4 md:px-8 text-center text-white">
        {subtitle && (
          <p
            className="text-lg md:text-xl font-medium mb-3 opacity-90"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {subtitle}
          </p>
        )}

        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {title}
        </h1>
      </div>

      {/* TRANSPARENT CURVE CUT (image is clipped) */}
      <svg
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <mask id="curve-cut">
            {/* Visible area */}
            <rect width="1200" height="120" fill="black" />
            {/* Cut-out curve */}
            <path d={curvePaths[curveDepth]} fill="black" />
          </mask>
        </defs>

        {/* Mask applied – no color, just transparency */}
        <rect width="1200" height="120" fill="black" mask="url(#curve-cut)" />
      </svg>
    </div>
  );
}
