"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length)
    setIsAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length)
    setIsAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlay(false)
  }

  return (
    <section className="bg-background py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-primary mb-16">Estate Features</h2>

        {/* Carousel Container */}
        <div className="relative">
          {/* Features Display */}
          <div className="flex items-center justify-center gap-8 mb-12">
            {/* Left Arrow */}
            <button
              onClick={prevSlide}
              className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 hover:bg-primary transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Feature Cards */}
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-center items-center gap-8">
                {/* Previous Card (dimmed) */}
                {features[(currentSlide - 1 + features.length) % features.length] && (
                  <div className="hidden lg:flex flex-col items-center text-center opacity-40 w-32">
                    <div className="text-5xl mb-4">
                      {features[(currentSlide - 1 + features.length) % features.length].icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {features[(currentSlide - 1 + features.length) % features.length].title}
                    </h3>
                  </div>
                )}

                {/* Current Card (highlighted) */}
                <div className="flex flex-col items-center text-center w-full md:w-64">
                  <div className="text-7xl mb-6 animate-bounce">{features[currentSlide].icon}</div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{features[currentSlide].title}</h3>
                  <p className="text-gray-400 text-sm">{features[currentSlide].description}</p>
                </div>

                {/* Next Card (dimmed) */}
                {features[(currentSlide + 1) % features.length] && (
                  <div className="hidden lg:flex flex-col items-center text-center opacity-40 w-32">
                    <div className="text-5xl mb-4">{features[(currentSlide + 1) % features.length].icon}</div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {features[(currentSlide + 1) % features.length].title}
                    </h3>
                  </div>
                )}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={nextSlide}
              className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 hover:bg-primary transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mb-12">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-primary w-8" : "bg-gray-600"
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
