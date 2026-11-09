"use client"

import { PropertyCard } from "@/components/property-card"
import { usePublicProperties } from "@/lib/use-public-properties"

export function ProjectsList({ title = "Homes with nothing to hide.", eyebrow = "TONMAG portfolio", filter = "all" }: { title?: string; eyebrow?: string; filter?: "all" | "lagos" | "premium" }) {
  const properties = usePublicProperties()
  const visible = filter === "lagos" ? properties.filter((property) => /Lagos|Ikoyi|Lekki|Victoria Island/i.test(property.location)) : filter === "premium" ? properties.filter((property) => property.priceNgn >= 250_000_000) : properties
  return (
    <section className="w-full py-9 lg:py-11">
      <div className="w-full">
        <div className="mb-7 px-5 sm:mb-9 sm:px-8 lg:px-12">
          <p className="mb-2 font-serif text-lg italic text-primary">{eyebrow}</p>
          <h2 className="font-serif text-[clamp(2.35rem,5vw,4.5rem)] italic leading-none">{title}</h2>
        </div>
        <div className="property-carousel flex w-full snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-6">{visible.map((property) => <div key={property.id} className="w-[min(88vw,390px)] shrink-0 snap-start"><PropertyCard property={property} /></div>)}</div>
      </div>
    </section>
  )
}
