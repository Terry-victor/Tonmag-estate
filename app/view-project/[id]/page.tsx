'use client'

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Share2, MessageCircle, Wifi, Dumbbell, Waves, Eye, Home, Bed, Bath, Ruler2, Download } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"

const projectsData = {
  "1": {
    id: "1",
    name: "Midnight Ocean Villa",
    location: "Trentino, Italy",
    price: "$4,500",
    beds: 4,
    baths: 3,
    sqft: 1589,
    description: "Escape to luxury in this modern architectural gem perched above the coastline. Midnight Ocean Villa offers panoramic ocean views, open-concept living spaces, and seamless indoor-outdoor flow.",
    images: [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    ],
    amenities: [
      { icon: Waves, label: "Infinity Pool" },
      { icon: Eye, label: "Ocean View" },
      { icon: Home, label: "Beach Access" },
      { icon: MessageCircle, label: "Workspace" },
      { icon: Dumbbell, label: "Fitness" },
      { icon: Wifi, label: "Wifi" },
    ],
    floorPlans: [
      { floor: "Floor 1", image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
      { floor: "Floor 2", image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    ],
    priceHistory: [
      { date: "2020", price: 3800 },
      { date: "2021", price: 3900 },
      { date: "2022", price: 4100 },
      { date: "2023", price: 4300 },
      { date: "2024", price: 4500 },
    ],
    agent: {
      name: "Emily Johnson",
      company: "Skyline Realty Group",
      rating: 5,
      reviews: 128,
      image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
  },
  "2": {
    id: "2",
    name: "Oak Haven Estates",
    location: "Los Angeles, California",
    price: "$5,200",
    beds: 5,
    baths: 4,
    sqft: 2400,
    description: "A stunning 5-bedroom fully detached duplex featuring contemporary architecture and premium finishes throughout. Perfect for families seeking luxury and space.",
    images: [
      "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    ],
    amenities: [
      { icon: Waves, label: "Swimming Pool" },
      { icon: Eye, label: "City View" },
      { icon: Home, label: "Garden" },
      { icon: MessageCircle, label: "Home Office" },
      { icon: Dumbbell, label: "Gym" },
      { icon: Wifi, label: "Smart Home" },
    ],
    floorPlans: [
      { floor: "Ground Floor", image: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" },
      { floor: "First Floor", image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    ],
    priceHistory: [
      { date: "2020", price: 4200 },
      { date: "2021", price: 4400 },
      { date: "2022", price: 4700 },
      { date: "2023", price: 5000 },
      { date: "2024", price: 5200 },
    ],
    agent: {
      name: "Emily Johnson",
      company: "Skyline Realty Group",
      rating: 5,
      reviews: 128,
      image: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    },
  },
  "3": {
    id: "3",
    name: "Oakville Residences",
    location: "Miami, Florida",
    price: "$3,800",
    beds: 5,
    baths: 3,
    sqft: 2000,
    description: "A semi-detached luxury duplex offering the perfect balance of privacy and community. Modern design meets timeless elegance in this premium residential setting.",
    images: [
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    ],
    amenities: [
      { icon: Waves, label: "Pool Access" },
      { icon: Eye, label: "Golf View" },
      { icon: Home, label: "Community" },
      { icon: MessageCircle, label: "Lounge" },
      { icon: Dumbbell, label: "Fitness" },
      { icon: Wifi, label: "WiFi" },
    ],
    floorPlans: [
      { floor: "Lower Level", image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
      { floor: "Upper Level", image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    ],
    priceHistory: [
      { date: "2020", price: 3200 },
      { date: "2021", price: 3400 },
      { date: "2022", price: 3500 },
      { date: "2023", price: 3700 },
      { date: "2024", price: 3800 },
    ],
    agent: {
      name: "Emily Johnson",
      company: "Skyline Realty Group",
      rating: 5,
      reviews: 128,
      image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
  },
  "4": {
    id: "4",
    name: "Maple Court Apartments",
    location: "New York, New York",
    price: "$2,900",
    beds: 3,
    baths: 2,
    sqft: 1200,
    description: "Modern 3-bedroom apartment in the heart of the city. High-rise living with spectacular skyline views and premium amenities.",
    images: [
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    ],
    amenities: [
      { icon: Waves, label: "Rooftop Deck" },
      { icon: Eye, label: "City View" },
      { icon: Home, label: "Concierge" },
      { icon: MessageCircle, label: "Co-working" },
      { icon: Dumbbell, label: "Gym" },
      { icon: Wifi, label: "High-Speed WiFi" },
    ],
    floorPlans: [
      { floor: "Apartment Layout", image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    ],
    priceHistory: [
      { date: "2020", price: 2400 },
      { date: "2021", price: 2500 },
      { date: "2022", price: 2650 },
      { date: "2023", price: 2800 },
      { date: "2024", price: 2900 },
    ],
    agent: {
      name: "Emily Johnson",
      company: "Skyline Realty Group",
      rating: 5,
      reviews: 128,
      image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  },
  "5": {
    id: "5",
    name: "Pine Park Residences",
    location: "Seattle, Washington",
    price: "$2,100",
    beds: 2,
    baths: 2,
    sqft: 950,
    description: "Cozy 2-bedroom apartment perfect for couples or small families. Eco-friendly features and modern sustainable design throughout.",
    images: [
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    ],
    amenities: [
      { icon: Waves, label: "Community Pool" },
      { icon: Eye, label: "Park View" },
      { icon: Home, label: "Green Space" },
      { icon: MessageCircle, label: "Study" },
      { icon: Dumbbell, label: "Yoga Studio" },
      { icon: Wifi, label: "WiFi" },
    ],
    floorPlans: [
      { floor: "Floor Plan", image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
    ],
    priceHistory: [
      { date: "2020", price: 1800 },
      { date: "2021", price: 1900 },
      { date: "2022", price: 1950 },
      { date: "2023", price: 2000 },
      { date: "2024", price: 2100 },
    ],
    agent: {
      name: "Emily Johnson",
      company: "Skyline Realty Group",
      rating: 5,
      reviews: 128,
      image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  },
}

export default function ViewProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  const project = projectsData[projectId as keyof typeof projectsData]
  const [isFavorite, setIsFavorite] = useState(false)

  if (!project) {
    return (
      <main>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Project not found</h1>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-0">
          {/* Left Side - Main Image */}
          <div className="w-full lg:w-2/3">
            <div className="relative h-96 lg:h-screen" style={{ background: project.images[0] }}>
              <div className="absolute inset-0 bg-black/30" />
              {/* Rent Price Badge */}
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-base opacity-80 mb-2">Rent price</p>
                <p className="text-5xl font-bold">{project.price}</p>
              </div>
              {/* Top Controls */}
              <div className="absolute top-6 right-6 flex gap-2">
                <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors" onClick={() => setIsFavorite(!isFavorite)}>
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>
                <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                  <Ruler2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Details Card */}
          <div className="w-full lg:w-1/3 bg-white dark:bg-card p-6 sm:p-8 flex flex-col gap-6">
            {/* Header with Actions */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{project.name}</h1>
                <p className="text-muted-foreground text-sm">{project.location}</p>
              </div>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* CTA Button */}
            <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:opacity-90 py-6">
              Rent villa
            </Button>

            {/* Floor Plan Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Floor plan</h3>
              <div className="grid grid-cols-2 gap-3">
                {project.floorPlans.map((plan, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg border border-border p-2 cursor-pointer hover:border-accent transition-colors"
                    style={{ background: plan.image }}
                  >
                    <p className="text-xs font-medium text-foreground/70">{plan.floor}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Estimate Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Price estimate</h3>
              <div className="bg-muted rounded-lg p-4 relative h-48">
                {/* Simple line chart representation */}
                <svg className="w-full h-32" viewBox="0 0 100 50" preserveAspectRatio="none">
                  <polyline points="0,40 25,35 50,25 75,20 100,15" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
                {/* Price tooltip */}
                <div className="absolute top-4 right-4 bg-black text-white px-3 py-2 rounded text-xs font-semibold">
                  JAN 20, 2023<br />{project.price}
                </div>
              </div>
              <div className="flex gap-2 mt-3 text-xs text-muted-foreground justify-between px-2">
                <span>2020</span>
                <span>2021</span>
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
              </div>
            </div>

            {/* Agent Info */}
            <div className="border-t border-border pt-6">
              <div className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-full" style={{ background: project.agent.image }} />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{project.agent.name}</p>
                  <p className="text-xs text-muted-foreground">{project.agent.company}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(project.agent.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
                <Button className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90">
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Property Info */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>{project.name}</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.05rem' }}>
              {project.description}
            </p>
            <Link href="/book-a-tour">
              <Button variant="outline">Read more</Button>
            </Link>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-4 mb-16">
            <Card className="p-6 text-center">
              <Bed className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{project.beds}</p>
              <p className="text-sm text-muted-foreground">beds</p>
            </Card>
            <Card className="p-6 text-center">
              <Bath className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{project.baths}</p>
              <p className="text-sm text-muted-foreground">baths</p>
            </Card>
            <Card className="p-6 text-center">
              <Ruler2 className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{project.sqft.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">sqft</p>
            </Card>
          </div>

          {/* Amenities */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {project.amenities.map((amenity, index) => {
                const Icon = amenity.icon
                return (
                  <Card key={index} className="p-4 text-center hover:shadow-lg transition-shadow">
                    <Icon className="w-6 h-6 mx-auto text-primary mb-2" />
                    <p className="text-sm font-medium">{amenity.label}</p>
                  </Card>
                )
              })}
            </div>
            <Link href="/book-a-tour">
              <Button variant="outline" className="mt-4">Show all 24 amenities</Button>
            </Link>
          </div>

          {/* Floor Plans Detail */}
          <div>
            <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>Floor plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.floorPlans.map((plan, index) => (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden border border-border h-96"
                  style={{ background: plan.image }}
                >
                  <div className="w-full h-full flex items-end p-6">
                    <p className="text-white font-semibold text-lg">{plan.floor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
