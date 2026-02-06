'use client'

import { Button } from "@/components/ui/button"
import { Heart, Share2, Grid3x3, MapPin, Wifi, Zap, Waves, Eye, Home, Dumbbell, Eye as EyeIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import dynamic from "next/dynamic"

// Mock chart component - you can replace with actual Recharts later
const PriceChart = dynamic(() => Promise.resolve(MockChart), { ssr: false })

function MockChart() {
  return (
    <svg viewBox="0 0 300 150" className="w-full h-32 stroke-foreground fill-none">
      <polyline points="10,100 40,80 70,90 100,60 130,75 160,50 190,70 220,40 250,60 280,20" strokeWidth="2" />
      <line x1="130" y1="0" x2="130" y2="150" className="stroke-gray-300" strokeWidth="1" strokeDasharray="4" />
    </svg>
  )
}

const projectsData: Record<string, any> = {
  "1": {
    id: "1",
    name: "Midnight Ocean Villa",
    location: "Trentino, Italy",
    price: "$4,500",
    beds: 4,
    baths: 3,
    sqft: "1,589",
    description: "Escape to luxury in this modern architectural gem perched above the coastline. Midnight Ocean Villa offers panoramic ocean views, open-concept living spaces, and seamless indoor-outdoor flow.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adb50f3fdde1f9f1837c976e441b6267-oAM9h96Kszb1zWCerWIyTYBzXzLkwk.webp",
    amenities: [
      { icon: Waves, label: "Infinity Pool" },
      { icon: Eye, label: "Ocean View" },
      { icon: Home, label: "Beach Access" },
      { icon: Dumbbell, label: "Workspace" },
      { icon: Dumbbell, label: "Fitness" },
      { icon: Wifi, label: "Wifi" },
    ],
    floorPlans: [
      { floor: "Floor 1", image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
      { floor: "Floor 2", image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    ],
    agent: {
      name: "Emily Johnson",
      company: "Skyline Realty Group",
      rating: 5,
      reviews: 128,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adb50f3fdde1f9f1837c976e441b6267-oAM9h96Kszb1zWCerWIyTYBzXzLkwk.webp",
    },
  },
  "2": {
    id: "2",
    name: "Luxury Penthouse",
    location: "New York, USA",
    price: "$8,500",
    beds: 5,
    baths: 4,
    sqft: "2,850",
    description: "Experience ultimate luxury in this stunning penthouse with floor-to-ceiling windows overlooking the city skyline.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adb50f3fdde1f9f1837c976e441b6267-oAM9h96Kszb1zWCerWIyTYBzXzLkwk.webp",
    amenities: [
      { icon: Waves, label: "Rooftop Pool" },
      { icon: Eye, label: "City View" },
      { icon: Home, label: "Home Gym" },
      { icon: Dumbbell, label: "Spa" },
      { icon: Wifi, label: "Smart Home" },
      { icon: Zap, label: "EV Charging" },
    ],
    floorPlans: [
      { floor: "Floor 1", image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
      { floor: "Floor 2", image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    ],
    agent: {
      name: "Sarah Mitchell",
      company: "Luxury Real Estate Inc",
      rating: 5,
      reviews: 89,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adb50f3fdde1f9f1837c976e441b6267-oAM9h96Kszb1zWCerWIyTYBzXzLkwk.webp",
    },
  },
  "3": {
    id: "3",
    name: "Modern Lakeside Resort",
    location: "Geneva, Switzerland",
    price: "$6,200",
    beds: 4,
    baths: 3,
    sqft: "2,100",
    description: "Magnificent lakeside property with spectacular alpine views and direct water access.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adb50f3fdde1f9f1837c976e441b6267-oAM9h96Kszb1zWCerWIyTYBzXzLkwk.webp",
    amenities: [
      { icon: Waves, label: "Private Beach" },
      { icon: Eye, label: "Lake View" },
      { icon: Dumbbell, label: "Sauna" },
      { icon: Home, label: "Wine Cellar" },
      { icon: Wifi, label: "Fiber Internet" },
      { icon: Zap, label: "Solar Power" },
    ],
    floorPlans: [
      { floor: "Floor 1", image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
      { floor: "Floor 2", image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    ],
    agent: {
      name: "Philippe Durand",
      company: "Swiss Alpine Realty",
      rating: 5,
      reviews: 156,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adb50f3fdde1f9f1837c976e441b6267-oAM9h96Kszb1zWCerWIyTYBzXzLkwk.webp",
    },
  },
}

export default function ViewProjectPage({ params }: { params: { id: string } }) {
  const project = projectsData[params.id] || projectsData["1"]
  const [isFavorite, setIsFavorite] = useState(false)
  const [showAllAmenities, setShowAllAmenities] = useState(false)

  const displayedAmenities = showAllAmenities ? project.amenities : project.amenities.slice(0, 6)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <div className="hidden lg:flex w-60 bg-black text-white flex-col items-center py-8 gap-8">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
          <Home className="w-6 h-6 text-black" />
        </div>
        <nav className="flex flex-col gap-6">
          {[Heart, MapPin, Home, MessageCircle, Grid3x3, Eye, EyeIcon, Share2].map((Icon, idx) => (
            <button key={idx} className="p-3 hover:bg-gray-900 rounded-lg transition-colors">
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-4">
          <button className="p-3 hover:bg-gray-900 rounded-lg transition-colors">
            <Eye className="w-5 h-5" />
          </button>
          <button className="p-3 hover:bg-gray-900 rounded-lg transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Section - Property Image */}
        <div className="lg:w-1/2 relative h-96 lg:h-auto lg:min-h-screen">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          {/* Price Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8">
            <p className="text-gray-300 text-sm mb-2">Rent price</p>
            <h2 className="text-5xl font-bold text-white">{project.price}</h2>
          </div>

          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
              <Grid3x3 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Section - Property Details */}
        <div className="lg:w-1/2 bg-white dark:bg-card p-6 lg:p-12 overflow-y-auto">
          {/* Header with Actions */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                {project.name}
              </h1>
              <p className="text-gray-500 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {project.location}
              </p>
            </div>
            <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
              Rent villa
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="text-sm text-gray-500 hover:text-gray-700">units</button>
          </div>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {project.description}
          </p>
          <button className="text-black dark:text-white font-medium text-sm mb-8">Read more</button>

          {/* Property Stats */}
          <div className="flex gap-8 mb-12 pb-12 border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-3xl font-bold">{project.beds}</p>
              <p className="text-gray-500 text-sm">beds</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{project.baths}</p>
              <p className="text-gray-500 text-sm">baths</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{project.sqft}</p>
              <p className="text-gray-500 text-sm">sqft</p>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6">Amenities</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {displayedAmenities.map((amenity, idx) => {
                const Icon = amenity.icon
                return (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{amenity.label}</p>
                  </div>
                )
              })}
            </div>
            <button className="text-sm font-medium text-black dark:text-white underline">
              Show all 24 amenities
            </button>
          </div>

          {/* Floor Plans */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6">Floor plan</h3>
            <div className="grid grid-cols-2 gap-6">
              {project.floorPlans.map((plan, idx) => (
                <div key={idx}>
                  <p className="font-semibold mb-3">{plan.floor}</p>
                  <div
                    className="w-full h-40 rounded-lg border border-gray-200 dark:border-gray-700"
                    style={{ background: plan.image }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Price Estimate */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6">Price estimate</h3>
            <div className="relative bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded text-sm">
                JAN 20, 2023
                <br />
                {project.price}
              </div>
              <MockChart />
              <div className="flex justify-between text-xs text-gray-500 mt-4">
                <span>2020</span>
                <span>2021</span>
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
              </div>
            </div>
          </div>

          {/* Agent Card */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                <img
                  src={project.agent.image}
                  alt={project.agent.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold">{project.agent.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{project.agent.company}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            </div>
            <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
