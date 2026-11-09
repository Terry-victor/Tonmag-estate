"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bath, BedDouble, CheckCircle2, Heart, MapPin, Maximize2 } from "lucide-react"
import { type Property, formatNaira } from "@/lib/properties"
import { useSaaS } from "@/components/saas-provider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cardHover } from "@/lib/animations"

export function PropertyCard({ property }: { property: Property }) {
  const { user, data, toggleSaved } = useSaaS()
  const router = useRouter()
  const saved = data.savedPropertyIds.includes(property.id)
  const [authGate, setAuthGate] = useState(false)
  const destination = `/view-project/${property.id}`
  const openProperty = () => user ? router.push(destination) : setAuthGate(true)

  return (
    <><motion.article whileHover={cardHover} onClick={openProperty} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openProperty() } }} role="link" tabIndex={0} aria-label={`View ${property.name}`} id={`property-${property.id}`} className="motion-card group cursor-pointer overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-[0_18px_50px_rgba(8,25,39,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.image}
          alt={`${property.name} in ${property.location}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="bg-primary px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-sm">
            {property.badge}
          </span>
          <button
            type="button"
            onClick={(event) => { event.stopPropagation(); user ? toggleSaved(property.id) : setAuthGate(true) }}
            className="flex size-12 items-center justify-center rounded-full bg-white text-navy shadow-md transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={saved ? `Remove ${property.name} from saved properties` : `Save ${property.name}`}
            aria-pressed={saved}
          >
            <Heart className={saved ? "fill-primary text-primary" : "text-navy"} />
          </button>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary" aria-hidden="true" />
            {property.location}
          </p>
          <h3 className="font-serif text-2xl leading-tight text-foreground group-hover:text-primary">{property.name}</h3>
        </div>

        <div aria-label="Property price">
          <p className="text-xl font-semibold tracking-tight">{formatNaira(property.priceNgn)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{property.priceForeign} · indicative {property.foreignCurrency}</p>
        </div>

        <dl className="flex flex-wrap gap-x-5 gap-y-2 border-y border-border py-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><BedDouble className="size-4" /><dt className="sr-only">Bedrooms</dt><dd>{property.beds} beds</dd></div>
          <div className="flex items-center gap-2"><Bath className="size-4" /><dt className="sr-only">Bathrooms</dt><dd>{property.baths} baths</dd></div>
          <div className="flex items-center gap-2"><Maximize2 className="size-4" /><dt className="sr-only">Area</dt><dd>{property.sqm} m²</dd></div>
        </dl>

        <div className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <span><strong className="font-semibold text-foreground">Title verified</strong> · {property.verifiedDate} · {property.verifiedBy}<br />Permit {property.permit}</span>
        </div>
      </div>
    </motion.article><Dialog open={authGate} onOpenChange={setAuthGate}><DialogContent className="max-w-md"><DialogHeader><DialogTitle className="font-serif text-3xl">Continue to {property.name}</DialogTitle><DialogDescription>Sign in or create your TONMAG account to view the full project, save homes, and keep your property journey together.</DialogDescription></DialogHeader><div className="grid gap-3 sm:grid-cols-2"><Link href={`/sign-in?next=${encodeURIComponent(destination)}`} className="inline-flex min-h-12 items-center justify-center bg-primary px-5 text-sm font-bold text-white">Sign in</Link><Link href={`/sign-up?next=${encodeURIComponent(destination)}`} className="inline-flex min-h-12 items-center justify-center border border-border px-5 text-sm font-bold">Create account</Link></div></DialogContent></Dialog></>
  )
}
