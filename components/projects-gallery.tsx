"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "TONMAG Smart Estate, Wuye",
    location: "Abuja, Nigeria",
    category: "Smart Home",
    tags: ["3-bedroom", "4-bedroom", "Smart Home"],
    image: "/modern-luxury-apartment-building-exterior.jpg",
    price: "From ₦45M",
  },
  {
    id: 2,
    title: "TONMAG Residences, Maitama",
    location: "Abuja, Nigeria",
    category: "Residential",
    tags: ["2-bedroom", "3-bedroom", "Penthouse"],
    image: "/luxury-residential-complex-with-gardens.jpg",
    price: "From ₦35M",
  },
  {
    id: 3,
    title: "TONMAG Heights, Ikoyi",
    location: "Lagos, Nigeria",
    category: "Luxury",
    tags: ["4-bedroom", "5-bedroom", "Luxury"],
    image: "/high-rise-luxury-apartment-building.jpg",
    price: "From ₦80M",
  },
  {
    id: 4,
    title: "TONMAG Gardens, Lekki",
    location: "Lagos, Nigeria",
    category: "Garden",
    tags: ["2-bedroom", "3-bedroom", "Garden"],
    image: "/residential-complex-with-landscaping.jpg",
    price: "From ₦40M",
  },
  {
    id: 5,
    title: "TONMAG Towers, VI",
    location: "Lagos, Nigeria",
    category: "Smart Home",
    tags: ["3-bedroom", "Penthouse", "Smart Home"],
    image: "/modern-office-and-residential-tower.jpg",
    price: "From ₦60M",
  },
  {
    id: 6,
    title: "TONMAG Villas, Banana Island",
    location: "Lagos, Nigeria",
    category: "Luxury",
    tags: ["5-bedroom", "Villa", "Luxury"],
    image: "/luxury-villa-pool.png",
    price: "From ₦150M",
  },
]

const categories = ["All", "Smart Home", "Residential", "Luxury", "Garden"]

export function ProjectsGallery() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "All" || project.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Developments</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our premium residential projects across Nigeria
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <Input
              placeholder="Search by name, type, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "bg-primary hover:bg-primary/90" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-muted">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>

                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{project.location}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{project.price}</span>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No projects found matching your search.</p>
          </div>
        )}
      </div>
    </section>
  )
}
