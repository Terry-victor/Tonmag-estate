"use client"

import { useState, useEffect } from "react"

const features = [
  {
    id: 1,
    icon: "🔐",
    title: "Facial Recognition",
    description: "Advanced biometric security for seamless access control",
  },
  {
    id: 2,
    icon: "📡",
    title: "Motion Sensors",
    description: "Intelligent motion detection for enhanced safety",
  },
  {
    id: 3,
    icon: "🚨",
    title: "Security Alarm",
    description: "Real-time alert system for immediate response",
  },
  {
    id: 4,
    icon: "💡",
    title: "Smart Lighting",
    description: "Automated lighting control for energy efficiency",
  },
  {
    id: 5,
    icon: "🌡️",
    title: "Climate Control",
    description: "Intelligent temperature management system",
  },
]

export function EstateFeatures() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    setCurrentSlide(index)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
  }

  return (
    <section className="bg-background py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-primary mb-16">Estate Features</h2>

        {/* Carousel Container */}
        <div className="relative">
          {/* Feature Cards Display */}
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                className={`flex flex-col items-center text-center p-4 md:p-6 rounded-lg transition-all duration-500 cursor-pointer transform ${
                  index === currentSlide
                    ? "scale-110 bg-primary/20"
                    : hoveredIndex !== null && hoveredIndex !== index
                      ? "scale-75 opacity-40"
                      : "scale-100 opacity-60"
                }`}
              >
                <div
                  className={`transition-all duration-500 ${
                    index === currentSlide ? "text-7xl animate-bounce" : "text-4xl"
                  }`}
                >
                  {feature.icon}
                </div>
                <h3
                  className={`font-semibold text-foreground mt-3 transition-all duration-500 ${
                    index === currentSlide ? "text-2xl" : "text-sm"
                  }`}
                >
                  {feature.title}
                </h3>
                {index === currentSlide && (
                  <p className="text-gray-400 text-sm mt-3 max-w-xs animate-in fade-in duration-300">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mb-12">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  index === currentSlide ? "bg-primary w-8" : "bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Quote Section */}
          <div className="text-center border-t border-gray-700 pt-12">
            <p className="text-xl text-foreground mb-4 italic">"We will never stop delivering the highest quality."</p>
            <p className="text-primary font-script text-2xl">-The TONMAG Team.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
