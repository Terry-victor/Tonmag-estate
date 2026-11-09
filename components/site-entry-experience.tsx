"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { X } from "lucide-react"
import { useSaaS } from "@/components/saas-provider"

const splashKey = "tonmag-splash-seen"
const promptKey = "tonmag-signup-prompt-dismissed"

export function SiteEntryExperience() {
  const reduceMotion = useReducedMotion()
  const { user, ready } = useSaaS()
  const [splash, setSplash] = useState(true)
  const [prompt, setPrompt] = useState(false)

  useEffect(() => {
    const alreadySeen = window.sessionStorage.getItem(splashKey) === "1"
    const duration = reduceMotion || alreadySeen ? 100 : 1150
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(splashKey, "1")
      setSplash(false)
    }, duration)
    return () => window.clearTimeout(timer)
  }, [reduceMotion])

  useEffect(() => {
    if (splash || !ready || user || window.sessionStorage.getItem(promptKey) === "1") return
    const timer = window.setTimeout(() => setPrompt(true), reduceMotion ? 100 : 650)
    return () => window.clearTimeout(timer)
  }, [ready, reduceMotion, splash, user])

  const dismiss = () => { window.sessionStorage.setItem(promptKey, "1"); setPrompt(false) }

  return <>
    <AnimatePresence>{splash && <motion.div className="fixed inset-0 z-[100] grid min-h-dvh place-items-center bg-navy text-white" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0.01 : 0.4 }} aria-label="TONMAG is loading"><motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="text-center"><span className="mx-auto grid size-20 place-items-center border border-[#d6ae68] font-serif text-5xl">T</span><p className="mt-5 text-xs font-extrabold tracking-[.35em]">TONMAG</p><div className="mt-6 h-px w-44 overflow-hidden bg-white/15"><motion.div className="h-full bg-[#d6ae68]" initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ duration: reduceMotion ? 0.01 : 1, ease: "easeOut" }} /></div></motion.div></motion.div>}</AnimatePresence>
    <AnimatePresence>{prompt && <motion.aside initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 z-[80] mx-auto max-w-md rounded-2xl border border-white/15 bg-navy p-5 text-white shadow-2xl sm:left-auto sm:right-6" aria-label="Create an account"><button onClick={dismiss} className="absolute right-3 top-3 grid size-11 place-items-center rounded-full hover:bg-white/10" aria-label="Dismiss"><X className="size-4" /></button><p className="text-xs font-bold uppercase tracking-[.18em] text-[#e4bd79]">Keep your search close</p><h2 className="mt-2 font-serif text-2xl">Save homes and unlock your dashboard.</h2><p className="mt-2 pr-7 text-sm leading-6 text-white/65">Create an account for saved properties, inspections, documents, and secure updates.</p><div className="mt-4 flex gap-2"><Link onClick={dismiss} href="/sign-up" className="inline-flex min-h-11 flex-1 items-center justify-center bg-primary px-4 text-sm font-bold">Create account</Link><Link onClick={dismiss} href="/sign-in" className="inline-flex min-h-11 items-center justify-center border border-white/25 px-4 text-sm font-bold">Sign in</Link></div></motion.aside>}</AnimatePresence>
  </>
}
