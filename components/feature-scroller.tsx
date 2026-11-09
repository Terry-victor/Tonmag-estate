"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

const features = [
  "Title-verified Nigerian homes",
  "Remote inspections",
  "Secure document access",
  "A dedicated local team",
]

export function FeatureScroller() {
  const [active, setActive] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) return
    const timer = window.setInterval(() => setActive((current) => (current + 1) % features.length), 3200)
    return () => window.clearInterval(timer)
  }, [reduceMotion])

  return <div className="mt-5 flex min-h-9 items-center gap-3" aria-label={`Included: ${features.join(", ")}`}>
    <span className="size-1.5 shrink-0 rounded-full bg-[#e4bd79]" aria-hidden="true" />
    <div className="relative h-7 min-w-0 flex-1 overflow-hidden" aria-hidden="true">
      <AnimatePresence initial={false} mode="wait">
        <motion.p
          key={active}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-0 truncate text-sm font-semibold text-white/85 sm:text-base"
        >
          {features[active]}
        </motion.p>
      </AnimatePresence>
    </div>
    <span className="hidden gap-1.5 sm:flex" aria-hidden="true">{features.map((feature, index) => <span key={feature} className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${index === active ? "w-5 bg-[#e4bd79]" : "w-1.5 bg-white/35"}`} />)}</span>
  </div>
}
