"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ChevronDown, MapPin, Search } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { fadeUp, floatingAnimation, floatingText, heroEntrance, staggerContainer } from "@/lib/animations"
import { FeatureScroller } from "@/components/feature-scroller"

export function Hero() {
  const [location, setLocation] = useState("")
  const [type, setType] = useState("Any home")
  const [budget, setBudget] = useState("Any budget")
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const heroVideoUrl = process.env.NEXT_PUBLIC_HERO_VIDEO_URL

  const submit = () => {
    const params = new URLSearchParams()
    if (location.trim()) params.set("query", location.trim())
    if (type !== "Any home") params.set("type", type)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section id="home-hero" className="relative min-h-dvh overflow-hidden bg-navy text-white">
      {!reduceMotion && heroVideoUrl ? <video className="absolute inset-0 size-full object-cover" autoPlay muted loop playsInline poster="/NICE.JPG" aria-hidden="true"><source src={heroVideoUrl} type="video/mp4" /></video> : <motion.div animate={reduceMotion ? undefined : floatingAnimation} className="absolute -inset-6 bg-[url('/NICE.JPG')] bg-cover bg-center" role="img" aria-label="Contemporary TONMAG residence at dusk" />}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,23,34,.9)_0%,rgba(5,23,34,.52)_53%,rgba(5,23,34,.18)_100%)]" />

      <div className="relative mx-auto flex min-h-dvh max-w-[1440px] flex-col justify-end px-4 pb-8 pt-24 sm:px-8 sm:pb-12 lg:justify-center lg:pb-24">
        <motion.div className="max-w-4xl" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.p variants={heroEntrance} className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#e4bd79]"><motion.span animate={reduceMotion ? undefined : floatingText}>Built in Nigeria. Managed from anywhere.</motion.span></motion.p>
          <motion.h1 variants={fadeUp} className="hero-gradient-text max-w-4xl font-serif text-[clamp(3.2rem,7.2vw,6.9rem)] font-medium leading-[0.88] tracking-[-0.035em]">
            Home should feel closer. <span className="block">Distance, thoughtfully handled.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-7 max-w-xl text-base leading-7 text-white/82 sm:text-lg">
            Discover title-verified Nigerian homes with remote inspections, secure document access, and a dedicated local team.
          </motion.p>
          <motion.div variants={fadeUp} className="max-w-xl"><FeatureScroller /></motion.div>

          <motion.div variants={fadeUp} className="mt-7 max-w-5xl rounded-[1.25rem] bg-white p-2 text-navy shadow-2xl lg:rounded-full">
            <div className="grid gap-1 lg:grid-cols-[1.35fr_1fr_1fr_auto]">
              <label className="flex min-h-16 items-center gap-3 rounded-full px-5 hover:bg-[#f3efe7]">
                <MapPin className="size-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="flex-1">
                  <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#5d6971]">Location</span>
                  <input value={location} onChange={(event) => setLocation(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()} placeholder="Lagos, Abuja or area" className="mt-1 w-full bg-transparent text-base font-semibold outline-none placeholder:text-[#63717a]" />
                </span>
              </label>

              <label className="relative flex min-h-16 items-center border-border px-5 lg:border-l">
                <span className="flex-1">
                  <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#5d6971]">Property type</span>
                  <select value={type} onChange={(event) => setType(event.target.value)} className="mt-1 w-full appearance-none bg-transparent pr-6 text-sm font-semibold outline-none">
                    <option>Any home</option><option>Apartment</option><option>Villa</option><option>Terrace</option>
                  </select>
                </span>
                <ChevronDown className="pointer-events-none absolute right-4 size-4" />
              </label>

              <label className="relative flex min-h-16 items-center border-border px-5 lg:border-l">
                <span className="flex-1">
                  <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#5d6971]">Price range</span>
                  <select value={budget} onChange={(event) => setBudget(event.target.value)} className="mt-1 w-full appearance-none bg-transparent pr-6 text-sm font-semibold outline-none">
                    <option>Any budget</option><option>Up to ₦200m</option><option>₦200m – ₦400m</option><option>₦400m+</option>
                  </select>
                </span>
                <ChevronDown className="pointer-events-none absolute right-4 size-4" />
              </label>

              <button type="button" onClick={submit} className="flex min-h-16 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-extrabold text-white transition hover:bg-[#8d682f]" aria-label="Search properties">
                <Search className="size-5" /> Search
              </button>
            </div>
          </motion.div>

          <motion.button variants={fadeUp} onClick={() => document.querySelector("#verified-homes")?.scrollIntoView()} className="mt-7 inline-flex min-h-12 items-center gap-2 text-sm font-bold text-white/90 hover:text-white">
            Explore verified homes <ArrowRight className="size-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
