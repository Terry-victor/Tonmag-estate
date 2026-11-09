"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { PropertyCard } from "@/components/property-card"
import { usePublicProperties } from "@/lib/use-public-properties"

export function ProjectsShowcase() {
  const properties = usePublicProperties()
  return (
    <section id="verified-homes" className="bg-background px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="luxury-eyebrow mb-4">Curated & independently checked</p>
            <h2 className="font-serif text-5xl leading-[0.95] md:text-7xl">Verified homes, without the guesswork.</h2>
          </div>
          <Link href="/search" className="inline-flex min-h-12 items-center gap-2 self-start border-b border-primary text-sm font-bold text-foreground hover:text-primary">
            View all properties <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {properties.slice(0, 3).map((property) => <PropertyCard key={property.id} property={property} />)}
        </div>

        <div className="mt-20 grid overflow-hidden bg-navy text-white lg:grid-cols-[1.1fr_.9fr]">
          <div className="p-8 sm:p-12 lg:p-16">
            <span className="mb-7 grid size-12 place-items-center rounded-full border border-white/20 text-[#e4bd79]"><Sparkles /></span>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e4bd79]">TONMAG intelligence</p>
            <h3 className="max-w-2xl font-serif text-4xl leading-none sm:text-6xl">What could your property be worth today?</h3>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/70">Our assisted valuation combines comparable sales, verified title data, and local market signals. Results are shown in naira and your preferred home currency.</p>
            <Link href="/contact" className="mt-9 inline-flex min-h-12 items-center bg-primary px-6 text-sm font-bold text-white transition hover:bg-[#8d682f]">Get property valuation</Link>
          </div>
          <div className="border-t border-white/10 bg-[#102d40] p-8 sm:p-12 lg:border-l lg:border-t-0 lg:p-16">
            <p className="text-sm font-semibold text-white/60">Illustrative estimate</p>
            <p className="mt-10 font-serif text-5xl sm:text-6xl">₦242,000,000</p>
            <p className="mt-2 text-base text-white/65">$151,250 USD · £119,790 GBP</p>
            <div className="mt-10 h-28 border-b border-l border-white/20" aria-label="Illustrative rising property value chart">
              <svg viewBox="0 0 440 110" className="h-full w-full" role="img" aria-hidden="true">
                <path d="M0 93 C70 88 78 71 134 76 S216 54 266 59 S356 22 440 10" fill="none" stroke="#c99b50" strokeWidth="3" />
              </svg>
            </div>
            <div className="mt-4 flex justify-between text-xs text-white/45"><span>2022</span><span>2023</span><span>2024</span><span>2025</span><span>2026</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
