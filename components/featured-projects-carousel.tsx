"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, ChevronRight } from "lucide-react"

const featuredProjects = [
  {
    id: 1,
    name: "The Nouveau by Cosgrove",
    location: "Maitama",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-To2Cf4gSvXFtC8aEOIjQO6Jd6hfVtF.png",
  },
  {
    id: 2,
    name: "Cosgrove Heights Residences",
    location: "Ikoyi",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    name: "Tonmag Estate Classic",
    location: "Victoria Island",
    image: "https://images.unsplash.com/photo-1600607687644-c173cecf74a1?w=800&h=600&fit=crop",
  },
]

export function FeaturedProjectsCarousel() {
  const [current, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProjects.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoplay])

  return (
    <section className="py-20 px-4 md:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Featured Projects
        </h2>

        <div className="relative rounded-2xl overflow-hidden h-96 md:h-[500px] group">
          {/* Carousel Items */}
          {featuredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-8">
                <div></div>
                <div className="text-white space-y-4">
                  <div>
                    <h3
                      className="text-3xl md:text-4xl font-bold mb-2"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-lg">
                      <MapPin className="w-5 h-5" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div></div>
                  <Link href={`/view-project/${project.id}`}>
                    <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white flex items-center gap-2">
                      View Project
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {featuredProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setAutoplay(false)
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === current
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
