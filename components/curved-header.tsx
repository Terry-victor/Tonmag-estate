import Image from "next/image"

interface CurvedHeaderProps {
  title: string
  subtitle?: string
  backgroundImage?: string
  height?: "small" | "medium" | "large"
}

export function CurvedHeader({
  title,
  subtitle,
  backgroundImage = "/curved-header-building.jpg",
  height = "medium",
}: CurvedHeaderProps) {
  const heightClass = {
    small: "h-64",
    medium: "h-96",
    large: "h-screen",
  }[height]

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden`}>
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt={title}
        fill
        className="object-cover"
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 md:px-8 text-center text-white">
        {subtitle && (
          <p className="text-lg md:text-xl font-medium mb-3 opacity-90" style={{ fontFamily: 'var(--font-cormorant)' }}>
            {subtitle}
          </p>
        )}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {title}
        </h1>
      </div>

      {/* Curved Bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 Q300,100 600,100 T1200,50 L1200,0 L0,0 Z"
          fill="hsl(var(--background))"
        />
      </svg>
    </div>
  )
}
