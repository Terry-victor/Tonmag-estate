"use client"

import { useState } from "react"
import { X, Search } from "lucide-react"

export function Hero() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
    <div
  className="absolute inset-0 bg-cover bg-center"
  style={{
    backgroundImage: "url('/luxurious-villa-with-modern-architectural-design.png')",
  }}
>
  {/* Overlay Gradient */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/80" />
</div>



      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading with Yellow Accents */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-tight">
              Welcome to a New
              <br />
              <span className="relative inline-block">
                Era of
                <span className="relative inline-block ml-3">
                  <span className="absolute -inset-2 sm:-inset-3 border-4 border-accent" />
                  <span className="relative">Smart Living</span>
                </span>
              </span>
            </h1>
          </div>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-gray-100 max-w-2xl mx-auto leading-relaxed">
            Step into a realm of unparalleled grandeur,
            <br />
            where the future of luxury is elegantly crafted today
          </p>

          {/* Search Bar */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-gray-200">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.5 1.5H9.5V3H8V1.5H7V3H5.5V1.5H4.5V3H3V1.5H2V3H1V19H19V3H18V1.5H17V3H15.5V1.5H14.5V3H13V1.5H12V3H10.5V1.5ZM17 17H3V5H17V17Z" />
                </svg>
              </div>
              <span className="text-sm sm:text-base">Explore TONMAG homes</span>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Search className="w-5 h-5 text-gray-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Property Showcase Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
