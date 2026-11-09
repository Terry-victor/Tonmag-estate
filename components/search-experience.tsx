"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ListFilter, Map, RotateCcw, SlidersHorizontal, X } from "lucide-react"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { formatNaira } from "@/lib/properties"
import { usePublicProperties } from "@/lib/use-public-properties"

type Filters = {
  query: string
  type: string
  minPrice: string
  maxPrice: string
  beds: string
  baths: string
  status: string
  verified: boolean
  inspection: string
  currency: string
  completion: string
  furnishing: string
  ownership: string
  amenities: string
  sort: string
}

const initialFilters: Filters = {
  query: "", type: "", minPrice: "", maxPrice: "", beds: "", baths: "", status: "", verified: true,
  inspection: "", currency: "USD", completion: "", furnishing: "", ownership: "", amenities: "", sort: "featured",
}

const fieldClass = "min-h-12 w-full rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground"

function FilterFields({ filters, update }: { filters: Filters; update: <K extends keyof Filters>(key: K, value: Filters[K]) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      <label className="sm:col-span-2 lg:col-span-1"><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Location</span><input className={fieldClass} value={filters.query} onChange={(e) => update("query", e.target.value)} placeholder="Area, city or estate" /></label>
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Property type</span><select className={fieldClass} value={filters.type} onChange={(e) => update("type", e.target.value)}><option value="">All types</option><option>Apartment</option><option>Villa</option><option>Terrace</option></select></label>
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Status</span><select className={fieldClass} value={filters.status} onChange={(e) => update("status", e.target.value)}><option value="">Any status</option><option>Ready</option><option>Off-plan</option><option>Under construction</option></select></label>
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Minimum price</span><select className={fieldClass} value={filters.minPrice} onChange={(e) => update("minPrice", e.target.value)}><option value="">No minimum</option><option value="150000000">₦150m</option><option value="250000000">₦250m</option><option value="400000000">₦400m</option></select></label>
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Maximum price</span><select className={fieldClass} value={filters.maxPrice} onChange={(e) => update("maxPrice", e.target.value)}><option value="">No maximum</option><option value="200000000">₦200m</option><option value="350000000">₦350m</option><option value="500000000">₦500m</option></select></label>
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Bedrooms</span><select className={fieldClass} value={filters.beds} onChange={(e) => update("beds", e.target.value)}><option value="">Any</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option></select></label>
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Bathrooms</span><select className={fieldClass} value={filters.baths} onChange={(e) => update("baths", e.target.value)}><option value="">Any</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option></select></label>
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Inspection</span><select className={fieldClass} value={filters.inspection} onChange={(e) => update("inspection", e.target.value)}><option value="">Any format</option><option>Virtual</option><option>In-person</option><option>Both</option></select></label>
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Display currency</span><select className={fieldClass} value={filters.currency} onChange={(e) => update("currency", e.target.value)}><option>USD</option><option>GBP</option><option>CAD</option></select></label>
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Completion</span><select className={fieldClass} value={filters.completion} onChange={(e) => update("completion", e.target.value)}><option value="">Any date</option><option>0–6 months</option><option>6–18 months</option><option>18+ months</option></select></label>
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Furnishing</span><select className={fieldClass} value={filters.furnishing} onChange={(e) => update("furnishing", e.target.value)}><option value="">Any</option><option>Furnished</option><option>Unfurnished</option></select></label>
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Ownership</span><select className={fieldClass} value={filters.ownership} onChange={(e) => update("ownership", e.target.value)}><option value="">Any title</option><option>C of O</option><option>Governor&apos;s Consent</option><option>Deed of Assignment</option></select></label>
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Amenities</span><select className={fieldClass} value={filters.amenities} onChange={(e) => update("amenities", e.target.value)}><option value="">Any</option><option>Pool</option><option>Gym</option><option>Backup power</option><option>Waterfront</option></select></label>
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Sort by</span><select className={fieldClass} value={filters.sort} onChange={(e) => update("sort", e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
      <label className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-card px-4 sm:col-span-2 lg:col-span-1"><input type="checkbox" checked={filters.verified} onChange={(e) => update("verified", e.target.checked)} className="size-5 accent-[#a57b38]" /><span className="text-sm font-semibold">Verified title only</span></label>
    </div>
  )
}

export function SearchExperience() {
  const properties = usePublicProperties()
  const params = useSearchParams()
  const [filters, setFilters] = useState<Filters>({ ...initialFilters, query: params.get("query") ?? "", type: params.get("type") ?? "" })
  const [mapVisible, setMapVisible] = useState(true)
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((current) => ({ ...current, [key]: value }))
  const reset = () => setFilters(initialFilters)

  const results = useMemo(() => {
    const filtered = properties.filter((property) => {
      const term = filters.query.toLowerCase()
      return (!term || `${property.name} ${property.location}`.toLowerCase().includes(term))
        && (!filters.type || property.type === filters.type)
        && (!filters.status || property.status === filters.status)
        && (!filters.minPrice || property.priceNgn >= Number(filters.minPrice))
        && (!filters.maxPrice || property.priceNgn <= Number(filters.maxPrice))
        && (!filters.beds || property.beds >= Number(filters.beds))
        && (!filters.baths || property.baths >= Number(filters.baths))
        && (!filters.inspection || property.inspection === filters.inspection || property.inspection === "Both")
    })
    return [...filtered].sort((a, b) => filters.sort === "price-low" ? a.priceNgn - b.priceNgn : filters.sort === "price-high" ? b.priceNgn - a.priceNgn : 0)
  }, [filters])

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-navy px-5 py-10 text-white sm:px-8">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#e4bd79]">Property discovery</p>
          <h1 className="font-serif text-5xl leading-none md:text-7xl">Find your place in Nigeria.</h1>
          <p className="mt-4 max-w-2xl text-base text-white/70">Every result includes a named title review, remote inspection options, and pricing for buyers living abroad.</p>
        </div>
      </div>

      <div className="sticky top-[76px] z-30 border-b border-border bg-background/95 px-5 py-3 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 overflow-x-auto">
          <Drawer>
            <DrawerTrigger asChild><Button variant="outline" className="min-h-12 rounded-full lg:hidden"><SlidersHorizontal /> Filters</Button></DrawerTrigger>
            <DrawerContent className="max-h-[88svh] rounded-t-[2rem]">
              <DrawerHeader className="flex-row items-center justify-between border-b"><DrawerTitle className="font-serif text-3xl">Refine your search</DrawerTitle><DrawerClose className="grid size-12 place-items-center" aria-label="Close filters"><X /></DrawerClose></DrawerHeader>
              <div className="overflow-y-auto p-5"><FilterFields filters={filters} update={update} /></div>
              <div className="flex gap-3 border-t p-5"><Button variant="outline" className="min-h-12 flex-1" onClick={reset}>Reset</Button><DrawerClose asChild><Button className="min-h-12 flex-[2]">Show {results.length} homes</Button></DrawerClose></div>
            </DrawerContent>
          </Drawer>
          {[filters.type || "All homes", filters.status || "Any status", filters.beds ? `${filters.beds}+ beds` : "Any beds", "Verified titles"].map((label) => <span key={label} className="whitespace-nowrap rounded-full border border-border bg-card px-4 py-3 text-xs font-bold">{label}</span>)}
          <button onClick={() => setMapVisible(!mapVisible)} className="ml-auto flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-navy px-4 text-xs font-bold text-white"><Map className="size-4" /> {mapVisible ? "Hide map" : "Show map"}</button>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-border bg-card p-5 lg:block" aria-label="Property filters">
          <div className="sticky top-[156px] max-h-[calc(100vh-176px)] overflow-y-auto pr-2">
            <div className="mb-6 flex items-center justify-between"><h2 className="font-serif text-3xl">Filters</h2><button onClick={reset} className="flex min-h-12 items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"><RotateCcw className="size-3" /> Reset</button></div>
            <FilterFields filters={filters} update={update} />
          </div>
        </aside>

        <div className={mapVisible ? "grid min-w-0 xl:grid-cols-[minmax(0,1fr)_minmax(360px,.9fr)]" : "min-w-0"}>
          <section className="min-w-0 p-5 sm:p-8" aria-live="polite">
            <div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-sm text-muted-foreground">{results.length} title-verified homes</p><h2 className="font-serif text-3xl sm:text-4xl">Homes matching your life</h2></div><ListFilter className="size-5 text-primary" /></div>
            {results.length ? <div className={`grid gap-6 ${mapVisible ? "2xl:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`}>{results.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="grid min-h-80 place-items-center border border-dashed border-border bg-card text-center"><div><h3 className="font-serif text-3xl">No exact matches yet</h3><p className="mt-2 text-sm text-muted-foreground">Try widening the price or location filters.</p><Button onClick={reset} className="mt-6">Reset filters</Button></div></div>}
          </section>

          {mapVisible && <aside className="map-grid relative hidden min-h-[calc(100vh-156px)] overflow-hidden border-l border-border xl:sticky xl:top-[156px] xl:block xl:h-[calc(100vh-156px)]" aria-label={`Map showing ${results.length} properties`}>
            <div className="absolute left-5 top-5 rounded-full bg-card px-4 py-2 text-xs font-bold shadow-lg">Lagos & Abuja · {results.length} homes</div>
            {results.map((property, index) => <a href={`#property-${property.id}`} key={property.id} style={{ left: `${property.coordinates.x}%`, top: `${property.coordinates.y}%`, animationDelay: `${index * 90}ms` }} className="animate-map-pin absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy px-3 py-2 text-xs font-extrabold text-white shadow-xl ring-2 ring-white transition hover:z-10 hover:scale-110" aria-label={`${property.name}, ${formatNaira(property.priceNgn)}`}>₦{Math.round(property.priceNgn / 1000000)}m{index === 0 && <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-primary text-[10px] text-white">2</span>}</a>)}
          </aside>}
        </div>
      </div>
    </main>
  )
}
