"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface HouseType {
  id: string
  name: string
  description: string
  bedrooms: string
  price: string
  image: string
}

const houseTypes: HouseType[] = [
  {
    id: "1",
    name: "Acacia",
    description: "4 Bedroom Terrace",
    bedrooms: "4 Bedrooms",
    price: "₦45M - ₦65M",
    image: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  },
  {
    id: "2",
    name: "Oak",
    description: "5-Bedroom Fully Detached Duplex",
    bedrooms: "5 Bedrooms",
    price: "₦75M - ₦95M",
    image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "3",
    name: "Oakville",
    description: "5-Bedroom Semi-Detached Duplex",
    bedrooms: "5 Bedrooms",
    price: "₦65M - ₦85M",
    image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: "4",
    name: "Maple",
    description: "3 Bedroom Apartment",
    bedrooms: "3 Bedrooms",
    price: "₦35M - ₦50M",
    image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: "5",
    name: "Pine",
    description: "2 Bedroom Apartment",
    bedrooms: "2 Bedrooms",
    price: "₦25M - ₦40M",
    image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
]

export function CarouselHouseTypes() {
  const [current, setCurrent] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % houseTypes.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [])

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    setCurrent(index)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
  }

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-15"
      >
        <source src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4" type="video/mp4" />
      </video>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Desktop Carousel */}
        <div className="hidden md:block">
          <div className="relative px-4">
            <div className="flex gap-6 overflow-hidden">
              {houseTypes.map((card, idx) => (
                <div
                  key={card.id}
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onMouseLeave={handleMouseLeave}
                  className={`flex-shrink-0 transition-all duration-500 transform cursor-pointer ${
                    idx === current ? "w-full md:w-2/3" : "w-1/4 opacity-50 scale-90"
                  }`}
                >
                  <div className="relative group rounded-3xl overflow-hidden h-[500px] shadow-2xl">
                    <div className="absolute inset-0" style={{ background: card.image }} />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                      <h3 className="text-4xl font-bold mb-3">{card.name}</h3>
                      <p className="text-base mb-2 opacity-90">{card.description}</p>
                      <p className="text-lg font-semibold mb-6 text-amber-300">{card.price}</p>
                      <Button className="w-full bg-white text-black hover:bg-gray-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 text-base py-6">
                        View Project →
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden h-[500px] shadow-2xl">
              <div className="absolute inset-0" style={{ background: houseTypes[current].image }} />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-3xl font-bold mb-2">{houseTypes[current].name}</h3>
                <p className="text-base mb-2 opacity-90">{houseTypes[current].description}</p>
                <p className="text-lg font-semibold mb-6 text-amber-300">{houseTypes[current].price}</p>
                <Button className="w-full bg-white text-black hover:bg-gray-100 text-base py-6">View Project →</Button>
              </div>
            </div>

            {/* Mobile Navigation Dots */}
            <div className="flex gap-2 mt-6 justify-center">
              {houseTypes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === current ? "bg-accent w-8" : "bg-gray-400 w-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Indicators */}
        <div className="hidden md:flex justify-center gap-2 mt-8">
          {houseTypes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              onMouseEnter={() => handleMouseEnter(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === current ? "bg-accent w-8" : "bg-gray-400 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
