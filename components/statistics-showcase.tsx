"use client"

import Link from "next/link"
import { ArrowRight, FileCheck2, Globe2, KeyRound, Video } from "lucide-react"
import { motion } from "framer-motion"
import { CountUp } from "@/components/count-up"
import { cardHover, fadeLeft, fadeUp, iconHover, staggerContainer, viewportOnce } from "@/lib/animations"

const steps = [
  { icon: Globe2, number: "01", title: "Discover from anywhere", copy: "Compare verified homes in naira and your home currency, with a local adviser on hand." },
  { icon: Video, number: "02", title: "Inspect in real time", copy: "Join a live, captioned walkthrough or appoint us to inspect against your brief." },
  { icon: FileCheck2, number: "03", title: "Verify every document", copy: "See the named reviewer, title evidence, permit number, and transaction activity trail." },
  { icon: KeyRound, number: "04", title: "Own with ongoing support", copy: "Track construction, maintenance, documents, and payments from your private workspace." },
]

export function StatisticsShowcase() {
  return (
    <section className="bg-card px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <motion.div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-20" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
          <motion.div variants={fadeLeft}><p className="luxury-eyebrow mb-4">The diaspora ownership path</p><h2 className="font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.95]">Distance, thoughtfully handled.</h2><p className="mt-7 max-w-lg leading-8 text-muted-foreground">From first shortlist to long-term care, every step has a named person, a visible record, and a clear next action.</p><Link href="/contact" className="mt-8 inline-flex min-h-12 items-center gap-2 bg-primary px-6 text-sm font-bold text-white">Talk to an agent <ArrowRight className="size-4" /></Link></motion.div>
          <motion.div variants={staggerContainer} className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            {steps.map(({ icon: Icon, number, title, copy }) => <motion.article variants={fadeUp} whileHover={cardHover} key={title} className="bg-background p-7 sm:p-9"><div className="flex items-center justify-between"><motion.div whileHover={iconHover}><Icon className="size-6 text-primary" /></motion.div><span className="font-serif text-2xl text-muted-foreground/55">{number}</span></div><h3 className="mt-10 font-serif text-3xl leading-none">{title}</h3><p className="mt-4 text-sm leading-6 text-muted-foreground">{copy}</p></motion.article>)}
          </motion.div>
        </motion.div>

        <motion.dl variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mt-20 grid border-y border-border py-9 sm:grid-cols-3">
          <motion.div variants={fadeUp} className="p-4 text-center"><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Document activity trail</dt><dd className="mt-2 font-serif"><CountUp end={100} duration={1200} suffix="%" /></dd></motion.div>
          <motion.div variants={fadeUp} className="border-y border-border p-4 text-center sm:border-x sm:border-y-0"><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Buyer home markets</dt><dd className="mt-2 font-serif"><CountUp end={18} duration={1300} /></dd></motion.div>
          <motion.div variants={fadeUp} className="p-4 text-center"><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dedicated local response</dt><dd className="mt-2 flex items-center justify-center font-serif"><span className="mr-1 text-4xl">&lt;</span><CountUp end={30} duration={1400} suffix=" min" /></dd></motion.div>
        </motion.dl>
      </div>
    </section>
  )
}
