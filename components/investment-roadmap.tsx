"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations"

const tracks = {
  local: [
    ["Choose an opportunity", "Compare plan duration, entry amount, projected return, and underlying property exposure."],
    ["Meet the investment team", "Review the opportunity in person or by video and ask questions before committing."],
    ["Complete KYC and documents", "Submit identity, address, source-of-funds details, and sign the investment agreement."],
    ["Fund the investment", "Pay through the supported local payment route and receive a traceable confirmation."],
    ["Track performance", "Receive reports, milestones, distributions, and support from the TONMAG team."],
  ],
  diaspora: [
    ["Choose from abroad", "Compare opportunities, currencies, timelines, and verified project information online."],
    ["Inspect remotely", "Join a live walkthrough or appoint a trusted representative to inspect on your behalf."],
    ["Verify and sign digitally", "Complete KYC, review documents with your adviser, and sign through the secure workflow."],
    ["Pay internationally", "Use the available card or bank-transfer route with a unique reference and verification trail."],
    ["Manage from anywhere", "Follow construction, documents, payments, and updates in your private dashboard."],
  ],
} as const

export function InvestmentRoadmap() {
  const [track, setTrack] = useState<keyof typeof tracks>("local")
  const [active, setActive] = useState(0)
  return <section className="bg-navy px-4 py-20 text-white sm:px-8"><div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#e4bd79]">Investment roadmap</p><h2 className="mt-3 font-serif text-[clamp(2.8rem,6vw,5rem)] leading-none">A clear path to participation.</h2></div><div className="flex rounded-full border border-white/15 p-1"><button onClick={() => { setTrack("local"); setActive(0) }} className={`min-h-11 rounded-full px-5 text-sm font-bold ${track === "local" ? "bg-white text-navy" : "text-white/70"}`}>Local investor</button><button onClick={() => { setTrack("diaspora"); setActive(0) }} className={`min-h-11 rounded-full px-5 text-sm font-bold ${track === "diaspora" ? "bg-white text-navy" : "text-white/70"}`}>Diaspora investor</button></div></div><motion.div key={track} variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mt-12 grid gap-3 lg:grid-cols-5">{tracks[track].map(([title], index) => <motion.button variants={fadeUp} onClick={() => setActive(index)} key={title} className={`min-h-28 rounded-2xl border p-5 text-left transition ${active === index ? "border-[#e4bd79] bg-white/10" : "border-white/15 bg-white/[.04] hover:bg-white/[.08]"}`}><span className="flex items-center justify-between text-xs font-bold text-[#e4bd79]"><span>0{index + 1}</span>{index < active && <CheckCircle2 className="size-4" />}</span><strong className="mt-5 block font-serif text-xl leading-tight">{title}</strong></motion.button>)}</motion.div><AnimatePresence mode="wait"><motion.div key={`${track}-${active}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-6 rounded-2xl bg-white p-6 text-navy sm:p-8"><p className="text-xs font-bold uppercase tracking-wider text-primary">Step {active + 1}</p><h3 className="mt-2 font-serif text-3xl">{tracks[track][active][0]}</h3><p className="mt-3 max-w-3xl leading-7 text-navy/65">{tracks[track][active][1]}</p></motion.div></AnimatePresence></div></section>
}
