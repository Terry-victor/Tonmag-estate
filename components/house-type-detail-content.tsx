"use client";

import { Button } from "@/components/ui/button";
import { Heart, Share2, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface HouseType {
  id: number;
  propertyImage: string;
  slug: string;
  name: string;
  location: string;
  price: number;
  description: string;
  beds: number;
  baths: number;
  sqft: number;
  amenities: Array<{ name: string }>;
  floors: Array<{ name: string }>;
  agent: { name: string; company: string };
}

export function HouseTypeDetailContent({
  houseType,
}: {
  houseType: HouseType;
}) {
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [showMap, setShowMap] = useState(false); // new state to toggle map

  // Google Maps embed URL based on property location
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
    houseType.location,
  )}`;

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Property Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted flex-col justify-between p-8 relative rounded-r-3xl overflow-hidden">
        <div className="relative h-full rounded-2xl overflow-hidden">
          {!showMap ? (
            <Image
              src={houseType.propertyImage}
              alt={houseType.name}
              fill
              className="object-cover"
            />
          ) : (
            <iframe
              src={mapSrc}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              title="Property Location"
            ></iframe>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

          {/* Property Buttons */}
          <div className="absolute top-6 left-6 flex gap-2">
            <button
              onClick={() => setShowMap(false)}
              className="bg-white rounded-full p-3 hover:bg-gray-100 transition-colors"
            >
              <Eye className="w-5 h-5 text-black" />
            </button>
            <button
              onClick={() => setShowMap(true)}
              className="bg-white rounded-full p-3 hover:bg-gray-100 transition-colors"
            >
              <Share2 className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Price Overlay */}
          {!showMap && (
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-linear-to-t from-black/80 to-transparent text-white">
              <p className="text-sm opacity-90 mb-2">Rent price</p>
              <p className="text-5xl font-bold">
                ${houseType.price.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Property Details */}
      <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Header with Buttons */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              {houseType.name}
            </h1>
            <p className="text-muted-foreground">{houseType.location}</p>
          </div>
          <Button className="bg-black hover:bg-black/90 text-white rounded-full px-8 py-6">
            Rent {houseType.name}
          </Button>
        </div>

        {/* Property Controls */}
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
          {houseType.description}
        </p>

        {/* Read More Link */}
        <a
          href="#"
          className="text-foreground font-medium hover:underline mb-8 block"
        >
          Read more
        </a>

        {/* Property Stats */}
        <div className="flex gap-8 mb-12 text-center">
          <div>
            <p className="text-4xl font-bold text-foreground">
              {houseType.beds}
            </p>
            <p className="text-muted-foreground">beds</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-foreground">
              {houseType.baths}
            </p>
            <p className="text-muted-foreground">baths</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-foreground">
              {houseType.sqft.toLocaleString()}
            </p>
            <p className="text-muted-foreground">sqft</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Amenities</h3>
          <div className="grid grid-cols-2 gap-4">
            {houseType.amenities.slice(0, 6).map((amenity, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
                <span className="text-sm">{amenity.name}</span>
              </div>
            ))}
          </div>
          {houseType.amenities.length > 6 && (
            <a
              href="#"
              className="text-primary text-sm font-medium hover:underline mt-4 block"
            >
              Show all {houseType.amenities.length} amenities
            </a>
          )}
        </div>

        {/* Floor Plans */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Floor plan</h3>
          <div className="grid grid-cols-2 gap-4">
            {houseType.floors.map((floor, index) => (
              <button
                key={index}
                onClick={() => setSelectedFloor(index)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedFloor === index
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="w-full h-32 bg-muted rounded mb-3 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">
                    Floor Plan
                  </span>
                </div>
                <p className="font-medium text-sm">{floor.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Price Estimate Chart */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Price estimate</h3>
          <div className="bg-muted rounded-lg p-6 h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Price chart visualization</p>
          </div>
        </div>

        {/* Agent Contact */}
        <div className="border-t border-border pt-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <p className="font-bold text-foreground">
                  {houseType.agent.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {houseType.agent.company}
                </p>
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
  );
}
