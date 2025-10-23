"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % houseTypes.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlay])

  const next = () => {
    setCurrent((prev) => (prev + 1) % houseTypes.length)
    setIsAutoPlay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + houseTypes.length) % houseTypes.length)
    setIsAutoPlay(false)
  }

  const getVisibleCards = () => {
    const cards = []
    for (let i = 0; i < 3; i++) {
      const index = (current + i) % houseTypes.length
      cards.push(houseTypes[index])
    }
    return cards
  }

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Carousel */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="flex gap-6 overflow-hidden">
              {getVisibleCards().map((card, idx) => (
                <div
                  key={card.id}
                  className="flex-1 min-w-0 transform transition-all duration-500"
                  style={{
                    opacity: idx === 0 ? 1 : 0.7,
                    scale: idx === 0 ? 1 : 0.95,
                  }}
                >
                  <div className="relative group rounded-2xl overflow-hidden h-96 cursor-pointer">
                    <div className="absolute inset-0" style={{ background: card.image }} />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                      <h3 className="text-3xl font-bold mb-2">{card.name}</h3>
                      <p className="text-sm mb-4 opacity-90">{card.description}</p>
                      <Button className="w-full bg-white text-black hover:bg-gray-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300">
                        View Project →
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 p-2 rounded-full bg-primary/20 hover:bg-primary/40 transition-all duration-300 hidden lg:flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 p-2 rounded-full bg-primary/20 hover:bg-primary/40 transition-all duration-300 hidden lg:flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden h-80">
              <div className="absolute inset-0" style={{ background: houseTypes[current].image }} />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{houseTypes[current].name}</h3>
                <p className="text-sm mb-4 opacity-90">{houseTypes[current].description}</p>
                <Button className="w-full bg-white text-black hover:bg-gray-100">View Project →</Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex gap-2 mt-4 justify-center">
              <button onClick={prev} className="p-2 rounded-full bg-primary/20 hover:bg-primary/40 transition-all">
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button onClick={next} className="p-2 rounded-full bg-primary/20 hover:bg-primary/40 transition-all">
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {houseTypes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrent(idx)
                setIsAutoPlay(false)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current ? "bg-accent w-8" : "bg-gray-400 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
