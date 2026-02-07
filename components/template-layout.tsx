'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Heart, Eye, Share2 } from 'lucide-react'

interface TemplateLayoutProps {
  data: {
    id: number
    name: string
    slug: string
    location: string
    description: string
    price: number
    beds: number
    baths: number
    sqft: number
    amenities: { name: string; icon: string }[]
    floors: { name: string; image: string }[]
    agent: {
      name: string
      company: string
      rating: number
    }
  }
}

export function TemplateLayout({ data }: TemplateLayoutProps) {
  const [selectedFloor, setSelectedFloor] = useState(0)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <div className="hidden lg:flex w-16 bg-black flex-col items-center py-6 gap-6 rounded-r-3xl">
        <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center">
          <span className="text-white font-bold">🏢</span>
        </div>
        <button className="p-3 hover:bg-white/10 rounded-lg transition-colors">
          <Search className="w-5 h-5 text-white" />
        </button>
        <button className="p-3 hover:bg-white/10 rounded-lg transition-colors">
          <BookmarkIcon className="w-5 h-5 text-white" />
        </button>
        <button className="p-3 hover:bg-white/10 rounded-lg transition-colors">
          <Building2 className="w-5 h-5 text-white" />
        </button>
        <button className="p-3 hover:bg-white/10 rounded-lg transition-colors">
          <MessageCircle className="w-5 h-5 text-white" />
        </button>
        <button className="p-3 hover:bg-white/10 rounded-lg transition-colors">
          <BarChart3 className="w-5 h-5 text-white" />
        </button>
        <button className="p-3 hover:bg-white/10 rounded-lg transition-colors mt-auto">
          <Settings className="w-5 h-5 text-white" />
        </button>
        <button className="p-3 hover:bg-white/10 rounded-lg transition-colors">
          <Shield className="w-5 h-5 text-white" />
        </button>
        <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-white text-sm">👤</span>
        </button>
      </div>

      {/* Center - Image Card */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted flex-col justify-between p-8">
        <div className="relative h-full rounded-3xl overflow-hidden">
          <Image
            src={`/house-type-${data.slug}.jpg`}
            alt={data.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Action Buttons */}
          <div className="absolute top-6 left-6 flex gap-2">
            <button className="bg-white rounded-full p-3 hover:bg-gray-100 transition-colors">
              <Eye className="w-5 h-5 text-black" />
            </button>
            <button className="bg-white rounded-full p-3 hover:bg-gray-100 transition-colors">
              <Share2 className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Price Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
            <p className="text-sm opacity-90 mb-2">Rent price</p>
            <p className="text-5xl font-bold">${data.price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Details */}
      <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
              {data.name}
            </h1>
            <p className="text-muted-foreground">{data.location}</p>
          </div>
          <Button className="bg-black hover:bg-black/90 text-white rounded-full px-8 py-6">
            Rent villa
          </Button>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8 border-b border-border pb-6">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Eye className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground ml-auto">
            More listings
          </button>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-base mb-8 leading-relaxed">
          {data.description}
        </p>

        <a href="#" className="text-foreground font-medium hover:underline mb-8 block">
          Read more
        </a>

        {/* Stats */}
        <div className="flex gap-8 mb-12">
          <div className="text-center">
            <p className="text-4xl font-bold text-foreground">{data.beds}</p>
            <p className="text-muted-foreground text-sm">beds</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-foreground">{data.baths}</p>
            <p className="text-muted-foreground text-sm">baths</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-foreground">{data.sqft.toLocaleString()}</p>
            <p className="text-muted-foreground text-sm">sqft</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            Amenities
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {data.amenities.slice(0, 6).map((amenity, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
                <span className="text-sm">{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floor Plans */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            Floor plan
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {data.floors.map((floor, i) => (
              <button
                key={i}
                onClick={() => setSelectedFloor(i)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedFloor === i ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="w-full h-32 bg-muted rounded mb-3 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Floor Plan</span>
                </div>
                <p className="font-medium text-sm">{floor.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Price Chart */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            Price estimate
          </h3>
          <div className="bg-muted rounded-lg p-6 h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Price chart visualization</p>
          </div>
        </div>

        {/* Agent Card */}
        <div className="border-t border-border pt-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <p className="font-bold text-foreground">{data.agent.name}</p>
                <p className="text-sm text-muted-foreground">{data.agent.company}</p>
                <p className="text-xs text-primary">★★★★★</p>
              </div>
            </div>
            <Button className="bg-black hover:bg-black/90 text-white rounded-full px-8 py-6">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Icon imports - using lucide-react
import { Search, Bookmark as BookmarkIcon, Building2, MessageCircle, BarChart3, Settings, Shield }
