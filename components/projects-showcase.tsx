"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "The Nouveau by TONMAG",
    location: "Maitama",
    image: "/modern-luxury-apartment-building-maitama.jpg",
    slug: "the-nouveau-maitama",
  },
  {
    id: 2,
    title: "TONMAG Heights",
    location: "Ikoyi",
    image: "/luxury-residential-complex-ikoyi.jpg",
    slug: "tonmag-heights-ikoyi",
  },
  {
    id: 3,
    title: "The Residences",
    location: "Victoria Island",
    image: "/premium-residential-tower-victoria-island.jpg",
    slug: "the-residences-vi",
  },
]

export function ProjectsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll(".project-card")
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("animate-in")
            }, index * 150)
          })
        }
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-20 bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Featured Projects</h2>
          <p className="text-gray-400 text-lg">Explore our latest luxury developments across Africa</p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <style>{`
            @keyframes scaleUp {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .project-card {
              opacity: 0;
              transform: scale(0.95);
            }
            .project-card.animate-in {
              animation: scaleUp 0.6s ease-out forwards;
            }
          `}</style>

          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`} className="project-card group">
              <div className="relative h-80 rounded-xl overflow-hidden cursor-pointer">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <div />
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-300 text-sm">{project.location}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white group-hover:text-amber-400 transition-colors">
                      <span className="text-sm font-semibold">View Project</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-400 text-slate-900 font-semibold rounded-lg hover:bg-amber-300 transition-colors"
          >
            View All Projects
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* YouTube Video Section */}
        <div className="mt-20 pt-16 border-t border-gray-800">
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Experience TONMAG in Action
          </h3>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="TONMAG Estate Features"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
