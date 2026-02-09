"use client"

import { useEffect, useRef } from "react"

interface Property {
  id: number
  title: string
  location: string
  lat: number
  lng: number
  price: string
}

const properties: Property[] = [
  {
    id: 1,
    title: "Cosgrove Smart Estate, Wuye",
    location: "Abuja, Nigeria",
    lat: 9.0765,
    lng: 7.3986,
    price: "From ₦45M",
  },
  {
    id: 2,
    title: "Cosgrove Residences, Maitama",
    location: "Abuja, Nigeria",
    lat: 9.0834,
    lng: 7.4,
    price: "From ₦35M",
  },
  {
    id: 3,
    title: "Cosgrove Heights, Ikoyi",
    location: "Lagos, Nigeria",
    lat: 6.4637,
    lng: 3.6158,
    price: "From ₦80M",
  },
  {
    id: 4,
    title: "Cosgrove Gardens, Lekki",
    location: "Lagos, Nigeria",
    lat: 6.4469,
    lng: 3.5789,
    price: "From ₦40M",
  },
  {
    id: 5,
    title: "Cosgrove Towers, VI",
    location: "Lagos, Nigeria",
    lat: 6.4274,
    lng: 3.4257,
    price: "From ₦60M",
  },
  {
    id: 6,
    title: "Cosgrove Villas, Banana Island",
    location: "Lagos, Nigeria",
    lat: 6.4305,
    lng: 3.5236,
    price: "From ₦150M",
  },
]

export function PropertiesMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (!mapRef.current) return

    const initMap = () => {
      const google = (window as any).google
      if (!google || !google.maps) {
        console.error("Google Maps API not loaded")
        return
      }

      const map = new google.maps.Map(mapRef.current!, {
        zoom: 6,
        center: { lat: 7.5, lng: 5.5 },
        styles: [
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#616161" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e9e9e9" }],
          },
        ],
      })

      mapInstanceRef.current = map

      properties.forEach((property) => {
        const marker = new google.maps.Marker({
          position: { lat: property.lat, lng: property.lng },
          map: map,
          title: property.title,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4F46E5",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
          },
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-3 max-w-xs">
              <h3 class="font-semibold text-sm mb-1">${property.title}</h3>
              <p class="text-xs text-gray-600 mb-2">${property.location}</p>
              <p class="text-sm font-bold text-blue-600">${property.price}</p>
            </div>
          `,
        })

        marker.addListener("click", () => {
          markersRef.current.forEach((m) => {
            const infoWindows = m.infoWindow
            if (infoWindows) infoWindows.close()
          })
          infoWindow.open(map, marker)
          marker.infoWindow = infoWindow
        })

        markersRef.current.push(marker)
      })
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    script.async = true
    script.defer = true
    script.onload = initMap
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Properties Across Nigeria</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our premium developments in key locations across Nigeria
          </p>
        </div>

        <div className="rounded-lg overflow-hidden shadow-lg h-96 md:h-[500px]">
          <div ref={mapRef} className="w-full h-full" />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <div key={property.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-sm mb-1">{property.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{property.location}</p>
              <p className="text-sm font-bold text-primary">{property.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
