"use client"

import { Award, Building2, Trophy, Users2 } from "lucide-react"
import { motion } from "framer-motion"
import { CountUp } from "@/components/count-up"
import { cardHover, fadeUp, iconHover, staggerContainer, viewportOnce } from "@/lib/animations"

const stats = [
  { value: 1000, suffix: "+", label: "Homes Built", icon: Building2 },
  { value: 10, suffix: "+", label: "Projects", icon: Award },
  { value: 30, suffix: "+", label: "Awards", icon: Trophy },
  { value: 1000, suffix: "+", label: "Global Clients", icon: Users2 },
]

export function AboutStats() {
  return <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
    {stats.map((stat) => {
      const Icon = stat.icon
      return <motion.article key={stat.label} variants={fadeUp} whileHover={cardHover} className="rounded-2xl border border-border bg-card p-4 text-center shadow-[0_18px_45px_rgba(8,25,39,.06)] sm:p-6">
        <motion.span whileHover={iconHover} className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-accent/10 text-accent"><Icon className="size-6" /></motion.span>
        <CountUp end={stat.value} duration={1400} suffix={stat.suffix} />
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">{stat.label}</p>
      </motion.article>
    })}
  </motion.div>
}
