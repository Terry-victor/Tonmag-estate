"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Project {
  id: string
  name: string
  location: string
  description: string
  status: string
  image: string
}

const projects: Project[] = [
  {
    id: "1",
    name: "TONMAG Heights",
    location: "Lagos, Nigeria",
    description: "Luxury residential complex with world-class amenities",
    status: "Completed",
    image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "2",
    name: "Smart Living Towers",
    location: "Abuja, Nigeria",
    description: "Modern smart home apartments with IoT integration",
    status: "In Progress",
    image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: "3",
    name: "TONMAG Gardens",
    location: "Accra, Ghana",
    description: "Eco-friendly residential community with green spaces",
    status: "Completed",
    image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: "4",
    name: "Elite Residences",
    location: "Nairobi, Kenya",
    description: "Premium luxury apartments with exclusive amenities",
    status: "In Progress",
    image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  {
    id: "5",
    name: "TONMAG Estates",
    location: "Johannesburg, South Africa",
    description: "Gated community with resort-style living",
    status: "Planned",
    image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
]

export function CarouselProjects() {
  const [current, setCurrent] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % projects.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlay])

  const next = () => {
    setCurrent((prev) => (prev + 1) % projects.length)
    setIsAutoPlay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + projects.length) % projects.length)
    setIsAutoPlay(false)
  }

  const getVisibleCards = () => {
    const cards = []
    for (let i = 0; i < 3; i++) {
      const index = (current + i) % projects.length
      cards.push(projects[index])
    }
    return cards
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400"
      case "In Progress":
        return "bg-blue-500/20 text-blue-400"
      case "Planned":
        return "bg-yellow-500/20 text-yellow-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Carousel */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="flex gap-6 overflow-hidden">
              {getVisibleCards().map((project, idx) => (
                <div
                  key={project.id}
                  className="flex-1 min-w-0 transform transition-all duration-500"
                  style={{
                    opacity: idx === 0 ? 1 : 0.7,
                    scale: idx === 0 ? 1 : 0.95,
                  }}
                >
                  <div className="relative group rounded-2xl overflow-hidden h-96 cursor-pointer">
                    <div className="absolute inset-0" style={{ background: project.image }} />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />

                    {/* Status Badge */}
                    <div
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                      <h3 className="text-3xl font-bold mb-2">{project.name}</h3>
                      <div className="flex items-center gap-2 mb-3 opacity-90">
                        <MapPin className="w-4 h-4" />
                        <p className="text-sm">{project.location}</p>
                      </div>
                      <p className="text-sm mb-4 opacity-80">{project.description}</p>
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
              <div className="absolute inset-0" style={{ background: projects[current].image }} />
              <div className="absolute inset-0 bg-black/40" />

              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(projects[current].status)}`}
              >
                {projects[current].status}
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{projects[current].name}</h3>
                <div className="flex items-center gap-2 mb-3 opacity-90">
                  <MapPin className="w-4 h-4" />
                  <p className="text-sm">{projects[current].location}</p>
                </div>
                <p className="text-sm mb-4 opacity-80">{projects[current].description}</p>
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
          {projects.map((_, idx) => (
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
